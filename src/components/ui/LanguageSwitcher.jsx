import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { LANGUAGES } from "../../store/langStore";

// Reusable language switcher. variant="compact" shows just the short code
// (good for the topbar); variant="full" shows the flag + label.
export default function LanguageSwitcher({ variant = "compact", align = "right" }) {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-2.5 py-2 text-sm text-white/70 transition-colors hover:border-white/20 hover:text-white"
      >
        {variant === "full" ? (
          <>
            <span className="text-base leading-none">{current.flag}</span>
            <span className="hidden sm:inline">{current.label}</span>
          </>
        ) : (
          <>
            <Globe className="h-4 w-4" />
            <span className="font-medium">{current.short}</span>
          </>
        )}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className={`glass-strong absolute z-50 mt-2 w-44 overflow-hidden rounded-xl p-1 ${
              align === "right" ? "right-0" : "left-0"
            }`}
          >
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setLang(l.code);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  l.code === lang ? "bg-primary-500/15 text-primary-300" : "text-white/70 hover:bg-white/[0.05]"
                }`}
              >
                <span className="text-base leading-none">{l.flag}</span>
                <span className="flex-1 text-left">{l.label}</span>
                {l.code === lang && <Check className="h-4 w-4" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
