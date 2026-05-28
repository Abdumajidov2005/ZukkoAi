import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import ru from "./locales/ru.json";
import uz from "./locales/uz.json";

// Read the persisted language from the lang store (falls back to "uz").
function getInitialLang() {
  try {
    const raw = localStorage.getItem("zukko-lang");
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed?.state?.lang || "uz";
    }
  } catch {
    /* ignore */
  }
  return "uz";
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ru: { translation: ru },
    uz: { translation: uz },
  },
  lng: getInitialLang(),
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  returnNull: false,
});

// NOTE: When a backend is connected, translations can be loaded remotely
// instead of bundled. Add `i18next-http-backend` and point it at your API,
// e.g. loadPath: `${import.meta.env.VITE_API_BASE_URL}/i18n/{{lng}}`.

export default i18n;
