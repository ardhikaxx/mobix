"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import appsData from "@/public/data/apps.json";
import { formatBytes } from "@/lib/utils/slug";
import type { AppDoc } from "@/types/app";

export default function EmbedCard({
  slugPromise,
}: {
  slugPromise: Promise<{ slug: string }>;
}) {
  const { slug } = use(slugPromise);
  const app = (appsData.apps as AppDoc[]).find(
    (a) => a.slug === slug && a.status === "published"
  );
  const [downloadCount, setDownloadCount] = useState(0);

  useEffect(() => {
    if (!slug) return;
    getDoc(doc(db, "downloads", slug))
      .then((snap) => setDownloadCount(snap.exists() ? snap.data().count : 0))
      .catch(() => {});
  }, [slug]);

  if (!app) {
    return (
      <div className="flex items-center justify-center h-32 text-sm text-gray-400">
        App not found
      </div>
    );
  }

  const appUrl = `https://mobix-mu.vercel.app/apps/${slug}`;

  return (
    <div className="w-[320px] rounded-xl border border-gray-200 bg-white p-5 shadow-lg dark:border-gray-700 dark:bg-gray-900">
      <Link href={appUrl} target="_blank" className="flex flex-col items-center text-center gap-3">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl ring-1 ring-black/5 shadow-md dark:ring-white/10">
          <Image src={app.logoURL} alt={app.name} fill className="object-cover" sizes="80px" />
        </div>
        <div className="flex flex-col items-center">
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 break-words">
            {app.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {formatBytes(app.apkSizeBytes)} · {downloadCount.toLocaleString()} downloads
          </p>
          <p className="mt-2 text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3 text-center max-w-[260px]">
            {app.description}
          </p>
          <span className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-full bg-store px-6 py-2 text-sm font-semibold text-white shadow-md shadow-store/20 hover:bg-store-light transition-colors">
            Install Aplikasi
          </span>
          <p className="mt-2 text-[10px] text-gray-400 dark:text-gray-500">
            Tersedia di Mobix
          </p>
        </div>
      </Link>
    </div>
  );
}
