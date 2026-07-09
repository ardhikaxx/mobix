"use client";

import { useState } from "react";
import { AppGrid } from "@/components/AppGrid";
import { SearchBar } from "@/components/SearchBar";
import { CategoryPill } from "@/components/CategoryPill";
import { useLatestApps } from "@/lib/hooks/useApps";
import { CATEGORIES } from "@/lib/constants/categories";

export default function HomePage() {
  const { data: latest, error: latestErr, isLoading: latestLoad } = useLatestApps();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (q: string) => {
    setSearchQuery(q);
    
    if (!q) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    try {
      const response = await fetch(`/api/apps?search=${encodeURIComponent(q)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSearchResults(data.apps || []);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <div>
      {/* Search Section */}
      <section className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        <div className="flex justify-center">
          <SearchBar large onSearch={handleSearch} />
        </div>
      </section>

      {/* Categories Section */}
      {!isSearching && searchQuery === "" && (
        <section id="categories" className="mx-auto max-w-5xl px-4 pb-2 scroll-mt-20">
          <div className="mb-3 sm:mb-4 flex items-center justify-between">
            <h2 className="text-sm sm:text-lg font-bold text-gray-800 dark:text-gray-200">Categories</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <CategoryPill key={cat.slug} slug={cat.slug} label={cat.label} />
            ))}
          </div>
        </section>
      )}

      {/* Search Results or Latest Apps */}
      {searchQuery !== "" ? (
        <section className="mx-auto max-w-5xl px-4 py-4 sm:py-6">
          <div className="mb-3 sm:mb-4 flex items-center justify-between">
            <h2 className="text-sm sm:text-lg font-bold text-gray-800 dark:text-gray-200">
              Hasil pencarian untuk "{searchQuery}"
            </h2>
            <button
              onClick={handleClearSearch}
              className="text-sm font-medium text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Bersihkan
            </button>
          </div>
          <AppGrid
            apps={searchResults}
            isLoading={isSearching}
            error={searchResults.length === 0 && !isSearching ? new Error("Tidak ada hasil") : null}
          />
        </section>
      ) : (
        <section className="mx-auto max-w-5xl px-4 py-4 sm:py-6">
          <div className="mb-3 sm:mb-4 flex items-center justify-between">
            <h2 className="text-sm sm:text-lg font-bold text-gray-800 dark:text-gray-200">New updates</h2>
          </div>
          <AppGrid
            apps={latest}
            isLoading={latestLoad}
            error={latestErr}
          />
        </section>
      )}
    </div>
  );
}
