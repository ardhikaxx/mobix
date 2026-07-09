import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = "id" | "en";

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "id",
      setLanguage: (language) => set({ language }),
    }),
    {
      name: "mobix-language",
      storage: typeof window !== "undefined" ? {
        getItem: (name) => {
          const item = localStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      } : undefined,
    }
  )
);
