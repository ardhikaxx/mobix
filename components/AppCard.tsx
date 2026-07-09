"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, Download } from "lucide-react";
import type { AppDoc } from "@/types/app";
import { getCategoryLabel } from "@/lib/constants/categories";
import { formatBytes } from "@/lib/utils/slug";
import { useRealtimeRating } from "@/lib/hooks/useRealtimeRating";
import { useDownloadCount } from "@/lib/hooks/useDownloadCount";

function RatingStars({ rating }: { rating: number }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const filled = i <= Math.round(rating);
    stars.push(
      <Star
        key={i}
        className={`size-3.5 ${filled ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600"}`}
      />
    );
  }
  return <div className="flex items-center gap-0.5">{stars}</div>;
}

export function AppCard({ app }: { app: AppDoc }) {
  const { rating, totalReviews } = useRealtimeRating(app.slug);
  const { count: downloadCount } = useDownloadCount(app.slug);
  const category = getCategoryLabel(app.category);
  const hasRating = totalReviews > 0;

  return (
    <Link
      href={`/apps/${app.slug}`}
      className="group block rounded-2xl border border-gray-100 bg-white p-3 sm:p-4 transition-all duration-200 hover:border-store/30 hover:shadow-lg active:scale-[0.98] active:bg-gray-50/50 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-store/30 dark:active:bg-gray-800/50"
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="relative size-14 sm:size-16 shrink-0 rounded-2xl overflow-hidden ring-1 ring-black/5 shadow-sm dark:ring-white/10">
          <Image src={app.logoURL} alt={app.name} fill className="object-cover" sizes="64px" loading="eager" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1 sm:gap-1.5">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 dark:text-gray-100" title={app.name}>
            {app.name}
          </h3>

          <span className="text-xs text-gray-400 dark:text-gray-500">{category}</span>

          <div className="flex flex-col gap-0">
            <span className="text-xs text-gray-400 dark:text-gray-500">{formatBytes(app.apkSizeBytes)}</span>
            <span className="text-[11px] text-gray-400 dark:text-gray-500">{downloadCount} download</span>
          </div>

          {hasRating && (
            <div className="flex items-center gap-1.5">
              <RatingStars rating={rating} />
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">{rating.toFixed(1)}</span>
              <span className="text-[11px] text-gray-400 dark:text-gray-500">({totalReviews})</span>
            </div>
          )}

          <div className="flex items-center justify-center gap-1 rounded-lg bg-store px-3 py-1.5 text-xs font-semibold text-white transition-colors group-hover:bg-store-light mt-0.5">
            <Download className="size-3.5" />
            Install
          </div>
        </div>
      </div>
    </Link>
  );
}
