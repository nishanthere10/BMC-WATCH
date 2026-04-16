"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import en from "@/i18n/dictionaries/en.json";
import mr from "@/i18n/dictionaries/mr.json";
import hi from "@/i18n/dictionaries/hi.json";

type Locale = "en" | "mr" | "hi";

const dictionaries = {
  en,
  mr,
  hi,
};

interface I18nContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("civic-watch-locale") as Locale;
    if (saved && ["en", "mr", "hi"].includes(saved)) {
      setLocaleState(saved);
    }
    setMounted(true);
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("civic-watch-locale", l);
  };

  const t = (key: string): string => {
    const parts = key.split(".");
    let current: any = dictionaries[locale];
    
    for (const part of parts) {
      if (current[part] === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key; // Fallback to key
      }
      current = current[part];
    }
    
    return current;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      <div suppressHydrationWarning>
        {mounted ? children : <span className="opacity-0">{children}</span>}
      </div>
    </I18nContext.Provider>
  );
}

export function useTranslations() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useTranslations must be used within an I18nProvider");
  }
  return context;
}
