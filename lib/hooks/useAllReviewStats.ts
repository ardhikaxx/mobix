import useSWR from "swr";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export interface ReviewStats {
  rating: number;
  totalReviews: number;
}

export function useAllReviewStats(): Record<string, ReviewStats> {
  const { data } = useSWR(
    "reviewsStats:all",
    async () => {
      const snap = await getDocs(collection(db, "reviewsStats"));
      const map: Record<string, ReviewStats> = {};
      snap.forEach((doc) => {
        const d = doc.data();
        map[doc.id] = {
          rating: d.averageRating ?? 0,
          totalReviews: d.totalReviews ?? 0,
        };
      });
      return map;
    },
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  );
  return data ?? {};
}
