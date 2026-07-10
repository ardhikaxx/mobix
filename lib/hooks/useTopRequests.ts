import useSWR from "swr";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export interface RequestItem {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string | null;
  title: string;
  description: string;
  voteCount: number;
}

export function useTopRequests(count = 5) {
  const { data, isLoading } = useSWR(
    `requests:top:${count}`,
    async () => {
      const q = query(
        collection(db, "requests"),
        orderBy("voteCount", "desc"),
        limit(count)
      );
      const snap = await getDocs(q);
      const list: RequestItem[] = [];
      snap.forEach((doc) => {
        const d = doc.data();
        list.push({
          id: doc.id,
          userId: d.userId,
          userName: d.userName,
          userPhoto: d.userPhoto,
          title: d.title,
          description: d.description,
          voteCount: d.voteCount ?? 0,
        });
      });
      return list;
    },
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  );
  return { requests: data ?? [], loading: isLoading };
}
