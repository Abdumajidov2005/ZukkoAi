import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Line,
} from "recharts";
import { Trophy, PenLine, FileText, Flame, ArrowRight, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { StatCard, SectionHeading, Badge } from "../../components/ui/index.jsx";
import { useAuthStore } from "../../store/authStore";
import { useLanguage } from "../../hooks/useLanguage";
import { dashboardApi } from "../../services/api";
import { USE_MOCK } from "../../services/api";
import { progressData, skillRadar, weeklyActivity, recentEssays, homeworkList } from "../../data/mockData";

const tooltipStyle = {
  background: "#141A2A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12, color: "#fff",
};

function useDashboard() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(!USE_MOCK);

  useEffect(() => {
    if (USE_MOCK) return;
    let cancelled = false;
    (async () => {
      try {
        const [stats, bandProg, skills, weekly, hw, recent] = await Promise.all([
          dashboardApi.stats(),
          dashboardApi.bandProgress({ days: 180 }),
          dashboardApi.skills(),
          dashboardApi.weeklyActivity(),
          dashboardApi.homework({ limit: 5 }),
          dashboardApi.recentSubmissions({ limit: 5 }),
        ]);
        if (!cancelled) setData({ stats, bandProg, skills, weekly, hw, recent });
      } catch (e) {
        console.error("Dashboard load error:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return { data, loading };
}

export default function StudentOverview() {
  const user = useAuthStore((s) => s.user);
  const { t } = useLanguage();
  const { data, loading } = useDashboard();

  // --- Data resolvers ---
  const stats = data?.stats || {};
  const bandData = USE_MOCK
    ? progressData
    : (data?.bandProg?.data || []).map((d) => ({ month: d.date?.slice(5), band: d.overall_band }));

  const radarData = USE_MOCK
    ? skillRadar
    : data?.skills
    ? [
        { skill: "Grammar",    score: ((data.skills.grammar    || 0) / 9) * 100 },
        { skill: "Vocabulary", score: ((data.skills.vocabulary || 0) / 9) * 100 },
        { skill: "Coherence",  score: ((data.skills.coherence  || 0) / 9) * 100 },
        { skill: "Task",       score: ((data.skills.task       || 0) / 9) * 100 },
      ]
    : [];

  const weeklyData = USE_MOCK
    ? weeklyActivity
    : (data?.weekly?.days || []).map((d) => ({ day: d.day, essays: d.essays, tests: d.mock_tests }));

  const hwList = USE_MOCK ? homeworkList.filter((h) => h.status !== "done") : (data?.hw || []);
  const essayList = USE_MOCK
    ? recentEssays
    : (data?.recent || []).map((e) => ({
        id: e.id, title: e.topic,
        band: e.overall_band, date: new Date(e.created_at).toLocaleDateString("uz"),
        status: e.status === "completed" ? "checked" : "pending", words: e.word_count,
      }));

  const targetBand = data?.bandProg?.summary?.target_band;
  const bandDataWithTarget = bandData.map((d) => ({ ...d, target: targetBand ? parseFloat(targetBand) : undefined }));

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
      </div>
    );
  }

  const pending = hwList.filter((h) => h.status === "pending" || h.status === "overdue" || !h.is_done);

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
        <StatCard icon={Trophy} label={t("pages.student.overview.currentBand")}
          value={stats.current_band ?? "6.5"}
          change={stats.current_band_delta != null ? (stats.current_band_delta >= 0 ? `+${stats.current_band_delta}` : `${stats.current_band_delta}`) : "+1.0"}
          trend="up" accent="primary" delay={0} />
        <StatCard icon={PenLine} label={t("pages.student.overview.essaysChecked")}
          value={stats.total_submissions ?? "24"}
          change={stats.submissions_delta != null ? `+${stats.submissions_delta}` : "+3"}
          trend="up" accent="secondary" delay={0.05} />
        <StatCard icon={Flame} label={t("pages.student.overview.dayStreak")}
          value={stats.daily_streak ?? "12"}
          change={stats.streak_delta != null ? `+${stats.streak_delta}` : "+1"}
          trend="up" accent="primary" delay={0.1} />
        <StatCard icon={FileText} label={t("pages.student.overview.testsTaken")}
          value={stats.total_mock_tests ?? "0"}
          change={stats.mock_tests_delta != null ? `+${stats.mock_tests_delta}` : "0"}
          trend="up" accent="secondary" delay={0.15} />
      </div>

      {/* charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
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
            <AreaChart data={bandDataWithTarget}>
              <defs>
                <linearGradient id="bandG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis domain={[4, 9]} stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="band" stroke="#8B5CF6" strokeWidth={2.5} fill="url(#bandG)" />
              {targetBand && <Line type="monotone" dataKey="target" stroke="#06B6D4" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />}
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="glass rounded-2xl p-5">
          <h3 className="font-medium text-white mb-1">{t("pages.student.overview.skillBreakdown")}</h3>
          <p className="text-xs text-white/40 mb-2">{t("pages.student.overview.strengthsGaps")}</p>
          <ResponsiveContainer width="100%" height={230}>
            <RadarChart data={radarData} outerRadius="72%">
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="skill" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }} />
              <Radar dataKey="score" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.35} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* bottom row */}
      <div className="grid lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 glass rounded-2xl p-5">
          <h3 className="font-medium text-white mb-4">{t("pages.student.overview.weeklyActivity")}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="essays" stackId="a" fill="#7C3AED" />
              <Bar dataKey="tests"  stackId="a" fill="#06B6D4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

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
                <div className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                  (h.status === "overdue" || h.is_overdue) ? "bg-rose-500/15 text-rose-400" : "bg-primary-500/15 text-primary-400"
                }`}>
                  <Clock className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm text-white">{h.title}</div>
                  <div className="text-[11px] text-white/40">{t("pages.student.overview.due")} {h.due || h.due_label}</div>
                </div>
                {(h.status === "overdue" || h.is_overdue) && <Badge color="red">{t("pages.student.overview.late")}</Badge>}
              </div>
            ))}
            {pending.length === 0 && (
              <div className="flex items-center gap-2 text-sm text-white/40">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Barcha vazifalar bajarilgan!
              </div>
            )}
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
          {essayList.map((e) => (
            <div key={e.id} className="flex items-center gap-4 rounded-xl px-3 py-3 hover:bg-white/[0.03] transition-colors">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary-500/10 text-primary-400">
                <PenLine className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm text-white">{e.title}</div>
                <div className="text-[11px] text-white/40">{e.words} {t("pages.student.overview.words", "words")} · {e.date}</div>
              </div>
              {(e.status === "pending" || e.status === "processing") ? (
                <Badge color="amber"><Clock className="h-3 w-3" /> {t("pages.student.overview.checking")}</Badge>
              ) : e.band != null ? (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm font-semibold text-emerald-400">{e.band}</span>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
