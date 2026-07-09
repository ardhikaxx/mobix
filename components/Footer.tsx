"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/lib/hooks/useTranslation";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        <div className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="relative size-7 shrink-0 overflow-hidden rounded-md shadow-sm">
              <Image src="/images/logo_mobix.png" alt="Mobix Logo" fill sizes="28px" className="object-cover" />
            </div>
            <span className="text-base font-bold text-gray-800 dark:text-gray-100">Mobix</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/" className="hover:text-store transition">{t.footer.home}</Link>
            <Link href="/about" className="hover:text-store transition">{t.footer.about}</Link>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-6 text-center text-xs text-gray-400 dark:border-gray-800 dark:text-gray-500">
          &copy; {new Date().getFullYear()} Mobix
        </div>
      </div>
    </footer>
  );
}
