import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, Wand2, CheckCircle2, Zap } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

function FloatingCard({ className, delay, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.6 }}
      className={`absolute glass-strong rounded-2xl p-3.5 shadow-glow ${className}`}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5 + delay, repeat: Infinity, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <section className="relative pt-36 md:pt-44 pb-24 md:pb-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div variants={container} initial="hidden" animate="show" className="mx-auto max-w-4xl text-center">
          <motion.div variants={item} className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm text-white/70">
            <Sparkles className="h-3.5 w-3.5 text-primary-400" />
            {t("hero.badge")}
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-7 font-display text-5xl sm:text-6xl md:text-7xl font-semibold leading-[1.02] tracking-tight text-white text-balance"
          >
            {t("hero.title1")} <br className="hidden sm:block" />
            <span className="gradient-text">{t("hero.title2")}</span>
          </motion.h1>

          <motion.p variants={item} className="mx-auto mt-6 max-w-2xl text-lg text-white/55 text-balance">
            {t("hero.subtitle")}
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <button onClick={() => navigate("/register")} className="btn-primary group">
              {t("hero.startLearning")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button onClick={() => navigate("/register")} className="btn-ghost group">
              <Wand2 className="h-4 w-4 text-primary-400" />
              {t("hero.tryChecker")}
            </button>
          </motion.div>

          <motion.div variants={item} className="mt-8 flex items-center justify-center gap-6 text-xs text-white/40">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> No card required</span>
            <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-primary-400" /> Instant band score</span>
            <span className="hidden sm:flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-secondary-400" /> 12k+ learners</span>
          </motion.div>
        </motion.div>

        {/* Dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 60, rotateX: 8 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ perspective: 1200 }}
          className="relative mx-auto mt-20 max-w-5xl"
        >
          {/* floating accents */}
          <FloatingCard className="hidden lg:block -left-10 top-16 w-44" delay={0.7}>
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-500/20 text-emerald-400 font-bold">7.5</div>
              <div>
                <div className="text-xs font-medium text-white">{t("hero.bandScore")}</div>
                <div className="text-[10px] text-white/40">+1.0 this month</div>
              </div>
            </div>
          </FloatingCard>

          <FloatingCard className="hidden lg:block -right-8 top-32 w-48" delay={1}>
            <div className="text-xs font-medium text-white mb-1.5">{t("hero.grammarFixed")}</div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="line-through text-rose-400/70">depend of</span>
              <ArrowRight className="h-3 w-3 text-white/30" />
              <span className="text-emerald-400">depend on</span>
            </div>
          </FloatingCard>

          <FloatingCard className="hidden lg:block right-10 -bottom-6 w-40" delay={1.2}>
            <div className="text-[10px] text-white/40 mb-1">{t("hero.aiTutor")}</div>
            <div className="text-xs text-white">"Try linking ideas with <span className="text-primary-400">'consequently'</span>…"</div>
          </FloatingCard>

          {/* the mockup frame */}
          <div className="gradient-border rounded-3xl p-2 shadow-glow">
            <div className="rounded-2xl bg-bg-soft overflow-hidden">
              {/* top bar */}
              <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
                <div className="ml-4 flex-1 max-w-xs rounded-lg bg-white/5 px-3 py-1 text-[11px] text-white/40">
                  app.zukko.ai/overview
                </div>
              </div>
              {/* body grid */}
              <div className="grid grid-cols-12 gap-3 p-4">
                {/* sidebar */}
                <div className="col-span-3 hidden sm:flex flex-col gap-2">
                  {["Overview", "AI Checker", "Tests", "Speaking", "Progress"].map((s, i) => (
                    <div key={s} className={`rounded-lg px-3 py-2 text-[11px] ${i === 0 ? "bg-primary-500/20 text-primary-300" : "text-white/40"}`}>
                      {s}
                    </div>
                  ))}
                </div>
                {/* main */}
                <div className="col-span-12 sm:col-span-9 space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { l: "Current Band", v: "6.5", c: "primary" },
                      { l: "Essays", v: "24", c: "secondary" },
                      { l: "Streak", v: "12d", c: "primary" },
                    ].map((k) => (
                      <div key={k.l} className="rounded-xl glass p-3">
                        <div className="text-[10px] text-white/40">{k.l}</div>
                        <div className={`mt-1 text-lg font-semibold ${k.c === "primary" ? "text-primary-400" : "text-secondary-400"}`}>{k.v}</div>
                      </div>
                    ))}
                  </div>
                  {/* fake chart */}
                  <div className="rounded-xl glass p-4">
                    <div className="text-[11px] text-white/50 mb-3">{t("hero.bandProgression")}</div>
                    <div className="flex items-end gap-2 h-24">
                      {[40, 52, 50, 64, 78, 82].map((h, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ delay: 1 + i * 0.1, duration: 0.6 }}
                          className="flex-1 rounded-t-md bg-gradient-to-t from-primary-600 to-secondary-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* glow under mockup */}
          <div className="absolute inset-x-10 -bottom-8 h-24 bg-primary-600/30 blur-3xl -z-10" />
        </motion.div>
      </div>
    </section>
  );
}
