import useSWR from "swr";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export function useAllDownloadStats() {
  const { data, isLoading } = useSWR(
    "downloads:all",
    async () => {
      const snap = await getDocs(collection(db, "downloads"));
      const map: Record<string, number> = {};
      snap.forEach((doc) => {
        map[doc.id] = doc.data().count ?? 0;
      });
      return map;
    },
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  );
  return { downloadMap: data ?? {}, loading: isLoading };
}
