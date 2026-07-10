"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import { useTranslation } from "@/lib/hooks/useTranslation";
import Link from "next/link";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  increment,
  deleteField,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Loader2, Plus, X, MessageSquare, Trash2, ThumbsUp, Pencil } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import toast from "react-hot-toast";

interface RequestData {
  userId: string;
  userName: string;
  userPhoto: string | null;
  title: string;
  description: string;
  createdAt: Timestamp | null;
  editedAt: Timestamp | null;
  voteCount: number;
  voters: Record<string, boolean>;
}

export default function RequestsPage() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useTranslation();
  const [requests, setRequests] = useState<(RequestData & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(false);

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

  const startEdit = () => {
    if (!myRequest) return;
    setTitle(myRequest.title);
    setDescription(myRequest.description);
    setEditing(true);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!title.trim() || !description.trim()) {
      toast.error("Judul dan deskripsi harus diisi");
      return;
    }

    setSubmitting(true);
    try {
      if (editing) {
        await updateDoc(doc(db, "requests", user.uid), {
          title: title.trim(),
          description: description.trim(),
          editedAt: serverTimestamp(),
        });
        toast.success("Request berhasil diedit!");
      } else {
        await setDoc(doc(db, "requests", user.uid), {
          userId: user.uid,
          userName: user.displayName || user.email || "User",
          userPhoto: user.photoURL || null,
          title: title.trim(),
          description: description.trim(),
          createdAt: serverTimestamp(),
          editedAt: null,
          voteCount: 0,
          voters: {},
        });
        toast.success("Request berhasil ditambahkan!");
      }
      setTitle("");
      setDescription("");
      setShowForm(false);
      setEditing(false);
    } catch {
      toast.error(editing ? "Gagal mengedit request" : "Gagal menambahkan request");
    } finally {
      setSubmitting(false);
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditing(false);
    setTitle("");
    setDescription("");
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

  const handleVote = async (req: RequestData & { id: string }) => {
    if (!user) {
      toast.error("Login dulu untuk voting");
      return;
    }
    const ref = doc(db, "requests", req.id);
    const hasVoted = req.voters?.[user.uid];
    try {
      if (hasVoted) {
        await updateDoc(ref, {
          [`voters.${user.uid}`]: deleteField(),
          voteCount: increment(-1),
        });
      } else {
        const newCount = (req.voteCount ?? 0) + 1;
        const milestones = [5, 10, 25, 50, 100];
        const isMilestone = milestones.includes(newCount);

        await updateDoc(ref, {
          [`voters.${user.uid}`]: true,
          voteCount: increment(1),
        });

        if (isMilestone) {
          toast.success(`🎉 Request "${req.title}" mencapai ${newCount} suara!`, { duration: 5000 });
        }
      }
    } catch {
      toast.error("Gagal melakukan voting");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Breadcrumb items={[{ label: t.breadcrumb.home, href: "/" }, { label: t.breadcrumb.requests }]} />
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">Request Aplikasi</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Minta aplikasi yang kamu butuhin, biar developer bikin
          </p>
        </div>
        {user && !myRequest && !editing && (
          <button
            onClick={() => { setShowForm(!showForm); setEditing(false); }}
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

      {/* Add / Edit Form */}
      {showForm && user && (editing || !myRequest) && (
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
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-store py-2.5 text-sm font-bold text-white transition hover:bg-store-light disabled:opacity-50"
            >
              {submitting && <Loader2 className="size-4 animate-spin" />}
              {submitting ? "Menyimpan..." : editing ? "Simpan Perubahan" : "Kirim Request"}
            </button>
            <button
              type="button"
              onClick={cancelForm}
              className="rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {/* My Request Banner */}
      {myRequest && !editing && (
        <div className="mb-6 rounded-2xl border border-store/20 bg-store/5 p-4 dark:border-store/10 dark:bg-store/5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-store">Request Kamu</p>
              <h3 className="mt-1 text-sm font-bold text-gray-900 dark:text-gray-100">{myRequest.title}</h3>
              <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{myRequest.description}</p>
              {myRequest.editedAt && (
                <p className="mt-1 text-[10px] text-gray-400">
                  diedit {myRequest.editedAt.toDate ? new Date(myRequest.editedAt.toDate()).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : ""}
                </p>
              )}
            </div>
            <div className="flex shrink-0 gap-1">
              <button
                onClick={startEdit}
                className="rounded-full p-2 text-gray-400 transition hover:bg-store/10 hover:text-store"
                title="Edit request"
              >
                <Pencil className="size-4" />
              </button>
              <button
                onClick={handleDelete}
                className="rounded-full p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                title="Hapus request"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
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
                  {req.editedAt && (
                    <p className="mt-0.5 text-[10px] text-gray-400">
                      diedit {req.editedAt.toDate ? new Date(req.editedAt.toDate()).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : ""}
                    </p>
                  )}
                  <button
                    onClick={() => handleVote(req)}
                    className={`mt-2 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition active:scale-95 ${
                      user && req.voters?.[user.uid]
                        ? "bg-store/10 text-store"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
                    }`}
                  >
                    <ThumbsUp className="size-3.5" />
                    {req.voteCount ?? 0}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
