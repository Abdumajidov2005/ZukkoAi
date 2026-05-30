import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileCheck2, CheckCircle2, Sparkles, Send, PenLine, ChevronRight, Loader2 } from "lucide-react";
import { SectionHeading, Badge, Avatar } from "../../components/ui/index.jsx";
import { Panel, EmptyState } from "../../components/dashboard/shared.jsx";
import { writingApi } from "../../services/api";
import { USE_MOCK } from "../../services/api";
import { teacherEssays } from "../../data/mockData";
import { useLanguage } from "../../hooks/useLanguage";

const statusMeta = {
  "needs-review":    { color: "amber",  tKey: "pages.teacher.essays.needsReview" },
  "pending_review":  { color: "amber",  tKey: "pages.teacher.essays.needsReview" },
  reviewed:          { color: "green",  tKey: "pages.teacher.essays.reviewed" },
};

function useSubmissions(tab) {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(!USE_MOCK);

  useEffect(() => {
    if (USE_MOCK) {
      const mockTab = tab === "pending_review" ? "needs-review" : tab;
      setItems(teacherEssays.filter((e) => tab === "all" || e.status === mockTab));
      return;
    }
    setLoading(true);
    writingApi.teacherSubmissions({ tab, page_size: 50 })
      .then((r) => setItems(r.results || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [tab]);

  return { items, loading };
}

export default function TeacherEssays() {
  const { t } = useLanguage();
  const [tab, setTab]           = useState("pending_review");
  const [selected, setSelected] = useState(null);
  const [detail, setDetail]     = useState(null);
  const [feedback, setFeedback] = useState("");
  const [sending, setSending]   = useState(false);
  const { items, loading }      = useSubmissions(tab);

  const selectItem = async (e) => {
    setSelected(e);
    setFeedback("");
    if (!USE_MOCK) {
      try {
        const d = await writingApi.teacherSubmission(e.id);
        setDetail(d);
        setFeedback(d.teacher_feedback?.comment || "");
      } catch (err) { console.error(err); }
    }
  };

  const sendFeedback = async (action) => {
    if (!feedback.trim() || !selected) return;
    if (USE_MOCK) { setFeedback(""); setSelected(null); return; }
    setSending(true);
    try {
      await writingApi.teacherFeedback(selected.id, { comment: feedback, action });
      setSelected(null);
      setFeedback("");
    } catch (err) { alert(err.message); }
    finally { setSending(false); }
  };

  // Normalize item for both mock and real
  const normalize = (e) => USE_MOCK ? {
    id: e.id,
    student: e.student,
    avatar: e.student.split(" ").map((n) => n[0]).join(""),
    title: e.title,
    status: e.status,
    words: e.words,
    date: e.submitted,
    band: e.band,
  } : {
    id: e.id,
    student: e.student?.full_name || e.student?.username || "—",
    avatar: (e.student?.full_name || "??").split(" ").map((n) => n[0]).join(""),
    title: e.prompt_title || e.free_topic || "—",
    status: e.teacher_reviewed ? "reviewed" : "pending_review",
    words: e.word_count,
    date: new Date(e.created_at).toLocaleDateString("uz"),
    band: e.overall_band,
  };

  const list = items.map(normalize);
  const detailFb = detail?.feedback || {};

  return (
    <div className="space-y-7">
      <SectionHeading title={t("pages.teacher.essays.title")} subtitle={t("pages.teacher.essays.subtitle")}
        action={<Badge color="secondary"><Sparkles className="h-3 w-3" /> {t("pages.teacher.essays.aiAssisted")}</Badge>} />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="mb-3 flex gap-2">
            {["pending_review", "reviewed", "all"].map((tabId) => {
              const label = { pending_review: t("pages.teacher.essays.needsReview"), reviewed: t("pages.teacher.essays.reviewed"), all: t("pages.teacher.essays.all") }[tabId];
              return (
                <button key={tabId} onClick={() => { setTab(tabId); setSelected(null); setDetail(null); }}
                  className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                    tab === tabId ? "bg-primary-500/20 text-primary-300 border border-primary-500/30" : "text-white/50 border border-transparent hover:text-white/80"
                  }`}>{label}</button>
              );
            })}
          </div>
          <div className="space-y-2">
            {loading ? (
              <div className="flex h-32 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary-400" /></div>
            ) : list.length === 0 ? (
              <Panel><EmptyState icon={CheckCircle2} title={t("pages.teacher.essays.allCaughtUp")} subtitle={t("pages.teacher.essays.noEssays")} /></Panel>
            ) : list.map((e, i) => (
              <motion.button key={e.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }} onClick={() => selectItem(items[i])}
                className={`glass w-full rounded-2xl p-4 text-left transition-all ${
                  selected?.id === (items[i]?.id ?? e.id) ? "border-primary-500/60 shadow-glow" : "hover:border-primary-500/30"
                }`}>
                <div className="flex items-center gap-3">
                  <Avatar initials={e.avatar} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-white">{e.student}</div>
                    <div className="truncate text-xs text-white/40">{e.title}</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-white/30" />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <Badge color={(statusMeta[e.status] || statusMeta["reviewed"]).color}>
                    {t((statusMeta[e.status] || statusMeta["reviewed"]).tKey)}
                  </Badge>
                  <span className="text-xs text-white/40">{e.words} {t("pages.teacher.essays.words")} · {e.date}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {!selected ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="glass grid h-full min-h-80 place-items-center rounded-2xl p-8">
                <EmptyState icon={FileCheck2} title={t("pages.teacher.essays.selectEssay")} subtitle={t("pages.teacher.essays.pickEssay")} />
              </motion.div>
            ) : (
              <motion.div key={selected.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="glass rounded-2xl p-6 space-y-5">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-white">{normalize(selected).title}</h3>
                    <p className="text-xs text-white/40 mt-0.5">{normalize(selected).student} · {normalize(selected).words} so'z</p>
                  </div>
                  {normalize(selected).band != null && (
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary-500/10 text-primary-400">
                      <span className="text-lg font-bold">{normalize(selected).band}</span>
                    </div>
                  )}
                </div>

                {/* Essay text */}
                {!USE_MOCK && detail && (
                  <div>
                    <p className="text-xs text-white/40 mb-2">Insho matni</p>
                    <div className="max-h-40 overflow-y-auto rounded-xl bg-white/[0.03] p-4 text-sm text-white/80 leading-relaxed">{detail.essay_text}</div>
                  </div>
                )}

                {/* AI Feedback scores */}
                {!USE_MOCK && detail?.feedback && (
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Task Achievement",    score: detailFb.task_achievement },
                      { label: "Coherence & Cohesion",score: detailFb.coherence_cohesion },
                      { label: "Lexical Resource",    score: detailFb.lexical_resource },
                      { label: "Grammatical Range",   score: detailFb.grammatical_range },
                    ].map((c) => (
                      <div key={c.label} className="rounded-xl bg-white/[0.03] p-3">
                        <div className="text-xs text-white/50">{c.label}</div>
                        <div className="text-xl font-semibold text-white mt-0.5">{c.score ?? "—"}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Teacher feedback */}
                <div>
                  <label className="text-xs text-white/50 mb-2 block">O'qituvchi izohi</label>
                  <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={4}
                    placeholder="O'quvchiga izoh yozing..."
                    className="w-full rounded-xl bg-white/5 border border-white/10 p-4 text-sm text-white placeholder:text-white/30 outline-none focus:border-primary-500/40 resize-none" />
                </div>

                <div className="flex gap-3">
                  <button onClick={() => sendFeedback("draft")} disabled={sending || !feedback.trim()}
                    className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-white/60 hover:text-white disabled:opacity-40 transition-colors">
                    {sending ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Qoralama saqlash"}
                  </button>
                  <button onClick={() => sendFeedback("send")} disabled={sending || !feedback.trim()}
                    className="btn-primary flex-1 disabled:opacity-40">
                    {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4" /> Yuborish</>}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
