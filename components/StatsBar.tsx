"use client";

import { Download, Star, Smartphone } from "lucide-react";
import { useAllReviewStats } from "@/lib/hooks/useAllReviewStats";
import { useAllDownloadStats } from "@/lib/hooks/useAllDownloadStats";

export function StatsBar({ totalApps }: { totalApps: number }) {
  const { reviewMap, loading: reviewLoading } = useAllReviewStats();
  const { downloadMap, loading: downloadLoading } = useAllDownloadStats();

  const totalDownloads = Object.values(downloadMap).reduce((a, b) => a + b, 0);
  const totalReviews = Object.values(reviewMap).reduce((a, b) => a + b.totalReviews, 0);
  const loading = (reviewLoading || downloadLoading) && totalApps > 0;

  const stats = [
    { icon: Smartphone, value: totalApps, label: "Aplikasi" },
    { icon: Download, value: totalDownloads, label: "Download" },
    { icon: Star, value: totalReviews, label: "Ulasan" },
  ];

  return (
    <section className="mx-auto max-w-5xl px-4 pb-2">
      <div className="grid grid-cols-3 gap-3 rounded-2xl border border-gray-100 bg-white/80 p-4 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80 sm:p-5">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1 text-center">
                <div className="size-4 animate-pulse rounded bg-gray-200 sm:size-5 dark:bg-gray-700" />
                <div className="mx-auto h-7 w-14 animate-pulse rounded bg-gray-200 sm:hidden dark:bg-gray-700" />
                <div className="mx-auto hidden h-8 w-16 animate-pulse rounded bg-gray-200 sm:block dark:bg-gray-700" />
                <div className="mx-auto h-3 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            ))
          : stats.map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-1 text-center">
                <s.icon className="size-4 text-store sm:size-5" />
                <span className="text-lg font-extrabold text-gray-900 dark:text-gray-100 sm:text-xl">
                  {s.value.toLocaleString("id-ID")}
                </span>
                <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 sm:text-xs">
                  {s.label}
                </span>
              </div>
            ))}
      </div>
    </section>
  );
}
