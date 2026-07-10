"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import Link from "next/link";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Loader2, Plus, X, MessageSquare, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface RequestData {
  userId: string;
  userName: string;
  userPhoto: string | null;
  title: string;
  description: string;
  createdAt: Timestamp | null;
}

export default function RequestsPage() {
  const { user, loading: authLoading } = useAuth();
  const [requests, setRequests] = useState<(RequestData & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "requests"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as RequestData & { id: string }));
      setRequests(list);
      setLoading(false);
    });
    return unsub;
  }, []);

  if (authLoading) return null;

  const myRequest = user ? requests.find((r) => r.userId === user.uid) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!title.trim() || !description.trim()) {
      toast.error("Judul dan deskripsi harus diisi");
      return;
    }

    setSubmitting(true);
    try {
      await setDoc(doc(db, "requests", user.uid), {
        userId: user.uid,
        userName: user.displayName || user.email || "User",
        userPhoto: user.photoURL || null,
        title: title.trim(),
        description: description.trim(),
        createdAt: serverTimestamp(),
      });
      toast.success("Request berhasil ditambahkan!");
      setTitle("");
      setDescription("");
      setShowForm(false);
    } catch {
      toast.error("Gagal menambahkan request");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!user || !myRequest) return;
    try {
      await deleteDoc(doc(db, "requests", user.uid));
      toast.success("Request berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus request");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">Request Aplikasi</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Minta aplikasi yang kamu butuhin, biar developer bikin
          </p>
        </div>
        {user && !myRequest && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 rounded-full bg-store px-5 py-2.5 text-sm font-bold text-white transition hover:bg-store-light active:scale-95 shadow-sm"
          >
            {showForm ? <X className="size-4" /> : <Plus className="size-4" />}
            {showForm ? "Batal" : "Tambah Request"}
          </button>
        )}
      </div>

      {/* Guest message */}
      {!user && (
        <div className="mb-8 rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center dark:border-gray-700 dark:bg-gray-800/30">
          <MessageSquare className="mx-auto mb-4 size-10 text-gray-300 dark:text-gray-600" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <Link href="/login" className="font-semibold text-store hover:underline">Login</Link> atau{" "}
            <Link href="/register" className="font-semibold text-store hover:underline">Daftar</Link> dulu untuk menambahkan request aplikasi
          </p>
        </div>
      )}

      {/* Add Form */}
      {showForm && user && !myRequest && (
        <form onSubmit={handleSubmit} className="mb-8 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">Judul Aplikasi</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Aplikasi Catatan Keuangan"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-store focus:ring-2 focus:ring-store/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">Deskripsi</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Jelaskan fitur yang kamu butuhkan..."
              className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-store focus:ring-2 focus:ring-store/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-store py-2.5 text-sm font-bold text-white transition hover:bg-store-light disabled:opacity-50"
          >
            {submitting && <Loader2 className="size-4 animate-spin" />}
            {submitting ? "Mengirim..." : "Kirim Request"}
          </button>
        </form>
      )}

      {/* My Request Banner */}
      {myRequest && (
        <div className="mb-6 rounded-2xl border border-store/20 bg-store/5 p-4 dark:border-store/10 dark:bg-store/5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-store">Request Kamu</p>
              <h3 className="mt-1 text-sm font-bold text-gray-900 dark:text-gray-100">{myRequest.title}</h3>
              <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{myRequest.description}</p>
            </div>
            <button
              onClick={handleDelete}
              className="shrink-0 rounded-full p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
              title="Hapus request"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* Requests List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-gray-100 p-5 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-3 w-1/4 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
              <div className="mt-3 space-y-2">
                <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 p-10 text-center dark:border-gray-700">
          <MessageSquare className="mx-auto mb-3 size-12 text-gray-200 dark:text-gray-700" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Belum ada request. Jadilah yang pertama!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-start gap-3">
                <div className="relative size-10 shrink-0 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  {req.userPhoto ? (
                    <img src={req.userPhoto} alt="" className="size-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="flex size-full items-center justify-center text-sm font-bold text-gray-500 dark:text-gray-400">
                      {req.userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{req.userName}</span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500">
                      {req.createdAt?.toDate ? new Date(req.createdAt.toDate()).toLocaleDateString("id-ID") : ""}
                    </span>
                  </div>
                  <h3 className="mt-1 text-sm font-bold text-gray-800 dark:text-gray-200">{req.title}</h3>
                  <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">{req.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
