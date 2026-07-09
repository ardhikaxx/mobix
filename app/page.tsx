"use client";

import { useState, useMemo } from "react";
import { AppGrid } from "@/components/AppGrid";
import { SearchBar } from "@/components/SearchBar";
import { CategoryPill } from "@/components/CategoryPill";
import { usePublishedApps } from "@/lib/hooks/useApps";
import { useTranslation } from "@/lib/hooks/useTranslation";
import { CATEGORIES } from "@/lib/constants/categories";
import { Loader2 } from "lucide-react";

const PAGE_SIZE = 8;

export default function HomePage() {
  const { data: allApps, error: publishedErr, isLoading: publishedLoad } = usePublishedApps();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

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

  const visibleApps = useMemo(() => {
    if (!allApps) return [];
    return allApps.slice(0, visibleCount);
  }, [allApps, visibleCount]);

  const hasMore = allApps ? visibleCount < allApps.length : false;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, allApps?.length ?? prev));
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
            <h2 className="text-sm sm:text-lg font-bold text-gray-800 dark:text-gray-200">{t.home.categories}</h2>
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
              {t.home.searchResults} "{searchQuery}"
            </h2>
            <button
              onClick={handleClearSearch}
              className="text-sm font-medium text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {t.home.clear}
            </button>
          </div>
          <AppGrid
            apps={searchResults}
            isLoading={isSearching}
            error={searchResults.length === 0 && !isSearching ? new Error("Tidak ada hasil") : undefined}
          />
        </section>
      ) : (
        <section className="mx-auto max-w-5xl px-4 py-4 sm:py-6">
          <div className="mb-3 sm:mb-4 flex items-center justify-between">
            <h2 className="text-sm sm:text-lg font-bold text-gray-800 dark:text-gray-200">{t.home.newUpdates}</h2>
          </div>
          <AppGrid
            apps={visibleApps}
            isLoading={publishedLoad}
            error={publishedErr}
          />
          {hasMore && (
            <div className="mt-6 sm:mt-8 flex justify-center">
              <button
                onClick={handleLoadMore}
                className="inline-flex items-center gap-2 min-h-[46px] rounded-full border border-gray-200 bg-white px-8 py-3 text-sm font-bold text-gray-700 transition-all hover:border-store/30 hover:bg-store/5 hover:text-store active:scale-95 shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-store/30 dark:hover:bg-store/10"
              >
                <Loader2 className="size-4" />
                Load More ({allApps!.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
