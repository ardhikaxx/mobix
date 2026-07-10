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
    <div className="w-[320px] max-h-[140px] overflow-y-auto rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900">
      <Link href={appUrl} target="_blank" className="flex items-start gap-3">
        <div className="relative size-14 shrink-0 overflow-hidden rounded-xl ring-1 ring-black/5 shadow-sm dark:ring-white/10">
          <Image src={app.logoURL} alt={app.name} fill className="object-cover" sizes="56px" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 break-words">
            {app.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formatBytes(app.apkSizeBytes)} · {downloadCount.toLocaleString()} downloads
          </p>
          <p className="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500 leading-tight line-clamp-2">
            {app.description}
          </p>
          <span className="mt-1.5 inline-flex items-center justify-center rounded-lg bg-store px-3 py-1 text-xs font-semibold text-white">
            Install
          </span>
        </div>
      </Link>
    </div>
  );
}
