"use client";

import { useState, useEffect } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import { useAuth } from "@/context/AuthProvider";
import { useUser } from "@/lib/hooks/useUser";
import { db } from "@/lib/firebase/client";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { DetailSkeleton } from "@/components/Skeleton";
import { ErrorState } from "@/components/ErrorState";
import Image from "next/image";
import toast from "react-hot-toast";
import { Loader2, Upload } from "lucide-react";

function ProfileContent() {
  const { user } = useAuth();
  const { data: userDoc, isLoading, error, mutate } = useUser(user?.uid);

  const [form, setForm] = useState({
    displayName: "",
    bio: "",
    website: "",
    githubUsername: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userDoc) {
      setForm({
        displayName: userDoc.displayName || "",
        bio: userDoc.bio || "",
        website: userDoc.website || "",
        githubUsername: userDoc.githubUsername || "",
      });
    }
  }, [userDoc]);

  if (isLoading) return <DetailSkeleton />;
  if (error) return <ErrorState message={error.message} />;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      const token = await user.getIdToken();
      const fd = new FormData();
      fd.append("file", file);
      fd.append("type", "avatar");
      fd.append("appId", "profile");

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      if (!res.ok) throw new Error();
      const { url } = await res.json();
      await updateDoc(doc(db, "users", user.uid), { photoURL: url, updatedAt: serverTimestamp() });
      toast.success("Foto profil diperbarui");
      mutate();
    } catch {
      toast.error("Gagal mengupload foto");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      await updateDoc(doc(db, "users", user.uid), {
        displayName: form.displayName,
        bio: form.bio,
        website: form.website,
        githubUsername: form.githubUsername,
        updatedAt: serverTimestamp(),
      });
      toast.success("Profil diperbarui!");
      mutate();
    } catch {
      toast.error("Gagal memperbarui profil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="rounded-xl border border-gray-100 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Foto Profil</h2>
          <div className="flex items-center gap-4">
            <div className="relative size-20 overflow-hidden rounded-full bg-gray-200">
              {userDoc?.photoURL || user?.photoURL ? (
                <Image
                  src={userDoc?.photoURL || user?.photoURL || ""}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-2xl font-bold text-gray-400">
                  {form.displayName[0]?.toUpperCase() || "U"}
                </div>
              )}
            </div>
            <label className="cursor-pointer rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-200">
              <Upload className="mr-1 inline-block size-4" />
              Upload Foto
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </label>
          </div>
        </section>

        <section className="rounded-xl border border-gray-100 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Informasi Dasar</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Nama Lengkap</label>
              <input
                value={form.displayName}
                onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
              <input
                value={user?.email || ""}
                disabled
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={3}
                maxLength={200}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
                placeholder="Ceritakan tentang diri Anda"
              />
              <div className="mt-1 text-right text-xs text-gray-400">{form.bio.length}/200</div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Website</label>
              <input
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
                placeholder="https://"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">GitHub Username</label>
              <input
                value={form.githubUsername}
                onChange={(e) => setForm({ ...form, githubUsername: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
                placeholder="username"
              />
            </div>
          </div>
        </section>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {loading && <Loader2 className="size-4 animate-spin" />}
          {loading ? "Menyimpan..." : "Simpan Profil"}
        </button>
      </form>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AuthGuard>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <ProfileContent />
      </div>
    </AuthGuard>
  );
}
