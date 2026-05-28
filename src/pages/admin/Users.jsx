import { useState } from "react";
import { Users, Search, Plus, UserCheck, UserX, MoreHorizontal } from "lucide-react";
import { SectionHeading, Badge, Avatar } from "../../components/ui/index.jsx";
import { Panel, DataTable, IconTile } from "../../components/dashboard/shared.jsx";
import { adminUsers } from "../../data/mockData";
import { useLanguage } from "../../hooks/useLanguage";

const roleColor = { student: "secondary", teacher: "primary", manager: "amber", admin: "red" };

export default function AdminUsers() {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");

  const rows = adminUsers.filter((u) =>
    (role === "all" || u.role === role) &&
    (u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase()))
  );

  const stats = {
    total: adminUsers.length,
    active: adminUsers.filter((u) => u.status === "active").length,
    suspended: adminUsers.filter((u) => u.status === "suspended").length,
  };

  const columns = [
    { key: "name", label: t("pages.admin.users.user"), render: (r) => (
      <div className="flex items-center gap-3">
        <Avatar initials={r.name.split(" ").map((n) => n[0]).join("")} size="sm" />
        <div>
          <div className="font-medium text-white">{r.name}</div>
          <div className="text-xs text-white/40">{r.email}</div>
        </div>
      </div>
    )},
    { key: "role", label: t("common.role"), render: (r) => <Badge color={roleColor[r.role]}>{t(`roles.${r.role}`)}</Badge> },
    { key: "joined", label: t("pages.admin.users.joined"), render: (r) => <span className="text-white/50">{r.joined}</span> },
    { key: "status", label: t("pages.admin.users.status"), render: (r) => (
      <Badge color={r.status === "active" ? "green" : "red"}>
        {r.status === "active" ? <UserCheck className="h-3 w-3" /> : <UserX className="h-3 w-3" />} {r.status === "active" ? t("pages.admin.users.active") : t("pages.admin.users.suspended")}
      </Badge>
    )},
    { key: "action", label: "", align: "right", render: () => (
      <button className="rounded-lg p-2 text-white/40 hover:bg-white/[0.05] hover:text-white/70"><MoreHorizontal className="h-4 w-4" /></button>
    )},
  ];

  return (
    <div className="space-y-7">
      <SectionHeading title={t("pages.admin.users.title")} subtitle={t("pages.admin.users.subtitle")}
        action={<button className="btn-primary text-sm"><Plus className="h-4 w-4" /> {t("pages.admin.users.addUser")}</button>} />

      <div className="grid grid-cols-3 gap-4">
        <Panel className="!p-4" delay={0}>
          <div className="flex items-center gap-3">
            <IconTile icon={Users} accent="primary" />
            <div><div className="text-xl font-semibold text-white">{stats.total}</div><div className="text-xs text-white/40">{t("pages.admin.users.totalUsers")}</div></div>
          </div>
        </Panel>
        <Panel className="!p-4" delay={0.05}>
          <div className="flex items-center gap-3">
            <IconTile icon={UserCheck} accent="green" />
            <div><div className="text-xl font-semibold text-white">{stats.active}</div><div className="text-xs text-white/40">{t("pages.admin.users.active")}</div></div>
          </div>
        </Panel>
        <Panel className="!p-4" delay={0.1}>
          <div className="flex items-center gap-3">
            <IconTile icon={UserX} accent="red" />
            <div><div className="text-xl font-semibold text-white">{stats.suspended}</div><div className="text-xs text-white/40">{t("pages.admin.users.suspended")}</div></div>
          </div>
        </Panel>
      </div>

      <Panel delay={0.15}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="relative min-w-48 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("pages.admin.users.user")+"…"}
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-white/30 focus:border-primary-500/50 focus:outline-none" />
          </div>
          <div className="flex gap-2">
            {["all", "student", "teacher", "manager", "admin"].map((f) => (
              <button key={f} onClick={() => setRole(f)}
                className={`rounded-lg px-3 py-1.5 text-xs capitalize transition-colors ${
                  role === f ? "bg-primary-500/20 text-primary-300" : "text-white/50 hover:text-white/80"
                }`}>{t(`filters.${f}`)}</button>
            ))}
          </div>
        </div>
        <DataTable columns={columns} rows={rows} rowKey="id" />
      </Panel>
    </div>
  );
}
