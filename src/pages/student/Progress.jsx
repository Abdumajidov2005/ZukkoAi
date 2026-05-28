import {
  Area, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Line, ComposedChart,
} from "recharts";
import { TrendingUp, Target, Award, Calendar, Flame } from "lucide-react";
import { SectionHeading, Badge, StatCard, ProgressBar } from "../../components/ui/index.jsx";
import { Panel, tooltipStyle } from "../../components/dashboard/shared.jsx";
import { progressData, skillRadar, weeklyActivity } from "../../data/mockData";
import { useLanguage } from "../../hooks/useLanguage";

export default function StudentProgress() {
  const { t } = useLanguage();
  return (
    <div className="space-y-7">
      <SectionHeading title={t("pages.student.progress.title")} subtitle={t("pages.student.progress.subtitle")}
        action={<Badge color="green"><TrendingUp className="h-3 w-3" /> {t("pages.student.progress.improved")}</Badge>} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Award} label={t("pages.student.progress.currentBand")} value="6.5" change="+1.0" accent="primary" delay={0} />
        <StatCard icon={Target} label={t("pages.student.progress.targetBand")} value="7.0" change={t("pages.student.progress.toGo")} trend="neutral" accent="secondary" delay={0.05} />
        <StatCard icon={Flame} label={t("pages.student.progress.studyStreak")} value="12 days" change="+3" accent="primary" delay={0.1} />
        <StatCard icon={Calendar} label={t("pages.student.progress.hoursMonth")} value="42h" change="+8h" accent="secondary" delay={0.15} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title={t("pages.student.progress.bandProgression")} subtitle={t("pages.student.progress.monthlyVsTarget")} className="lg:col-span-2" delay={0.1}>
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={progressData}>
              <defs>
                <linearGradient id="pBand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis domain={[4, 8]} stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="band" stroke="#8B5CF6" strokeWidth={2.5} fill="url(#pBand)" />
              <Line type="monotone" dataKey="target" stroke="#06B6D4" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title={t("pages.student.progress.skillBreakdown")} subtitle={t("pages.student.progress.strengthsGaps")} delay={0.15}>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={skillRadar} outerRadius="70%">
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="skill" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }} />
              <Radar dataKey="score" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.35} strokeWidth={2} />
              <Tooltip contentStyle={tooltipStyle} />
            </RadarChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title={t("pages.student.progress.studyMinutes")} subtitle={t("pages.student.progress.thisWeek")} className="lg:col-span-2" delay={0.2}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="minutes" fill="#7C3AED" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title={t("pages.student.progress.skillTargets")} delay={0.25}>
          <div className="space-y-4">
            {skillRadar.map((s) => (
              <div key={s.skill}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-white/70">{s.skill}</span>
                  <span className="text-white/50">{s.score}%</span>
                </div>
                <ProgressBar value={s.score} color={s.score >= 80 ? "green" : s.score >= 65 ? "primary" : "amber"} />
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
