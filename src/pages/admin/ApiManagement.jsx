import { useState } from "react";
import { motion } from "framer-motion";
import { Cable, Plus, Copy, Eye, EyeOff, RefreshCw, Activity } from "lucide-react";
import { SectionHeading, Badge, ProgressBar } from "../../components/ui/index.jsx";
import { Panel, IconTile } from "../../components/dashboard/shared.jsx";
import { apiKeys } from "../../data/mockData";
import { useLanguage } from "../../hooks/useLanguage";

export default function AdminApiManagement() {
  const { t } = useLanguage();
  const [revealed, setRevealed] = useState({});

  const totalUsage = apiKeys.reduce((a, k) => a + k.usage, 0);
  const totalLimit = apiKeys.reduce((a, k) => a + k.limit, 0);

  function toggle(id) { setRevealed((r) => ({ ...r, [id]: !r[id] })); }

  return (
    <div className="space-y-7">
      <SectionHeading title={t("pages.admin.api.title")} subtitle={t("pages.admin.api.subtitle")}
        action={<button className="btn-primary text-sm"><Plus className="h-4 w-4" /> {t("pages.admin.api.newKey")}</button>} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Panel className="!p-4" delay={0}>
          <div className="flex items-center gap-3">
            <IconTile icon={Cable} accent="primary" />
            <div><div className="text-xl font-semibold text-white">{apiKeys.length}</div><div className="text-xs text-white/40">{t("pages.admin.api.activeKeys")}</div></div>
          </div>
        </Panel>
        <Panel className="!p-4" delay={0.05}>
          <div className="flex items-center gap-3">
            <IconTile icon={Activity} accent="secondary" />
            <div><div className="text-xl font-semibold text-white">{(totalUsage / 1000).toFixed(1)}K</div><div className="text-xs text-white/40">{t("pages.admin.api.totalRequests")}</div></div>
          </div>
        </Panel>
        <Panel className="!p-4" delay={0.1}>
          <div className="flex items-center gap-3">
            <IconTile icon={RefreshCw} accent="primary" />
            <div><div className="text-xl font-semibold text-white">{Math.round((totalUsage / totalLimit) * 100)}%</div><div className="text-xs text-white/40">{t("pages.admin.api.quotaUsed")}</div></div>
          </div>
        </Panel>
      </div>

      <div className="space-y-4">
        {apiKeys.map((k, i) => {
          const pct = Math.round((k.usage / k.limit) * 100);
          return (
            <motion.div key={k.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }} className="glass rounded-2xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <IconTile icon={Cable} accent="primary" size="lg" />
                  <div>
                    <h3 className="font-medium text-white">{k.name}</h3>
                    <Badge color="green">{k.status}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <code className="rounded-lg bg-white/[0.04] px-3 py-1.5 font-mono text-xs text-white/60">
                    {revealed[k.id] ? k.key.replace(/•+/, "x7Kp9Lm2Qr4Vn8") : k.key}
                  </code>
                  <button onClick={() => toggle(k.id)} className="rounded-lg p-2 text-white/40 hover:bg-white/[0.05] hover:text-white/70">
                    {revealed[k.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button className="rounded-lg p-2 text-white/40 hover:bg-white/[0.05] hover:text-white/70"><Copy className="h-4 w-4" /></button>
                </div>
              </div>

              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="text-white/50">{t("pages.admin.api.usageMonth")}</span>
                  <span className="text-white/70">{k.usage.toLocaleString()} / {k.limit.toLocaleString()}</span>
                </div>
                <ProgressBar value={k.usage} max={k.limit} color={pct >= 80 ? "red" : pct >= 60 ? "amber" : "secondary"} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
