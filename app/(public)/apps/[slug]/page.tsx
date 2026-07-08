"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppBySlug } from "@/lib/hooks/useApps";
import { getCategoryLabel } from "@/lib/constants/categories";
import { formatBytes, formatDate } from "@/lib/utils/slug";
import { useAuth } from "@/context/AuthProvider";
import { AuthDialog } from "@/components/AuthDialog";
import { DetailSkeleton } from "@/components/Skeleton";
import { ErrorState } from "@/components/ErrorState";
import {
  Download,
  Eye,
  Globe,
  Code2,
  ChevronLeft,
  ExternalLink,
  Shield,
  User,
} from "lucide-react";
import { doc, updateDoc, increment, serverTimestamp, addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import toast from "react-hot-toast";

export default function AppDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data: app, isLoading, error } = useAppBySlug(slug);
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <DetailSkeleton />
      </div>
    );
  }

  if (error || !app) {
    const isPermissionError = error?.message?.includes("permission");
    if (isPermissionError) {
      return (
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <h3 className="mb-2 text-lg font-semibold text-gray-600">Aplikasi tidak ditemukan</h3>
            <p className="mb-4 max-w-sm text-sm text-gray-400">Belum ada aplikasi yang diupload.</p>
          </div>
        </div>
      );
    }
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <ErrorState
          message={error?.message || "Aplikasi tidak ditemukan"}
        />
      </div>
    );
  }

  const handleDownload = async () => {
    if (!user) {
      setAuthOpen(true);
      return;
    }

    setDownloading(true);
    try {
      const ownerId = app.ownerId;
      await Promise.all([
        addDoc(collection(db, "downloads"), {
          appId: app.appId,
          appName: app.name,
          appVersion: app.version,
          userId: user.uid,
          ownerId,
          downloadedAt: serverTimestamp(),
        }),
        updateDoc(doc(db, "apps", app.appId), {
          downloadCount: increment(1),
          updatedAt: serverTimestamp(),
        }),
        updateDoc(doc(db, "users", ownerId), {
          totalDownloads: increment(1),
        }),
      ]);

      window.open(app.apkURL, "_blank");
      toast.success("Download dimulai!");
    } catch {
      window.open(app.apkURL, "_blank");
    } finally {
      setDownloading(false);
    }
  };

  const isOwner = user?.uid === app.ownerId;
  const screenshots = app.screenshots || [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ChevronLeft className="size-4" /> Kembali
      </Link>

      <div className="mb-8 overflow-hidden rounded-2xl border border-gray-100 bg-white">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="relative mx-auto size-24 shrink-0 overflow-hidden rounded-2xl sm:mx-0">
              <Image
                src={app.logoURL}
                alt={app.name}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <h1 className="mb-1 text-2xl font-bold text-gray-900">{app.name}</h1>
              <p className="mb-3 text-sm text-gray-500">
                by{" "}
                <Link href={`/search?q=${app.ownerName}`} className="font-medium text-gray-700 hover:text-blue-600">
                  {app.ownerName}
                </Link>{" "}
                in {getCategoryLabel(app.category)}
              </p>
              <div className="mb-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                  v{app.version}
                </span>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                  {formatBytes(app.apkSizeBytes)}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                  <Download className="size-3" /> {app.downloadCount.toLocaleString()}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                  <Eye className="size-3" /> {app.viewCount.toLocaleString()}
                </span>
              </div>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                <Download className="size-4" />
                {downloading ? "Memproses..." : "Download APK"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 grid gap-6 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-100 p-4 text-center">
          <div className="text-xs text-gray-500">Developer</div>
          <div className="mt-1 flex items-center justify-center gap-1.5 text-sm font-medium text-gray-900">
            <User className="size-4 text-gray-400" />
            {app.ownerName}
          </div>
        </div>
        <div className="rounded-xl border border-gray-100 p-4 text-center">
          <div className="text-xs text-gray-500">Minimum Android</div>
          <div className="mt-1 text-sm font-medium text-gray-900">
            {app.minAndroidVersion || "Android 6.0"}
          </div>
        </div>
        <div className="rounded-xl border border-gray-100 p-4 text-center">
          <div className="text-xs text-gray-500">Updated</div>
          <div className="mt-1 text-sm font-medium text-gray-900">
            {formatDate(app.lastVersionUpdateAt)}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Description</h2>
        <p className="whitespace-pre-line text-sm leading-relaxed text-gray-600">
          {app.description}
        </p>
      </div>

      {screenshots.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Screenshots</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {screenshots.map((url, idx) => (
              <button
                key={idx}
                onClick={() => setLightboxIdx(idx)}
                className="relative aspect-[9/16] h-64 shrink-0 overflow-hidden rounded-xl"
              >
                <Image
                  src={url}
                  alt={`Screenshot ${idx + 1}`}
                  fill
                  className="object-cover transition hover:scale-105"
                  sizes="180px"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {app.changelog && (
        <div className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Changelog</h2>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="whitespace-pre-line text-sm text-gray-600">{app.changelog}</p>
          </div>
        </div>
      )}

      {(app.websiteURL || app.githubURL) && (
        <div className="mb-8 flex flex-wrap gap-3">
          {app.websiteURL && (
            <a
              href={app.websiteURL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
            >
              <Globe className="size-4" /> Website <ExternalLink className="size-3" />
            </a>
          )}
          {app.githubURL && (
            <a
              href={app.githubURL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
            >
              <Code2 className="size-4" /> GitHub <ExternalLink className="size-3" />
            </a>
          )}
        </div>
      )}

      {app.tags && app.tags.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 text-sm font-semibold text-gray-500">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {app.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {isOwner && (
        <div className="mb-8">
          <Link
            href={`/dashboard/apps/${app.appId}/edit`}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
          >
            Edit Aplikasi
          </Link>
        </div>
      )}

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
          <button
            onClick={() => setLightboxIdx(null)}
            className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white backdrop-blur"
          >
            <ExternalLink className="size-5" />
          </button>
        </div>
      )}
    </div>
  );
}
