"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Loader2, Link2 } from "lucide-react";

interface OgData {
  title: string | null;
  description: string | null;
  image: string | null;
  url: string;
}

export function LinkPreview({ url }: { url: string }) {
  const [data, setData] = useState<OgData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    fetch(`/api/link-preview?url=${encodeURIComponent(url)}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((og: OgData) => {
        if (!cancelled) {
          setData(og);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [url]);

  if (loading) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1.5 flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-xs text-gray-400 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800/30 dark:hover:bg-gray-800/50"
      >
        <Loader2 className="size-3 animate-spin" />
        Loading preview...
      </a>
    );
  }

  if (error || !data || (!data.title && !data.description && !data.image)) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1.5 inline-flex items-center gap-1.5 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-xs text-gray-500 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800/30 dark:hover:bg-gray-800/50"
      >
        <Link2 className="size-3" />
        {url.length > 50 ? url.slice(0, 50) + "..." : url}
        <ExternalLink className="size-3" />
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group mt-1.5 block overflow-hidden rounded-xl border border-gray-100 bg-gray-50 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800/30 dark:hover:bg-gray-800/50"
    >
      <div className="flex flex-col sm:flex-row">
        {data.image && (
          <div className="relative shrink-0 sm:w-28 sm:self-stretch">
            <img
              src={data.image}
              alt=""
              className="h-32 w-full object-cover sm:h-full"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>
        )}
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 p-3">
          {data.title && (
            <span className="line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-store dark:text-gray-100">
              {data.title}
            </span>
          )}
          {data.description && (
            <span className="line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
              {data.description}
            </span>
          )}
          <span className="mt-0.5 truncate text-[10px] text-gray-400">
            {new URL(url).hostname}
          </span>
        </div>
      </div>
    </a>
  );
}
