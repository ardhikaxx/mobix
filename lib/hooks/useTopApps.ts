import useSWR from "swr";
import type { AppDoc } from "@/types/app";

export function useTopApps() {
  return useSWR(
    "apps:top",
    async () => {
      const data = await fetch("/data/apps.json").then((r) => r.json());
      const apps = data.apps as AppDoc[];
      return apps
        .filter((a) => a.status === "published")
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3);
    },
    { revalidateOnFocus: false }
  );
}
