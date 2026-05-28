import { motion } from "framer-motion";
import { FolderKanban, Users, Calendar, GraduationCap, Plus, MoreHorizontal } from "lucide-react";
import { SectionHeading, Badge, ProgressBar, Avatar } from "../../components/ui/index.jsx";
import { Panel, IconTile } from "../../components/dashboard/shared.jsx";
import { teacherGroups, teacherPerformance } from "../../data/mockData";
import { useLanguage } from "../../hooks/useLanguage";

// expand the academy's groups by pairing with teachers
const academyGroups = teacherGroups.map((g, i) => ({
  ...g,
  teacher: teacherPerformance[i % teacherPerformance.length],
}));

export default function ManagerGroups() {
  const { t } = useLanguage();
  const totalStudents = academyGroups.reduce((a, g) => a + g.students, 0);

  return (
    <div className="space-y-7">
      <SectionHeading title={t("pages.manager.groups.title")} subtitle={t("pages.manager.groups.subtitle")}
        action={<button className="btn-primary text-sm"><Plus className="h-4 w-4" /> {t("pages.manager.groups.newGroup")}</button>} />

      <div className="grid grid-cols-3 gap-4">
        <Panel className="!p-4" delay={0}>
          <div className="flex items-center gap-3">
            <IconTile icon={FolderKanban} accent="primary" />
            <div><div className="text-xl font-semibold text-white">{academyGroups.length}</div><div className="text-xs text-white/40">{t("pages.manager.groups.activeGroups")}</div></div>
          </div>
        </Panel>
        <Panel className="!p-4" delay={0.05}>
          <div className="flex items-center gap-3">
            <IconTile icon={Users} accent="secondary" />
            <div><div className="text-xl font-semibold text-white">{totalStudents}</div><div className="text-xs text-white/40">{t("pages.manager.groups.enrolled")}</div></div>
          </div>
        </Panel>
        <Panel className="!p-4" delay={0.1}>
          <div className="flex items-center gap-3">
            <IconTile icon={GraduationCap} accent="primary" />
            <div><div className="text-xl font-semibold text-white">6.5</div><div className="text-xs text-white/40">{t("pages.manager.groups.avgBand")}</div></div>
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {academyGroups.map((g, i) => (
          <motion.div key={g.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }} className="glass rounded-2xl p-5 transition-colors hover:border-primary-500/40">
            <div className="flex items-start justify-between">
              <IconTile icon={FolderKanban} accent={g.color === "secondary" ? "secondary" : "primary"} size="lg" />
              <button className="rounded-lg p-1.5 text-white/30 hover:bg-white/[0.05] hover:text-white/60"><MoreHorizontal className="h-4 w-4" /></button>
            </div>
            <h3 className="mt-4 font-medium text-white">{g.name}</h3>
            <Badge color="gray">{g.level}</Badge>

            <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/[0.03] p-2.5">
              <Avatar initials={g.teacher.avatar} size="sm" />
              <div className="min-w-0">
                <div className="truncate text-xs text-white/70">{g.teacher.name}</div>
                <div className="text-[10px] text-white/40">{t("pages.manager.groups.leadTeacher")}</div>
              </div>
            </div>

            <div className="mt-4 space-y-2.5 text-sm">
              <div className="flex items-center justify-between text-white/50">
                <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {t("pages.manager.groups.students")}</span>
                <span className="text-white/80">{g.students}</span>
              </div>
              <div className="flex items-center justify-between text-white/50">
                <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {t("pages.manager.groups.schedule")}</span>
                <span className="text-white/80">{g.schedule}</span>
              </div>
              {g.avgBand && (
                <div>
                  <div className="mb-1 flex justify-between text-white/50"><span>{t("pages.manager.groups.avgBand")}</span><span className="text-white/80">{g.avgBand}</span></div>
                  <ProgressBar value={g.avgBand} max={9} color={g.color === "secondary" ? "secondary" : "primary"} />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
