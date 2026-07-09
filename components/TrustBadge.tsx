"use client";

import { useUserCount } from "@/lib/hooks/useUserCount";
import { MobixBadge } from "./MobixBadge";

const AVATARS = [
  { initial: "A", color: "bg-red-500" },
  { initial: "B", color: "bg-blue-500" },
  { initial: "C", color: "bg-green-500" },
  { initial: "D", color: "bg-purple-500" },
];

export function TrustBadge() {
  const { count, loading } = useUserCount();

  const displayCount = count ?? 0;
  const formatted = displayCount >= 1000
    ? `${(displayCount / 1000).toFixed(1).replace(/\.0$/, "")}rb+`
    : `${displayCount}+`;

  return (
    <div className="flex items-center gap-3 rounded-full border border-gray-100 bg-white px-4 py-2 shadow-sm dark:border-gray-700 dark:bg-gray-800/80">
      <MobixBadge variant="compact" />
      <div className="h-5 w-px bg-gray-200 dark:bg-gray-600" />
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {AVATARS.map((a, i) => (
            <div
              key={i}
              className={`relative flex size-7 items-center justify-center rounded-full text-[10px] font-bold text-white ring-2 ring-white dark:ring-gray-800 ${a.color}`}
            >
              {a.initial}
            </div>
          ))}
        </div>
        {loading ? (
          <span className="h-3 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-600" />
        ) : (
          <span className="whitespace-nowrap text-xs font-semibold text-gray-600 dark:text-gray-300">
            {formatted} pengguna
          </span>
        )}
      </div>
    </div>
  );
}
