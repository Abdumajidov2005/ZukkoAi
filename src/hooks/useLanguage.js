import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLangStore } from "../store/langStore";

// Keeps i18next in sync with the persisted language store and exposes
// a simple { lang, setLang, t } API for components.
export function useLanguage() {
  const { t, i18n } = useTranslation();
  const lang = useLangStore((s) => s.lang);
  const setLangStore = useLangStore((s) => s.setLang);

  useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
    document.documentElement.lang = lang;
  }, [lang, i18n]);

  function setLang(next) {
    setLangStore(next);
    i18n.changeLanguage(next);
  }

  return { lang, setLang, t };
}
