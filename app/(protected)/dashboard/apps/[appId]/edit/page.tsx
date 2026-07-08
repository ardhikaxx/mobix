"use client";

import { useState, use, useEffect } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { useAppById } from "@/lib/hooks/useApps";
import { db } from "@/lib/firebase/client";
import { doc, updateDoc, serverTimestamp, increment } from "firebase/firestore";
import { CATEGORIES } from "@/lib/constants/categories";
import { generateSearchKeywords } from "@/lib/utils/searchKeywords";
import { DetailSkeleton } from "@/components/Skeleton";
import { ErrorState } from "@/components/ErrorState";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const MIN_ANDROID_VERSIONS = [
  "Android 6.0 (API 23)",
  "Android 7.0 (API 24)",
  "Android 8.0 (API 26)",
  "Android 9.0 (API 28)",
  "Android 10 (API 29)",
  "Android 11 (API 30)",
  "Android 12 (API 31)",
  "Android 13 (API 33)",
  "Android 14 (API 34)",
];

function EditContent({ appId }: { appId: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const { data: app, isLoading, error } = useAppById(appId);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "tools",
    version: "1.0.0",
    websiteURL: "",
    githubURL: "",
    tags: "",
    changelog: "",
    minAndroidVersion: "Android 8.0 (API 26)",
  });

  const [newLogo, setNewLogo] = useState<File | null>(null);
  const [newApk, setNewApk] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (app) {
      setForm({
        name: app.name,
        description: app.description,
        category: app.category,
        version: app.version,
        websiteURL: app.websiteURL || "",
        githubURL: app.githubURL || "",
        tags: (app.tags || []).join(", "),
        changelog: app.changelog || "",
        minAndroidVersion: app.minAndroidVersion || "Android 8.0 (API 26)",
      });
    }
  }, [app]);

  if (isLoading) return <DetailSkeleton />;
  if (error || !app) return <ErrorState message={error?.message || "Aplikasi tidak ditemukan"} />;
  if (app.ownerId !== user?.uid) {
    return <ErrorState message="Anda tidak memiliki akses ke aplikasi ini" />;
  }

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name || form.name.length < 3) errs.name = "Minimal 3 karakter";
    if (form.name.length > 60) errs.name = "Maksimal 60 karakter";
    if (!form.description || form.description.length < 20) errs.description = "Minimal 20 karakter";
    if (form.description.length > 5000) errs.description = "Maksimal 5000 karakter";
    if (!/^\d+\.\d+\.\d+$/.test(form.version)) errs.version = "Format harus x.y.z";
    if (newLogo && newLogo.size > 2 * 1024 * 1024) errs.logo = "Logo maksimal 2MB";
    if (newApk && newApk.size > 200 * 1024 * 1024) errs.apk = "APK maksimal 200MB";
    if (newApk && !newApk.name.endsWith(".apk")) errs.apk = "File harus .apk";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !validate()) return;

    setLoading(true);
    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const searchKeywords = generateSearchKeywords(form.name, tags, form.category);

    try {
      const updates: Record<string, unknown> = {
        name: form.name,
        description: form.description,
        category: form.category,
        tags,
        searchKeywords,
        websiteURL: form.websiteURL || null,
        githubURL: form.githubURL || null,
        changelog: form.changelog || "",
        minAndroidVersion: form.minAndroidVersion,
        updatedAt: serverTimestamp(),
      };

      const token = await user.getIdToken();

      if (newLogo) {
        const fd = new FormData();
        fd.append("file", newLogo);
        fd.append("type", "logo");
        fd.append("appId", appId);
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });
        if (!res.ok) throw new Error();
        const { url } = await res.json();
        updates.logoURL = url;
      }

      if (newApk) {
        const versionCode = app.versionCode + 1;
        const fd = new FormData();
        fd.append("file", newApk);
        fd.append("type", "apk");
        fd.append("appId", appId);
        fd.append("versionCode", String(versionCode));
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });
        if (!res.ok) throw new Error();
        const { url } = await res.json();
        updates.apkURL = url;
        updates.apkFileName = newApk.name;
        updates.apkSizeBytes = newApk.size;
        updates.versionCode = versionCode;
        updates.lastVersionUpdateAt = serverTimestamp();
      }

      updates.version = form.version;

      await updateDoc(doc(db, "apps", appId), updates);

      toast.success("Aplikasi berhasil diperbarui!");
      router.push("/dashboard/apps");
    } catch {
      toast.error("Gagal memperbarui aplikasi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Edit Aplikasi</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="rounded-xl border border-gray-100 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Informasi Dasar</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Nama Aplikasi *</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Deskripsi *</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={6}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
              />
              <div className="mt-1 text-right text-xs text-gray-400">{form.description.length}/5000</div>
              {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Kategori *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Versi *</label>
                <input
                  value={form.version}
                  onChange={(e) => setForm({ ...form, version: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
                />
                {errors.version && <p className="mt-1 text-xs text-red-500">{errors.version}</p>}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-gray-100 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">File (kosongkan jika tidak diubah)</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Logo Baru</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewLogo(e.target.files?.[0] || null)}
                className="w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700"
              />
              {errors.logo && <p className="mt-1 text-xs text-red-500">{errors.logo}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">APK Baru</label>
              <input
                type="file"
                accept=".apk"
                onChange={(e) => setNewApk(e.target.files?.[0] || null)}
                className="w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700"
              />
              {errors.apk && <p className="mt-1 text-xs text-red-500">{errors.apk}</p>}
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-gray-100 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Informasi Tambahan</h2>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Website</label>
                <input
                  value={form.websiteURL}
                  onChange={(e) => setForm({ ...form, websiteURL: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">GitHub</label>
                <input
                  value={form.githubURL}
                  onChange={(e) => setForm({ ...form, githubURL: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Min. Android Version</label>
                <select
                  value={form.minAndroidVersion}
                  onChange={(e) => setForm({ ...form, minAndroidVersion: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
                >
                  {MIN_ANDROID_VERSIONS.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Tags</label>
                <input
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Changelog</label>
              <textarea
                value={form.changelog}
                onChange={(e) => setForm({ ...form, changelog: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
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
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
}

export default function EditPage({
  params,
}: {
  params: Promise<{ appId: string }>;
}) {
  const { appId } = use(params);
  return (
    <AuthGuard>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <EditContent appId={appId} />
      </div>
    </AuthGuard>
  );
}
