import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  limit,
  orderBy,
  query,
  where,
  startAfter,
  DocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { AppDoc } from "@/types/app";

async function fetchPopularApps(): Promise<AppDoc[]> {
  const q = query(
    collection(db, "apps"),
    where("status", "==", "published"),
    orderBy("downloadCount", "desc"),
    limit(8)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ appId: d.id, ...d.data() } as AppDoc));
}

export function usePopularApps() {
  return useSWR("apps:popular", fetchPopularApps, { revalidateOnFocus: false });
}

async function fetchLatestApps(): Promise<AppDoc[]> {
  const q = query(
    collection(db, "apps"),
    where("status", "==", "published"),
    orderBy("createdAt", "desc"),
    limit(8)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ appId: d.id, ...d.data() } as AppDoc));
}

export function useLatestApps() {
  return useSWR("apps:latest", fetchLatestApps, { revalidateOnFocus: false });
}

export function useAppBySlug(slug: string) {
  return useSWR(
    slug ? `app:${slug}` : null,
    async () => {
      const q = query(collection(db, "apps"), where("slug", "==", slug), limit(1));
      const snap = await getDocs(q);
      if (snap.empty) return null;
      return { appId: snap.docs[0].id, ...snap.docs[0].data() } as AppDoc;
    },
    { revalidateOnFocus: false }
  );
}

export function useAppById(appId: string) {
  return useSWR(
    appId ? `app:id:${appId}` : null,
    async () => {
      const snap = await getDoc(doc(db, "apps", appId));
      if (!snap.exists()) return null;
      return { appId: snap.id, ...snap.data() } as AppDoc;
    },
    { revalidateOnFocus: false }
  );
}

export function useAppsByCategory(categorySlug: string) {
  return useSWR(
    categorySlug ? `apps:category:${categorySlug}` : null,
    async () => {
      const q = query(
        collection(db, "apps"),
        where("status", "==", "published"),
        where("category", "==", categorySlug),
        orderBy("createdAt", "desc"),
        limit(20)
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ appId: d.id, ...d.data() } as AppDoc));
    },
    { revalidateOnFocus: false }
  );
}

export function useMyApps(uid: string | undefined) {
  return useSWR(
    uid ? `myapps:${uid}` : null,
    async () => {
      const q = query(
        collection(db, "apps"),
        where("ownerId", "==", uid),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ appId: d.id, ...d.data() } as AppDoc));
    },
    { revalidateOnFocus: true }
  );
}
