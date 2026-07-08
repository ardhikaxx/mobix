import useSWR from "swr";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { AppDoc } from "@/types/app";

export function useTopApps() {
  return useSWR(
    "apps:top",
    async () => {
      const q = query(
        collection(db, "apps"),
        where("status", "==", "published"),
        orderBy("downloadCount", "desc"),
        limit(3)
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ appId: d.id, ...d.data() } as AppDoc));
    },
    { revalidateOnFocus: false }
  );
}
