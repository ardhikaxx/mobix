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
        className="mb-4 inline-flex items-center gap-1 min-h-[40px] rounded-xl px-3 py-1.5 -ml-3 text-sm font-bold text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:scale-95 transition-all"
      >
        <ChevronLeft className="size-4 text-store" /> Kembali ke Beranda
      </Link>
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Kategori: {label}</h1>
      <AppGrid apps={apps} isLoading={isLoading} error={error} />
    </div>
  );
}
