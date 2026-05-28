import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar, Line,
  PolarGrid, PolarAngleAxis, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { Trophy, PenLine, FileText, Flame, ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import { StatCard, SectionHeading, Badge } from "../../components/ui/index.jsx";
import { useAuthStore } from "../../store/authStore";
import { useLanguage } from "../../hooks/useLanguage";
import { progressData, skillRadar, weeklyActivity, recentEssays, homeworkList } from "../../data/mockData";

const tooltipStyle = {
  background: "#141A2A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12, color: "#fff",
};

export default function StudentOverview() {
  const user = useAuthStore((s) => s.user);
  const { t } = useLanguage();
  const pending = homeworkList.filter((h) => h.status === "pending" || h.status === "overdue");

  return (
    <div className="space-y-7">
      <SectionHeading
        title={t("pages.student.overview.welcome", { name: user?.fullname?.split(" ")[0] })}
        subtitle={t("pages.student.overview.subtitle")}
        action={
          <Link to="/app/ai-checker" className="btn-primary !py-2.5 text-sm">
            <PenLine className="h-4 w-4" /> {t("pages.student.overview.checkEssay")}
          </Link>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Trophy} label={t("pages.student.overview.currentBand")} value="6.5" change="+1.0" trend="up" accent="primary" delay={0} />
        <StatCard icon={PenLine} label={t("pages.student.overview.essaysChecked")} value="24" change="+3" trend="up" accent="secondary" delay={0.05} />
        <StatCard icon={Flame} label={t("pages.student.overview.dayStreak")} value="12" change="+1" trend="up" accent="primary" delay={0.1} />
        <StatCard icon={FileText} label={t("pages.student.overview.testsTaken")} value="18" change="+2" trend="up" accent="secondary" delay={0.15} />
      </div>

      {/* charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* band progression */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="lg:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium text-white">{t("pages.student.overview.bandProgression")}</h3>
              <p className="text-xs text-white/40">{t("pages.student.overview.towardTarget")}</p>
            </div>
            <Badge color="green">{t("pages.student.overview.onTrack")}</Badge>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={progressData}>
              <defs>
                <linearGradient id="bandG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis domain={[4, 8]} stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="band" stroke="#8B5CF6" strokeWidth={2.5} fill="url(#bandG)" />
              <Line type="monotone" dataKey="target" stroke="#06B6D4" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* skill radar */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="glass rounded-2xl p-5">
          <h3 className="font-medium text-white mb-1">{t("pages.student.overview.skillBreakdown")}</h3>
          <p className="text-xs text-white/40 mb-2">{t("pages.student.overview.strengthsGaps")}</p>
          <ResponsiveContainer width="100%" height={230}>
            <RadarChart data={skillRadar} outerRadius="72%">
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="skill" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }} />
              <Radar dataKey="score" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.35} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* bottom row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* weekly activity */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 glass rounded-2xl p-5">
          <h3 className="font-medium text-white mb-4">{t("pages.student.overview.weeklyActivity")}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyActivity} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="essays" stackId="a" fill="#7C3AED" radius={[0, 0, 0, 0]} />
              <Bar dataKey="tests" stackId="a" fill="#06B6D4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* homework */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-white">{t("pages.student.overview.homework")}</h3>
            <Link to="/app/homework" className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1">
              {t("pages.student.overview.viewAll")} <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {pending.slice(0, 3).map((h) => (
              <div key={h.id} className="flex items-start gap-3 rounded-xl bg-white/[0.03] p-3">
                <div className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg ${h.status === "overdue" ? "bg-rose-500/15 text-rose-400" : "bg-primary-500/15 text-primary-400"}`}>
                  <Clock className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm text-white">{h.title}</div>
                  <div className="text-[11px] text-white/40">{t("pages.student.overview.due")} {h.due}</div>
                </div>
                {h.status === "overdue" && <Badge color="red">{t("pages.student.overview.late")}</Badge>}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* recent essays */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-white">{t("pages.student.overview.recentEssays")}</h3>
          <Badge color="secondary">{t("pages.student.overview.aiGraded")}</Badge>
        </div>
        <div className="space-y-2">
          {recentEssays.map((e) => (
            <div key={e.id} className="flex items-center gap-4 rounded-xl px-3 py-3 hover:bg-white/[0.03] transition-colors">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary-500/10 text-primary-400">
                <PenLine className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm text-white">{e.title}</div>
                <div className="text-[11px] text-white/40">{e.words} {t("pages.student.overview.words", "words")} · {e.date}</div>
              </div>
              {e.status === "pending" ? (
                <Badge color="amber"><Clock className="h-3 w-3" /> {t("pages.student.overview.checking")}</Badge>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm font-semibold text-emerald-400">{e.band}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
