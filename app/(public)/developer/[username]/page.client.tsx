"use client";

import { use } from "react";
import { useAppsByDeveloper } from "@/lib/hooks/useApps";
import { AppGrid } from "@/components/AppGrid";
import { useTranslation } from "@/lib/hooks/useTranslation";
import Breadcrumb from "@/components/Breadcrumb";
import { slugify } from "@/lib/utils/slug";
import appsData from "@/public/data/apps.json";

export default function DeveloperPageClient({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const devName = appsData.apps.find((a) => slugify(a.ownerName) === username)?.ownerName || username;
  const { data: apps, isLoading, error } = useAppsByDeveloper(devName);
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
      <Breadcrumb items={[
        { label: t.breadcrumb.home, href: "/" },
        { label: "Developer" },
        { label: devName },
      ]} />
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 break-words">
          {devName}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {apps?.length ?? 0} aplikasi
        </p>
      </div>
      <AppGrid apps={apps} isLoading={isLoading} error={error} />
    </div>
  );
}
