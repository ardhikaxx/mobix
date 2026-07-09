"use client";

import { useState } from "react";
import { useThemeStore, type ThemeMode } from "@/store/themeStore";
import { Monitor, Moon, Sun, Check, Bell, Globe, Info, Volume2, Eye } from "lucide-react";

const themeOptions: { mode: ThemeMode; label: string; icon: typeof Monitor }[] = [
  { mode: "system", label: "Sesuai Device", icon: Monitor },
  { mode: "dark", label: "Dark Mode", icon: Moon },
  { mode: "light", label: "Light Mode", icon: Sun },
];

type SettingsTab = "theme" | "notification" | "language" | "about";

export function SettingsDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { theme, setTheme } = useThemeStore();
  const [activeTab, setActiveTab] = useState<SettingsTab>("theme");
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [language, setLanguage] = useState("id");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Pengaturan</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-400"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab("theme")}
            className={`flex-1 border-b-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === "theme"
                ? "border-store text-store dark:text-store"
                : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Moon className="size-4" />
              <span className="hidden sm:inline">Tema</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("notification")}
            className={`flex-1 border-b-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === "notification"
                ? "border-store text-store dark:text-store"
                : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Bell className="size-4" />
              <span className="hidden sm:inline">Notif</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("language")}
            className={`flex-1 border-b-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === "language"
                ? "border-store text-store dark:text-store"
                : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Globe className="size-4" />
              <span className="hidden sm:inline">Bahasa</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`flex-1 border-b-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === "about"
                ? "border-store text-store dark:text-store"
                : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Info className="size-4" />
              <span className="hidden sm:inline">Tentang</span>
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Theme Tab */}
          {activeTab === "theme" && (
            <div className="space-y-2">
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">Pilih tema tampilan aplikasi</p>
              {themeOptions.map(({ mode, label, icon: Icon }) => (
                <button
                  key={mode}
                  onClick={() => setTheme(mode)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    theme === mode
                      ? "bg-store/10 text-store dark:bg-store/20"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon className="size-5 shrink-0" />
                  <span className="flex-1 text-left">{label}</span>
                  {theme === mode && <Check className="size-4 shrink-0" />}
                </button>
              ))}
            </div>
          )}

          {/* Notification Tab */}
          {activeTab === "notification" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Kelola notifikasi aplikasi</p>
              
              <div className="space-y-3">
                <label className="flex items-center gap-3 rounded-lg px-3 py-3 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                    className="size-4 cursor-pointer rounded border-gray-300"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Notifikasi Push</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Terima notifikasi aplikasi</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 rounded-lg px-3 py-3 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <input
                    type="checkbox"
                    checked={soundEnabled}
                    onChange={(e) => setSoundEnabled(e.target.checked)}
                    className="size-4 cursor-pointer rounded border-gray-300"
                    disabled={!notifications}
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Suara Notifikasi</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Mainkan suara saat notifikasi</div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Language Tab */}
          {activeTab === "language" && (
            <div className="space-y-2">
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">Pilih bahasa aplikasi</p>
              {[
                { code: "id", label: "Bahasa Indonesia" },
                { code: "en", label: "English" },
              ].map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => setLanguage(code)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    language === code
                      ? "bg-store/10 text-store dark:bg-store/20"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  }`}
                >
                  <Globe className="size-5 shrink-0" />
                  <span className="flex-1 text-left">{label}</span>
                  {language === code && <Check className="size-4 shrink-0" />}
                </button>
              ))}
            </div>
          )}

          {/* About Tab */}
          {activeTab === "about" && (
            <div className="space-y-4">
              <div className="rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Mobix</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">v1.0.0</p>
              </div>
              
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Platform distribusi aplikasi mobile berbasis komunitas. Upload dan download aplikasi Android buatan komunitas.
              </p>

              <div className="space-y-2 pt-2">
                <a
                  href="#"
                  className="block rounded-lg px-3 py-2 text-sm text-store hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Kebijakan Privasi
                </a>
                <a
                  href="#"
                  className="block rounded-lg px-3 py-2 text-sm text-store hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Syarat & Ketentuan
                </a>
                <a
                  href="#"
                  className="block rounded-lg px-3 py-2 text-sm text-store hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Hubungi Kami
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
