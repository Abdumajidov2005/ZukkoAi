import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarCheck, Check, X, Minus, Users } from "lucide-react";
import { SectionHeading, Badge, ProgressBar } from "../../components/ui/index.jsx";
import { Panel, IconTile } from "../../components/dashboard/shared.jsx";
import { teacherStudents } from "../../data/mockData";

const days = ["Mon", "Wed", "Fri"];
const states = ["present", "absent", "late"];
const stateMeta = {
  present: { icon: Check, cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  absent: { icon: X, cls: "bg-rose-500/15 text-rose-400 border-rose-500/30" },
  late: { icon: Minus, cls: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
};

// seed an attendance grid deterministically
function seed() {
  const grid = {};
  teacherStudents.forEach((s, si) => {
    grid[s.id] = days.map((_, di) => states[(si + di) % 3]);
  });
  return grid;
}

export default function TeacherAttendance() {
  const [grid, setGrid] = useState(seed);

  function cycle(sid, di) {
    setGrid((g) => {
      const row = [...g[sid]];
      const next = states[(states.indexOf(row[di]) + 1) % 3];
      row[di] = next;
      return { ...g, [sid]: row };
    });
  }

  const totalCells = teacherStudents.length * days.length;
  const presentCount = Object.values(grid).flat().filter((v) => v === "present").length;
  const rate = Math.round((presentCount / totalCells) * 100);

  return (
    <div className="space-y-7">
      <SectionHeading title="Attendance" subtitle="Mark and track weekly attendance. Tap a cell to change."
        action={<Badge color="green"><CalendarCheck className="h-3 w-3" /> This week</Badge>} />

      <div className="grid grid-cols-3 gap-4">
        <Panel className="!p-4" delay={0}>
          <div className="flex items-center gap-3">
            <IconTile icon={Users} accent="primary" />
            <div><div className="text-xl font-semibold text-white">{teacherStudents.length}</div><div className="text-xs text-white/40">Students</div></div>
          </div>
        </Panel>
        <Panel className="!p-4" delay={0.05}>
          <div className="flex items-center gap-3">
            <IconTile icon={Check} accent="green" />
            <div><div className="text-xl font-semibold text-white">{rate}%</div><div className="text-xs text-white/40">Attendance Rate</div></div>
          </div>
        </Panel>
        <Panel className="!p-4" delay={0.1}>
          <div className="flex items-center gap-3">
            <IconTile icon={CalendarCheck} accent="secondary" />
            <div><div className="text-xl font-semibold text-white">{days.length}</div><div className="text-xs text-white/40">Sessions</div></div>
          </div>
        </Panel>
      </div>

      <Panel delay={0.15}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-xs uppercase tracking-wide text-white/40">
                <th className="px-3 py-3 text-left font-medium">Student</th>
                {days.map((d) => <th key={d} className="px-3 py-3 text-center font-medium">{d}</th>)}
                <th className="px-3 py-3 text-right font-medium">Rate</th>
              </tr>
            </thead>
            <tbody>
              {teacherStudents.map((s, i) => {
                const row = grid[s.id];
                const present = row.filter((v) => v === "present").length;
                const pct = Math.round((present / days.length) * 100);
                return (
                  <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                    className="border-b border-white/[0.04]">
                    <td className="px-3 py-3">
                      <div className="font-medium text-white">{s.name}</div>
                      <div className="text-xs text-white/40">{s.group}</div>
                    </td>
                    {row.map((st, di) => {
                      const M = stateMeta[st];
                      const SIcon = M.icon;
                      return (
                        <td key={di} className="px-3 py-3 text-center">
                          <button onClick={() => cycle(s.id, di)}
                            className={`mx-auto grid h-9 w-9 place-items-center rounded-lg border transition-all ${M.cls}`}>
                            <SIcon className="h-4 w-4" />
                          </button>
                        </td>
                      );
                    })}
                    <td className="px-3 py-3">
                      <div className="ml-auto w-24">
                        <div className="mb-1 text-right text-xs text-white/50">{pct}%</div>
                        <ProgressBar value={pct} color={pct >= 80 ? "green" : pct >= 50 ? "amber" : "red"} />
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex gap-4 text-xs text-white/40">
          <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-400" /> Present</span>
          <span className="flex items-center gap-1.5"><Minus className="h-3.5 w-3.5 text-amber-400" /> Late</span>
          <span className="flex items-center gap-1.5"><X className="h-3.5 w-3.5 text-rose-400" /> Absent</span>
        </div>
      </Panel>
    </div>
  );
}
