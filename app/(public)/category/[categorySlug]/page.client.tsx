"use client";

import { use } from "react";
import { useAppsByCategory } from "@/lib/hooks/useApps";
import { AppGrid } from "@/components/AppGrid";
import { getCategoryLabel } from "@/lib/constants/categories";
import { useTranslation } from "@/lib/hooks/useTranslation";
import Breadcrumb from "@/components/Breadcrumb";

export default function CategoryPageClient({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = use(params);
  const { data: apps, isLoading, error } = useAppsByCategory(categorySlug);
  const label = getCategoryLabel(categorySlug);
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
      <Breadcrumb items={[
        { label: t.breadcrumb.home, href: "/" },
        { label: t.breadcrumb.category, href: "/#categories" },
        { label },
      ]} />
      <h1 className="mb-6 sm:mb-8 text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 break-words">Kategori: {label}</h1>
      <AppGrid apps={apps} isLoading={isLoading} error={error} />
    </div>
  );
}
