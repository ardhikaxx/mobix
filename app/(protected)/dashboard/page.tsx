"use client";

import { AuthGuard } from "@/components/AuthGuard";
import { useAuth } from "@/context/AuthProvider";
import { useMyApps } from "@/lib/hooks/useApps";
import { useUser } from "@/lib/hooks/useUser";
import { StatsCard } from "@/components/StatsCard";
import { StatsCardSkeleton } from "@/components/Skeleton";
import Link from "next/link";
import {
  AppWindow,
  Download,
  Upload,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

function DashboardContent() {
  const { user } = useAuth();
  const { data: userDoc, isLoading: userLoading } = useUser(user?.uid);
  const { data: myApps, isLoading: appsLoading } = useMyApps(user?.uid);

  const totalDownloads = myApps?.reduce((sum, app) => sum + app.downloadCount, 0) ?? 0;
  const topApp = myApps?.length
    ? [...myApps].sort((a, b) => b.downloadCount - a.downloadCount)[0]
    : null;

  if (userLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Selamat datang, {userDoc?.displayName || user?.displayName || "User"}!
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Aplikasi"
          value={userDoc?.appCount ?? myApps?.length ?? 0}
          icon={<AppWindow className="size-5" />}
        />
        <StatsCard
          title="Total Download"
          value={totalDownloads.toLocaleString()}
          icon={<Download className="size-5" />}
        />
        <StatsCard
          title="Aplikasi Terpopuler"
          value={topApp?.name || "-"}
          icon={<TrendingUp className="size-5" />}
        />
        <StatsCard
          title="Upload Terbaru"
          value={myApps?.[0]?.name || "-"}
          icon={<Upload className="size-5" />}
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <Link
          href="/dashboard/upload"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <Upload className="size-4" />
          Upload Aplikasi Baru
        </Link>
        <Link
          href="/dashboard/apps"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <AppWindow className="size-4" />
          Kelola Aplikasi <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <DashboardContent />
      </div>
    </AuthGuard>
  );
}
