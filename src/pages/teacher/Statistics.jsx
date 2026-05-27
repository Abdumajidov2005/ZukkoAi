import {
  BarChart, Bar, AreaChart, Area, ResponsiveContainer,
  XAxis, YAxis, Tooltip, CartesianGrid, RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from "recharts";
import { BarChart3, TrendingUp, Users, FileCheck2, Award } from "lucide-react";
import { SectionHeading, StatCard, Badge } from "../../components/ui/index.jsx";
import { Panel, tooltipStyle } from "../../components/dashboard/shared.jsx";
import { teacherStudents, skillRadar } from "../../data/mockData";

const bandTrend = [
  { month: "Jan", classAvg: 5.8 }, { month: "Feb", classAvg: 6.0 },
  { month: "Mar", classAvg: 6.1 }, { month: "Apr", classAvg: 6.4 },
  { month: "May", classAvg: 6.6 }, { month: "Jun", classAvg: 6.8 },
];

export default function TeacherStatistics() {
  const bandDist = [5, 5.5, 6, 6.5, 7, 7.5].map((b) => ({
    band: b.toString(),
    count: teacherStudents.filter((s) => Math.round(s.band * 2) / 2 === b).length,
  }));

  return (
    <div className="space-y-7">
      <SectionHeading title="Statistics" subtitle="Class performance and engagement insights."
        action={<Badge color="green"><TrendingUp className="h-3 w-3" /> Improving</Badge>} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Users} label="Active Students" value="43" change="+5" accent="primary" delay={0} />
        <StatCard icon={Award} label="Class Avg Band" value="6.8" change="+0.4" accent="secondary" delay={0.05} />
        <StatCard icon={FileCheck2} label="Essays Graded" value="312" change="+28" accent="primary" delay={0.1} />
        <StatCard icon={BarChart3} label="Avg Attendance" value="89%" change="+2%" accent="secondary" delay={0.15} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Class Band Trend" subtitle="6-month average" className="lg:col-span-2" delay={0.1}>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={bandTrend}>
              <defs>
                <linearGradient id="tStat" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis domain={[5, 8]} stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="classAvg" stroke="#06B6D4" strokeWidth={2.5} fill="url(#tStat)" />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Skill Coverage" subtitle="Class average" delay={0.15}>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={skillRadar} outerRadius="70%">
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="skill" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }} />
              <Radar dataKey="score" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.35} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <Panel title="Band Distribution" subtitle="Students per band score" delay={0.2}>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={bandDist}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="band" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Bar dataKey="count" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Panel>
    </div>
  );
}
