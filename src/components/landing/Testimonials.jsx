import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Star, Check, Sparkles } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { testimonials, pricingPlans } from "../../data/mockData";

export function Testimonials() {
  const { t } = useLanguage();
  // translated text/role come from i18n; name + avatar stay from data
  const items = t("testimonials.items", { returnObjects: true });

  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm text-white/70">
            <Star className="h-3.5 w-3.5 text-amber-400" /> {t("testimonials.badge")}
          </span>
          <h2 className="mt-6 font-display text-4xl md:text-5xl font-semibold tracking-tight text-white">
            {t("testimonials.title1")} <span className="gradient-text">{t("testimonials.title2")}</span>
          </h2>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {testimonials.map((tm, i) => {
            const tr = Array.isArray(items) ? items[i] || {} : {};
            return (
              <motion.figure
                key={tm.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`glass rounded-2xl p-6 ${i === 1 ? "md:-translate-y-4 shadow-glow" : ""}`}
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="text-white/80 leading-relaxed">"{tr.text || tm.text}"</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-primary-600 to-secondary-500 text-sm font-semibold">
                    {tm.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{tm.name}</div>
                    <div className="text-xs text-primary-400">{tr.role || tm.role}</div>
                  </div>
                </figcaption>
              </motion.figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// maps pricing plan index -> i18n key
const PLAN_KEYS = ["starter", "pro", "academy"];

export function Pricing() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <section id="pricing" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm text-white/70">
            <Sparkles className="h-3.5 w-3.5 text-primary-400" /> {t("pricing.badge")}
          </span>
          <h2 className="mt-6 font-display text-4xl md:text-5xl font-semibold tracking-tight text-white">
            {t("pricing.title1")} <span className="gradient-text">{t("pricing.title2")}</span>
          </h2>
          <p className="mt-4 text-white/55">{t("pricing.subtitle")}</p>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-6 items-stretch">
          {pricingPlans.map((p, i) => {
            const k = PLAN_KEYS[i];
            const features = t(`pricing.plans.${k}.features`, { returnObjects: true });
            const period = p.period === "forever" ? t("pricing.perForever") : t("pricing.perMonth");
            return (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative flex flex-col rounded-3xl p-7 ${
                  p.featured ? "gradient-border shadow-glow scale-[1.02]" : "glass"
                }`}
              >
                {p.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary-600 to-secondary-500 px-3 py-1 text-[11px] font-medium text-white shadow-glow">
                    {t("pricing.mostPopular")}
                  </span>
                )}
                <div className="text-sm font-medium text-white/60">{t(`pricing.plans.${k}.name`)}</div>
                <div className="mt-3 flex items-end gap-1">
                  <span className="font-display text-5xl font-semibold text-white">${p.price}</span>
                  <span className="mb-1.5 text-sm text-white/40">/{period}</span>
                </div>
                <p className="mt-2 text-sm text-white/50">{t(`pricing.plans.${k}.tagline`)}</p>

                <ul className="mt-6 space-y-3 flex-1">
                  {(Array.isArray(features) ? features : []).map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-white/70">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-400" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate("/register")}
                  className={`mt-7 w-full rounded-2xl py-3 text-sm font-medium transition-all duration-300 ${
                    p.featured
                      ? "bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-glow hover:-translate-y-0.5"
                      : "glass text-white hover:bg-white/10"
                  }`}
                >
                  {t(`pricing.plans.${k}.cta`)}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
