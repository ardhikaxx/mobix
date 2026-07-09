"use client";

import { useState, useMemo } from "react";
import { AppGrid } from "@/components/AppGrid";
import { SearchBar } from "@/components/SearchBar";
import { CategoryPill } from "@/components/CategoryPill";
import { usePublishedApps } from "@/lib/hooks/useApps";
import { useTranslation } from "@/lib/hooks/useTranslation";
import { CATEGORIES } from "@/lib/constants/categories";
import { Loader2 } from "lucide-react";
import { TrustBadge } from "@/components/TrustBadge";
import { MobixBadge } from "@/components/MobixBadge";

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
        <div className="mb-4 flex justify-center">
          <TrustBadge />
        </div>
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

      {/* Developer CTA Section */}
      <section className="border-t border-gray-100 bg-gradient-to-b from-gray-50 to-white py-10 sm:py-14 dark:border-gray-800 dark:from-gray-900/50 dark:to-gray-900">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">
            Punya Aplikasi Android?
          </h2>
          <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
            Publikasikan di Mobix — hanya <strong>Rp10.000</strong> sekali, dilihat ribuan orang.
          </p>
          <p className="mb-6 text-xs text-gray-400">
            Chat WhatsApp, kirim APK, bayar via QRIS. Admin upload-kan untukmu.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <MobixBadge />
            <a
              href="https://wa.me/6285933648537"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-green-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-green-700 active:scale-95 shadow-sm"
            >
              <svg className="size-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Chat Admin via WhatsApp
            </a>
          </div>
          <p className="mt-6 text-xs text-gray-400">
            <a href="/developers" className="underline hover:text-gray-600 dark:hover:text-gray-300">Lihat halaman developer &rarr;</a>
          </p>
        </div>
      </section>
    </div>
  );
}
