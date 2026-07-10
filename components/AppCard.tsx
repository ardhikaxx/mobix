"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, Download, Share2, Sparkles, Flame, BadgeCheck } from "lucide-react";
import type { AppDoc } from "@/types/app";
import { getCategoryLabel } from "@/lib/constants/categories";
import { formatBytes } from "@/lib/utils/slug";
import { useRealtimeRating } from "@/lib/hooks/useRealtimeRating";
import { useDownloadCount } from "@/lib/hooks/useDownloadCount";
import type { ReviewStats } from "@/lib/hooks/useAllReviewStats";
import toast from "react-hot-toast";

function RatingStars({ rating }: { rating: number }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const filled = i <= Math.round(rating);
    stars.push(
      <Star
        key={i}
        className={`size-3 ${filled ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600"}`}
      />
    );
  }
  return <div className="flex items-center gap-0.5">{stars}</div>;
}

const POPULAR_THRESHOLD = 50;
const NEW_DAYS = 14;

function isNewApp(createdAt: string): boolean {
  const diff = Date.now() - new Date(createdAt).getTime();
  return diff < NEW_DAYS * 24 * 60 * 60 * 1000;
}

function handleShare(e: React.MouseEvent, slug: string, name: string) {
  e.preventDefault();
  e.stopPropagation();
  const url = `${window.location.origin}/apps/${slug}`;
  if (navigator.share) {
    navigator.share({ title: name, text: `Download ${name} di Mobix!`, url }).catch(() => {});
  } else {
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Link disalin!");
    }).catch(() => {
      toast.error("Gagal menyalin link");
    });
  }
}

export function AppCard({
  app,
  ratingMap,
  downloadMap,
}: {
  app: AppDoc;
  ratingMap?: Record<string, ReviewStats>;
  downloadMap?: Record<string, number>;
}) {
  const { rating: rtg, totalReviews: revs } = useRealtimeRating(app.slug);
  const { count: dlCount } = useDownloadCount(app.slug);
  const stats = ratingMap?.[app.slug];
  const rating = stats?.rating ?? rtg;
  const totalReviews = stats?.totalReviews ?? revs;
  const downloadCount = downloadMap?.[app.slug] ?? dlCount;
  const category = getCategoryLabel(app.category);
  const popular = downloadCount >= POPULAR_THRESHOLD;
  const newest = isNewApp(app.createdAt);
  const hasRating = totalReviews > 0;

  return (
    <div className="group relative rounded-2xl border border-gray-100 bg-white transition-all duration-200 hover:border-store/30 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-store/30">
      <Link
        href={`/apps/${app.slug}`}
        className="block p-3 sm:p-4 active:scale-[0.98] active:bg-gray-50/50 dark:active:bg-gray-800/50"
      >
        {(popular || newest) && (
          <div className="absolute -left-0.5 top-3 z-10 flex flex-col gap-1">
            {newest && (
              <span className="inline-flex items-center gap-1 rounded-r-full bg-blue-500 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
                <Sparkles className="size-3" /> New
              </span>
            )}
            {popular && (
              <span className="inline-flex items-center gap-1 rounded-r-full bg-orange-500 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
                <Flame className="size-3" /> Popular
              </span>
            )}
          </div>
        )}

        <div className="flex items-start gap-3 sm:gap-4">
          <div className="relative size-14 shrink-0 overflow-hidden rounded-2xl ring-1 ring-black/5 shadow-sm sm:size-16 dark:ring-white/10">
            <Image src={app.logoURL} alt={app.name} fill className="object-cover" sizes="64px" loading="eager" />
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:gap-1">
            <h3 className="flex items-center gap-1 truncate text-sm font-semibold text-gray-900 dark:text-gray-100" title={app.name}>
              <span className="truncate">{app.name}</span>
              {app.isVerified && <BadgeCheck className="size-3.5 shrink-0 text-blue-500" />}
            </h3>

            <div className="flex items-center gap-1.5">
              <RatingStars rating={rating} />
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                {rating.toFixed(1)}
              </span>
              {hasRating && (
                <span className="text-[11px] text-gray-400 dark:text-gray-500">
                  ({totalReviews})
                </span>
              )}
            </div>

            <span className="text-xs text-gray-400 dark:text-gray-500">{category}</span>

            <div className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500">
              <span>{formatBytes(app.apkSizeBytes)}</span>
              <span className="text-gray-300 dark:text-gray-600">·</span>
              <span>{downloadCount} download</span>
            </div>

            <div className="mt-1 flex items-center justify-center gap-1 rounded-lg bg-store px-3 py-1.5 text-xs font-semibold text-white transition-colors group-hover:bg-store-light">
              <Download className="size-3.5" />
              Install
            </div>
          </div>
        </div>
      </Link>

      <button
        onClick={(e) => handleShare(e, app.slug, app.name)}
        className="absolute right-2.5 top-2.5 z-10 rounded-full p-1.5 text-gray-400 opacity-0 transition hover:bg-gray-100 hover:text-store group-hover:opacity-100 dark:hover:bg-gray-800"
        title="Bagikan"
      >
        <Share2 className="size-3.5" />
      </button>
    </div>
  );
}
