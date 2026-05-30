import { useEffect, useState } from "react";
import {
  Area, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, ComposedChart,
} from "recharts";
import { TrendingUp, Target, Award, Calendar, Flame, Loader2 } from "lucide-react";
import { SectionHeading, Badge, StatCard, ProgressBar } from "../../components/ui/index.jsx";
import { Panel, tooltipStyle } from "../../components/dashboard/shared.jsx";
import { dashboardApi, writingApi } from "../../services/api";
import { USE_MOCK } from "../../services/api";
import { progressData, skillRadar, weeklyActivity } from "../../data/mockData";
import { useLanguage } from "../../hooks/useLanguage";

function useProgressData() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(!USE_MOCK);

  useEffect(() => {
    if (USE_MOCK) return;
    Promise.all([
      dashboardApi.bandProgress({ days: 180 }),
      dashboardApi.skills(),
      dashboardApi.weeklyActivity(),
      dashboardApi.stats(),
    ])
      .then(([band, skills, weekly, stats]) => setData({ band, skills, weekly, stats }))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}

export default function StudentProgress() {
  const { t } = useLanguage();
  const { data, loading } = useProgressData();

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
    </div>
  );

  // Data normalizatsiya
  const bandChart = USE_MOCK
    ? progressData
    : (data?.band?.data || []).map((d) => ({
        month: d.date?.slice(5, 10),
        band:  d.overall_band,
        target: data?.band?.summary?.target_band ? parseFloat(data.band.summary.target_band) : undefined,
      }));

  const radarData = USE_MOCK
    ? skillRadar
    : data?.skills
    ? [
        { skill: "Grammar",    score: Math.round((data.skills.grammar    || 0) / 9 * 100) },
        { skill: "Vocabulary", score: Math.round((data.skills.vocabulary || 0) / 9 * 100) },
        { skill: "Coherence",  score: Math.round((data.skills.coherence  || 0) / 9 * 100) },
        { skill: "Task",       score: Math.round((data.skills.task       || 0) / 9 * 100) },
      ]
    : [];

  const weeklyData = USE_MOCK
    ? weeklyActivity
    : (data?.weekly?.days || []).map((d) => ({ day: d.day, minutes: d.total * 20 }));

  const stats = data?.stats || {};
  const currentBand  = USE_MOCK ? "6.5" : (stats.current_band ?? "—");
  const targetBand   = USE_MOCK ? "7.0" : (data?.band?.summary?.target_band ?? "—");
  const streak       = USE_MOCK ? "12 days" : `${stats.daily_streak ?? 0} kun`;

  return (
    <div className="space-y-7">
      <SectionHeading
        title={t("pages.student.progress.title")}
        subtitle={t("pages.student.progress.subtitle")}
        action={<Badge color="green"><TrendingUp className="h-3 w-3" /> {t("pages.student.progress.improved")}</Badge>}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Award}    label={t("pages.student.progress.currentBand")}  value={currentBand} change="+1.0" accent="primary"   delay={0}    />
        <StatCard icon={Target}   label={t("pages.student.progress.targetBand")}   value={targetBand}  change={t("pages.student.progress.toGo")} trend="neutral" accent="secondary" delay={0.05} />
        <StatCard icon={Flame}    label={t("pages.student.progress.studyStreak")}  value={streak}      change="+3"  accent="primary"   delay={0.1}  />
        <StatCard icon={Calendar} label={t("pages.student.progress.hoursMonth")}   value={USE_MOCK ? "42h" : `${stats.total_submissions ?? 0} ta`} change="" accent="secondary" delay={0.15} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title={t("pages.student.progress.bandProgression")} subtitle={t("pages.student.progress.monthlyVsTarget")} className="lg:col-span-2" delay={0.1}>
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={bandChart}>
              <defs>
                <linearGradient id="pBand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#7C3AED" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis domain={[4, 9]}  stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="band"   stroke="#8B5CF6" strokeWidth={2.5} fill="url(#pBand)" />
              {!USE_MOCK && <Area type="monotone" dataKey="target" stroke="#06B6D4" strokeWidth={1.5} strokeDasharray="5 5" fill="none" />}
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title={t("pages.student.overview.skillBreakdown")} delay={0.15}>
          <ResponsiveContainer width="100%" height={230}>
            <RadarChart data={radarData} outerRadius="70%">
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="skill" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }} />
              <Radar dataKey="score" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.35} strokeWidth={2} />
              <Tooltip contentStyle={tooltipStyle} />
            </RadarChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title={t("pages.student.overview.weeklyActivity")} className="lg:col-span-2" delay={0.2}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="day"     stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="minutes" fill="#7C3AED" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Ko'nikmalar" delay={0.25}>
          <div className="space-y-3 mt-2">
            {radarData.map((s) => (
              <div key={s.skill}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-white/70">{s.skill}</span>
                  <span className="text-white/50">{s.score}%</span>
                </div>
                <ProgressBar value={s.score} color={s.score >= 70 ? "green" : s.score >= 50 ? "amber" : "red"} />
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
