"use client";

import { Download, Star, Smartphone } from "lucide-react";
import { useAllReviewStats } from "@/lib/hooks/useAllReviewStats";
import { useAllDownloadStats } from "@/lib/hooks/useAllDownloadStats";

export function StatsBar({ totalApps }: { totalApps: number }) {
  const reviewStatsMap = useAllReviewStats();
  const downloadStatsMap = useAllDownloadStats();

  const totalDownloads = Object.values(downloadStatsMap).reduce((a, b) => a + b, 0);
  const totalReviews = Object.values(reviewStatsMap).reduce((a, b) => a + b.totalReviews, 0);

  const stats = [
    { icon: Smartphone, value: totalApps, label: "Aplikasi" },
    { icon: Download, value: totalDownloads, label: "Download" },
    { icon: Star, value: totalReviews, label: "Ulasan" },
  ];

  return (
    <section className="mx-auto max-w-5xl px-4 pb-2">
      <div className="grid grid-cols-3 gap-3 rounded-2xl border border-gray-100 bg-white/80 p-4 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80 sm:p-5">
        {stats.map((s, i) => (
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
