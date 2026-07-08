"use client";

import { useState, useCallback } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { db, storage } from "@/lib/firebase/client";
import { doc, collection, setDoc, updateDoc, increment, serverTimestamp } from "firebase/firestore";
import { ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import type { StorageReference } from "firebase/storage";
import { CATEGORIES } from "@/lib/constants/categories";
import { generateAppSlug } from "@/lib/utils/slug";
import { generateSearchKeywords } from "@/lib/utils/searchKeywords";
import toast from "react-hot-toast";
import {
  Upload,
  ImageIcon,
  Package,
  Loader2,
  X,
} from "lucide-react";

function uploadFile(
  strRef: StorageReference,
  file: File,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(strRef, file);
    task.on("state_changed", null, reject, async () => {
      try {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      } catch (e) {
        reject(e);
      }
    });
  });
}

interface UploadProgress {
  logo: number;
  screenshots: number[];
  apk: number;
}

function UploadContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "tools",
    version: "1.0.0",
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [apkFile, setApkFile] = useState<File | null>(null);
  const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback(() => {
    const errs: Record<string, string> = {};
    if (!form.name || form.name.length < 3) errs.name = "Minimal 3 karakter";
    if (form.name.length > 60) errs.name = "Maksimal 60 karakter";
    if (!form.description || form.description.length < 20) errs.description = "Minimal 20 karakter";
    if (form.description.length > 5000) errs.description = "Maksimal 5000 karakter";
    if (!/^\d+\.\d+\.\d+$/.test(form.version)) errs.version = "Format harus x.y.z";
    if (!logoFile) errs.logo = "Logo wajib diupload";
    if (logoFile && logoFile.size > 2 * 1024 * 1024) errs.logo = "Logo maksimal 2MB";
    if (!apkFile) errs.apk = "File APK wajib diupload";
    if (apkFile && apkFile.size > 200 * 1024 * 1024) errs.apk = "APK maksimal 200MB";
    if (apkFile && !apkFile.name.endsWith(".apk")) errs.apk = "File harus .apk";
    if (screenshotFiles.length > 6) errs.screenshots = "Maksimal 6 screenshot";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [form, logoFile, apkFile, screenshotFiles]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !validate()) return;

    setLoading(true);
    setProgress(0);

    const appId = doc(collection(db, "apps")).id;
    const slug = generateAppSlug(form.name);
    const searchKeywords = generateSearchKeywords(form.name, [], form.category);

    const uploadPaths: string[] = [];

    try {
      let logoURL = "";
      const screenshotURLs: string[] = [];
      let apkURL = "";

      const tasks: Promise<void>[] = [];
      let completed = 0;
      const total = (logoFile ? 1 : 0) + screenshotFiles.length + (apkFile ? 1 : 0);

      const track = <T,>(p: Promise<T>): Promise<T> => {
        return p.then((v) => {
          completed++;
          setProgress(Math.round((completed / total) * 100));
          return v;
        });
      };

      if (logoFile) {
        const logoPath = `users/${user.uid}/logos/${appId}.webp`;
        uploadPaths.push(logoPath);
        const logoRef = storageRef(storage, logoPath);
        tasks.push(
          track(uploadFile(logoRef, logoFile)).then((url) => { logoURL = url; }),
        );
      }

      for (let i = 0; i < screenshotFiles.length; i++) {
        const path = `users/${user.uid}/screenshots/${appId}/${i + 1}.webp`;
        uploadPaths.push(path);
        const ref_ = storageRef(storage, path);
        const idx = i;
        tasks.push(
          track(uploadFile(ref_, screenshotFiles[i])).then((url) => { screenshotURLs[idx] = url; }),
        );
      }

      if (apkFile) {
        const fileName = `1-${apkFile.name.toLowerCase().replace(/\s+/g, "-")}`;
        const apkPath = `users/${user.uid}/apks/${appId}/${fileName}`;
        uploadPaths.push(apkPath);
        const apkRef = storageRef(storage, apkPath);
        tasks.push(
          track(uploadFile(apkRef, apkFile)).then((url) => { apkURL = url; }),
        );
      }

      await Promise.all(tasks);

      await setDoc(doc(db, "apps", appId), {
        appId,
        ownerId: user.uid,
        ownerName: user.displayName || "User",
        ownerPhotoURL: user.photoURL || null,
        name: form.name,
        slug,
        description: form.description,
        category: form.category,
        tags: [],
        searchKeywords,
        logoURL,
        screenshots: screenshotURLs,
        apkURL,
        apkFileName: apkFile?.name || "",
        apkSizeBytes: apkFile?.size || 0,
        version: form.version,
        versionCode: 1,
        minAndroidVersion: "",
        changelog: "",
        websiteURL: null,
        githubURL: null,
        downloadCount: 0,
        viewCount: 0,
        status: "published",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastVersionUpdateAt: serverTimestamp(),
      });

      await updateDoc(doc(db, "users", user.uid), {
        appCount: increment(1),
      });

      toast.success("Aplikasi berhasil diupload!");
      router.push("/dashboard/apps");
    } catch {
      for (const path of uploadPaths) {
        try {
          await deleteObject(storageRef(storage, path));
        } catch {}
      }
      toast.error("Gagal mengupload aplikasi. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Upload Aplikasi Baru</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="rounded-xl border border-gray-100 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Informasi Dasar</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Nama Aplikasi *</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                placeholder="Nama aplikasi"
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Deskripsi *</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={6}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                placeholder="Deskripsikan aplikasi Anda (min 20 karakter)"
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
                    <option key={cat.slug} value={cat.slug}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Versi *</label>
                <input
                  value={form.version}
                  onChange={(e) => setForm({ ...form, version: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
                  placeholder="1.0.0"
                />
                {errors.version && <p className="mt-1 text-xs text-red-500">{errors.version}</p>}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-gray-100 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">File</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Logo *</label>
              <div
                className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 p-6 transition hover:border-blue-400"
                onClick={() => document.getElementById("logo-input")?.click()}
              >
                {logoFile ? (
                  <div className="flex items-center gap-2">
                    <ImageIcon className="size-5 text-blue-600" />
                    <span className="text-sm text-gray-600">{logoFile.name}</span>
                    <button type="button" onClick={(e) => { e.stopPropagation(); setLogoFile(null); }} className="text-red-500">
                      <X className="size-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="mb-2 size-8 text-gray-400" />
                    <p className="text-sm text-gray-500">Klik untuk upload logo (maks 2MB)</p>
                  </>
                )}
                <input
                  id="logo-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                />
              </div>
              {errors.logo && <p className="mt-1 text-xs text-red-500">{errors.logo}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Screenshot (opsional, maks 6)</label>
              <div
                className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 p-6 transition hover:border-blue-400"
                onClick={() => document.getElementById("screenshot-input")?.click()}
              >
                {screenshotFiles.length > 0 ? (
                  <div className="space-y-1">
                    {screenshotFiles.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <ImageIcon className="size-4 text-blue-600" />
                        {f.name}
                        <button type="button" onClick={(e) => { e.stopPropagation(); setScreenshotFiles((prev) => prev.filter((_, j) => j !== i)); }} className="text-red-500">
                          <X className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <Upload className="mb-2 size-8 text-gray-400" />
                    <p className="text-sm text-gray-500">Klik untuk upload screenshot</p>
                  </>
                )}
                <input
                  id="screenshot-input"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => setScreenshotFiles(Array.from(e.target.files || []).slice(0, 6))}
                />
              </div>
              {errors.screenshots && <p className="mt-1 text-xs text-red-500">{errors.screenshots}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">File APK *</label>
              <div
                className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 p-6 transition hover:border-blue-400"
                onClick={() => document.getElementById("apk-input")?.click()}
              >
                {apkFile ? (
                  <div className="flex items-center gap-2">
                    <Package className="size-5 text-blue-600" />
                    <span className="text-sm text-gray-600">{apkFile.name}</span>
                    <button type="button" onClick={(e) => { e.stopPropagation(); setApkFile(null); }} className="text-red-500">
                      <X className="size-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="mb-2 size-8 text-gray-400" />
                    <p className="text-sm text-gray-500">Klik untuk upload APK (maks 200MB)</p>
                  </>
                )}
                <input
                  id="apk-input"
                  type="file"
                  accept=".apk"
                  className="hidden"
                  onChange={(e) => setApkFile(e.target.files?.[0] || null)}
                />
              </div>
              {errors.apk && <p className="mt-1 text-xs text-red-500">{errors.apk}</p>}
            </div>
          </div>
        </section>

        {loading && progress > 0 && progress < 100 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Mengupload file...</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {loading && <Loader2 className="size-4 animate-spin" />}
          {loading ? "Mengupload..." : "Upload Aplikasi"}
        </button>
      </form>
    </div>
  );
}

export default function UploadPage() {
  return (
    <AuthGuard>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <UploadContent />
      </div>
    </AuthGuard>
  );
}
