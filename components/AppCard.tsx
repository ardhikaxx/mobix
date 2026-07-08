"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, Download } from "lucide-react";
import type { AppDoc } from "@/types/app";
import { getCategoryLabel } from "@/lib/constants/categories";
import { formatBytes } from "@/lib/utils/slug";
import { useRealtimeRating } from "@/lib/hooks/useRealtimeRating";

function RatingStars({ rating }: { rating: number }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        className={`size-3 ${i <= Math.round(rating) ? "fill-gray-700 text-gray-700" : "fill-gray-200 text-gray-200"}`}
      />
    );
  }
  return <div className="flex items-center gap-0.5">{stars}</div>;
}

export function AppCard({ app }: { app: AppDoc }) {
  const { rating, totalReviews } = useRealtimeRating(app.slug);

  return (
    <Link
      href={`/apps/${app.slug}`}
      className="group block rounded-xl border border-gray-100 bg-white p-4 transition hover:shadow-md"
    >
      <div className="mb-3 flex flex-col items-center">
        <div className="relative mb-3 size-[72px] shrink-0 overflow-hidden rounded-2xl shadow-sm">
          <Image
            src={app.logoURL}
            alt={app.name}
            fill
            className="object-cover"
            sizes="72px"
          />
        </div>
        <h3 className="w-full text-center text-sm font-semibold text-gray-800 line-clamp-1 leading-tight" title={app.name}>
          {app.name}
        </h3>
        <p className="mt-0.5 text-[11px] text-gray-500">{getCategoryLabel(app.category)}</p>
      </div>
      <div className="flex items-center justify-center gap-1.5">
        <Download className="size-3 text-gray-400" />
        <span className="text-xs font-bold text-gray-700">{formatBytes(app.apkSizeBytes)}</span>
      </div>
      <div className="mt-1 flex items-center justify-center gap-1">
        <RatingStars rating={rating} />
        <span className="text-[11px] font-medium text-gray-600">
          {totalReviews > 0 ? rating.toFixed(1) : "-"}
        </span>
      </div>
    </Link>
  );
}
