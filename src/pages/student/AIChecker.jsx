import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PenLine, Wand2, Loader2, CheckCircle2, AlertTriangle, BookOpen,
  Sparkles, ArrowRight, RotateCcw, Copy, FileText,
} from "lucide-react";
import { SectionHeading, Badge } from "../../components/ui/index.jsx";
import { useAIChecker } from "../../hooks/useAIChecker";
import { useLanguage } from "../../hooks/useLanguage";

const SAMPLE = `In modern society, technology have become an essential part of our daily life. Many people uses smartphones, computers and the internet for work, study and communication. While some argue that technology makes our life more complex, I believe the advantages are bigger than the disadvantages.

Firstly, technology improve communication. People can talk with friends and family in other countries easily. This is a good thing for relationships. Also, students can find a lot of information online which help them to study better.

However, there are some problems. People depend of technology too much and sometimes they forget how to do simple things. In conclusion, although technology has some negative effects, it brings more benefits to the society.`;

const PROMPTS = [
  "Some people think technology makes life more complex. Do you agree or disagree?",
  "Discuss the advantages and disadvantages of remote work.",
  "Some believe governments should fund the arts over sports.",
];

function ScoreRing({ band }) {
  const pct = (band / 9) * 100;
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative grid place-items-center">
      <svg width="140" height="140" className="-rotate-90">
        <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
        <motion.circle
          cx="70" cy="70" r={r} fill="none" stroke="url(#ring)" strokeWidth="10" strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (c * pct) / 100 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <div className="text-3xl font-bold text-white">{band}</div>
        <div className="text-[10px] uppercase tracking-wider text-white/40">Band</div>
      </div>
    </div>
  );
}

export default function AIChecker() {
  const [text, setText] = useState("");
  const [prompt, setPrompt] = useState(PROMPTS[0]);
  const { check, reset, loading, stage, stages, result } = useAIChecker();
  const { t } = useLanguage();

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  const handleCheck = () => {
    if (wordCount < 20) return;
    check(text);
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        title={t("pages.student.aiChecker.title")}
        subtitle={t("pages.student.aiChecker.subtitle")}
        action={<Badge color="primary" size="md"><Sparkles className="h-3 w-3" /> Powered by GPT-4o</Badge>}
      />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* INPUT */}
        <div className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <label className="text-xs text-white/50">{t("pages.student.aiChecker.prompt")}</label>
            <select
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="mt-1.5 w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm text-white outline-none focus:border-primary-500/40"
            >
              {PROMPTS.map((p) => <option key={p} value={p} className="bg-bg-card">{p}</option>)}
            </select>
          </div>

          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-white/50">{t("pages.student.aiChecker.yourEssay")}</label>
              <button onClick={() => setText(SAMPLE)} className="text-[11px] text-primary-400 hover:text-primary-300 flex items-center gap-1">
                <FileText className="h-3 w-3" /> {t("pages.student.aiChecker.loadSample")}
              </button>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t("pages.student.aiChecker.placeholder")}
              rows={14}
              className="w-full rounded-xl bg-white/5 border border-white/10 p-4 text-sm leading-relaxed text-white placeholder:text-white/30 outline-none focus:border-primary-500/40 transition-colors resize-none"
            />
            <div className="mt-3 flex items-center justify-between">
              <span className={`text-xs ${wordCount < 150 ? "text-amber-400" : "text-emerald-400"}`}>
                {wordCount} {t("pages.student.aiChecker.words")} {wordCount < 150 && "· 250+"}
              </span>
              <div className="flex gap-2">
                {result && (
                  <button onClick={() => { reset(); setText(""); }} className="btn-ghost !py-2 !px-4 text-sm">
                    <RotateCcw className="h-4 w-4" /> Reset
                  </button>
                )}
                <button onClick={handleCheck} disabled={loading || wordCount < 20} className="btn-primary !py-2 !px-5 text-sm disabled:opacity-50">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                  {loading ? t("pages.student.aiChecker.analyzing") : t("pages.student.aiChecker.checkEssay")}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* OUTPUT */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="glass rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px]">
                <div className="relative">
                  <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-500 shadow-glow">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <span className="absolute inset-0 rounded-2xl bg-primary-500/40 animate-ping" />
                </div>
                <div className="mt-6 space-y-2 w-full max-w-xs">
                  {stages.map((s, i) => (
                    <div key={s} className={`flex items-center gap-2.5 text-sm transition-colors ${
                      i < stage ? "text-emerald-400" : i === stage ? "text-white" : "text-white/30"
                    }`}>
                      {i < stage ? <CheckCircle2 className="h-4 w-4" /> :
                       i === stage ? <Loader2 className="h-4 w-4 animate-spin" /> :
                       <div className="h-4 w-4 rounded-full border border-white/20" />}
                      {s}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {!loading && !result && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="glass rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/5">
                  <PenLine className="h-8 w-8 text-white/30" />
                </div>
                <h3 className="mt-5 font-medium text-white">{t("pages.student.aiChecker.emptyTitle")}</h3>
                <p className="mt-2 max-w-xs text-sm text-white/40">{t("pages.student.aiChecker.emptyDesc")}</p>
              </motion.div>
            )}

            {!loading && result && <ResultPanel key="result" result={result} />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ResultPanel({ result }) {
  const { t } = useLanguage();
  const [tab, setTab] = useState("feedback");
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      {/* score header */}
      <div className="gradient-border rounded-2xl p-5 shadow-glow">
        <div className="flex items-center gap-5">
          <ScoreRing band={result.band} />
          <div className="flex-1">
            <Badge color="green"><CheckCircle2 className="h-3 w-3" /> Analysis complete</Badge>
            <div className="mt-2 text-sm text-white/60">{result.stats.words} {t("pages.student.aiChecker.words")} · {result.stats.sentences}</div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {result.criteria.map((c) => (
                <div key={c.name} className="rounded-lg bg-white/[0.03] px-2.5 py-2">
                  <div className="text-[10px] text-white/40 truncate">{c.name}</div>
                  <div className="text-sm font-semibold text-white">{c.score.toFixed(1)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* tabs */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="flex border-b border-white/5">
          {[
            { id: "feedback", label: t("pages.student.aiChecker.feedback"), icon: Sparkles },
            { id: "grammar", label: t("pages.student.aiChecker.grammar"), icon: AlertTriangle },
            { id: "vocab", label: t("pages.student.aiChecker.vocabulary"), icon: BookOpen },
            { id: "improved", label: t("pages.student.aiChecker.modelAnswer"), icon: Wand2 },
          ].map((tb) => (
            <button key={tb.id} onClick={() => setTab(tb.id)}
              className={`flex flex-1 items-center justify-center gap-1.5 px-2 py-3 text-xs font-medium transition-colors ${
                tab === tb.id ? "bg-primary-500/10 text-primary-400 border-b-2 border-primary-500" : "text-white/40 hover:text-white/70"
              }`}>
              <tb.icon className="h-3.5 w-3.5" /> {tb.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {tab === "feedback" && (
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-white/75">{result.feedback}</p>
              <div className="space-y-2.5">
                {result.criteria.map((c) => (
                  <div key={c.name}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/70">{c.name}</span>
                      <span className="text-primary-400 font-semibold">{c.score.toFixed(1)}</span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-white/40">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "grammar" && (
            <div className="space-y-3">
              {result.grammarIssues.map((g, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  className="rounded-xl bg-white/[0.03] p-3.5">
                  <Badge color="amber">{g.type}</Badge>
                  <div className="mt-2 flex items-center gap-2 text-sm flex-wrap">
                    <span className="line-through text-rose-400/80">{g.original}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-white/30" />
                    <span className="text-emerald-400 font-medium">{g.fix}</span>
                  </div>
                  <p className="mt-1.5 text-[11px] text-white/40">{g.note}</p>
                </motion.div>
              ))}
            </div>
          )}

          {tab === "vocab" && (
            <div className="space-y-3">
              {result.vocabSuggestions.map((v, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  className="rounded-xl bg-white/[0.03] p-3.5">
                  <div className="flex items-center gap-2 text-sm flex-wrap">
                    <span className="rounded-md bg-rose-500/10 px-2 py-0.5 text-rose-400">{v.weak}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-white/30" />
                    <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-emerald-400 font-medium">{v.strong}</span>
                  </div>
                  <p className="mt-1.5 text-[11px] text-white/40">{v.reason}</p>
                </motion.div>
              ))}
            </div>
          )}

          {tab === "improved" && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <Badge color="secondary"><Wand2 className="h-3 w-3" /> AI Model Answer</Badge>
                <button className="text-[11px] text-white/40 hover:text-white flex items-center gap-1">
                  <Copy className="h-3 w-3" /> Copy
                </button>
              </div>
              <p className="text-sm leading-relaxed text-white/70 italic">{result.improved}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
