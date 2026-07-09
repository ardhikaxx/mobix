"use client";

import { useThemeStore, type ThemeMode } from "@/store/themeStore";
import { Monitor, Moon, Sun, Check } from "lucide-react";

const options: { mode: ThemeMode; label: string; icon: typeof Monitor }[] = [
  { mode: "system", label: "Sesuai Device", icon: Monitor },
  { mode: "dark", label: "Dark Mode", icon: Moon },
  { mode: "light", label: "Light Mode", icon: Sun },
];

export function SettingsDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { theme, setTheme } = useThemeStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Pengaturan Tampilan</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-400"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-2">
          {options.map(({ mode, label, icon: Icon }) => (
            <button
              key={mode}
              onClick={() => {
                setTheme(mode);
                onClose();
              }}
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
      </div>
    </div>
  );
}
