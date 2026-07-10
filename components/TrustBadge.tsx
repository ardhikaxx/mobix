"use client";

import { useUserCount } from "@/lib/hooks/useUserCount";

function AvatarCircle({ url, name }: { url: string; name: string }) {
  return (
    <div className="relative size-7 overflow-hidden rounded-full ring-2 ring-white dark:ring-gray-800">
      <img
        src={url}
        alt={name}
        className="size-full object-cover"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

function PlaceholderCircle({ name }: { name: string }) {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-pink-500",
  ];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div
      className={`flex size-7 items-center justify-center rounded-full text-[10px] font-bold text-white ring-2 ring-white dark:ring-gray-800 ${color}`}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export function TrustBadge() {
  const { count, avatars, loading } = useUserCount();

  const displayCount = count ?? 0;
  const formatted = displayCount >= 1000
    ? `${(displayCount / 1000).toFixed(1).replace(/\.0$/, "")}rb+`
    : `${displayCount}+`;

  const maxAvatars = 4;
  const items = avatars.slice(0, maxAvatars);

  return (
    <div className="flex items-center gap-3 rounded-full border border-gray-100 bg-white px-4 py-2 shadow-sm dark:border-gray-700 dark:bg-gray-800/80">
      <img src="/badge.svg" alt="Mobix" width={180} height={60} className="h-[60px] w-[180px]" />
      <div className="h-5 w-px bg-gray-200 dark:bg-gray-600" />
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="size-7 animate-pulse rounded-full bg-gray-200 ring-2 ring-white dark:bg-gray-600 dark:ring-gray-800"
              />
            ))
          ) : items.length > 0 ? (
            items.map((a) =>
              a.photoURL ? (
                <AvatarCircle key={a.uid} url={a.photoURL} name={a.displayName} />
              ) : (
                <PlaceholderCircle key={a.uid} name={a.displayName} />
              ),
            )
          ) : (
            Array.from({ length: 4 }).map((_, i) => (
              <PlaceholderCircle key={i} name="M" />
            ))
          )}
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
