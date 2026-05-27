import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from "recharts";
import { DollarSign, Users, TrendingUp, GraduationCap } from "lucide-react";
import { SectionHeading, StatCard, Badge } from "../../components/ui/index.jsx";
import { Panel, tooltipStyle } from "../../components/dashboard/shared.jsx";
import { revenueData, courseDistribution, teacherPerformance } from "../../data/mockData";

export default function ManagerAnalytics() {
  const totalRevenue = revenueData.reduce((a, r) => a + r.revenue, 0);
  const latestStudents = revenueData[revenueData.length - 1].students;

  return (
    <div className="space-y-7">
      <SectionHeading title="Analytics" subtitle="Business performance at a glance."
        action={<Badge color="green"><TrendingUp className="h-3 w-3" /> Growing</Badge>} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={DollarSign} label="Total Revenue" value={`$${(totalRevenue / 1000).toFixed(0)}K`} change="+14%" accent="primary" delay={0} />
        <StatCard icon={Users} label="Active Students" value={latestStudents} change="+28" accent="secondary" delay={0.05} />
        <StatCard icon={GraduationCap} label="Teachers" value="14" change="+2" accent="primary" delay={0.1} />
        <StatCard icon={TrendingUp} label="Avg Band Lift" value="+1.4" change="+0.2" accent="secondary" delay={0.15} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Revenue & Students" subtitle="Last 6 months" className="lg:col-span-2" delay={0.1}>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="stu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis yAxisId="l" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis yAxisId="r" orientation="right" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area yAxisId="l" type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={2.5} fill="url(#rev)" name="Revenue ($)" />
              <Area yAxisId="r" type="monotone" dataKey="students" stroke="#06B6D4" strokeWidth={2} fill="url(#stu)" name="Students" />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Course Mix" subtitle="Enrollment by course" delay={0.15}>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={courseDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%"
                innerRadius={55} outerRadius={85} paddingAngle={3} stroke="none">
                {courseDistribution.map((c) => <Cell key={c.name} fill={c.color} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1.5">
            {courseDistribution.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-white/60">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />{c.name}
                </span>
                <span className="text-white/40">{c.value}%</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Teacher Performance" subtitle="Students taught vs average band" delay={0.2}>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={teacherPerformance} barGap={6}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="students" fill="#7C3AED" radius={[6, 6, 0, 0]} name="Students" />
            <Bar dataKey="rating" fill="#06B6D4" radius={[6, 6, 0, 0]} name="Rating" />
          </BarChart>
        </ResponsiveContainer>
      </Panel>
    </div>
  );
}
