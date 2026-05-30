import { useEffect, useState } from "react";
import { PenLine, BookOpen, Headphones, Mic, Clock, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { SectionHeading, Badge } from "../../components/ui/index.jsx";
import { dashboardApi } from "../../services/api";
import { USE_MOCK } from "../../services/api";
import { homeworkList } from "../../data/mockData";
import { useLanguage } from "../../hooks/useLanguage";

const typeIcon = {
  writing: PenLine, writing_task1: PenLine, writing_task2: PenLine,
  reading: BookOpen, listening: Headphones,
  vocabulary: BookOpen, speaking: Mic, mock_test: BookOpen,
};

const statusMeta = {
  pending:  { color: "amber", label: "Pending",   icon: Clock },
  overdue:  { color: "red",   label: "Kechikkan", icon: AlertTriangle },
  done:     { color: "green", label: "Bajarildi", icon: CheckCircle2 },
};

function useHomework() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(!USE_MOCK);

  useEffect(() => {
    if (USE_MOCK) { setItems(homeworkList); return; }
    dashboardApi.homework({ limit: 20 })
      .then((res) => {
        // Backend array qaytaradi
        const arr = Array.isArray(res) ? res : (res?.results || []);
        setItems(arr.map((h) => ({
          id:     h.id,
          title:  h.title,
          type:   h.type || "writing",
          due:    h.due_label || "—",
          status: h.is_done ? "done" : h.is_overdue ? "overdue" : "pending",
          teacher: "—",
        })));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { items, loading };
}

export default function StudentHomework() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState("all");
  const { items, loading }  = useHomework();

  const list = items.filter((h) => filter === "all" || h.status === filter);
  const counts = {
    pending: items.filter((h) => h.status === "pending").length,
    overdue: items.filter((h) => h.status === "overdue").length,
    done:    items.filter((h) => h.status === "done").length,
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
    </div>
  );

  return (
    <div className="space-y-7">
      <SectionHeading
        title={t("pages.student.homework.title")}
        subtitle={t("pages.student.homework.subtitle")}
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { key: "pending", label: "Kutilmoqda", color: "amber" },
          { key: "overdue", label: "Kechikkan",  color: "red"   },
          { key: "done",    label: "Bajarildi",  color: "green" },
        ].map((s) => (
          <div key={s.key} className="glass rounded-2xl p-4 text-center">
            <div className="text-2xl font-semibold text-white">{counts[s.key]}</div>
            <Badge color={s.color} className="mt-1">{s.label}</Badge>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {["all", "pending", "overdue", "done"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm capitalize transition-colors ${
              filter === f
                ? "bg-primary-500/20 text-primary-300 border border-primary-500/30"
                : "text-white/50 hover:text-white/80 border border-transparent"
            }`}>
            {f === "all" ? "Barchasi" : f === "pending" ? "Kutilmoqda" : f === "overdue" ? "Kechikkan" : "Bajarildi"}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {list.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center text-white/40">
            <CheckCircle2 className="h-10 w-10 mx-auto mb-3 text-emerald-400" />
            <p>Hech narsa topilmadi</p>
          </div>
        ) : list.map((h) => {
          const Icon   = typeIcon[h.type] || PenLine;
          const meta   = statusMeta[h.status] || statusMeta.pending;
          const SIcon  = meta.icon;
          return (
            <div key={h.id} className="glass rounded-2xl p-4 flex items-center gap-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-500/10 text-primary-400">
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white truncate">{h.title}</div>
                <div className="text-xs text-white/40 mt-0.5 capitalize">{h.type?.replace(/_/g, " ")}</div>
              </div>
              <div className="text-right shrink-0">
                <Badge color={meta.color}><SIcon className="h-3 w-3" /> {meta.label}</Badge>
                <div className="mt-1 text-xs text-white/40">{h.due}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
