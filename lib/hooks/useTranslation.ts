"use client";

import { useLanguageStore } from "@/store/languageStore";
import { translations } from "@/lib/translations";

export function useTranslation() {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language];
  
  return { t, language };
}
