import useSWR from "swr";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { UserDoc } from "@/types/user";

export function useUser(uid: string | undefined) {
  return useSWR(
    uid ? `user:${uid}` : null,
    async () => {
      if (!uid) return null;
      const snap = await getDoc(doc(db, "users", uid));
      if (!snap.exists()) return null;
      return { uid: snap.id, ...snap.data() } as UserDoc;
    },
    { revalidateOnFocus: false }
  );
}
