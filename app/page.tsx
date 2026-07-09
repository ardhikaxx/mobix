"use client";

import Link from "next/link";
import { AppGrid } from "@/components/AppGrid";
import { CategoryPill } from "@/components/CategoryPill";
import { usePopularApps, useLatestApps } from "@/lib/hooks/useApps";
import { CATEGORIES } from "@/lib/constants/categories";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  const { data: popular, error: popularErr, isLoading: popularLoad } = usePopularApps();
  const { data: latest, error: latestErr, isLoading: latestLoad } = useLatestApps();

  return (
    <div>
      {/* Recommended Section */}
      <section id="recommended" className="mx-auto max-w-5xl px-4 py-4 sm:py-6 scroll-mt-20">
        <div className="mb-3 sm:mb-4 flex items-center justify-between">
          <h2 className="text-sm sm:text-lg font-bold text-gray-800 dark:text-gray-200">Recommended for you</h2>
        </div>
        <AppGrid
          apps={popular}
          isLoading={popularLoad}
          error={popularErr}
        />
      </section>

      {/* Categories */}
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

      {/* Latest Apps */}
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
    </div>
  );
}
