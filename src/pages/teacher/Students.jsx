import { useEffect, useState } from "react";
import { Users, Search, UserCheck, AlertTriangle, Clock, MessageSquare, Loader2 } from "lucide-react";
import { SectionHeading, Badge, Avatar, ProgressBar } from "../../components/ui/index.jsx";
import { Panel, DataTable, IconTile } from "../../components/dashboard/shared.jsx";
import { groupsApi } from "../../services/api";
import { USE_MOCK } from "../../services/api";
import { teacherStudents } from "../../data/mockData";
import { useLanguage } from "../../hooks/useLanguage";

const statusMeta = {
  active:   { color: "green",  tKey: "pages.teacher.students.active" },
  idle:     { color: "amber",  tKey: "pages.teacher.students.idle" },
  at_risk:  { color: "red",    tKey: "pages.teacher.students.risk" },
  risk:     { color: "red",    tKey: "pages.teacher.students.risk" },
};

function useTeacherStudents() {
  const [students, setStudents] = useState([]);
  const [summary, setSummary]   = useState(null);
  const [loading, setLoading]   = useState(!USE_MOCK);

  useEffect(() => {
    if (USE_MOCK) { setStudents(teacherStudents); return; }
    groupsApi.teacherStudents({ page_size: 100 })
      .then((r) => { setStudents(r.results || []); setSummary(r.summary); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { students, summary, loading };
}

export default function TeacherStudents() {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("all");
  const { students, summary, loading } = useTeacherStudents();

  const groups = ["all", ...new Set(students.map((s) => USE_MOCK ? s.group : s.group_name).filter(Boolean))];

  const rows = students.filter((s) => {
    const name  = USE_MOCK ? s.name : (s.full_name || s.username || "");
    const grp   = USE_MOCK ? s.group : s.group_name;
    return (group === "all" || grp === group) && name.toLowerCase().includes(query.toLowerCase());
  });

  const normalize = (s) => USE_MOCK ? {
    id: s.id, name: s.name, avatar: s.avatar,
    group: s.group, band: s.band, attendance: s.attendance,
    essays: s.essays, status: s.status, lastActive: s.lastActive,
  } : {
    id: s.id,
    name: s.full_name || s.username,
    avatar: (s.full_name || s.username || "??").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase(),
    group: s.group_name || "—",
    band: s.current_band ?? "—",
    attendance: s.attendance_pct ?? 0,
    essays: s.total_submissions ?? 0,
    status: s.status || "idle",
    lastActive: s.last_active ? new Date(s.last_active).toLocaleDateString("uz") : "—",
  };

  const statsData = {
    total:   summary?.total_students ?? students.length,
    active:  summary?.active_today   ?? students.filter((s) => (USE_MOCK ? s.status : s.status) === "active").length,
    risk:    summary?.at_risk_count  ?? students.filter((s) => ["risk","at_risk"].includes(USE_MOCK ? s.status : s.status)).length,
    avgBand: summary?.average_band   ?? (students.length ? (students.reduce((a, s) => a + (USE_MOCK ? s.band : (parseFloat(s.current_band) || 0)), 0) / students.length).toFixed(1) : "—"),
  };

  const columns = [
    { key: "name", label: t("pages.teacher.students.student"), render: (r) => (
      <div className="flex items-center gap-3">
        <Avatar initials={r.avatar} size="sm" />
        <div>
          <div className="font-medium text-white">{r.name}</div>
          <div className="text-xs text-white/40">{r.lastActive}</div>
        </div>
      </div>
    )},
    { key: "group", label: t("pages.teacher.students.group"), render: (r) => <Badge color="secondary">{r.group}</Badge> },
    { key: "band", label: t("pages.teacher.students.band"), align: "center", render: (r) => <span className="font-semibold text-white">{r.band}</span> },
    { key: "attendance", label: t("pages.teacher.students.attendance"), render: (r) => (
      <div className="w-28">
        <div className="mb-1 text-xs text-white/50">{r.attendance}%</div>
        <ProgressBar value={r.attendance} color={r.attendance >= 90 ? "green" : r.attendance >= 80 ? "amber" : "red"} />
      </div>
    )},
    { key: "essays", label: t("pages.teacher.students.essays"), align: "center", render: (r) => <span className="text-white/70">{r.essays}</span> },
    { key: "status", label: t("pages.teacher.students.status"), render: (r) => (
      <Badge color={(statusMeta[r.status] || statusMeta.idle).color}>{t((statusMeta[r.status] || statusMeta.idle).tKey)}</Badge>
    )},
    { key: "action", label: "", align: "right", render: () => (
      <button className="rounded-lg p-2 text-white/40 hover:bg-white/[0.05] hover:text-primary-400"><MessageSquare className="h-4 w-4" /></button>
    )},
  ];

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary-400" /></div>;

  return (
    <div className="space-y-7">
      <SectionHeading title={t("pages.teacher.students.title")} subtitle={t("pages.teacher.students.subtitle")} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { icon: Users,         label: t("pages.teacher.students.total"),      value: statsData.total,   accent: "primary" },
          { icon: UserCheck,     label: t("pages.teacher.students.activeToday"),value: statsData.active,  accent: "secondary" },
          { icon: AlertTriangle, label: t("pages.teacher.students.atRisk"),     value: statsData.risk,    accent: "red" },
          { icon: Clock,         label: t("pages.teacher.students.avgBand"),    value: statsData.avgBand, accent: "primary" },
        ].map((s, i) => (
          <Panel key={s.label} className="!p-4" delay={i * 0.05}>
            <div className="flex items-center gap-3">
              <IconTile icon={s.icon} accent={s.accent} />
              <div><div className="text-xl font-semibold text-white">{s.value}</div><div className="text-xs text-white/40">{s.label}</div></div>
            </div>
          </Panel>
        ))}
      </div>

      <Panel delay={0.15}>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder={t("pages.teacher.students.search")}
              className="w-full rounded-xl bg-white/5 border border-white/10 py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-primary-500/50" />
          </div>
          <select value={group} onChange={(e) => setGroup(e.target.value)}
            className="rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white outline-none focus:border-primary-500/50 bg-[#141A2A]">
            {groups.map((g) => <option key={g} value={g}>{g === "all" ? t("pages.teacher.students.allGroups") : g}</option>)}
          </select>
        </div>
        <DataTable columns={columns} rows={rows.map(normalize)} />
      </Panel>
    </div>
  );
}
