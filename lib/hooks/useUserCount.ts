"use client";

import { useState, useEffect } from "react";
import { collection, query, getCountFromServer, getDocs, orderBy, limit, where } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

type UserPhoto = {
  uid: string;
  photoURL: string | null;
  displayName: string;
};

export function useUserCount() {
  const [count, setCount] = useState<number | null>(null);
  const [avatars, setAvatars] = useState<UserPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const q = query(collection(db, "users"));
        const [countSnap, docsSnap] = await Promise.all([
          getCountFromServer(q),
          getDocs(query(collection(db, "users"), orderBy("createdAt", "desc"), limit(4))),
        ]);
        setCount(countSnap.data().count);
        const users: UserPhoto[] = [];
        docsSnap.forEach((doc) => {
          const data = doc.data() as UserPhoto;
          const photoURL = data.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.displayName || "User")}&bold=true&background=01875f&color=fff&size=64`;
          users.push({ uid: data.uid, photoURL, displayName: data.displayName });
        });
        setAvatars(users);
      } catch {
        setCount(null);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  return { count, avatars, loading };
}
