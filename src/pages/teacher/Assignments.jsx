import { useState } from "react";
import { motion } from "framer-motion";
import { ClipboardList, Plus, Calendar, Users, CheckCircle2, PenLine, X } from "lucide-react";
import { SectionHeading, Badge, ProgressBar } from "../../components/ui/index.jsx";
import { IconTile } from "../../components/dashboard/shared.jsx";

const initial = [
  { id: "a1", title: "Writing Task 2 — Opinion Essay", group: "IELTS-A", due: "Tomorrow", submitted: 9, total: 14, type: "writing" },
  { id: "a2", title: "Cambridge Test 12 — Reading", group: "IELTS-B", due: "in 3 days", submitted: 4, total: 11, type: "reading" },
  { id: "a3", title: "Vocabulary Set: Environment", group: "IELTS-A", due: "in 5 days", submitted: 2, total: 14, type: "vocabulary" },
  { id: "a4", title: "Speaking Part 2 — Cue Cards", group: "General", due: "Completed", submitted: 18, total: 18, type: "speaking" },
];

export default function TeacherAssignments() {
  const [list, setList] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", group: "IELTS-A", due: "", type: "writing" });

  function create() {
    if (!form.title.trim()) return;
    setList((l) => [{ id: `a${Date.now()}`, ...form, due: form.due || "Next week", submitted: 0, total: 14 }, ...l]);
    setForm({ title: "", group: "IELTS-A", due: "", type: "writing" });
    setShowForm(false);
  }

  return (
    <div className="space-y-7">
      <SectionHeading title="Assignments" subtitle="Create and track homework across your groups."
        action={<button onClick={() => setShowForm((s) => !s)} className="btn-primary text-sm">
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{showForm ? "Cancel" : "New Assignment"}
        </button>} />

      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
          className="glass overflow-hidden rounded-2xl p-5">
          <h3 className="mb-4 font-medium text-white">Create Assignment</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs text-white/50">Title</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Writing Task 2 — Problem/Solution"
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-primary-500/50 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-white/50">Group</label>
              <select value={form.group} onChange={(e) => setForm({ ...form, group: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white focus:border-primary-500/50 focus:outline-none">
                {["IELTS-A", "IELTS-B", "General"].map((g) => <option key={g} className="bg-bg-card">{g}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-white/50">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white focus:border-primary-500/50 focus:outline-none">
                {["writing", "reading", "listening", "vocabulary", "speaking"].map((t) => <option key={t} className="bg-bg-card capitalize">{t}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button onClick={create} className="btn-primary text-sm">Create</button>
          </div>
        </motion.div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {list.map((a, i) => {
          const done = a.submitted === a.total;
          return (
            <motion.div key={a.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }} className="glass rounded-2xl p-5">
              <div className="flex items-start justify-between">
                <IconTile icon={done ? CheckCircle2 : PenLine} accent={done ? "green" : "primary"} size="lg" />
                <Badge color={done ? "green" : "secondary"}>{a.group}</Badge>
              </div>
              <h3 className="mt-4 font-medium text-white">{a.title}</h3>
              <div className="mt-2 flex items-center gap-3 text-xs text-white/40">
                <span className="flex items-center gap-1 capitalize"><ClipboardList className="h-3 w-3" /> {a.type}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {a.due}</span>
              </div>
              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-white/50"><Users className="h-3 w-3" /> Submissions</span>
                  <span className="text-white/70">{a.submitted}/{a.total}</span>
                </div>
                <ProgressBar value={a.submitted} max={a.total} color={done ? "green" : "primary"} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
