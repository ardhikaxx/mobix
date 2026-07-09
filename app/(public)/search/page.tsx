"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSearch } from "@/lib/hooks/useSearch";
import { AppGrid } from "@/components/AppGrid";
import { SearchBar } from "@/components/SearchBar";

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const { data: apps, isLoading, error } = useSearch(q);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
      <h1 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Cari Aplikasi</h1>
      <div className="mb-6 sm:mb-8">
        <SearchBar large />
      </div>
      {q && (
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 break-words">
          Hasil pencarian untuk &quot;{q}&quot;
        </p>
      )}
      <AppGrid apps={apps} isLoading={isLoading} error={error} />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}
