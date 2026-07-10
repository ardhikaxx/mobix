"use client";

import { use } from "react";
import { useAppsByDeveloper } from "@/lib/hooks/useApps";
import { useAllDownloadStats } from "@/lib/hooks/useAllDownloadStats";
import { useAllReviewStats } from "@/lib/hooks/useAllReviewStats";
import { AppGrid } from "@/components/AppGrid";
import { useTranslation } from "@/lib/hooks/useTranslation";
import Breadcrumb from "@/components/Breadcrumb";
import { slugify } from "@/lib/utils/slug";
import appsData from "@/public/data/apps.json";
import { Download, Star, Smartphone, BadgeCheck } from "lucide-react";

export default function DeveloperPageClient({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const devName = appsData.apps.find((a) => slugify(a.ownerName) === username)?.ownerName || username;
  const { data: apps, isLoading, error } = useAppsByDeveloper(devName);
  const { downloadMap } = useAllDownloadStats();
  const { reviewMap } = useAllReviewStats();
  const { t } = useTranslation();

  const totalDownloads = (apps ?? []).reduce((sum, a) => sum + (downloadMap[a.slug] ?? 0), 0);
  const totalReviews = (apps ?? []).reduce((sum, a) => sum + (reviewMap[a.slug]?.totalReviews ?? 0), 0);
  const avgRating = (apps ?? []).length > 0
    ? (apps ?? []).reduce((sum, a) => sum + (reviewMap[a.slug]?.rating ?? 0), 0) / (apps ?? []).length
    : 0;
  const appCount = apps?.length ?? 0;
  const isActive = appCount > 1;

  const formatCount = (n: number) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + "Jt";
    if (n >= 1000) return (n / 1000).toFixed(1) + "Rb";
    return n.toString();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
      <Breadcrumb items={[
        { label: t.breadcrumb.home, href: "/" },
        { label: "Developer" },
        { label: devName },
      ]} />

      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 break-words">
              {devName}
            </h1>
            {isActive && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                <BadgeCheck className="size-3" />
                Developer Aktif
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {appCount} aplikasi
          </p>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-3 gap-3 sm:gap-4">
        <div className="rounded-xl border border-gray-100 bg-white p-4 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <Smartphone className="mx-auto mb-1.5 size-5 text-store" />
          <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">{appCount}</p>
          <p className="text-[11px] text-gray-500">Aplikasi</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <Download className="mx-auto mb-1.5 size-5 text-store" />
          <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">{formatCount(totalDownloads)}</p>
          <p className="text-[11px] text-gray-500">Download</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <Star className="mx-auto mb-1.5 size-5 text-store" />
          <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
            {avgRating > 0 ? avgRating.toFixed(1) : "-"}
          </p>
          <p className="text-[11px] text-gray-500">Rating ({totalReviews})</p>
        </div>
      </div>

      <AppGrid apps={apps} isLoading={isLoading} error={error} />
    </div>
  );
}
