import { useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardList, PenLine, BookOpen, Headphones, Mic, Clock, CheckCircle2, AlertCircle, User,
} from "lucide-react";
import { SectionHeading, Badge } from "../../components/ui/index.jsx";
import { Panel, IconTile, EmptyState } from "../../components/dashboard/shared.jsx";
import { homeworkList } from "../../data/mockData";

const typeIcon = { writing: PenLine, reading: BookOpen, listening: Headphones, vocabulary: BookOpen, speaking: Mic };
const statusMeta = {
  pending: { color: "amber", label: "Pending", icon: Clock },
  overdue: { color: "red", label: "Overdue", icon: AlertCircle },
  done: { color: "green", label: "Completed", icon: CheckCircle2 },
};
const filters = ["all", "pending", "overdue", "done"];

export default function StudentHomework() {
  const [filter, setFilter] = useState("all");
  const list = homeworkList.filter((h) => filter === "all" || h.status === filter);
  const counts = {
    pending: homeworkList.filter((h) => h.status === "pending").length,
    overdue: homeworkList.filter((h) => h.status === "overdue").length,
    done: homeworkList.filter((h) => h.status === "done").length,
  };

  return (
    <div className="space-y-7">
      <SectionHeading title="Homework" subtitle="Assignments from your teacher." />

      <div className="grid grid-cols-3 gap-4">
        <Panel className="!p-4" delay={0}>
          <div className="flex items-center gap-3">
            <IconTile icon={Clock} accent="amber" />
            <div><div className="text-xl font-semibold text-white">{counts.pending}</div><div className="text-xs text-white/40">Pending</div></div>
          </div>
        </Panel>
        <Panel className="!p-4" delay={0.05}>
          <div className="flex items-center gap-3">
            <IconTile icon={AlertCircle} accent="red" />
            <div><div className="text-xl font-semibold text-white">{counts.overdue}</div><div className="text-xs text-white/40">Overdue</div></div>
          </div>
        </Panel>
        <Panel className="!p-4" delay={0.1}>
          <div className="flex items-center gap-3">
            <IconTile icon={CheckCircle2} accent="green" />
            <div><div className="text-xl font-semibold text-white">{counts.done}</div><div className="text-xs text-white/40">Completed</div></div>
          </div>
        </Panel>
      </div>

      <div className="flex gap-2">
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm capitalize transition-colors ${
              filter === f ? "bg-primary-500/20 text-primary-300 border border-primary-500/30" : "text-white/50 hover:text-white/80 border border-transparent"
            }`}>{f}</button>
        ))}
      </div>

      <div className="space-y-3">
        {list.length === 0 ? (
          <Panel><EmptyState icon={ClipboardList} title="Nothing here" subtitle="No homework in this category." /></Panel>
        ) : (
          list.map((h, i) => {
            const TIcon = typeIcon[h.type] || ClipboardList;
            const meta = statusMeta[h.status];
            const SIcon = meta.icon;
            return (
              <motion.div key={h.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass flex items-center gap-4 rounded-2xl p-4 hover:border-primary-500/30 transition-colors">
                <IconTile icon={TIcon} accent={h.status === "overdue" ? "red" : h.status === "done" ? "green" : "primary"} size="lg" />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium text-white">{h.title}</div>
                  <div className="mt-0.5 flex items-center gap-3 text-xs text-white/40">
                    <span className="flex items-center gap-1"><User className="h-3 w-3" /> {h.teacher}</span>
                    <span className="capitalize">{h.type}</span>
                  </div>
                </div>
                <div className="text-right">
                  <Badge color={meta.color}><SIcon className="h-3 w-3" /> {meta.label}</Badge>
                  <div className="mt-1 text-xs text-white/40">{h.due}</div>
                </div>
                {h.status !== "done" && (
                  <button className="btn-primary !py-2 text-sm">Start</button>
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
