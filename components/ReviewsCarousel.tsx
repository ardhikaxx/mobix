"use client";

import { useState, useEffect, useCallback } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { usePublishedApps } from "@/lib/hooks/useApps";
import { Star } from "lucide-react";
import Link from "next/link";

interface ReviewDoc {
  id: string;
  appSlug: string;
  appName: string;
  userId: string;
  userName: string;
  userPhoto: string | null;
  rating: number;
  text: string;
  createdAt: Timestamp | null;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`size-3 ${i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600"}`}
        />
      ))}
    </div>
  );
}

export function ReviewsCarousel() {
  const [reviews, setReviews] = useState<ReviewDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [slide, setSlide] = useState(0);
  const { data: apps } = usePublishedApps();

  useEffect(() => {
    const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"), limit(30));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ReviewDoc));
      setReviews(list);
      setLoading(false);
    });
    return unsub;
  }, []);

  const appMap = new Map<string, string>();
  if (apps) {
    apps.forEach((a) => appMap.set(a.slug, a.logoURL));
  }

  const enriched = reviews.map((r) => ({
    ...r,
    appLogo: appMap.get(r.appSlug) || null,
  }));

  const totalSlides = Math.max(1, Math.ceil(enriched.length / 3));

  const nextSlide = useCallback(() => {
    setSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  useEffect(() => {
    if (enriched.length <= 3) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide, enriched.length]);

  if (loading) {
    return (
      <section className="border-t border-gray-100 bg-white py-10 sm:py-14 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-8 text-center">
            <div className="mx-auto h-5 w-32 animate-pulse rounded bg-gray-200 sm:hidden dark:bg-gray-700" />
            <div className="mx-auto hidden h-6 w-40 animate-pulse rounded bg-gray-200 sm:block dark:bg-gray-700" />
            <div className="mx-auto mt-1 h-3 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-xl border border-gray-100 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800/50">
                <div className="mb-3 flex items-center gap-3">
                  <div className="size-9 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="flex-1 space-y-1">
                    <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-3 w-16 rounded bg-gray-200 dark:bg-gray-700" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-3 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="size-6 rounded-md bg-gray-200 dark:bg-gray-700" />
                  <div className="h-3 w-20 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (enriched.length === 0) return null;

  const getSlideItems = (slideIndex: number) => {
    const start = slideIndex * 3;
    return enriched.slice(start, start + 3);
  };

  return (
    <section className="border-t border-gray-100 bg-white py-10 sm:py-14 dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-8 text-center">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
            💬 Ulasan Pengguna
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Apa kata mereka tentang aplikasi di Mobix
          </p>
        </div>

        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${slide * 100}%)` }}
          >
            {Array.from({ length: totalSlides }).map((_, si) => {
              const items = getSlideItems(si);
              return (
                <div key={si} className="flex w-full shrink-0 gap-4">
                  {items.length === 1 ? (
                    <div className="flex w-full justify-center">
                      <ReviewCard item={items[0]} />
                    </div>
                  ) : items.length === 2 ? (
                    <div className="flex w-full justify-center gap-4">
                      {items.map((item) => (
                        <div key={item.id} className="w-full max-w-sm">
                          <ReviewCard item={item} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {items.map((item) => (
                        <ReviewCard key={item.id} item={item} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {totalSlides > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className={`h-2 rounded-full transition-all ${
                  i === slide ? "w-6 bg-store" : "w-2 bg-gray-300 dark:bg-gray-600"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ReviewCard({ item }: { item: ReviewDoc & { appLogo: string | null } }) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-gray-100 bg-gray-50 p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/50">
      <div className="mb-3 flex items-center gap-3">
        {item.userPhoto ? (
          <img
            src={item.userPhoto}
            alt={item.userName}
            className="size-9 rounded-full object-cover ring-2 ring-white dark:ring-gray-800"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex size-9 items-center justify-center rounded-full bg-store/10 text-sm font-bold text-store">
            {item.userName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
            {item.userName}
          </p>
          <StarRating rating={item.rating} />
        </div>
      </div>

      <p className="mb-3 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400 line-clamp-3">
        &ldquo;{item.text}&rdquo;
      </p>

      <Link
        href={`/apps/${item.appSlug}`}
        className="mt-auto flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 transition hover:border-store/30 hover:bg-store/5 dark:border-gray-600 dark:bg-gray-800"
      >
        {item.appLogo ? (
          <img
            src={item.appLogo}
            alt={item.appName}
            className="size-6 rounded-md object-cover"
          />
        ) : (
          <div className="flex size-6 items-center justify-center rounded-md bg-store/10 text-[10px] font-bold text-store">
            {item.appName.charAt(0)}
          </div>
        )}
        <span className="truncate text-xs font-medium text-gray-700 dark:text-gray-300">
          {item.appName}
        </span>
      </Link>
    </div>
  );
}
