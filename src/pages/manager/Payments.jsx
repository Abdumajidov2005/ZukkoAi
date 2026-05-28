import { useState } from "react";
import { CheckCircle2, Clock, AlertCircle, Download, Search } from "lucide-react";
import { SectionHeading, Badge, Avatar } from "../../components/ui/index.jsx";
import { Panel, DataTable, IconTile } from "../../components/dashboard/shared.jsx";
import { payments } from "../../data/mockData";
import { useLanguage } from "../../hooks/useLanguage";

const statusMeta = {
  paid: { color: "green", tKey: "pages.manager.payments.paid", icon: CheckCircle2 },
  pending: { color: "amber", tKey: "pages.manager.payments.pending", icon: Clock },
  overdue: { color: "red", tKey: "pages.manager.payments.overdue", icon: AlertCircle },
};

export default function ManagerPayments() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const rows = payments.filter((p) =>
    (filter === "all" || p.status === filter) &&
    p.student.toLowerCase().includes(query.toLowerCase())
  );

  const total = payments.filter((p) => p.status === "paid").reduce((a, p) => a + p.amount, 0);
  const pending = payments.filter((p) => p.status === "pending").reduce((a, p) => a + p.amount, 0);
  const overdue = payments.filter((p) => p.status === "overdue").reduce((a, p) => a + p.amount, 0);

  const columns = [
    { key: "student", label: t("pages.manager.payments.student"), render: (r) => (
      <div className="flex items-center gap-3">
        <Avatar initials={r.student.split(" ").map((n) => n[0]).join("")} size="sm" />
        <span className="font-medium text-white">{r.student}</span>
      </div>
    )},
    { key: "course", label: t("pages.manager.payments.course"), render: (r) => <Badge color="secondary">{r.course}</Badge> },
    { key: "amount", label: t("pages.manager.payments.amount"), align: "center", render: (r) => <span className="font-semibold text-white">${r.amount}</span> },
    { key: "date", label: t("pages.manager.payments.date"), render: (r) => <span className="text-white/50">{r.date}</span> },
    { key: "status", label: t("pages.manager.payments.status"), align: "right", render: (r) => {
      const m = statusMeta[r.status];
      return <Badge color={m.color}><m.icon className="h-3 w-3" /> {t(m.tKey)}</Badge>;
    }},
  ];

  return (
    <div className="space-y-7">
      <SectionHeading title={t("pages.manager.payments.title")} subtitle={t("pages.manager.payments.subtitle")}
        action={<button className="btn-ghost text-sm"><Download className="h-4 w-4" /> {t("pages.manager.payments.export")}</button>} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Panel className="!p-5" delay={0}>
          <div className="flex items-center justify-between">
            <div><div className="text-2xl font-semibold text-emerald-400">${total}</div><div className="text-xs text-white/40">{t("pages.manager.payments.collected")}</div></div>
            <IconTile icon={CheckCircle2} accent="green" size="lg" />
          </div>
        </Panel>
        <Panel className="!p-5" delay={0.05}>
          <div className="flex items-center justify-between">
            <div><div className="text-2xl font-semibold text-amber-400">${pending}</div><div className="text-xs text-white/40">{t("pages.manager.payments.pending")}</div></div>
            <IconTile icon={Clock} accent="amber" size="lg" />
          </div>
        </Panel>
        <Panel className="!p-5" delay={0.1}>
          <div className="flex items-center justify-between">
            <div><div className="text-2xl font-semibold text-rose-400">${overdue}</div><div className="text-xs text-white/40">{t("pages.manager.payments.overdue")}</div></div>
            <IconTile icon={AlertCircle} accent="red" size="lg" />
          </div>
        </Panel>
      </div>

      <Panel delay={0.15}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="relative min-w-48 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("pages.manager.payments.student")+"…"}
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-white/30 focus:border-primary-500/50 focus:outline-none" />
          </div>
          <div className="flex gap-2">
            {["all", "paid", "pending", "overdue"].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`rounded-lg px-3 py-1.5 text-xs capitalize transition-colors ${
                  filter === f ? "bg-primary-500/20 text-primary-300" : "text-white/50 hover:text-white/80"
                }`}>{t(`filters.${f}`)}</button>
            ))}
          </div>
        </div>
        <DataTable columns={columns} rows={rows} rowKey="id" />
      </Panel>
    </div>
  );
}
