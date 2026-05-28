import {
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { BarChart3, Cpu, Zap, Activity, Server } from "lucide-react";
import { SectionHeading, StatCard, Badge } from "../../components/ui/index.jsx";
import { Panel, tooltipStyle, CHART_COLORS } from "../../components/dashboard/shared.jsx";
import { aiUsageData, revenueData } from "../../data/mockData";
import { useLanguage } from "../../hooks/useLanguage";

const apiCalls = [
  { day: "Mon", calls: 3200 }, { day: "Tue", calls: 4100 }, { day: "Wed", calls: 3800 },
  { day: "Thu", calls: 5200 }, { day: "Fri", calls: 6100 }, { day: "Sat", calls: 4400 }, { day: "Sun", calls: 2900 },
];

export default function AdminAnalytics() {
  const { t } = useLanguage();
  const totalAI = aiUsageData.reduce((a, d) => a + d.value, 0);

  return (
    <div className="space-y-7">
      <SectionHeading title={t("pages.admin.analytics.title")} subtitle={t("pages.admin.analytics.subtitle")}
        action={<Badge color="green"><Activity className="h-3 w-3" /> {t("pages.admin.analytics.operational")}</Badge>} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Cpu} label={t("pages.admin.analytics.aiRequests")} value={`${(totalAI / 1000).toFixed(1)}K`} change="+18%" accent="primary" delay={0} />
        <StatCard icon={Zap} label={t("pages.admin.analytics.avgLatency")} value="1.2s" change="-0.3s" trend="up" accent="secondary" delay={0.05} />
        <StatCard icon={Server} label={t("pages.admin.analytics.uptime")} value="99.9%" change="+0.1%" accent="primary" delay={0.1} />
        <StatCard icon={BarChart3} label={t("pages.admin.analytics.tokenSpend")} value="$842" change="+$96" trend="down" accent="secondary" delay={0.15} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title={t("pages.admin.analytics.apiCalls")} subtitle={t("pages.admin.analytics.thisWeek")} className="lg:col-span-2" delay={0.1}>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={apiCalls}>
              <defs>
                <linearGradient id="apiG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="calls" stroke="#8B5CF6" strokeWidth={2.5} fill="url(#apiG)" />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title={t("pages.admin.analytics.aiFeatureUsage")} subtitle={t("pages.admin.analytics.byFeature")} delay={0.15}>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={aiUsageData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3} stroke="none">
                {aiUsageData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1.5">
            {aiUsageData.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-white/60">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />{d.name}
                </span>
                <span className="text-white/40">{d.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title={t("pages.admin.analytics.platformGrowth")} subtitle={t("pages.admin.analytics.studentCount")} delay={0.2}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Bar dataKey="students" fill="#06B6D4" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Panel>
    </div>
  );
}
