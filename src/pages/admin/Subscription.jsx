import { motion } from "framer-motion";
import {
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { Check, Star, Users, DollarSign, TrendingUp } from "lucide-react";
import { SectionHeading, Badge } from "../../components/ui/index.jsx";
import { Panel, IconTile, tooltipStyle } from "../../components/dashboard/shared.jsx";
import { pricingPlans } from "../../data/mockData";
import { useLanguage } from "../../hooks/useLanguage";

const planSubscribers = [
  { plan: "Starter", users: 142 },
  { plan: "Pro Learner", users: 86 },
  { plan: "Academy", users: 14 },
];

export default function AdminSubscription() {
  const { t } = useLanguage();
  const mrr = 86 * 19 + 14 * 49;

  return (
    <div className="space-y-7">
      <SectionHeading title={t("pages.admin.subscription.title")} subtitle={t("pages.admin.subscription.subtitle")} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { icon: Users, label: t("pages.admin.subscription.totalSubscribers"), value: "242", accent: "primary" },
          { icon: DollarSign, label: t("pages.admin.subscription.mrr"), value: `$${mrr.toLocaleString()}`, accent: "secondary" },
          { icon: Star, label: t("pages.admin.subscription.proConversions"), value: "35%", accent: "primary" },
          { icon: TrendingUp, label: t("pages.admin.subscription.churnRate"), value: "2.1%", accent: "secondary" },
        ].map((s, i) => (
          <Panel key={s.label} className="!p-4" delay={i * 0.05}>
            <div className="flex items-center gap-3">
              <IconTile icon={s.icon} accent={s.accent} />
              <div><div className="text-xl font-semibold text-white">{s.value}</div><div className="text-xs text-white/40">{s.label}</div></div>
            </div>
          </Panel>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {pricingPlans.map((p, i) => (
          <motion.div key={p.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`relative rounded-2xl p-6 ${p.featured ? "gradient-border bg-primary-500/[0.04]" : "glass"}`}>
            {p.featured && <span className="absolute -top-3 left-1/2 -translate-x-1/2"><Badge color="primary"><Star className="h-3 w-3" /> {t("pages.admin.subscription.mostPopular")}</Badge></span>}
            <h3 className="font-display text-lg font-semibold text-white">{p.name}</h3>
            <p className="text-xs text-white/40">{p.tagline}</p>
            <div className="mt-4 flex items-end gap-1">
              <span className="font-display text-4xl font-bold gradient-text">${p.price}</span>
              <span className="mb-1 text-sm text-white/40">/{p.period}</span>
            </div>
            <div className="mt-5 space-y-2">
              {p.features.map((f) => (
                <div key={f} className="flex items-start gap-2 text-sm text-white/60">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />{f}
                </div>
              ))}
            </div>
            <button className={`mt-6 w-full rounded-xl py-2.5 text-sm font-medium ${
              p.featured ? "btn-primary justify-center" : "btn-ghost justify-center"
            }`}>{t("pages.admin.subscription.editPlan")}</button>
          </motion.div>
        ))}
      </div>

      <Panel title={t("pages.admin.subscription.subsByPlan")} delay={0.2}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={planSubscribers}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="plan" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Bar dataKey="users" fill="#7C3AED" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Panel>
    </div>
  );
}
