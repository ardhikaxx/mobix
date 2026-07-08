"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppBySlug } from "@/lib/hooks/useApps";
import { formatBytes } from "@/lib/utils/slug";
import { useAuth } from "@/context/AuthProvider";
import { AuthDialog } from "@/components/AuthDialog";
import { DetailSkeleton } from "@/components/Skeleton";
import { ErrorState } from "@/components/ErrorState";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { ChevronLeft, Star, Download, Shield, Share2, Send } from "lucide-react";
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
          className={`${cls} ${i <= rating ? "fill-store text-store" : "fill-gray-200 text-gray-200"} ${interactive ? "transition hover:scale-110" : ""}`}
        />
      </button>
    );
  }
  return <div className="flex items-center gap-0.5">{stars}</div>;
}

export default function AppDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data: app, isLoading, error } = useAppBySlug(slug);
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    if (!app) return;
    setLoadingReviews(true);
    const q = query(
      collection(db, "reviews"),
      where("appSlug", "==", slug),
      orderBy("createdAt", "desc")
    );
    getDocs(q).then((snap) => {
      setReviews(
        snap.docs.map((d) => ({ id: d.id, ...d.data() } as Review))
      );
    }).catch(() => {
      // index mungkin belum siap
    }).finally(() => setLoadingReviews(false));
  }, [app, slug]);

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
    window.open(app.apkURL, "_blank");
    toast.success("Download dimulai!");
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
      const newReview = {
        appSlug: slug,
        appName: app.name,
        userId: user.uid,
        userName: user.displayName || user.email || "User",
        userPhoto: user.photoURL || null,
        rating: reviewRating,
        text: reviewText.trim(),
        createdAt: serverTimestamp(),
      };
      const docRef = await addDoc(collection(db, "reviews"), newReview);
      const updatedReviews = [
        { id: docRef.id, ...newReview, createdAt: null } as Review,
        ...reviews,
      ];
      setReviews(updatedReviews);
      setReviewText("");
      setReviewRating(5);

      const total = updatedReviews.length;
      const avg = updatedReviews.reduce((s, r) => s + r.rating, 0) / total;
      setDoc(doc(db, "reviewsStats", slug), {
        appSlug: slug,
        averageRating: Math.round(avg * 10) / 10,
        totalReviews: total,
      }).catch(() => {});

      toast.success("Ulasan berhasil ditambahkan!");
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
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ChevronLeft className="size-4" /> Kembali
      </Link>

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
          <h1 className="text-xl font-bold text-gray-900 md:text-2xl">{app.name}</h1>
          <p className="mt-0.5 text-sm font-medium text-store">{app.ownerName}</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-full bg-store px-8 py-2.5 text-sm font-medium text-white transition hover:bg-store-light shadow-sm"
            >
              <Download className="size-4" />
              Install
            </button>
            <button className="rounded-full border border-gray-200 bg-white p-2.5 text-gray-600 transition hover:bg-gray-50">
              <Share2 className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mb-8 flex items-center justify-between gap-4 overflow-x-auto border-y border-gray-100 py-4 text-center hide-scrollbar md:justify-start md:gap-10">
        <div className="min-w-0 px-2">
          <div className="flex items-center justify-center gap-1 text-base font-bold text-gray-800">
            {avgRating > 0 ? avgRating.toFixed(1) : "-"} <Star className="size-3.5 fill-store text-store" />
          </div>
          <p className="mt-0.5 text-[11px] text-gray-500">{reviews.length} ulasan</p>
        </div>
        <div className="min-w-0 px-2">
          <div className="text-base font-bold text-gray-800">{formatBytes(app.apkSizeBytes)}</div>
          <p className="mt-0.5 text-[11px] text-gray-500">Size</p>
        </div>
      </div>

      {screenshots.length > 0 && (
        <div className="mb-8 w-full overflow-hidden">
          <h2 className="mb-3 text-sm font-bold text-gray-800">About this app</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar snap-x snap-mandatory">
            {screenshots.map((url, idx) => (
              <button
                key={idx}
                onClick={() => setLightboxIdx(idx)}
                className="relative h-64 w-[140px] shrink-0 snap-center overflow-hidden rounded-xl border border-gray-200 bg-gray-100"
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
        <p className="text-sm leading-relaxed text-gray-600">{app.description}</p>
      </div>

      <div className="mb-8 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="mb-2 text-sm font-bold text-gray-800">Data Safety</h2>
        <p className="mb-4 text-xs text-gray-500">
          Safety starts with understanding how developers collect and share your data. Data privacy and security practices may vary based on your use, region, and age.
        </p>
        <div className="mb-3 flex items-start gap-3">
          <Shield className="mt-0.5 size-4 shrink-0 text-gray-400" />
          <p className="text-xs font-medium text-gray-700">No data shared with third parties</p>
        </div>
        <div className="flex items-start gap-3">
          <Shield className="mt-0.5 size-4 shrink-0 text-gray-400" />
          <p className="text-xs font-medium text-gray-700">Data encrypted in transit</p>
        </div>
      </div>

      <div className="mb-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-800">Rating & Ulasan</h2>
        </div>

        {reviews.length > 0 && (
          <div className="mb-6 flex items-center gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-800">{avgRating.toFixed(1)}</div>
              <div className="mt-1 flex justify-center">
                <ReviewStars rating={Math.round(avgRating)} size="sm" />
              </div>
              <p className="mt-1 text-xs text-gray-500">{reviews.length} ulasan</p>
            </div>
            <div className="flex-1">
              {[5, 4, 3, 2, 1].map((num) => {
                const count = ratingDistribution[num - 1] || 0;
                const pct = (count / maxCount) * 100;
                return (
                  <div key={num} className="mb-1 flex items-center gap-2 text-xs text-gray-500">
                    <span className="w-3">{num}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
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
          <form onSubmit={handleSubmitReview} className="mb-6 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <h3 className="mb-3 text-sm font-semibold text-gray-800">Berikan Ulasan</h3>
            <div className="mb-3 flex items-center gap-2">
              <span className="text-xs text-gray-500">Rating:</span>
              <ReviewStars rating={reviewRating} size="sm" interactive onChange={setReviewRating} />
            </div>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={3}
              className="mb-3 w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-store focus:ring-2 focus:ring-store/20"
              placeholder="Ceritakan pendapat Anda tentang aplikasi ini..."
            />
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-store px-4 py-2 text-sm font-medium text-white transition hover:bg-store-light disabled:opacity-50"
            >
              <Send className="size-3.5" />
              {submitting ? "Mengirim..." : "Kirim Ulasan"}
            </button>
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
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse rounded-lg border border-gray-100 p-4">
                <div className="mb-2 h-4 w-32 rounded bg-gray-200" />
                <div className="mb-2 h-3 w-24 rounded bg-gray-200" />
                <div className="h-3 w-full rounded bg-gray-200" />
              </div>
            ))}
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-lg border border-gray-100 p-4">
                <div className="mb-2 flex items-center gap-3">
                  {r.userPhoto ? (
                    <Image
                      src={r.userPhoto}
                      alt={r.userName}
                      width={32}
                      height={32}
                      className="size-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex size-8 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600 uppercase">
                      {r.userName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-800">{r.userName}</p>
                    <ReviewStars rating={r.rating} size="sm" />
                  </div>
                </div>
                <p className="text-sm text-gray-600">{r.text}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-xs text-gray-400 italic">Belum ada ulasan. Jadilah yang pertama!</p>
        )}
      </div>

      <AuthDialog isOpen={authOpen} onClose={() => setAuthOpen(false)} />

      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightboxIdx(null)}
        >
          <div className="relative aspect-[9/16] h-[80vh]">
            <Image
              src={screenshots[lightboxIdx]}
              alt={`Screenshot ${lightboxIdx + 1}`}
              fill
              className="object-contain"
              sizes="80vh"
            />
          </div>
        </div>
      )}
    </div>
  );
}
