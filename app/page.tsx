"use client";

import Link from "next/link";
import { SearchBar } from "@/components/SearchBar";
import { AppGrid } from "@/components/AppGrid";
import { CategoryPill } from "@/components/CategoryPill";
import { StatsCard } from "@/components/StatsCard";
import { usePopularApps, useLatestApps } from "@/lib/hooks/useApps";
import { useTopApps } from "@/lib/hooks/useTopApps";
import { CATEGORIES } from "@/lib/constants/categories";
import { useAuth } from "@/context/AuthProvider";
import {
  Smartphone,
  Shield,
  Users,
  Zap,
  ArrowRight,
  Download,
  AppWindow,
} from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();
  const { data: popular, error: popularErr, isLoading: popularLoad } = usePopularApps();
  const { data: latest, error: latestErr, isLoading: latestLoad } = useLatestApps();
  const { data: topApps } = useTopApps();

  const totalDownloads = topApps?.reduce((sum, a) => sum + a.downloadCount, 0) ?? 0;

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 py-20 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              One Place for <span className="text-yellow-300">Every App</span>
            </h1>
            <p className="mb-8 text-lg text-blue-100">
              Platform distribusi aplikasi Android berbasis komunitas. Upload karya Anda, temukan aplikasi keren buatan developer Indonesia.
            </p>
            <div className="mb-12 flex justify-center">
              <SearchBar large />
            </div>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-yellow-300">{topApps?.length ?? 0}+</div>
                <div className="mt-1 text-sm text-blue-200">Total Apps</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-300">
                  {totalDownloads.toLocaleString()}+
                </div>
                <div className="mt-1 text-sm text-blue-200">Downloads</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-300">
                  {new Set(topApps?.map((a) => a.ownerId)).size}+
                </div>
                <div className="mt-1 text-sm text-blue-200">Contributors</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <CategoryPill key={cat.slug} slug={cat.slug} label={cat.label} />
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Aplikasi Populer</h2>
            <Link
              href="/search"
              className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Lihat Semua <ArrowRight className="size-4" />
            </Link>
          </div>
          <AppGrid
            apps={popular}
            isLoading={popularLoad}
            error={popularErr}
          />
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Baru Diunggah</h2>
            <Link
              href="/search"
              className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Lihat Semua <ArrowRight className="size-4" />
            </Link>
          </div>
          <AppGrid
            apps={latest}
            isLoading={latestLoad}
            error={latestErr}
          />
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-10 text-center text-2xl font-bold text-gray-900">
            Kenapa Memilih Mobix?
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-gray-100 p-6 text-center">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-blue-100">
                <Smartphone className="size-6 text-blue-600" />
              </div>
              <h3 className="mb-2 font-semibold text-gray-900">100% Gratis</h3>
              <p className="text-sm text-gray-500">Download dan upload aplikasi tanpa biaya sepeser pun.</p>
            </div>
            <div className="rounded-xl border border-gray-100 p-6 text-center">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-green-100">
                <Shield className="size-6 text-green-600" />
              </div>
              <h3 className="mb-2 font-semibold text-gray-900">Tanpa Iklan</h3>
              <p className="text-sm text-gray-500">Nikmati pengalaman browsing tanpa gangguan iklan mengganggu.</p>
            </div>
            <div className="rounded-xl border border-gray-100 p-6 text-center">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-purple-100">
                <Users className="size-6 text-purple-600" />
              </div>
              <h3 className="mb-2 font-semibold text-gray-900">Komunitas Terbuka</h3>
              <p className="text-sm text-gray-500">Siapa pun bisa berkontribusi dan berbagi karya mereka.</p>
            </div>
            <div className="rounded-xl border border-gray-100 p-6 text-center">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-orange-100">
                <Zap className="size-6 text-orange-600" />
              </div>
              <h3 className="mb-2 font-semibold text-gray-900">Mudah Digunakan</h3>
              <p className="text-sm text-gray-500">Upload aplikasi dalam hitungan menit dengan form yang sederhana.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
