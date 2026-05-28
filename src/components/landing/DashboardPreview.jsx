import { motion } from "framer-motion";
import { LayoutDashboard, Activity, Trophy, FileCheck2 } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

const TABS = ["student", "teacher", "admin"];

export default function DashboardPreview() {
  const { t } = useLanguage();
  return (
    <section id="dashboard" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm text-white/70">
              <LayoutDashboard className="h-3.5 w-3.5 text-secondary-400" /> {t("preview.badge")}
            </span>
            <h2 className="mt-6 font-display text-4xl md:text-5xl font-semibold tracking-tight text-white text-balance">
              {t("preview.title1")} <span className="gradient-text">{t("preview.title2")}</span>
            </h2>
            <p className="mt-4 text-lg text-white/55">{t("features.subtitle")}</p>

            <div className="mt-8 space-y-4">
              {[
                { icon: FileCheck2, k: "grading" },
                { icon: Activity, k: "analytics" },
                { icon: Trophy, k: "gamified" },
              ].map((item, i) => (
                <motion.div
                  key={item.k}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary-600/20 to-secondary-500/10">
                    <item.icon className="h-5 w-5 text-primary-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white">{t(`preview.items.${item.k}.title`)}</div>
                    <div className="text-sm text-white/50">{t(`preview.items.${item.k}.desc`)}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="gradient-border rounded-3xl p-2 shadow-glow">
              <div className="rounded-2xl bg-bg-soft overflow-hidden">
                {/* tabs */}
                <div className="flex items-center gap-1 border-b border-white/5 p-3">
                  {TABS.map((role, i) => (
                    <span
                      key={role}
                      className={`rounded-lg px-3 py-1.5 text-xs ${i === 0 ? "bg-primary-500/20 text-primary-300" : "text-white/40"}`}
                    >
                      {t(`roles.${role}`)}
                    </span>
                  ))}
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-white">{t("preview.welcome")}</div>
                      <div className="text-[11px] text-white/40">Target band 7.0 · 12 day streak</div>
                    </div>
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-primary-600 to-secondary-500 text-xs font-semibold">AK</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl glass p-4">
                      <div className="text-[10px] text-white/40">{t("preview.latestEssay")}</div>
                      <div className="mt-2 text-3xl font-semibold text-emerald-400">6.5</div>
                      <div className="mt-1 text-[10px] text-white/40">{t("preview.bandScore")}</div>
                    </div>
                    <div className="rounded-xl glass p-4">
                      <div className="text-[10px] text-white/40 mb-2">{t("preview.skills")}</div>
                      <div className="space-y-1.5">
                        {[["Grammar", 78], ["Vocab", 65], ["Coherence", 72]].map(([n, v]) => (
                          <div key={n}>
                            <div className="flex justify-between text-[9px] text-white/40">
                              <span>{n}</span><span>{v}%</span>
                            </div>
                            <div className="mt-0.5 h-1 rounded-full bg-white/10 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${v}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="h-full bg-gradient-to-r from-primary-500 to-secondary-400"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl glass p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] text-white/50">{t("preview.weeklyActivity")}</span>
                      <span className="text-[10px] text-secondary-400">+18%</span>
                    </div>
                    <div className="flex items-end justify-between gap-1.5 h-16">
                      {[30, 55, 40, 70, 50, 85, 60].map((h, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          whileInView={{ height: `${h}%` }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.06, duration: 0.5 }}
                          className="flex-1 rounded-t bg-gradient-to-t from-primary-600/80 to-secondary-400/80"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -inset-4 -z-10 bg-secondary-500/20 blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
