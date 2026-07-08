import useSWR from "swr";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

interface RatingStats {
  averageRating: number;
  totalReviews: number;
}

const fetcher = async (slug: string): Promise<RatingStats | null> => {
  const snap = await getDoc(doc(db, "reviewsStats", slug));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    averageRating: data.averageRating ?? 0,
    totalReviews: data.totalReviews ?? 0,
  };
};

export function useRealtimeRating(slug: string) {
  const { data, error, isLoading } = useSWR(`reviewsStats:${slug}`, () => fetcher(slug), {
    revalidateOnFocus: false,
    dedupingInterval: 30000,
  });

  return {
    rating: data?.averageRating ?? 0,
    totalReviews: data?.totalReviews ?? 0,
    isLoading,
    error,
  };
}
