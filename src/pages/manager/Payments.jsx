import { useEffect, useState } from "react";
import { CreditCard, CheckCircle2, XCircle, Clock, Search, Loader2, TrendingUp } from "lucide-react";
import { SectionHeading, Badge } from "../../components/ui/index.jsx";
import { Panel, IconTile, DataTable } from "../../components/dashboard/shared.jsx";
import { paymentsApi } from "../../services/api";
import { USE_MOCK } from "../../services/api";
import { payments } from "../../data/mockData";
import { useLanguage } from "../../hooks/useLanguage";

const statusMeta = {
  completed: { color: "green",  icon: CheckCircle2, label: "To'landi" },
  pending:   { color: "amber",  icon: Clock,         label: "Kutilmoqda" },
  failed:    { color: "red",    icon: XCircle,       label: "Xato" },
  cancelled: { color: "red",    icon: XCircle,       label: "Bekor" },
  refunded:  { color: "gray",   icon: XCircle,       label: "Qaytarildi" },
};

function usePayments() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(!USE_MOCK);

  useEffect(() => {
    if (USE_MOCK) { setItems(payments || []); return; }
    paymentsApi.history({ page_size: 100 })
      .then((r) => setItems(r.results || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { items, loading };
}

export default function ManagerPayments() {
  const { t } = useLanguage();
  const [query, setQuery]   = useState("");
  const [filter, setFilter] = useState("all");
  const { items, loading }  = usePayments();

  const normalize = (p) => USE_MOCK ? p : {
    id:       p.id,
    user:     p.plan_name || "—",
    plan:     p.plan_type || "—",
    amount:   `${p.amount} ${p.currency}`,
    provider: p.provider,
    status:   p.status,
    date:     p.paid_at ? new Date(p.paid_at).toLocaleDateString("uz") : new Date(p.created_at).toLocaleDateString("uz"),
  };

  const list = items
    .map(normalize)
    .filter((p) => filter === "all" || p.status === filter)
    .filter((p) => !query || String(p.user || p.plan || "").toLowerCase().includes(query.toLowerCase()));

  const total     = items.length;
  const completed = items.filter((p) => (USE_MOCK ? p.status : p.status) === "completed").length;
  const revenue   = USE_MOCK
    ? items.filter((p) => p.status === "completed").reduce((a, p) => a + (parseFloat(p.amount) || 0), 0)
    : items.filter((p) => p.status === "completed").reduce((a, p) => a + (parseFloat(p.amount) || 0), 0);

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
    </div>
  );

  const columns = [
    { key: "user",     label: "Foydalanuvchi / Plan" , render: (r) => (
      <div><div className="text-white text-sm font-medium">{r.user || r.plan_name || "—"}</div>
      <div className="text-white/40 text-xs">{r.plan || r.plan_type || ""}</div></div>
    )},
    { key: "amount",   label: "Summa",    render: (r) => <span className="text-white font-medium">{r.amount}</span> },
    { key: "provider", label: "To'lov",   render: (r) => <Badge color="secondary">{r.provider}</Badge> },
    { key: "status",   label: "Holat",    render: (r) => {
      const m = statusMeta[r.status] || statusMeta.pending;
      return <Badge color={m.color}>{m.label}</Badge>;
    }},
    { key: "date",     label: "Sana",     render: (r) => <span className="text-white/50 text-sm">{r.date}</span> },
  ];

  return (
    <div className="space-y-7">
      <SectionHeading title="To'lovlar" subtitle="Barcha to'lov tranzaksiyalari" />

      <div className="grid grid-cols-3 gap-4">
        <Panel className="!p-4" delay={0}>
          <div className="flex items-center gap-3">
            <IconTile icon={CreditCard} accent="primary" />
            <div><div className="text-xl font-semibold text-white">{total}</div><div className="text-xs text-white/40">Jami tranzaksiya</div></div>
          </div>
        </Panel>
        <Panel className="!p-4" delay={0.05}>
          <div className="flex items-center gap-3">
            <IconTile icon={CheckCircle2} accent="secondary" />
            <div><div className="text-xl font-semibold text-white">{completed}</div><div className="text-xs text-white/40">Muvaffaqiyatli</div></div>
          </div>
        </Panel>
        <Panel className="!p-4" delay={0.1}>
          <div className="flex items-center gap-3">
            <IconTile icon={TrendingUp} accent="primary" />
            <div><div className="text-xl font-semibold text-white">{revenue.toLocaleString()}</div><div className="text-xs text-white/40">Jami daromad</div></div>
          </div>
        </Panel>
      </div>

      <Panel delay={0.15}>
        <div className="mb-4 flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <input value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Qidirish..."
              className="w-full rounded-xl bg-white/5 border border-white/10 py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-primary-500/50" />
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}
            className="rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white outline-none bg-[#0D1117]">
            <option value="all">Barchasi</option>
            <option value="completed">To'landi</option>
            <option value="pending">Kutilmoqda</option>
            <option value="failed">Xato</option>
          </select>
        </div>
        <DataTable columns={columns} rows={list} />
      </Panel>
    </div>
  );
}
