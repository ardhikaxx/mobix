import useSWR from "swr";
import type { AppDoc } from "@/types/app";

const BASE_KEY = "/data/apps.json";
const fetcher = (url: string) => fetch(url).then((r) => r.json());

function parseApps(data: { apps: AppDoc[] }): AppDoc[] {
  return data.apps.map((app) => ({ ...app }));
}

async function fetchAllApps(): Promise<AppDoc[]> {
  const data = await fetcher(BASE_KEY);
  return parseApps(data);
}

export function usePopularApps() {
  return useSWR("apps:popular", async () => {
    const apps = await fetchAllApps();
    return apps
      .filter((a) => a.status === "published")
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8);
  }, { revalidateOnFocus: false });
}

export function usePublishedApps() {
  return useSWR("apps:published", async () => {
    const apps = await fetchAllApps();
    return apps
      .filter((a) => a.status === "published")
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, { revalidateOnFocus: false });
}

export function useLatestApps() {
  return useSWR("apps:latest", async () => {
    const apps = await fetchAllApps();
    return apps
      .filter((a) => a.status === "published")
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8);
  }, { revalidateOnFocus: false });
}

export function useAppBySlug(slug: string) {
  return useSWR(
    slug ? `app:slug:${slug}` : null,
    async () => {
      const apps = await fetchAllApps();
      return apps.find((a) => a.slug === slug && a.status === "published") ?? null;
    },
    { revalidateOnFocus: false }
  );
}

export function useAppById(appId: string) {
  return useSWR(
    appId ? `app:id:${appId}` : null,
    async () => {
      const apps = await fetchAllApps();
      return apps.find((a) => a.appId === appId) ?? null;
    },
    { revalidateOnFocus: false }
  );
}

export function useAppsByCategory(categorySlug: string) {
  return useSWR(
    categorySlug ? `apps:cat:${categorySlug}` : null,
    async () => {
      const apps = await fetchAllApps();
      return apps
        .filter((a) => a.status === "published" && a.category === categorySlug)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 20);
    },
    { revalidateOnFocus: false }
  );
}

export function useMyApps(uid: string | undefined) {
  return useSWR(
    uid ? `apps:my:${uid}` : null,
    async () => {
      const apps = await fetchAllApps();
      return apps
        .filter((a) => a.ownerId === uid)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    { revalidateOnFocus: false }
  );
}

export function useAppsByDeveloper(ownerName: string) {
  return useSWR(
    ownerName ? `apps:dev:${ownerName}` : null,
    async () => {
      const apps = await fetchAllApps();
      return apps
        .filter((a) => a.status === "published" && a.ownerName.toLowerCase().includes(ownerName.toLowerCase()))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    { revalidateOnFocus: false }
  );
}

export function useRelatedApps(slug: string, category: string) {
  return useSWR(
    slug && category ? `apps:related:${category}:${slug}` : null,
    async () => {
      const apps = await fetchAllApps();
      return apps
        .filter((a) => a.status === "published" && a.category === category && a.slug !== slug)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 6);
    },
    { revalidateOnFocus: false }
  );
}
