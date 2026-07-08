"use client";

import { use } from "react";
import { useAppsByCategory } from "@/lib/hooks/useApps";
import { AppGrid } from "@/components/AppGrid";
import { getCategoryLabel } from "@/lib/constants/categories";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = use(params);
  const { data: apps, isLoading, error } = useAppsByCategory(categorySlug);
  const label = getCategoryLabel(categorySlug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ChevronLeft className="size-4" /> Kembali
      </Link>
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Kategori: {label}</h1>
      <AppGrid apps={apps} isLoading={isLoading} error={error} />
    </div>
  );
}
