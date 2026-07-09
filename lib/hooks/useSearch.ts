import useSWR from "swr";
import type { AppDoc } from "@/types/app";

export function useSearch(queryStr: string) {
  const query = queryStr.toLowerCase().trim();
  
  return useSWR(
    `search:${query || "all"}`,
    async () => {
      const data = await fetch("/data/apps.json").then((r) => r.json());
      const apps = data.apps as AppDoc[];
      
      const published = apps.filter((a) => a.status === "published")
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      // If no query, return all published apps
      if (!query) return published;

      // Filter by keyword
      return published
        .filter(
          (a) =>
            a.name.toLowerCase().includes(query) ||
            a.description.toLowerCase().includes(query) ||
            a.searchKeywords?.some((k) => k.toLowerCase().includes(query))
        )
        .slice(0, 20);
    },
    { revalidateOnFocus: false }
  );
}
