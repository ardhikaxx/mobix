"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthProvider";
import { useUIStore } from "@/store/uiStore";
import { SearchBar } from "./SearchBar";
import {
  Menu,
  X,
  LogOut,
  Smartphone,
} from "lucide-react";
import { CATEGORIES } from "@/lib/constants/categories";

export function Navbar() {
  const { user } = useAuth();
  const { isDrawerOpen, toggleDrawer, closeDrawer } = useUIStore();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
          <button
            onClick={toggleDrawer}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
            aria-label="Menu"
          >
            {isDrawerOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>

          <Link href="/" className="flex items-center gap-2 shrink-0" onClick={closeDrawer}>
            <Smartphone className="size-7 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Mobix</span>
          </Link>

          <div className="hidden flex-1 lg:block">
            <SearchBar />
          </div>

          <div className="hidden items-center gap-1 lg:flex">
            {CATEGORIES.slice(0, 4).map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="rounded-lg px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-100"
              >
                {cat.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 rounded-lg p-1.5 transition hover:bg-gray-100"
                  >
                    <div className="relative size-8 overflow-hidden rounded-full bg-gray-200">
                      {user.photoURL ? (
                        <Image
                          src={user.photoURL}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="32px"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center text-sm font-medium text-gray-600">
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
                      <div className="absolute right-0 top-full z-20 mt-2 w-56 rounded-xl border border-gray-100 bg-white py-2 shadow-lg">
                        <div className="border-b border-gray-100 px-4 py-2">
                          <p className="text-sm font-medium text-gray-900">
                            {user.displayName || "User"}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <div className="border-t border-gray-100 pt-1">
                          <button
                            onClick={() => {
                              setProfileOpen(false);
                              import("firebase/auth").then(({ signOut }) =>
                                import("@/lib/firebase/client").then(({ auth }) =>
                                  signOut(auth)
                                )
                              );
                            }}
                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 transition hover:bg-red-50"
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
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {isDrawerOpen && (
        <>
          <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={closeDrawer} />
          <div className="fixed inset-y-0 left-0 z-40 w-72 border-r border-gray-100 bg-white lg:hidden">
            <div className="flex h-16 items-center gap-2 border-b border-gray-100 px-4">
              <Smartphone className="size-7 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Mobix</span>
            </div>
            <div className="px-4 py-4">
              <SearchBar />
            </div>
            <div className="space-y-1 px-2">
              <p className="px-3 py-2 text-xs font-medium uppercase text-gray-400">
                Categories
              </p>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  onClick={closeDrawer}
                  className="block rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
