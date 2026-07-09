"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function SearchBar({
  large = false,
  onSearch,
}: {
  large?: boolean;
  onSearch?: (q: string) => void;
}) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (large && inputRef.current) {
      inputRef.current.focus();
    }
  }, [large]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    if (onSearch) {
      onSearch(q);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative w-full ${large ? "max-w-2xl" : "max-w-md"}`}>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari aplikasi..."
        className={`w-full rounded-xl border border-gray-200 bg-white pr-4 text-gray-900 placeholder-gray-400 outline-none transition focus:border-store focus:ring-2 focus:ring-store/20 min-h-[44px] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 ${
          large ? "py-4 pl-12 text-base sm:text-lg" : "py-2.5 pl-10 text-base sm:text-sm"
        }`}
      />
      <Search
        className={`pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 ${
          large ? "ml-4 size-5" : "ml-3 size-4"
        }`}
      />
    </form>
  );
}
