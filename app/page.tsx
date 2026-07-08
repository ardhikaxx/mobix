"use client";

import Link from "next/link";
import Image from "next/image";
import { AppGrid } from "@/components/AppGrid";
import { CategoryPill } from "@/components/CategoryPill";
import { usePopularApps, useLatestApps } from "@/lib/hooks/useApps";
import { useTopApps } from "@/lib/hooks/useTopApps";
import { CATEGORIES } from "@/lib/constants/categories";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  const { data: popular, error: popularErr, isLoading: popularLoad } = usePopularApps();
  const { data: latest, error: latestErr, isLoading: latestLoad } = useLatestApps();
  const { data: topApps } = useTopApps();

  const featuredApp = topApps?.[0];

  return (
    <div>
      {/* Hero Banner */}
      {featuredApp && (
        <section className="mx-auto max-w-5xl px-4 pt-4 pb-2">
          <Link
            href={`/apps/${featuredApp.slug}`}
            className="group relative block overflow-hidden rounded-2xl shadow-md"
          >
            <div className="relative h-48 md:h-64">
              {featuredApp.screenshots?.[0] ? (
                <Image
                  src={featuredApp.screenshots[0]}
                  alt={featuredApp.name}
                  fill
                  priority
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                />
              ) : (
                <div className="flex size-full items-center justify-center bg-gradient-to-br from-store to-store-dark">
                  <span className="text-4xl font-bold text-white/30">{featuredApp.name}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="mb-2 inline-block rounded bg-blue-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                  Featured
                </span>
                <h2 className="text-xl font-bold text-white md:text-2xl">{featuredApp.name}</h2>
                <p className="mt-1 text-sm text-gray-200 line-clamp-1">{featuredApp.description}</p>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Recommended Section */}
      <section className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">Recommended for you</h2>
          <Link href="/search" className="text-sm font-medium text-store transition hover:text-store-light">
            <ArrowRight className="size-5" />
          </Link>
        </div>
        <AppGrid
          apps={popular}
          isLoading={popularLoad}
          error={popularErr}
        />
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-5xl px-4 pb-2">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">Categories</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <CategoryPill key={cat.slug} slug={cat.slug} label={cat.label} />
          ))}
        </div>
      </section>

      {/* Latest Apps */}
      <section className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">New updates</h2>
          <Link href="/search" className="text-sm font-medium text-store transition hover:text-store-light">
            <ArrowRight className="size-5" />
          </Link>
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
