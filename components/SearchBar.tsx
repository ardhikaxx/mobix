"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useTranslation } from "@/lib/hooks/useTranslation";

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
  const debounceTimer = useRef<NodeJS.Timeout>(undefined);
  const { t } = useTranslation();

  useEffect(() => {
    if (large && inputRef.current) {
      inputRef.current.focus();
    }
  }, [large]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    const trimmedValue = value.trim();
    
    if (trimmedValue.length >= 2 && onSearch) {
      debounceTimer.current = setTimeout(() => {
        onSearch(trimmedValue);
      }, 300);
    } else if (trimmedValue.length === 0 && onSearch) {
      onSearch("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q.length >= 2 && onSearch) {
      onSearch(q);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative w-full ${large ? "max-w-2xl" : "max-w-md"}`}>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder={t.home.search}
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
