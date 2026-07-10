"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";

const FIVE_MIN = 5 * 60 * 1000;

export function usePresence(user: { uid: string; displayName: string | null; email: string | null; photoURL: string | null } | null) {
  useEffect(() => {
    if (!user) return;

    const ref = doc(db, "presence", user.uid);

    const setOnline = () => {
      setDoc(ref, {
        userId: user.uid,
        userName: user.displayName || user.email || "User",
        userPhoto: user.photoURL,
        lastActive: serverTimestamp(),
      });
    };

    setOnline();
    const interval = setInterval(setOnline, 60000);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        setOnline();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
      deleteDoc(ref).catch(() => {});
    };
  }, [user]);
}

interface OnlineUser {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string | null;
  lastActive: Timestamp | null;
}

export function useOnlineUsers() {
  const [users, setUsers] = useState<OnlineUser[]>([]);

  useEffect(() => {
    const cutoff = new Date(Date.now() - FIVE_MIN);
    const q = query(
      collection(db, "presence"),
      where("lastActive", ">", cutoff),
      orderBy("lastActive", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          userId: data.userId ?? "",
          userName: data.userName ?? "",
          userPhoto: data.userPhoto ?? null,
          lastActive: data.lastActive ?? null,
        } as OnlineUser;
      });
      setUsers(list);
    });

    return unsub;
  }, []);

  return users;
}
