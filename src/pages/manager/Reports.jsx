import { motion } from "framer-motion";
import {
  LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { FileBarChart, Download, FileText, Calendar, TrendingUp, DollarSign, Users } from "lucide-react";
import { SectionHeading, Badge } from "../../components/ui/index.jsx";
import { Panel, IconTile, tooltipStyle } from "../../components/dashboard/shared.jsx";
import { revenueData } from "../../data/mockData";
import { useLanguage } from "../../hooks/useLanguage";

const reports = [
  { id: "r1", name: "Monthly Revenue Report", period: "May 2026", type: "Finance", icon: DollarSign, accent: "primary", size: "2.4 MB" },
  { id: "r2", name: "Student Enrollment Summary", period: "Q2 2026", type: "Enrollment", icon: Users, accent: "secondary", size: "1.1 MB" },
  { id: "r3", name: "Teacher Performance Review", period: "May 2026", type: "Staff", icon: TrendingUp, accent: "primary", size: "890 KB" },
  { id: "r4", name: "Course Completion Rates", period: "Q2 2026", type: "Academic", icon: FileText, accent: "secondary", size: "1.6 MB" },
  { id: "r5", name: "Attendance Overview", period: "May 2026", type: "Operations", icon: Calendar, accent: "primary", size: "740 KB" },
];

export default function ManagerReports() {
  const { t } = useLanguage();
  return (
    <div className="space-y-7">
      <SectionHeading title={t("pages.manager.reports.title")} subtitle={t("pages.manager.reports.subtitle")}
        action={<button className="btn-primary text-sm"><FileBarChart className="h-4 w-4" /> {t("pages.manager.reports.generateNew")}</button>} />

      <Panel title={t("pages.manager.reports.revenueTrend")} subtitle={t("pages.manager.reports.usedInReport")} delay={0.05}>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={2.5} dot={{ r: 3, fill: "#8B5CF6" }} />
          </LineChart>
        </ResponsiveContainer>
      </Panel>

      <Panel title={t("pages.manager.reports.availableReports")} delay={0.1}>
        <div className="space-y-2">
          {reports.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-white/[0.03]">
              <IconTile icon={r.icon} accent={r.accent} size="lg" />
              <div className="min-w-0 flex-1">
                <div className="font-medium text-white">{r.name}</div>
                <div className="mt-0.5 flex items-center gap-3 text-xs text-white/40">
                  <span>{r.period}</span>
                  <Badge color="gray">{r.type}</Badge>
                  <span>{r.size}</span>
                </div>
              </div>
              <button className="btn-ghost !py-2 text-sm"><Download className="h-4 w-4" /> {t("common.download")}</button>
            </motion.div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
