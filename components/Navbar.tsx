"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthProvider";
import { useUIStore } from "@/store/uiStore";
import { ConfirmDialog } from "./ConfirmDialog";
import { SettingsDialog } from "./SettingsDialog";
import {
  Menu,
  X,
  LogOut,
  ChevronDown,
  Settings,
} from "lucide-react";
import { CATEGORIES } from "@/lib/constants/categories";

export function Navbar() {
  const { user } = useAuth();
  const { isDrawerOpen, toggleDrawer, closeDrawer } = useUIStore();
  const [profileOpen, setProfileOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur-lg dark:border-gray-800 dark:bg-gray-900/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0" onClick={closeDrawer}>
            <div className="relative size-8 shrink-0 overflow-hidden rounded-lg shadow-sm">
              <Image src="/images/logo_mobix.png" alt="Mobix Logo" fill sizes="32px" className="object-cover" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">Mobix</span>
          </Link>

          {/* Center/Right: Menu (Desktop) */}
          <div className="hidden items-center gap-1 lg:flex">
            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCategoryOpen(!categoryOpen)}
                onMouseEnter={() => setCategoryOpen(true)}
                onMouseLeave={() => setCategoryOpen(false)}
                className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                Categories
                <ChevronDown className={`size-4 transition ${categoryOpen ? "rotate-180" : ""}`} />
              </button>
              {categoryOpen && (
                <div
                  onMouseEnter={() => setCategoryOpen(true)}
                  onMouseLeave={() => setCategoryOpen(false)}
                  className="absolute left-0 top-full z-20 mt-1 w-48 rounded-xl border border-gray-100 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
                >
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      onClick={() => setCategoryOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/about"
              className="rounded-lg px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              Tentang
            </Link>
          </div>

          {/* Right: User/Auth + Mobile Menu */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDrawer}
              className="flex items-center justify-center min-h-[44px] min-w-[44px] rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden dark:text-gray-400 dark:hover:bg-gray-800"
              aria-label="Menu"
            >
              {isDrawerOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>

            <button
              onClick={() => setSettingsOpen(true)}
              className="flex items-center justify-center min-h-[44px] min-w-[44px] rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              aria-label="Settings"
            >
              <Settings className="size-5" />
            </button>
            {user ? (
              <>
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 rounded-lg p-1.5 transition hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <div className="relative size-8 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      {user.photoURL ? (
                        <Image
                          src={user.photoURL}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="32px"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-400">
                          {user.displayName?.[0]?.toUpperCase() || "U"}
                        </div>
                      )}
                    </div>
                  </button>
                  {profileOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setProfileOpen(false)}
                      />
                      <div className="absolute right-0 top-full z-20 mt-2 w-56 min-w-[180px] max-w-[calc(100vw-2rem)] rounded-xl border border-gray-100 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-900">
                        <div className="border-b border-gray-100 px-4 py-2 dark:border-gray-700">
                          <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                            {user.displayName || "User"}
                          </p>
                          <p className="truncate text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>
                        <div className="border-t border-gray-100 pt-1 dark:border-gray-700">
                          <button
                            onClick={() => {
                              setProfileOpen(false);
                              setConfirmLogout(true);
                            }}
                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                          >
                            <LogOut className="size-4" />
                            Logout
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-store px-4 py-2 text-sm font-medium text-white transition hover:bg-store-light"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <ConfirmDialog
        isOpen={confirmLogout}
        onClose={() => setConfirmLogout(false)}
        onConfirm={() => {
          import("firebase/auth").then(({ signOut }) =>
            import("@/lib/firebase/client").then(({ auth }) =>
              signOut(auth)
            )
          );
        }}
        title="Konfirmasi Logout"
        message="Apakah Anda yakin ingin logout?"
        confirmLabel="Logout"
        cancelLabel="Batal"
        variant="danger"
      />

      <SettingsDialog
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      {isDrawerOpen && (
        <>
          <div className="fixed inset-0 z-30 bg-black/30 lg:hidden dark:bg-black/50" onClick={closeDrawer} />
          <div className="fixed inset-y-0 left-0 z-40 w-72 max-w-[calc(100vw-3rem)] border-r border-gray-100 bg-white lg:hidden dark:border-gray-800 dark:bg-gray-900">
            <div className="flex h-16 items-center gap-2 border-b border-gray-100 px-4 dark:border-gray-800">
              <div className="relative size-8 shrink-0 overflow-hidden rounded-lg shadow-sm">
                <Image src="/images/logo_mobix.png" alt="Mobix Logo" fill sizes="32px" className="object-cover" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">Mobix</span>
            </div>
            <div className="space-y-1 overflow-y-auto px-2 pb-4">
              <p className="px-3 py-2 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                Menu
              </p>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  onClick={closeDrawer}
                  className="block truncate rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  {cat.label}
                </Link>
              ))}
              <Link
                href="/about"
                onClick={closeDrawer}
                className="block truncate rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Tentang
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
