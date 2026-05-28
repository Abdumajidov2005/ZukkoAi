import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic, Lock, Square, Sparkles, Clock, Volume2, CheckCircle2,
} from "lucide-react";
import { SectionHeading, Badge } from "../../components/ui/index.jsx";
import { IconTile } from "../../components/dashboard/shared.jsx";
import { speakingTasks } from "../../data/mockData";
import { useLanguage } from "../../hooks/useLanguage";

export default function StudentSpeaking() {
  const { t } = useLanguage();
  const [active, setActive] = useState(null);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [result, setResult] = useState(null);
  const timer = useRef(null);

  useEffect(() => () => clearInterval(timer.current), []);

  function open(task) {
    if (task.status === "locked") return;
    setActive(task);
    setRecording(false);
    setSeconds(0);
    setResult(null);
  }
  function toggleRec() {
    if (recording) {
      clearInterval(timer.current);
      setRecording(false);
      // simulate AI evaluation
      setResult({
        band: 6.5,
        fluency: 70, pronunciation: 75, lexical: 65, grammar: 68,
        tip: "Good pace and clear pronunciation. Try using more complex linking phrases like 'on the other hand' and reduce filler words.",
      });
    } else {
      setRecording(true);
      setResult(null);
      setSeconds(0);
      timer.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
  }
  const mmss = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <div className="space-y-7">
      <SectionHeading
        title={t("pages.student.speaking.title")}
        subtitle={t("pages.student.speaking.subtitle")}
        action={<Badge color="secondary"><Sparkles className="h-3 w-3" /> {t("pages.student.speaking.aiEval")}</Badge>}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* task list */}
        <div className="space-y-4 lg:col-span-1">
          {speakingTasks.map((task, i) => (
            <motion.button key={task.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }} onClick={() => open(task)}
              disabled={task.status === "locked"}
              className={`glass w-full rounded-2xl p-5 text-left transition-all ${
                active?.id === task.id ? "border-primary-500/60 shadow-glow" : ""
              } ${task.status === "locked" ? "cursor-not-allowed opacity-50" : "hover:border-primary-500/40"}`}>
              <div className="flex items-start justify-between">
                <IconTile icon={task.status === "locked" ? Lock : Mic} accent={task.status === "locked" ? "amber" : "primary"} size="lg" />
                <Badge color="gray">{task.part}</Badge>
              </div>
              <h3 className="mt-3 font-medium text-white">{task.title}</h3>
              <div className="mt-1 flex items-center gap-1 text-xs text-white/40">
                <Clock className="h-3 w-3" /> {task.duration}
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {task.topics.map((tp) => <Badge key={tp} color="secondary">{tp}</Badge>)}
              </div>
            </motion.button>
          ))}
        </div>

        {/* recorder panel */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {!active ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="glass grid h-full min-h-80 place-items-center rounded-2xl p-8 text-center">
                <div>
                  <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-primary-500/10 text-primary-400">
                    <Mic className="h-7 w-7" />
                  </div>
                  <p className="text-white/70">{t("pages.student.speaking.selectTask")}</p>
                  <p className="mt-1 text-sm text-white/40">{t("pages.student.speaking.willScore")}</p>
                </div>
              </motion.div>
            ) : (
              <motion.div key={active.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Badge color="primary">{active.part}</Badge>
                    <h3 className="mt-2 font-display text-xl font-semibold text-white">{active.title}</h3>
                  </div>
                  <button className="btn-ghost text-sm"><Volume2 className="h-4 w-4" /> {t("pages.student.speaking.listen")}</button>
                </div>

                <div className="mt-4 rounded-xl bg-white/[0.03] p-4 text-sm text-white/70">
                  <p className="font-medium text-white/90">{t("pages.student.speaking.question")}</p>
                  <p className="mt-1">Describe {active.topics[0].toLowerCase()} that is important to you. You should say what it is, why it matters, and how it affects your daily life.</p>
                </div>

                {/* recorder */}
                <div className="mt-6 flex flex-col items-center">
                  <button onClick={toggleRec}
                    className={`relative grid h-24 w-24 place-items-center rounded-full transition-all ${
                      recording ? "bg-rose-500/20 text-rose-400" : "bg-gradient-to-br from-primary-600 to-secondary-500 text-white shadow-glow"
                    }`}>
                    {recording ? <Square className="h-8 w-8" /> : <Mic className="h-9 w-9" />}
                    {recording && <span className="absolute inset-0 animate-ping rounded-full bg-rose-500/30" />}
                  </button>
                  <p className="mt-4 font-mono text-2xl text-white">{mmss}</p>
                  <p className="text-xs text-white/40">{recording ? t("pages.student.speaking.recording") : result ? t("pages.student.speaking.analyzed") : t("pages.student.speaking.tapStart")}</p>
                </div>

                {/* AI result */}
                <AnimatePresence>
                  {result && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                      className="mt-6 rounded-2xl border border-primary-500/20 bg-primary-500/[0.04] p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-medium text-white">
                          <Sparkles className="h-4 w-4 text-secondary-400" /> {t("pages.student.speaking.aiEval")}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-semibold gradient-text">{result.band}</div>
                          <div className="text-[11px] text-white/40">{t("pages.student.tests.estBand")}</div>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {[[t("pages.student.speaking.fluency"), result.fluency], [t("pages.student.speaking.pronunciation"), result.pronunciation], [t("pages.student.speaking.lexical"), result.lexical], [t("pages.student.speaking.grammar"), result.grammar]].map(([k, v]) => (
                          <div key={k} className="rounded-xl bg-white/[0.03] p-3 text-center">
                            <div className="text-lg font-semibold text-white">{v}</div>
                            <div className="text-[11px] text-white/40">{k}</div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex items-start gap-2 text-sm text-white/70">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                        <p>{result.tip}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
