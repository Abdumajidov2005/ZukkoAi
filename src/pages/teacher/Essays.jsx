import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileCheck2, CheckCircle2, Sparkles, Send, PenLine, ChevronRight,
} from "lucide-react";
import { SectionHeading, Badge, Avatar } from "../../components/ui/index.jsx";
import { Panel, EmptyState } from "../../components/dashboard/shared.jsx";
import { teacherEssays } from "../../data/mockData";

const statusMeta = {
  "needs-review": { color: "amber", label: "Needs review" },
  reviewed: { color: "green", label: "Reviewed" },
};

export default function TeacherEssays() {
  const [tab, setTab] = useState("needs-review");
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");

  const list = teacherEssays.filter((e) => tab === "all" || e.status === tab);

  return (
    <div className="space-y-7">
      <SectionHeading title="Essay Review" subtitle="AI pre-grades essays — you add the final touch."
        action={<Badge color="secondary"><Sparkles className="h-3 w-3" /> AI assisted</Badge>} />

      <div className="grid gap-6 lg:grid-cols-5">
        {/* queue */}
        <div className="lg:col-span-2">
          <div className="mb-3 flex gap-2">
            {["needs-review", "reviewed", "all"].map((t) => (
              <button key={t} onClick={() => { setTab(t); setSelected(null); }}
                className={`rounded-full px-3 py-1.5 text-xs capitalize transition-colors ${
                  tab === t ? "bg-primary-500/20 text-primary-300 border border-primary-500/30" : "text-white/50 border border-transparent hover:text-white/80"
                }`}>{t.replace("-", " ")}</button>
            ))}
          </div>
          <div className="space-y-2">
            {list.length === 0 ? (
              <Panel><EmptyState icon={CheckCircle2} title="All caught up" subtitle="No essays in this view." /></Panel>
            ) : list.map((e, i) => (
              <motion.button key={e.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }} onClick={() => setSelected(e)}
                className={`glass w-full rounded-2xl p-4 text-left transition-all ${
                  selected?.id === e.id ? "border-primary-500/60 shadow-glow" : "hover:border-primary-500/30"
                }`}>
                <div className="flex items-center gap-3">
                  <Avatar initials={e.student.split(" ").map((n) => n[0]).join("")} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-white">{e.student}</div>
                    <div className="truncate text-xs text-white/40">{e.title}</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-white/30" />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <Badge color={statusMeta[e.status].color}>{statusMeta[e.status].label}</Badge>
                  <span className="text-xs text-white/40">{e.words} words · {e.submitted}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* detail */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {!selected ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="glass grid h-full min-h-80 place-items-center rounded-2xl p-8">
                <EmptyState icon={FileCheck2} title="Select an essay" subtitle="Pick an essay from the queue to review." />
              </motion.div>
            ) : (
              <motion.div key={selected.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="glass rounded-2xl p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-white">{selected.title}</h3>
                    <p className="mt-1 text-sm text-white/40">{selected.student} · {selected.words} words</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs text-secondary-400"><Sparkles className="h-3 w-3" /> AI Band</div>
                    <div className="text-3xl font-semibold gradient-text">{selected.aiBand}</div>
                  </div>
                </div>

                <div className="mt-5 rounded-xl bg-white/[0.03] p-4 text-sm leading-relaxed text-white/60">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-white/40">Essay excerpt</p>
                  <p>In today's rapidly evolving world, technology has become an integral part of our daily lives. While some argue that it has made our existence more complicated, others believe it has brought significant convenience…</p>
                </div>

                <div className="mt-5 grid grid-cols-4 gap-2">
                  {["Task", "Coherence", "Lexical", "Grammar"].map((c, idx) => (
                    <div key={c} className="rounded-xl bg-white/[0.03] p-3 text-center">
                      <div className="text-lg font-semibold text-white">{[6.5, 6.0, 7.0, 6.5][idx]}</div>
                      <div className="text-[11px] text-white/40">{c}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-5">
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white">
                    <PenLine className="h-4 w-4 text-primary-400" /> Your feedback
                  </label>
                  <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={3}
                    placeholder="Add comments for the student…"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white placeholder:text-white/30 focus:border-primary-500/50 focus:outline-none resize-none" />
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <button className="btn-ghost text-sm">Save draft</button>
                  <button className="btn-primary text-sm"><Send className="h-4 w-4" /> Send feedback</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
