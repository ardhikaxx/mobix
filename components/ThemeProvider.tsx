"use client";

import { useEffect, useState } from "react";
import { useThemeStore } from "@/store/themeStore";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("mobix-theme") as "system" | "dark" | "light" | null;
    if (saved) {
      setTheme(saved);
    }
  }, [setTheme]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("mobix-theme", theme);

    const apply = (isDark: boolean) => {
      document.documentElement.classList.toggle("dark", isDark);
    };

    if (theme === "dark") {
      apply(true);
    } else if (theme === "light") {
      apply(false);
    } else {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      apply(mq.matches);
      const handler = (e: MediaQueryListEvent) => apply(e.matches);
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, [theme, mounted]);

  return <>{children}</>;
}
