import { motion } from "framer-motion";
import { Database, HardDrive, RefreshCw, Download, Table2, Activity } from "lucide-react";
import { SectionHeading, Badge, ProgressBar } from "../../components/ui/index.jsx";
import { Panel, IconTile } from "../../components/dashboard/shared.jsx";
import { useLanguage } from "../../hooks/useLanguage";

const tables = [
  { name: "users", rows: 242, size: "1.8 MB", growth: "+12" },
  { name: "essays", rows: 4821, size: "34.2 MB", growth: "+186" },
  { name: "tests", rows: 1204, size: "8.6 MB", growth: "+42" },
  { name: "submissions", rows: 9640, size: "61.4 MB", growth: "+312" },
  { name: "payments", rows: 880, size: "2.1 MB", growth: "+24" },
  { name: "ai_logs", rows: 25600, size: "112 MB", growth: "+1.2K" },
];

export default function AdminDatabase() {
  const { t } = useLanguage();
  const totalRows = tables.reduce((a, t) => a + t.rows, 0);

  return (
    <div className="space-y-7">
      <SectionHeading title={t("pages.admin.database.title")} subtitle={t("pages.admin.database.subtitle")}
        action={
          <div className="flex gap-2">
            <button className="btn-ghost text-sm"><RefreshCw className="h-4 w-4" /> {t("pages.admin.database.sync")}</button>
            <button className="btn-primary text-sm"><Download className="h-4 w-4" /> {t("pages.admin.database.backup")}</button>
          </div>
        } />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { icon: Table2, label: t("pages.admin.database.tables"), value: tables.length, accent: "primary" },
          { icon: Database, label: t("pages.admin.database.totalRows"), value: `${(totalRows / 1000).toFixed(1)}K`, accent: "secondary" },
          { icon: HardDrive, label: t("pages.admin.database.storageUsed"), value: "220 MB", accent: "primary" },
          { icon: Activity, label: t("pages.admin.database.queriesSec"), value: "1.4K", accent: "secondary" },
        ].map((s, i) => (
          <Panel key={s.label} className="!p-4" delay={i * 0.05}>
            <div className="flex items-center gap-3">
              <IconTile icon={s.icon} accent={s.accent} />
              <div><div className="text-xl font-semibold text-white">{s.value}</div><div className="text-xs text-white/40">{s.label}</div></div>
            </div>
          </Panel>
        ))}
      </div>

      <Panel title={t("pages.admin.database.storage")} subtitle={t("pages.admin.database.storageOf")} delay={0.1}>
        <ProgressBar value={220} max={1024} color="primary" showLabel />
      </Panel>

      <Panel title={t("pages.admin.database.tables")} delay={0.15}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-xs uppercase tracking-wide text-white/40">
                <th className="px-3 py-3 text-left font-medium">{t("pages.admin.database.table")}</th>
                <th className="px-3 py-3 text-right font-medium">{t("pages.admin.database.rows")}</th>
                <th className="px-3 py-3 text-right font-medium">{t("pages.admin.database.size")}</th>
                <th className="px-3 py-3 text-right font-medium">{t("pages.admin.database.growth")}</th>
              </tr>
            </thead>
            <tbody>
              {tables.map((tbl, i) => (
                <motion.tr key={tbl.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="border-b border-white/[0.04] hover:bg-white/[0.03]">
                  <td className="px-3 py-3.5">
                    <span className="inline-flex items-center gap-2 font-mono text-white/80">
                      <Table2 className="h-4 w-4 text-primary-400" />{tbl.name}
                    </span>
                  </td>
                  <td className="px-3 py-3.5 text-right text-white/70">{tbl.rows.toLocaleString()}</td>
                  <td className="px-3 py-3.5 text-right text-white/50">{tbl.size}</td>
                  <td className="px-3 py-3.5 text-right"><Badge color="green">{tbl.growth}</Badge></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
