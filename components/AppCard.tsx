import Link from "next/link";
import Image from "next/image";
import { Download } from "lucide-react";
import type { AppDoc } from "@/types/app";
import { getCategoryLabel } from "@/lib/constants/categories";
import { formatBytes } from "@/lib/utils/slug";

export function AppCard({ app }: { app: AppDoc }) {
  return (
    <Link
      href={`/apps/${app.slug}`}
      className="group block rounded-xl border border-gray-100 bg-white p-4 transition hover:shadow-lg"
    >
      <div className="mb-3 flex items-start gap-3">
        <div className="relative size-12 shrink-0 overflow-hidden rounded-lg">
          <Image
            src={app.logoURL}
            alt={app.name}
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-gray-900 group-hover:text-blue-600">
            {app.name}
          </h3>
          <p className="text-xs text-gray-500">{getCategoryLabel(app.category)}</p>
        </div>
      </div>
      <p className="mb-3 line-clamp-2 text-xs text-gray-600">
        {app.shortDescription}
      </p>
      <div className="flex items-center gap-3 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <Download className="size-3" />
          {app.downloadCount.toLocaleString()}
        </span>
        <span>{formatBytes(app.apkSizeBytes)}</span>
        <span className="ml-auto rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600">
          v{app.version}
        </span>
      </div>
    </Link>
  );
}
