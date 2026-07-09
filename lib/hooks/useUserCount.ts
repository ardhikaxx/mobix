"use client";

import { useState, useEffect } from "react";
import { collection, query, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export function useUserCount() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCount() {
      try {
        const q = query(collection(db, "users"));
        const snap = await getCountFromServer(q);
        setCount(snap.data().count);
      } catch {
        setCount(null);
      } finally {
        setLoading(false);
      }
    }
    fetchCount();
  }, []);

  return { count, loading };
}
