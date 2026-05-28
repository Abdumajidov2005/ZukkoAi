import { motion } from "framer-motion";
import { BookOpen, Users, Clock, DollarSign, Plus, TrendingUp } from "lucide-react";
import { SectionHeading, Badge } from "../../components/ui/index.jsx";
import { Panel, IconTile } from "../../components/dashboard/shared.jsx";
import { useLanguage } from "../../hooks/useLanguage";

const courses = [
  { name: "IELTS Prep", students: 102, price: 120, weeks: 12, level: "Upper-Int → Advanced", color: "#7C3AED", fill: 90 },
  { name: "General English", students: 64, price: 90, weeks: 16, level: "Beginner → Intermediate", color: "#06B6D4", fill: 71 },
  { name: "Business English", students: 39, price: 150, weeks: 10, level: "Intermediate+", color: "#8B5CF6", fill: 52 },
  { name: "Kids English", students: 23, price: 70, weeks: 20, level: "Ages 7-12", color: "#22d3ee", fill: 38 },
];

export default function ManagerCourses() {
  const { t } = useLanguage();
  const totalStudents = courses.reduce((a, c) => a + c.students, 0);
  const totalRevenue = courses.reduce((a, c) => a + c.students * c.price, 0);

  return (
    <div className="space-y-7">
      <SectionHeading title={t("pages.manager.courses.title")} subtitle={t("pages.manager.courses.subtitle")}
        action={<button className="btn-primary text-sm"><Plus className="h-4 w-4" /> {t("pages.manager.courses.newCourse")}</button>} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { icon: BookOpen, label: t("pages.manager.courses.courses"), value: courses.length, accent: "primary" },
          { icon: Users, label: t("pages.manager.courses.enrolled"), value: totalStudents, accent: "secondary" },
          { icon: DollarSign, label: t("pages.manager.courses.monthlyRevenue"), value: `$${(totalRevenue / 1000).toFixed(1)}K`, accent: "primary" },
          { icon: TrendingUp, label: t("pages.manager.courses.completion"), value: "82%", accent: "secondary" },
        ].map((s, i) => (
          <Panel key={s.label} className="!p-4" delay={i * 0.05}>
            <div className="flex items-center gap-3">
              <IconTile icon={s.icon} accent={s.accent} />
              <div><div className="text-xl font-semibold text-white">{s.value}</div><div className="text-xs text-white/40">{s.label}</div></div>
            </div>
          </Panel>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {courses.map((c, i) => (
          <motion.div key={c.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }} className="glass rounded-2xl p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-xl" style={{ background: `${c.color}22`, color: c.color }}>
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium text-white">{c.name}</h3>
                  <p className="text-xs text-white/40">{c.level}</p>
                </div>
              </div>
              <Badge color="primary">${c.price}/mo</Badge>
            </div>

            <div className="mt-4 flex gap-4 text-sm text-white/50">
              <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {c.students} {t("pages.manager.courses.students")}</span>
              <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {c.weeks} {t("pages.manager.courses.weeks")}</span>
            </div>

            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-white/50">{t("pages.manager.courses.capacity")}</span>
                <span className="text-white/70">{c.fill}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div initial={{ width: 0 }} animate={{ width: `${c.fill}%` }}
                  transition={{ duration: 0.8 }} className="h-full rounded-full" style={{ background: c.color }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
