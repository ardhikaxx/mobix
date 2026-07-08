"use client";

import { Modal } from "./Modal";
import Link from "next/link";

export function AuthDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Login Diperlukan">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Silakan login atau daftar terlebih dahulu untuk mengunduh aplikasi.
        </p>
        <div className="flex flex-col gap-2">
          <Link
            href="/login"
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-lg border border-gray-200 px-4 py-2.5 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Daftar Akun Baru
          </Link>
        </div>
      </div>
    </Modal>
  );
}
