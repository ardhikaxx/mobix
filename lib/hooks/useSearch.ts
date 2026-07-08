import useSWR from "swr";
import type { AppDoc } from "@/types/app";

export function useSearch(queryStr: string) {
  return useSWR(
    queryStr ? `search:${queryStr}` : null,
    async () => {
      const data = await fetch("/data/apps.json").then((r) => r.json());
      const apps = data.apps as AppDoc[];
      const keyword = queryStr.toLowerCase().trim();
      if (!keyword) return [];

      return apps
        .filter((a) => a.status === "published")
        .filter(
          (a) =>
            a.name.toLowerCase().includes(keyword) ||
            a.description.toLowerCase().includes(keyword) ||
            a.searchKeywords?.some((k) => k.toLowerCase().includes(keyword))
        )
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 20);
    },
    { revalidateOnFocus: false }
  );
}
