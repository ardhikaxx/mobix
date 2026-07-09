"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, Download, HardDrive, Package, Zap } from "lucide-react";
import type { AppDoc } from "@/types/app";
import { getCategoryLabel } from "@/lib/constants/categories";
import { formatBytes } from "@/lib/utils/slug";
import { useRealtimeRating } from "@/lib/hooks/useRealtimeRating";

function RatingStars({ rating }: { rating: number }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const filled = i <= Math.round(rating);
    stars.push(
      <Star
        key={i}
        className={`size-3 ${filled ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
      />
    );
  }
  return <div className="flex items-center gap-0.5">{stars}</div>;
}

const CATEGORY_COLORS: Record<string, string> = {
  productivity: "from-blue-500 to-blue-600",
  tools: "from-gray-600 to-gray-700",
  games: "from-purple-500 to-purple-600",
  social: "from-sky-500 to-sky-600",
  finance: "from-emerald-500 to-emerald-600",
  health: "from-rose-500 to-rose-600",
  education: "from-amber-500 to-amber-600",
  entertainment: "from-pink-500 to-pink-600",
  photography: "from-violet-500 to-violet-600",
  business: "from-indigo-500 to-indigo-600",
  other: "from-teal-500 to-teal-600",
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  productivity: "from-blue-50 via-white to-white",
  tools: "from-gray-50 via-white to-white",
  games: "from-purple-50 via-white to-white",
  social: "from-sky-50 via-white to-white",
  finance: "from-emerald-50 via-white to-white",
  health: "from-rose-50 via-white to-white",
  education: "from-amber-50 via-white to-white",
  entertainment: "from-pink-50 via-white to-white",
  photography: "from-violet-50 via-white to-white",
  business: "from-indigo-50 via-white to-white",
  other: "from-teal-50 via-white to-white",
};

export function AppCard({ app }: { app: AppDoc }) {
  const { rating, totalReviews } = useRealtimeRating(app.slug);
  const category = getCategoryLabel(app.category);
  const catGradient = CATEGORY_GRADIENTS[app.category] || "from-gray-50 via-white to-white";
  const catColor = CATEGORY_COLORS[app.category] || "from-gray-500 to-gray-600";
  const ratingPercent = totalReviews > 0 ? (rating / 5) * 100 : 0;

  return (
    <Link
      href={`/apps/${app.slug}`}
      className="group relative block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gray-200 hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.15)]"
    >
      {/* Category-based header strip */}
      <div className={`h-2 bg-gradient-to-r ${catColor}`} />

      <div className={`bg-gradient-to-br ${catGradient} p-5`}>
        <div className="flex gap-4">
          {/* Logo */}
          <div className="relative flex-shrink-0 w-[84px] aspect-square rounded-[20px] overflow-hidden bg-white ring-1 ring-black/5 shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:ring-black/10">
            <Image src={app.logoURL} alt={app.name} fill className="object-cover" sizes="84px" loading="eager" />
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-2">
            {/* Name + Rating badge */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-bold text-gray-900 line-clamp-1" title={app.name}>
                {app.name}
              </h3>
              {totalReviews > 0 && (
                <span className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-amber-50 border border-amber-200/50 px-2 py-0.5 text-[11px] font-bold text-amber-700">
                  <Star className="size-2.5 fill-amber-500 text-amber-500" />
                  {rating.toFixed(1)}
                </span>
              )}
            </div>

            {/* Category + Size + Version */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-lg bg-white/80 border border-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-600 shadow-sm">
                {category}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-gray-400">
                <Package className="size-3" />
                {app.version}
              </span>
              <span className="text-gray-300 text-[10px]">|</span>
              <span className="inline-flex items-center gap-1 text-[11px] text-gray-400">
                <HardDrive className="size-3" />
                {formatBytes(app.apkSizeBytes)}
              </span>
            </div>

            {/* Description */}
            {app.shortDescription && (
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 border-l-2 border-gray-100 pl-2.5">
                {app.shortDescription}
              </p>
            )}

            {/* Divider */}
            <div className="my-0.5 border-t border-gray-50" />

            {/* Bottom: Rating bar + Download */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <RatingStars rating={rating} />
                  <span className="text-[11px] text-gray-400">
                    ({totalReviews})
                  </span>
                </div>
                {totalReviews > 0 && (
                  <div className="hidden sm:block h-1 w-16 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${catColor} transition-all duration-500`}
                      style={{ width: `${ratingPercent}%` }}
                    />
                  </div>
                )}
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-store to-store-light px-4 py-1.5 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:shadow-md hover:brightness-110 active:scale-95">
                <Download className="size-3.5 transition-transform duration-200 group-hover:translate-y-0.5" />
                Unduh
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
