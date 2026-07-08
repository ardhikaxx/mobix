"use client";

import { useState } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import { useAuth } from "@/context/AuthProvider";
import { auth } from "@/lib/firebase/client";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
} from "firebase/auth";
import { db } from "@/lib/firebase/client";
import { doc, deleteDoc } from "firebase/firestore";
import { Modal } from "@/components/Modal";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2, AlertTriangle } from "lucide-react";

function SettingsContent() {
  const { user } = useAuth();
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.email) return;

    if (newPassword.length < 8) {
      toast.error("Password baru minimal 8 karakter");
      return;
    }

    setPasswordLoading(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      toast.success("Password berhasil diubah!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: unknown) {
      const firebaseErr = err as { code?: string };
      if (firebaseErr.code === "auth/wrong-password") {
        toast.error("Password saat ini salah");
      } else {
        toast.error("Gagal mengubah password");
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user || !user.email) return;

    setDeleteLoading(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, deletePassword);
      await reauthenticateWithCredential(user, credential);

      await deleteDoc(doc(db, "users", user.uid));
      await deleteUser(user);

      toast.success("Akun berhasil dihapus");
      router.push("/");
    } catch {
      toast.error("Gagal menghapus akun. Periksa password Anda.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const isGoogleUser = user?.providerData?.some((p) => p?.providerId === "google.com");

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Settings</h1>

      {!isGoogleUser && (
        <section className="mb-8 rounded-xl border border-gray-100 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Ubah Password</h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Password Saat Ini</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Password Baru</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
                placeholder="Minimal 8 karakter"
                required
              />
            </div>
            <button
              type="submit"
              disabled={passwordLoading}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {passwordLoading && <Loader2 className="size-4 animate-spin" />}
              {passwordLoading ? "Menyimpan..." : "Ubah Password"}
            </button>
          </form>
        </section>
      )}

      {isGoogleUser && (
        <section className="mb-8 rounded-xl border border-blue-100 bg-blue-50 p-6">
          <p className="text-sm text-blue-700">
            Akun Google tidak dapat mengubah password. Kelola keamanan akun melalui pengaturan Google Anda.
          </p>
        </section>
      )}

      <section className="rounded-xl border border-red-100 bg-white p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-red-600">
          <AlertTriangle className="size-5" /> Zona Berbahaya
        </h2>
        <p className="mb-4 text-sm text-gray-600">
          Menghapus akun akan menghilangkan semua data Anda, termasuk aplikasi yang telah diupload. Tindakan ini tidak dapat dibatalkan.
        </p>
        <button
          onClick={() => setDeleteConfirm(true)}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
        >
          Hapus Akun
        </button>
      </section>

      <Modal
        isOpen={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}
        title="Konfirmasi Hapus Akun"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Masukkan password Anda untuk mengonfirmasi penghapusan akun. Semua data akan dihapus secara permanen.
          </p>
          <input
            type="password"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-red-400"
            placeholder="Password"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setDeleteConfirm(false)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={deleteLoading || !deletePassword}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {deleteLoading ? "Menghapus..." : "Hapus Akun"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <AuthGuard>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <SettingsContent />
      </div>
    </AuthGuard>
  );
}
