"use client";

import { useState } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import { useAuth } from "@/context/AuthProvider";
import { useMyApps } from "@/lib/hooks/useApps";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { GridSkeleton } from "@/components/Skeleton";
import { Modal } from "@/components/Modal";
import Image from "next/image";
import Link from "next/link";
import {
  ExternalLink,
  Pencil,
  Trash2,
  Upload,
} from "lucide-react";
import { doc, deleteDoc, updateDoc, increment, serverTimestamp } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "@/lib/firebase/client";
import toast from "react-hot-toast";
import { formatDate } from "@/lib/utils/slug";

function MyAppsContent() {
  const { user } = useAuth();
  const { data: apps, isLoading, error, mutate } = useMyApps(user?.uid);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (appId: string) => {
    setDeleting(true);
    try {
      const app = apps?.find((a) => a.appId === appId);
      if (!app) return;

      const logoRef = ref(storage, `users/${user!.uid}/logos/${appId}.webp`);
      const apkRef = ref(storage, `users/${user!.uid}/apks/${appId}/${app.apkFileName}`);

      await Promise.allSettled([
        deleteObject(logoRef),
        deleteObject(apkRef),
        ...(app.screenshots || []).map((_, idx) =>
          deleteObject(ref(storage, `users/${user!.uid}/screenshots/${appId}/${idx + 1}.webp`))
        ),
      ]);

      await deleteDoc(doc(db, "apps", appId));
      await updateDoc(doc(db, "users", user!.uid), {
        appCount: increment(-1),
      });

      toast.success("Aplikasi berhasil dihapus");
      mutate();
    } catch {
      toast.error("Gagal menghapus aplikasi");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  if (isLoading) return <GridSkeleton count={4} />;
  if (error) {
    const isPermissionError = error.message?.includes("permission");
    if (isPermissionError) {
      return (
        <EmptyState
          title="Belum ada aplikasi"
          description="Upload aplikasi pertama Anda sekarang!"
          action={
            <Link
              href="/dashboard/upload"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
            >
              <Upload className="size-4" /> Upload Aplikasi
            </Link>
          }
        />
      );
    }
    return <ErrorState message={error.message} />;
  }
  if (!apps || apps.length === 0) {
    return (
      <EmptyState
        title="Belum ada aplikasi"
        description="Upload aplikasi pertama Anda sekarang!"
        action={
          <Link
            href="/dashboard/upload"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
          >
            <Upload className="size-4" /> Upload Aplikasi
          </Link>
        }
      />
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
        <Link
          href="/dashboard/upload"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <Upload className="size-4" /> Upload Baru
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-500">App</th>
              <th className="px-4 py-3 font-medium text-gray-500">Category</th>
              <th className="px-4 py-3 font-medium text-gray-500">Downloads</th>
              <th className="px-4 py-3 font-medium text-gray-500">Version</th>
              <th className="px-4 py-3 font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 font-medium text-gray-500">Updated</th>
              <th className="px-4 py-3 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {apps.map((app) => (
              <tr key={app.appId} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative size-10 shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={app.logoURL}
                        alt={app.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{app.name}</div>
                      <div className="text-xs text-gray-400">{app.description.slice(0, 40)}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{app.category}</td>
                <td className="px-4 py-3 text-gray-600">{app.downloadCount.toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-600">v{app.version}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      app.status === "published"
                        ? "bg-green-100 text-green-700"
                        : app.status === "draft"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-400">
                  {formatDate(app.updatedAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/apps/${app.slug}`}
                      className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                    >
                      <ExternalLink className="size-4" />
                    </Link>
                    <Link
                      href={`/dashboard/apps/${app.appId}/edit`}
                      className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-blue-600"
                    >
                      <Pencil className="size-4" />
                    </Link>
                    <button
                      onClick={() => setDeleteTarget(app.appId)}
                      className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-red-600"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Hapus Aplikasi"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Apakah Anda yakin ingin menghapus aplikasi ini? File di storage juga akan ikut terhapus. Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setDeleteTarget(null)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              onClick={() => deleteTarget && handleDelete(deleteTarget)}
              disabled={deleting}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {deleting ? "Menghapus..." : "Hapus"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function MyAppsPage() {
  return (
    <AuthGuard>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <MyAppsContent />
      </div>
    </AuthGuard>
  );
}
