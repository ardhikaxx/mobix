"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

const STORAGE_KEY = "mobix_chat_last_seen";

export function useUnreadChat() {
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "chat"), orderBy("createdAt", "desc"), limit(1));
    const unsub = onSnapshot(q, (snap) => {
      if (snap.docs.length === 0) return;
      const lastMsg = snap.docs[0].data();
      const lastSeen = localStorage.getItem(STORAGE_KEY);
      if (!lastSeen) return;
      const msgTime = lastMsg.createdAt?.seconds * 1000 || 0;
      setHasUnread(msgTime > parseInt(lastSeen, 10));
    });
    return unsub;
  }, []);

  return hasUnread;
}

export function markChatSeen() {
  localStorage.setItem(STORAGE_KEY, Date.now().toString());
}
