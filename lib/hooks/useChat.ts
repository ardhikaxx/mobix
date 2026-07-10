import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  addDoc,
  updateDoc,
  increment,
  deleteField,
  serverTimestamp,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string | null;
  text: string;
  replyTo: {
    id: string;
    userName: string;
    text: string;
  } | null;
  likes: Record<string, boolean>;
  likeCount: number;
  createdAt: { seconds: number } | null;
  deleted?: boolean;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "chat"),
      orderBy("createdAt", "desc"),
      limit(100)
    );
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          userId: data.userId ?? "",
          userName: data.userName ?? "",
          userPhoto: data.userPhoto ?? null,
          text: data.text ?? "",
          replyTo: data.replyTo ?? null,
          likes: data.likes ?? {},
          likeCount: data.likeCount ?? 0,
          createdAt: data.createdAt ?? null,
          deleted: data.deleted ?? false,
        } as ChatMessage;
      });
      setMessages(list);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { messages, loading };
}

export async function sendMessage(
  userId: string,
  userName: string,
  userPhoto: string | null,
  text: string,
  replyTo: ChatMessage["replyTo"] = null
) {
  await addDoc(collection(db, "chat"), {
    userId,
    userName,
    userPhoto,
    text: text.trim(),
    replyTo,
    likes: {},
    likeCount: 0,
    createdAt: serverTimestamp(),
  });
}

export async function toggleLike(messageId: string, userId: string, hasLiked: boolean) {
  const ref = doc(db, "chat", messageId);
  if (hasLiked) {
    await updateDoc(ref, {
      [`likes.${userId}`]: deleteField(),
      likeCount: increment(-1),
    });
  } else {
    await updateDoc(ref, {
      [`likes.${userId}`]: true,
      likeCount: increment(1),
    });
  }
}

export async function deleteMessage(messageId: string) {
  await updateDoc(doc(db, "chat", messageId), {
    text: "[pesan telah dihapus]",
    deleted: true,
  });
}
