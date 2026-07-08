import useSWR from "swr";
import { collection, getDocs, limit, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { AppDoc } from "@/types/app";

export function useSearch(queryStr: string) {
  return useSWR(
    queryStr ? `search:${queryStr}` : null,
    async () => {
      const keyword = queryStr.toLowerCase().trim();
      if (!keyword) return [];

      const q = query(
        collection(db, "apps"),
        where("status", "==", "published"),
        where("searchKeywords", "array-contains", keyword),
        orderBy("downloadCount", "desc"),
        limit(20)
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ appId: d.id, ...d.data() } as AppDoc));
    },
    { revalidateOnFocus: false }
  );
}
