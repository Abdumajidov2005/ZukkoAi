import { useState } from "react";
import { Users, Search, UserCheck, AlertTriangle, Clock, Filter, MessageSquare } from "lucide-react";
import { SectionHeading, Badge, Avatar, ProgressBar } from "../../components/ui/index.jsx";
import { Panel, DataTable, IconTile } from "../../components/dashboard/shared.jsx";
import { teacherStudents } from "../../data/mockData";

const statusMeta = {
  active: { color: "green", label: "Active" },
  idle: { color: "amber", label: "Idle" },
  risk: { color: "red", label: "At risk" },
};

export default function TeacherStudents() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("all");

  const groups = ["all", ...new Set(teacherStudents.map((s) => s.group))];
  const rows = teacherStudents.filter((s) =>
    (group === "all" || s.group === group) &&
    s.name.toLowerCase().includes(query.toLowerCase())
  );

  const stats = {
    total: teacherStudents.length,
    active: teacherStudents.filter((s) => s.status === "active").length,
    risk: teacherStudents.filter((s) => s.status === "risk").length,
    avgBand: (teacherStudents.reduce((a, s) => a + s.band, 0) / teacherStudents.length).toFixed(1),
  };

  const columns = [
    { key: "name", label: "Student", render: (r) => (
      <div className="flex items-center gap-3">
        <Avatar initials={r.avatar} size="sm" />
        <div>
          <div className="font-medium text-white">{r.name}</div>
          <div className="text-xs text-white/40">{r.lastActive}</div>
        </div>
      </div>
    )},
    { key: "group", label: "Group", render: (r) => <Badge color="secondary">{r.group}</Badge> },
    { key: "band", label: "Band", align: "center", render: (r) => <span className="font-semibold text-white">{r.band}</span> },
    { key: "attendance", label: "Attendance", render: (r) => (
      <div className="w-28">
        <div className="mb-1 text-xs text-white/50">{r.attendance}%</div>
        <ProgressBar value={r.attendance} color={r.attendance >= 90 ? "green" : r.attendance >= 80 ? "amber" : "red"} />
      </div>
    )},
    { key: "essays", label: "Essays", align: "center", render: (r) => <span className="text-white/70">{r.essays}</span> },
    { key: "status", label: "Status", render: (r) => <Badge color={statusMeta[r.status].color}>{statusMeta[r.status].label}</Badge> },
    { key: "action", label: "", align: "right", render: () => (
      <button className="rounded-lg p-2 text-white/40 hover:bg-white/[0.05] hover:text-primary-400"><MessageSquare className="h-4 w-4" /></button>
    )},
  ];

  return (
    <div className="space-y-7">
      <SectionHeading title="My Students" subtitle="Monitor and support your learners." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { icon: Users, label: "Total Students", value: stats.total, accent: "primary" },
          { icon: UserCheck, label: "Active Today", value: stats.active, accent: "secondary" },
          { icon: AlertTriangle, label: "At Risk", value: stats.risk, accent: "red" },
          { icon: Clock, label: "Avg Band", value: stats.avgBand, accent: "primary" },
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
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search students…"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-white/30 focus:border-primary-500/50 focus:outline-none" />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-white/30" />
            {groups.map((g) => (
              <button key={g} onClick={() => setGroup(g)}
                className={`rounded-lg px-3 py-1.5 text-xs capitalize transition-colors ${
                  group === g ? "bg-primary-500/20 text-primary-300" : "text-white/50 hover:text-white/80"
                }`}>{g}</button>
            ))}
          </div>
        </div>
        <DataTable columns={columns} rows={rows} rowKey="id" />
      </Panel>
    </div>
  );
}
