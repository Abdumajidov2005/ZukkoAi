import { useState } from "react";
import { motion } from "framer-motion";
import { Info, AlertTriangle, CheckCircle2, XCircle, Search } from "lucide-react";
import { SectionHeading, Badge } from "../../components/ui/index.jsx";
import { Panel } from "../../components/dashboard/shared.jsx";
import { systemLogs } from "../../data/mockData";

// expand log list a bit for realism
const allLogs = [
  ...systemLogs,
  { id: "l6", level: "info", message: "Cache warmed for dashboard queries", time: "4h ago", source: "cache" },
  { id: "l7", level: "success", message: "AI model GPT-4o health check passed", time: "5h ago", source: "ai-engine" },
  { id: "l8", level: "warning", message: "Storage at 22% capacity", time: "6h ago", source: "database" },
  { id: "l9", level: "info", message: "12 new essays queued for grading", time: "7h ago", source: "ai-engine" },
];

const levelMeta = {
  info: { color: "secondary", icon: Info },
  warning: { color: "amber", icon: AlertTriangle },
  success: { color: "green", icon: CheckCircle2 },
  error: { color: "red", icon: XCircle },
};

export default function AdminLogs() {
  const [level, setLevel] = useState("all");
  const [query, setQuery] = useState("");

  const rows = allLogs.filter((l) =>
    (level === "all" || l.level === level) &&
    l.message.toLowerCase().includes(query.toLowerCase())
  );

  const counts = {
    error: allLogs.filter((l) => l.level === "error").length,
    warning: allLogs.filter((l) => l.level === "warning").length,
  };

  return (
    <div className="space-y-7">
      <SectionHeading title="System Logs" subtitle="Real-time platform activity."
        action={
          <div className="flex gap-2">
            <Badge color="red">{counts.error} errors</Badge>
            <Badge color="amber">{counts.warning} warnings</Badge>
          </div>
        } />

      <Panel delay={0.05}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="relative min-w-48 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search logs…"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-white/30 focus:border-primary-500/50 focus:outline-none" />
          </div>
          <div className="flex gap-2">
            {["all", "info", "success", "warning", "error"].map((f) => (
              <button key={f} onClick={() => setLevel(f)}
                className={`rounded-lg px-3 py-1.5 text-xs capitalize transition-colors ${
                  level === f ? "bg-primary-500/20 text-primary-300" : "text-white/50 hover:text-white/80"
                }`}>{f}</button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5 font-mono text-sm">
          {rows.map((l, i) => {
            const m = levelMeta[l.level];
            const Icon = m.icon;
            return (
              <motion.div key={l.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-white/[0.03]">
                <Icon className={`h-4 w-4 shrink-0 ${
                  l.level === "error" ? "text-rose-400" : l.level === "warning" ? "text-amber-400" : l.level === "success" ? "text-emerald-400" : "text-secondary-400"
                }`} />
                <span className="w-16 shrink-0 text-xs uppercase text-white/40">[{l.level}]</span>
                <span className="min-w-0 flex-1 truncate text-white/80">{l.message}</span>
                <span className="hidden shrink-0 text-xs text-white/30 sm:inline">{l.source}</span>
                <span className="shrink-0 text-xs text-white/30">{l.time}</span>
              </motion.div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}
