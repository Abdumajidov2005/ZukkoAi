import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Clock, ListChecks, ArrowRight, ArrowLeft, CheckCircle2,
  XCircle, RotateCcw, Trophy, Play,
} from "lucide-react";
import { SectionHeading, Badge, ProgressBar } from "../../components/ui/index.jsx";
import { Panel, IconTile } from "../../components/dashboard/shared.jsx";
import { tests, sampleQuiz } from "../../data/mockData";

const difficultyColor = { Easy: "green", Medium: "amber", Hard: "red" };

export default function StudentTests() {
  const [running, setRunning] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);

  const quiz = sampleQuiz;
  const q = quiz.questions[current];
  const progress = ((current + 1) / quiz.questions.length) * 100;

  function start() {
    setRunning(true);
    setCurrent(0);
    setAnswers({});
    setFinished(false);
  }
  function pick(idx) {
    setAnswers((a) => ({ ...a, [current]: idx }));
  }
  function next() {
    if (current < quiz.questions.length - 1) setCurrent((c) => c + 1);
    else setFinished(true);
  }
  function reset() {
    setRunning(false);
    setFinished(false);
    setAnswers({});
    setCurrent(0);
  }

  const score = quiz.questions.reduce((acc, qq, i) => acc + (answers[i] === qq.answer ? 1 : 0), 0);
  const pct = Math.round((score / quiz.questions.length) * 100);
  const estBand = (4 + (score / quiz.questions.length) * 4).toFixed(1);

  // ---------- Result screen ----------
  if (running && finished) {
    return (
      <div className="mx-auto max-w-3xl">
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-3xl p-8 text-center">
          <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-primary-600 to-secondary-500 shadow-glow">
            <Trophy className="h-9 w-9 text-white" />
          </div>
          <h2 className="font-display text-3xl font-semibold text-white">Test Complete!</h2>
          <p className="mt-1 text-white/50">{quiz.title}</p>

          <div className="mx-auto mt-7 grid max-w-md grid-cols-3 gap-4">
            <div className="glass rounded-2xl p-4">
              <div className="text-3xl font-semibold gradient-text">{score}/{quiz.questions.length}</div>
              <div className="mt-1 text-xs text-white/40">Correct</div>
            </div>
            <div className="glass rounded-2xl p-4">
              <div className="text-3xl font-semibold text-white">{pct}%</div>
              <div className="mt-1 text-xs text-white/40">Accuracy</div>
            </div>
            <div className="glass rounded-2xl p-4">
              <div className="text-3xl font-semibold text-secondary-400">{estBand}</div>
              <div className="mt-1 text-xs text-white/40">Est. Band</div>
            </div>
          </div>

          {/* review */}
          <div className="mt-7 space-y-2 text-left">
            {quiz.questions.map((qq, i) => {
              const ok = answers[i] === qq.answer;
              return (
                <div key={i} className="flex items-start gap-3 rounded-xl bg-white/[0.03] p-3">
                  {ok ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                    : <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />}
                  <div className="min-w-0">
                    <p className="text-sm text-white/80">{qq.q}</p>
                    {!ok && (
                      <p className="mt-1 text-xs text-emerald-400/80">
                        Correct: {qq.options[qq.answer]}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-7 flex justify-center gap-3">
            <button onClick={start} className="btn-primary text-sm"><RotateCcw className="h-4 w-4" /> Retry</button>
            <button onClick={reset} className="btn-ghost text-sm">Back to tests</button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ---------- Quiz runner ----------
  if (running) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold text-white">{quiz.title}</h2>
            <p className="text-sm text-white/40">Question {current + 1} of {quiz.questions.length}</p>
          </div>
          <button onClick={reset} className="btn-ghost text-sm">Exit</button>
        </div>
        <ProgressBar value={progress} />

        <AnimatePresence mode="wait">
          <motion.div key={current}
            initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
            className="glass mt-5 rounded-2xl p-6">
            <h3 className="text-lg font-medium text-white">{q.q}</h3>
            <div className="mt-5 space-y-3">
              {q.options.map((opt, idx) => {
                const selected = answers[current] === idx;
                return (
                  <button key={idx} onClick={() => pick(idx)}
                    className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left text-sm transition-all ${
                      selected
                        ? "border-primary-500/60 bg-primary-500/10 text-white"
                        : "border-white/[0.06] bg-white/[0.02] text-white/70 hover:border-white/15 hover:bg-white/[0.04]"
                    }`}>
                    <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border text-xs font-medium ${
                      selected ? "border-primary-400 bg-primary-500 text-white" : "border-white/20 text-white/40"
                    }`}>{String.fromCharCode(65 + idx)}</span>
                    {opt}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-5 flex items-center justify-between">
          <button onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0}
            className="btn-ghost text-sm disabled:opacity-30">
            <ArrowLeft className="h-4 w-4" /> Previous
          </button>
          <button onClick={next} disabled={answers[current] == null} className="btn-primary text-sm disabled:opacity-40">
            {current === quiz.questions.length - 1 ? "Finish" : "Next"} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // ---------- Test library ----------
  return (
    <div className="space-y-7">
      <SectionHeading title="IELTS Tests" subtitle="Practice tests graded instantly by AI." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Tests Available", value: tests.length, icon: FileText, accent: "primary" },
          { label: "Completed", value: 18, icon: CheckCircle2, accent: "secondary" },
          { label: "Avg Score", value: "74%", icon: ListChecks, accent: "primary" },
          { label: "Best Band", value: "7.0", icon: Trophy, accent: "secondary" },
        ].map((s, i) => (
          <Panel key={s.label} delay={i * 0.05} className="!p-4">
            <div className="flex items-center gap-3">
              <IconTile icon={s.icon} accent={s.accent} />
              <div>
                <div className="text-xl font-semibold text-white">{s.value}</div>
                <div className="text-xs text-white/40">{s.label}</div>
              </div>
            </div>
          </Panel>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tests.map((t, i) => (
          <motion.div key={t.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass group rounded-2xl p-5 transition-colors hover:border-primary-500/40">
            <div className="flex items-start justify-between">
              <IconTile icon={FileText} accent={t.color === "secondary" ? "secondary" : "primary"} size="lg" />
              <Badge color={difficultyColor[t.difficulty]}>{t.difficulty}</Badge>
            </div>
            <h3 className="mt-4 font-medium text-white">{t.title}</h3>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/40">
              <span className="flex items-center gap-1"><ListChecks className="h-3.5 w-3.5" /> {t.questions} Q</span>
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {t.duration} min</span>
              <span>{t.taken} taken</span>
            </div>
            <button onClick={start}
              className="btn-primary mt-5 w-full justify-center text-sm opacity-90 group-hover:opacity-100">
              <Play className="h-4 w-4" /> Start Test
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
