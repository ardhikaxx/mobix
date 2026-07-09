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
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Search Apps</h1>
      <div className="mb-8">
        <SearchBar large />
      </div>
      {q && (
        <p className="mb-6 text-sm text-gray-500">
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
