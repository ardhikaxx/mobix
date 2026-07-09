"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, increment, updateDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export function useDownloadCount(slug: string) {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getDoc(doc(db, "downloads", slug))
      .then((snap) => setCount(snap.exists() ? snap.data().count : 0))
      .catch(() => setCount(0))
      .finally(() => setLoading(false));
  }, [slug]);

  return { count, loading };
}

export async function incrementDownload(slug: string) {
  try {
    const ref = doc(db, "downloads", slug);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await updateDoc(ref, { count: increment(1) });
    } else {
      await setDoc(ref, { count: 1 });
    }
  } catch {
    // silently fail
  }
}
