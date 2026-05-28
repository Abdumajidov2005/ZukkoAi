import { motion } from "framer-motion";
import {
  PenLine, SpellCheck, GraduationCap, Mic, TrendingUp, Bot, Sparkles, BookOpen,
} from "lucide-react";
import { useInView } from "../../hooks/useInView";
import { useLanguage } from "../../hooks/useLanguage";

const FEATURES = [
  { icon: PenLine, key: "essayChecker", span: "lg:col-span-2 lg:row-span-2", accent: "primary", big: true },
  { icon: SpellCheck, key: "grammar", accent: "secondary" },
  { icon: GraduationCap, key: "ielts", accent: "primary" },
  { icon: Mic, key: "speaking", accent: "secondary" },
  { icon: TrendingUp, key: "progress", accent: "primary" },
  { icon: Bot, key: "tutor", span: "lg:col-span-2", accent: "secondary", wide: true },
  { icon: BookOpen, key: "vocab", accent: "primary" },
];

const accents = {
  primary: { ring: "from-primary-600/25 to-primary-500/5", icon: "text-primary-400", glow: "group-hover:shadow-glow" },
  secondary: { ring: "from-secondary-500/25 to-secondary-500/5", icon: "text-secondary-400", glow: "group-hover:shadow-glow-cyan" },
};

function FeatureCard({ f, i, t }) {
  const a = accents[f.accent];
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
      className={`group glass rounded-2xl p-6 hover:border-primary-500/40 transition-all duration-300 ${a.glow} ${f.span || ""}`}
    >
      <div className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${a.ring}`}>
        <f.icon className={`h-6 w-6 ${a.icon}`} />
      </div>
      <h3 className={`mt-5 font-display font-semibold text-white ${f.big ? "text-2xl" : "text-lg"}`}>
        {t(`features.items.${f.key}.title`)}
      </h3>
      <p className={`mt-2 text-white/50 ${f.big ? "text-base" : "text-sm"}`}>
        {t(`features.items.${f.key}.desc`)}
      </p>

      {f.big && (
        <div className="mt-6 rounded-xl bg-bg-soft/80 border border-white/5 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40">{t("features.overallBand")}</span>
            <span className="text-2xl font-semibold text-emerald-400">6.5</span>
          </div>
          <div className="mt-3 space-y-2">
            {[["Task", 80], ["Coherence", 72], ["Lexical", 65], ["Grammar", 78]].map(([n, v]) => (
              <div key={n} className="flex items-center gap-3">
                <span className="w-20 text-[11px] text-white/40">{n}</span>
                <div className="h-1.5 flex-1 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${v}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="h-full rounded-full bg-gradient-to-r from-primary-600 to-secondary-400"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function Features() {
  const [ref, inView] = useInView();
  const { t } = useLanguage();
  return (
    <section id="features" ref={ref} className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm text-white/70">
            <Sparkles className="h-3.5 w-3.5 text-primary-400" /> {t("features.badge")}
          </span>
          <h2 className="mt-6 font-display text-4xl md:text-5xl font-semibold tracking-tight text-white text-balance">
            {t("features.title1")} <span className="gradient-text">{t("features.title2")}</span>
          </h2>
          <p className="mt-4 text-lg text-white/55">{t("features.subtitle")}</p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 auto-rows-[minmax(0,auto)]">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.key} f={f} i={i} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
