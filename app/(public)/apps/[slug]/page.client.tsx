"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppBySlug, useRelatedApps } from "@/lib/hooks/useApps";
import { formatBytes } from "@/lib/utils/slug";
import { useAuth } from "@/context/AuthProvider";
import { useTranslation } from "@/lib/hooks/useTranslation";
import { AuthDialog } from "@/components/AuthDialog";
import { ShareDialog } from "@/components/ShareDialog";
import { DetailSkeleton } from "@/components/Skeleton";
import { ErrorState } from "@/components/ErrorState";
import Breadcrumb from "@/components/Breadcrumb";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { AppCard } from "@/components/AppCard";
import { useDownloadCount, incrementDownload } from "@/lib/hooks/useDownloadCount";
import { ChevronLeft, Star, Download, Share2, Send, ArrowRight, Flag, BadgeCheck, ShieldCheck } from "lucide-react";
import { slugify } from "@/lib/utils/slug";
import toast from "react-hot-toast";

interface Review {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string | null;
  rating: number;
  text: string;
  createdAt: { toDate?: () => Date; seconds?: number } | null;
}

function ReviewStars({ rating, size = "sm", interactive = false, onChange }: {
  rating: number;
  size?: "sm" | "lg";
  interactive?: boolean;
  onChange?: (r: number) => void;
}) {
  const cls = size === "lg" ? "size-5" : "size-3";
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <button
        key={i}
        type={interactive ? "button" : undefined}
        disabled={!interactive}
        onClick={() => onChange?.(i)}
        className={`${interactive ? "cursor-pointer" : "cursor-default"} ${cls}`}
      >
        <Star
          className={`${cls} ${i <= rating ? "fill-store text-store" : "fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600"} ${interactive ? "transition hover:scale-110" : ""}`}
        />
      </button>
    );
  }
  return <div className="flex items-center gap-0.5">{stars}</div>;
}

export default function AppDetailPageClient({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data: app, isLoading, error } = useAppBySlug(slug);
  const { data: relatedApps } = useRelatedApps(slug, app?.category ?? "");
  const { user } = useAuth();
  const { t } = useTranslation();
  const [authOpen, setAuthOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [restrictedOpen, setRestrictedOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const { count: downloadCount } = useDownloadCount(slug);

  const myReview = user ? reviews.find((r) => r.userId === user.uid) : null;

  useEffect(() => {
    if (!app) return;
    setLoadingReviews(true);
    const q = query(
      collection(db, "reviews"),
      where("appSlug", "==", slug)
    );
    getDocs(q).then((snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Review));
      list.sort((a, b) => {
        const ta = a.createdAt?.seconds ?? 0;
        const tb = b.createdAt?.seconds ?? 0;
        return tb - ta;
      });
      setReviews(list);
    }).catch(() => {
      // gagal fetch reviews
    }).finally(() => setLoadingReviews(false));
  }, [app, slug]);

  useEffect(() => {
    if (myReview) {
      setReviewRating(myReview.rating);
      setReviewText(myReview.text);
    } else if (user) {
      setReviewRating(5);
      setReviewText("");
    }
  }, [myReview, user]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <DetailSkeleton />
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <ErrorState message={error?.message || "Aplikasi tidak ditemukan"} />
      </div>
    );
  }

  const handleDownload = () => {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    if (app.isExclusive) {
      setRestrictedOpen(true);
      return;
    }
    window.open(app.apkURL, "_blank");
    incrementDownload(slug);
    toast.success("Download dimulai!");
  };

  const handleShare = () => {
    setShareOpen(true);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setAuthOpen(true);
      return;
    }
    if (!reviewText.trim()) {
      toast.error("Tulis ulasan Anda");
      return;
    }

    setSubmitting(true);
    try {
      const now = serverTimestamp();
      const reviewData = {
        appSlug: slug,
        appName: app.name,
        userId: user.uid,
        userName: user.displayName || user.email || "User",
        userPhoto: user.photoURL || null,
        rating: reviewRating,
        text: reviewText.trim(),
        createdAt: myReview ? undefined : now,
        updatedAt: myReview ? now : undefined,
      };

      const reviewId = `${user.uid}_${slug}`;
      let updatedReviews: Review[];
      if (myReview) {
        await updateDoc(doc(db, "reviews", myReview.id), reviewData);
        updatedReviews = reviews.map((r) =>
          r.id === myReview.id
            ? { ...r, ...reviewData, id: r.id, createdAt: r.createdAt }
            : r
        );
        toast.success("Ulasan berhasil diperbarui!");
      } else {
        await setDoc(doc(db, "reviews", reviewId), {
          ...reviewData,
          createdAt: now,
        });
        updatedReviews = [
          { id: reviewId, ...reviewData, createdAt: null } as Review,
          ...reviews,
        ];
        toast.success("Ulasan berhasil ditambahkan!");
      }
      setReviews(updatedReviews);

      const total = updatedReviews.length;
      const avg = total > 0 ? updatedReviews.reduce((s, r) => s + r.rating, 0) / total : 0;
      setDoc(doc(db, "reviewsStats", slug), {
        appSlug: slug,
        averageRating: Math.round(avg * 10) / 10,
        totalReviews: total,
      }).catch(() => {});
    } catch (err: unknown) {
      toast.error("Gagal menambahkan ulasan");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const ratingDistribution = [0, 0, 0, 0, 0];
  reviews.forEach((r) => {
    const idx = Math.min(Math.max(Math.round(r.rating) - 1, 0), 4);
    ratingDistribution[idx]++;
  });
  const maxCount = Math.max(...ratingDistribution, 1);

  const screenshots = app.screenshots || [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <Breadcrumb items={[
        { label: t.breadcrumb.home, href: "/" },
        { label: t.breadcrumb.category, href: app ? `/category/${app.category}` : undefined },
        { label: app?.name || "..." },
      ]} />

      <div className="mb-6 flex flex-col gap-5 sm:flex-row">
        <div className="relative mx-auto size-24 shrink-0 overflow-hidden rounded-2xl shadow-md sm:mx-0 sm:size-[100px]">
          <Image
            src={app.logoURL}
            alt={app.name}
            fill
            priority
            className="object-cover"
            sizes="100px"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center text-center sm:text-left">
          <div className="flex items-center justify-center gap-1.5 sm:justify-start">
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 md:text-2xl">{app.name}</h1>
            {app.isVerified && <BadgeCheck className="size-5 text-blue-500 shrink-0" />}
          </div>
          <Link href={`/developer/${slugify(app.ownerName)}`} className="mt-0.5 text-sm font-medium text-store hover:text-store-light transition">
            {app.ownerName}
          </Link>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 sm:justify-start w-full sm:w-auto">
            <button
              onClick={handleDownload}
              className="inline-flex flex-1 sm:flex-initial items-center justify-center gap-2.5 min-h-[46px] rounded-full bg-store px-8 py-3 text-sm sm:text-base font-bold text-white transition-all hover:bg-store-light active:scale-95 shadow-md shadow-store/20"
            >
              <Download className="size-5" />
              Install Aplikasi
            </button>
            <button 
              onClick={handleShare} 
              className="flex items-center justify-center min-h-[46px] min-w-[46px] rounded-full border border-gray-200 bg-white p-3 text-gray-700 transition-all hover:bg-gray-50 active:scale-95 shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              title="Bagikan Aplikasi"
            >
              <Share2 className="size-5 text-store" />
            </button>
          </div>
        </div>
      </div>

      <div className="mb-8 flex items-center justify-around gap-2 border-y border-gray-100 py-4 text-center dark:border-gray-800">
        <div className="min-w-0 px-2">
          <div className="flex items-center justify-center gap-1 text-sm sm:text-base font-bold text-gray-800 dark:text-gray-200">
            {avgRating > 0 ? avgRating.toFixed(1) : "-"} <Star className="size-3.5 fill-store text-store" />
          </div>
          <p className="mt-0.5 text-[10px] sm:text-[11px] text-gray-500 whitespace-nowrap">{reviews.length} ulasan</p>
        </div>
        <div className="min-w-0 px-2">
          <div className="text-sm sm:text-base font-bold text-gray-800 dark:text-gray-200">{formatBytes(app.apkSizeBytes)}</div>
          <p className="mt-0.5 text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400">Size</p>
        </div>
        <div className="min-w-0 px-2">
          <div className="text-sm sm:text-base font-bold text-gray-800 dark:text-gray-200">{downloadCount}</div>
          <p className="mt-0.5 text-[10px] sm:text-[11px] text-gray-500 whitespace-nowrap">Downloads</p>
        </div>
      </div>

      {screenshots.length > 0 && (
        <div className="mb-8 w-full overflow-hidden">
          <h2 className="mb-3 text-sm font-bold text-gray-800 dark:text-gray-200">About this app</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar snap-x snap-mandatory">
            {screenshots.map((url, idx) => (
              <button
                key={idx}
                onClick={() => setLightboxIdx(idx)}
                className="relative h-48 sm:h-64 w-[120px] sm:w-[140px] shrink-0 snap-center overflow-hidden rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
              >
                <Image
                  src={url}
                  alt={`Screenshot ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="140px"
                  priority={idx < 2}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mb-8">
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{app.description}</p>
      </div>

      <div className="mb-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-2 text-sm font-bold text-gray-800 dark:text-gray-200">Data Safety</h2>
        <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
          Safety starts with understanding how developers collect and share your data. Data privacy and security practices may vary based on your use, region, and age.
        </p>
        <div className="mb-3 flex items-start gap-3">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-green-500" />
          <p className="text-xs font-medium text-green-600 dark:text-green-400">No data shared with third parties</p>
        </div>
        <div className="mb-3 flex items-start gap-3">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-green-500" />
          <p className="text-xs font-medium text-green-600 dark:text-green-400">Data encrypted in transit</p>
        </div>
        {app.isScanned && (
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-green-500" />
            <p className="text-xs font-medium text-green-600 dark:text-green-400">Security scan passed — no viruses detected</p>
          </div>
        )}
      </div>

      {/* Laporkan Aplikasi */}
      <a
        href={`https://wa.me/6285933648537?text=Halo%20admin%2C%20saya%20ingin%20melaporkan%20aplikasi%20berikut%3A%20https://mobix-mu.vercel.app/apps/${app.slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-8 flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50/50 px-4 py-3 text-xs font-semibold text-red-600 transition hover:bg-red-50 active:scale-95 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/30"
      >
        <Flag className="size-3.5" />
        Laporkan Aplikasi
      </a>

      <div className="mb-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200">Rating & Ulasan</h2>
        </div>

        {reviews.length > 0 && (
          <div className="mb-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="text-center shrink-0">
              <div className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-200">{avgRating.toFixed(1)}</div>
              <div className="mt-1 flex justify-center">
                <ReviewStars rating={Math.round(avgRating)} size="sm" />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{reviews.length} ulasan</p>
            </div>
            <div className="w-full sm:flex-1">
              {[5, 4, 3, 2, 1].map((num) => {
                const count = ratingDistribution[num - 1] || 0;
                const pct = (count / maxCount) * 100;
                return (
                  <div key={num} className="mb-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="w-3 text-right sm:text-left">{num}</span>
                    <div className="h-2.5 sm:h-2 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                      <div className="h-full rounded-full bg-store" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-5 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {user ? (
          <form onSubmit={handleSubmitReview} className="mb-6 rounded-xl border border-gray-100 bg-gray-50 p-4 sm:p-5 dark:border-gray-800 dark:bg-gray-800">
            <h3 className="mb-3 text-sm font-semibold text-gray-800 dark:text-gray-200">
              {myReview ? "Edit Ulasan" : "Berikan Ulasan"}
            </h3>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">Rating:</span>
              <ReviewStars rating={reviewRating} size="sm" interactive onChange={setReviewRating} />
            </div>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={3}
              className="mb-3 w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-store focus:ring-2 focus:ring-store/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
              placeholder="Ceritakan pendapat Anda tentang aplikasi ini..."
            />
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-store px-4 py-2.5 text-sm font-medium text-white transition hover:bg-store-light disabled:opacity-50"
              >
                <Send className="size-3.5" />
                {submitting ? "Mengirim..." : myReview ? "Perbarui Ulasan" : "Kirim Ulasan"}
              </button>
              {myReview && (
                <button
                  type="button"
                  onClick={() => {
                    setReviewRating(myReview.rating);
                    setReviewText(myReview.text);
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        ) : (
          <div className="mb-6 text-center">
            <button
              onClick={() => setAuthOpen(true)}
              className="text-sm font-medium text-store hover:text-store-light"
            >
              Login untuk memberi ulasan
            </button>
          </div>
        )}

        {loadingReviews ? (
          <div className="space-y-3 sm:space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse rounded-lg border border-gray-100 p-4 dark:border-gray-800">
                <div className="mb-2 h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="mb-2 h-3 w-24 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            ))}
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-lg border border-gray-100 p-3 sm:p-4 dark:border-gray-800">
                <div className="mb-2 flex items-center gap-3">
                  {r.userPhoto ? (
                    <Image
                      src={r.userPhoto}
                      alt={r.userName}
                      width={36}
                      height={36}
                      className="size-8 sm:size-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex size-8 sm:size-9 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600 uppercase dark:bg-gray-700 dark:text-gray-400">
                      {r.userName.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">{r.userName}</p>
                    <ReviewStars rating={r.rating} size="sm" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 break-words">{r.text}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-xs text-gray-400 dark:text-gray-500 italic">Belum ada ulasan. Jadilah yang pertama!</p>
        )}
      </div>

      {/* Related Apps */}
      {relatedApps && relatedApps.length > 0 && (
        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200">Aplikasi Serupa</h2>
            <Link
              href={`/category/${app.category}`}
              className="inline-flex items-center gap-1 text-xs font-medium text-store hover:text-store-light transition"
            >
              Lihat Semua <ArrowRight className="size-3" />
            </Link>
          </div>
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedApps.slice(0, 3).map((related) => (
              <AppCard key={related.appId} app={related} />
            ))}
          </div>
        </section>
      )}

      <ShareDialog
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        appName={app.name}
        appSlug={app.slug}
      />

      <AuthDialog isOpen={authOpen} onClose={() => setAuthOpen(false)} />

      {restrictedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setRestrictedOpen(false)} />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Aplikasi Khusus</h2>
              <button
                onClick={() => setRestrictedOpen(false)}
                className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-400"
              >
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Aplikasi mobile ini khusus dan tidak digunakan untuk umum.
              </p>
              <button
                onClick={() => setRestrictedOpen(false)}
                className="w-full rounded-lg bg-store px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-store-light"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4"
          onClick={() => setLightboxIdx(null)}
        >
          <div className="relative aspect-[9/16] h-[60vh] sm:h-[80vh] max-h-[90vw] w-auto">
            <Image
              src={screenshots[lightboxIdx]}
              alt={`Screenshot ${lightboxIdx + 1}`}
              fill
              className="object-contain"
              sizes="(max-width: 640px) 90vw, 80vh"
            />
          </div>
        </div>
      )}
    </div>
  );
}
