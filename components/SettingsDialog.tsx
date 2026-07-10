"use client";

import { useState } from "react";
import Link from "next/link";
import { useThemeStore, type ThemeMode } from "@/store/themeStore";
import { useLanguageStore, type Language } from "@/store/languageStore";
import { Monitor, Moon, Sun, Check, Globe, Info } from "lucide-react";

const WA_LINK = "https://wa.me/6285933648537";

const themeOptions: { mode: ThemeMode; label: string; icon: typeof Monitor }[] = [];

type SettingsTab = "theme" | "language" | "about";

export function SettingsDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { theme, setTheme } = useThemeStore();
  const { language, setLanguage } = useLanguageStore();
  const [activeTab, setActiveTab] = useState<SettingsTab>("theme");

  // Dynamic theme options based on language
  const getThemeOptions = () => [
    { mode: "system" as ThemeMode, label: language === "id" ? "Sesuai Device" : "System Default", icon: Monitor },
    { mode: "dark" as ThemeMode, label: language === "id" ? "Dark Mode" : "Dark Mode", icon: Moon },
    { mode: "light" as ThemeMode, label: language === "id" ? "Light Mode" : "Light Mode", icon: Sun },
  ];

  const languageOptions: { code: Language; label: string }[] = [
    { code: "id", label: "Bahasa Indonesia" },
    { code: "en", label: "English" },
  ];

  if (!isOpen) return null;

  const isIndonesian = language === "id";
  const settingsTitle = isIndonesian ? "Pengaturan" : "Settings";
  const themeTabLabel = isIndonesian ? "Tema" : "Theme";
  const languageTabLabel = isIndonesian ? "Bahasa" : "Language";
  const aboutTabLabel = isIndonesian ? "Tentang" : "About";
  const selectThemeText = isIndonesian ? "Pilih tema tampilan aplikasi" : "Select app theme";
  const selectLanguageText = isIndonesian ? "Pilih bahasa aplikasi" : "Select app language";
  const descriptionText = isIndonesian 
    ? "Platform distribusi aplikasi mobile berbasis komunitas. Upload dan download aplikasi Android buatan komunitas."
    : "Community-based mobile app distribution platform. Upload and download Android apps created by the community.";
  const privacyLabel = isIndonesian ? "Kebijakan Privasi" : "Privacy Policy";
  const termsLabel = isIndonesian ? "Syarat & Ketentuan" : "Terms & Conditions";
  const contactLabel = isIndonesian ? "Hubungi Kami" : "Contact Us";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{settingsTitle}</h2>
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
              <span className="hidden sm:inline">{themeTabLabel}</span>
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
              <span className="hidden sm:inline">{languageTabLabel}</span>
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
              <span className="hidden sm:inline">{aboutTabLabel}</span>
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Theme Tab */}
          {activeTab === "theme" && (
            <div className="space-y-2">
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">{selectThemeText}</p>
              {getThemeOptions().map(({ mode, label, icon: Icon }) => (
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

          {/* Language Tab */}
          {activeTab === "language" && (
            <div className="space-y-2">
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">{selectLanguageText}</p>
              {languageOptions.map(({ code, label }) => (
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
                {descriptionText}
              </p>

              <div className="space-y-2 pt-2">
                <Link
                  href="/privacy"
                  className="block rounded-lg px-3 py-2 text-sm text-store hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {privacyLabel}
                </Link>
                <Link
                  href="/terms"
                  className="block rounded-lg px-3 py-2 text-sm text-store hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {termsLabel}
                </Link>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg px-3 py-2 text-sm text-store hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {contactLabel}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
