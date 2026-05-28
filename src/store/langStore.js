import { create } from "zustand";
import { persist } from "zustand/middleware";

export const LANGUAGES = [
  { code: "uz", label: "O‘zbek", short: "UZ", flag: "🇺🇿" },
  { code: "ru", label: "Русский", short: "RU", flag: "🇷🇺" },
  { code: "en", label: "English", short: "EN", flag: "🇬🇧" },
];

// Language store. The actual i18next instance is changed via the
// useLanguage hook so this store stays framework-agnostic and could
// later be hydrated from a backend user-preference endpoint.
export const useLangStore = create(
  persist(
    (set) => ({
      lang: "uz", // default language
      setLang: (lang) => set({ lang }),
    }),
    { name: "zukko-lang" }
  )
);
