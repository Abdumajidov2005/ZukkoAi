import { motion } from "framer-motion";
import { FolderKanban, Users, Calendar, Plus, ArrowRight, GraduationCap } from "lucide-react";
import { SectionHeading, Badge, ProgressBar } from "../../components/ui/index.jsx";
import { Panel, IconTile } from "../../components/dashboard/shared.jsx";
import { teacherGroups } from "../../data/mockData";

export default function TeacherGroups() {
  const totalStudents = teacherGroups.reduce((a, g) => a + g.students, 0);

  return (
    <div className="space-y-7">
      <SectionHeading title="Groups" subtitle="Manage your teaching groups and schedules."
        action={<button className="btn-primary text-sm"><Plus className="h-4 w-4" /> New Group</button>} />

      <div className="grid grid-cols-3 gap-4">
        <Panel className="!p-4" delay={0}>
          <div className="flex items-center gap-3">
            <IconTile icon={FolderKanban} accent="primary" />
            <div><div className="text-xl font-semibold text-white">{teacherGroups.length}</div><div className="text-xs text-white/40">Groups</div></div>
          </div>
        </Panel>
        <Panel className="!p-4" delay={0.05}>
          <div className="flex items-center gap-3">
            <IconTile icon={Users} accent="secondary" />
            <div><div className="text-xl font-semibold text-white">{totalStudents}</div><div className="text-xs text-white/40">Total Students</div></div>
          </div>
        </Panel>
        <Panel className="!p-4" delay={0.1}>
          <div className="flex items-center gap-3">
            <IconTile icon={GraduationCap} accent="primary" />
            <div><div className="text-xl font-semibold text-white">6.5</div><div className="text-xs text-white/40">Avg Band</div></div>
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {teacherGroups.map((g, i) => (
          <motion.div key={g.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="glass group rounded-2xl p-5 transition-colors hover:border-primary-500/40">
            <div className="flex items-start justify-between">
              <IconTile icon={FolderKanban} accent={g.color === "secondary" ? "secondary" : "primary"} size="lg" />
              <Badge color="gray">{g.level}</Badge>
            </div>
            <h3 className="mt-4 font-medium text-white">{g.name}</h3>
            <div className="mt-3 space-y-2.5 text-sm">
              <div className="flex items-center justify-between text-white/50">
                <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> Students</span>
                <span className="text-white/80">{g.students}</span>
              </div>
              <div className="flex items-center justify-between text-white/50">
                <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Schedule</span>
                <span className="text-white/80">{g.schedule}</span>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-white/50">
                  <span>Avg Band</span>
                  <span className="text-white/80">{g.avgBand ?? "—"}</span>
                </div>
                {g.avgBand && <ProgressBar value={g.avgBand} max={9} color={g.color === "secondary" ? "secondary" : "primary"} />}
              </div>
            </div>
            <button className="mt-4 flex w-full items-center justify-center gap-1 rounded-xl border border-white/[0.06] py-2 text-sm text-white/60 transition-colors hover:border-primary-500/40 hover:text-white">
              View group <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
