"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="mb-6 flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="size-3" />}
            {isLast || !item.href ? (
              <span className="text-gray-600 dark:text-gray-300">{item.label}</span>
            ) : (
              <Link href={item.href} className="transition hover:text-store">
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
