import { motion } from "framer-motion";
import { GraduationCap, Star, Users, Plus, Award } from "lucide-react";
import { SectionHeading, Badge, Avatar } from "../../components/ui/index.jsx";
import { Panel, DataTable, IconTile } from "../../components/dashboard/shared.jsx";
import { teacherPerformance } from "../../data/mockData";
import { useLanguage } from "../../hooks/useLanguage";

export default function ManagerTeachers() {
  const { t } = useLanguage();
  const totalStudents = teacherPerformance.reduce((a, t) => a + t.students, 0);
  const avgRating = (teacherPerformance.reduce((a, t) => a + t.rating, 0) / teacherPerformance.length).toFixed(1);

  const columns = [
    { key: "name", label: t("pages.manager.teachers.teachers"), render: (r) => (
      <div className="flex items-center gap-3">
        <Avatar initials={r.avatar} size="sm" />
        <span className="font-medium text-white">{r.name}</span>
      </div>
    )},
    { key: "students", label: t("pages.manager.teachers.students"), align: "center", render: (r) => <span className="text-white/70">{r.students}</span> },
    { key: "groups", label: t("pages.manager.teachers.groups"), align: "center", render: (r) => <span className="text-white/70">{r.groups}</span> },
    { key: "avgBand", label: t("pages.manager.teachers.band"), align: "center", render: (r) => <Badge color="secondary">{r.avgBand}</Badge> },
    { key: "rating", label: t("pages.manager.teachers.rating"), align: "right", render: (r) => (
      <span className="inline-flex items-center gap-1 font-medium text-white">
        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />{r.rating}
      </span>
    )},
  ];

  return (
    <div className="space-y-7">
      <SectionHeading title={t("pages.manager.teachers.title")} subtitle={t("pages.manager.teachers.subtitle")}
        action={<button className="btn-primary text-sm"><Plus className="h-4 w-4" /> {t("pages.manager.teachers.addTeacher")}</button>} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { icon: GraduationCap, label: t("pages.manager.teachers.teachers"), value: teacherPerformance.length, accent: "primary" },
          { icon: Users, label: t("pages.manager.teachers.studentsTaught"), value: totalStudents, accent: "secondary" },
          { icon: Star, label: t("pages.manager.teachers.avgRating"), value: avgRating, accent: "primary" },
          { icon: Award, label: t("pages.manager.teachers.topBand"), value: "7.1", accent: "secondary" },
        ].map((s, i) => (
          <Panel key={s.label} className="!p-4" delay={i * 0.05}>
            <div className="flex items-center gap-3">
              <IconTile icon={s.icon} accent={s.accent} />
              <div><div className="text-xl font-semibold text-white">{s.value}</div><div className="text-xs text-white/40">{s.label}</div></div>
            </div>
          </Panel>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {teacherPerformance.map((t, i) => (
          <motion.div key={t.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }} className="glass rounded-2xl p-5 text-center">
            <Avatar initials={t.avatar} size="lg" ring />
            <h3 className="mt-3 font-medium text-white">{t.name}</h3>
            <div className="mt-1 inline-flex items-center gap-1 text-sm text-amber-400">
              <Star className="h-3.5 w-3.5 fill-amber-400" />{t.rating}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/[0.06] pt-4 text-center">
              <div><div className="text-sm font-semibold text-white">{t.students}</div><div className="text-[10px] text-white/40">{t("pages.manager.teachers.students")}</div></div>
              <div><div className="text-sm font-semibold text-white">{t.groups}</div><div className="text-[10px] text-white/40">{t("pages.manager.teachers.groups")}</div></div>
              <div><div className="text-sm font-semibold text-secondary-400">{t.avgBand}</div><div className="text-[10px] text-white/40">{t("pages.manager.teachers.band")}</div></div>
            </div>
          </motion.div>
        ))}
      </div>

      <Panel title={t("pages.manager.teachers.allTeachers")} delay={0.25}>
        <DataTable columns={columns} rows={teacherPerformance} rowKey="id" />
      </Panel>
    </div>
  );
}
