import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PenLine, Wand2, Loader2, CheckCircle2, AlertTriangle, BookOpen,
  Sparkles, ArrowRight, RotateCcw, Copy, FileText,
} from "lucide-react";
import { SectionHeading, Badge } from "../../components/ui/index.jsx";
import { useAIChecker } from "../../hooks/useAIChecker";
import { writingApi } from "../../services/api";
import { USE_MOCK } from "../../services/api";
import { useLanguage } from "../../hooks/useLanguage";

const SAMPLE = `In modern society, technology have become an essential part of our daily life. Many people uses smartphones, computers and the internet for work, study and communication. While some argue that technology makes our life more complex, I believe the advantages are bigger than the disadvantages.

Firstly, technology improve communication. People can talk with friends and family in other countries easily. This is a good thing for relationships. Also, students can find a lot of information online which help them to study better.

However, there are some problems. People depend of technology too much and sometimes they forget how to do simple things. In conclusion, although technology has some negative effects, it brings more benefits to the society.`;

const FALLBACK_PROMPTS = [
  { id: null, title: "Some people think technology makes life more complex. Do you agree or disagree?" },
  { id: null, title: "Discuss the advantages and disadvantages of remote work." },
  { id: null, title: "Some believe governments should fund the arts over sports." },
];

function ScoreRing({ band }) {
  const pct = (band / 9) * 100;
  const r = 52, c = 2 * Math.PI * r;
  return (
    <div className="relative grid place-items-center">
      <svg width="140" height="140" className="-rotate-90">
        <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
        <motion.circle cx="70" cy="70" r={r} fill="none" stroke="url(#ring)" strokeWidth="10" strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (c * pct) / 100 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#7C3AED" />
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
  const [text, setText]               = useState("");
  const [prompts, setPrompts]         = useState(FALLBACK_PROMPTS);
  const [selectedPrompt, setSelected] = useState(FALLBACK_PROMPTS[0]);
  const { check, reset, loading, stage, stages, result, error } = useAIChecker();
  const { t } = useLanguage();

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  // Backend dan promptlar olish
  useEffect(() => {
    if (USE_MOCK) return;
    writingApi.getPrompts({ task_type: "task2", page_size: 20 })
      .then((r) => {
        const list = r.results || [];
        if (list.length > 0) {
          const mapped = list.map((p) => ({ id: p.id, title: p.title }));
          setPrompts(mapped);
          setSelected(mapped[0]);
        }
      })
      .catch(() => {}); // fallback promptlar qoladi
  }, []);

  const handleCheck = () => {
    if (wordCount < 20) return;
    check(text, {
      promptId:  selectedPrompt?.id  || null,
      freeTopic: selectedPrompt?.id  ? null : selectedPrompt?.title,
    });
  };

  const copy = (txt) => navigator.clipboard?.writeText(txt).catch(() => {});

  return (
    <div className="space-y-6">
      <SectionHeading
        title={t("pages.student.aiChecker.title")}
        subtitle={t("pages.student.aiChecker.subtitle")}
        action={<Badge color="primary" size="md"><Sparkles className="h-3 w-3" /> Powered by AI</Badge>}
      />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* INPUT */}
        <div className="space-y-4">
          {/* Prompt tanlash */}
          <div className="glass rounded-2xl p-5">
            <label className="text-xs text-white/50">{t("pages.student.aiChecker.prompt")}</label>
            <select
              value={selectedPrompt?.id ?? selectedPrompt?.title ?? ""}
              onChange={(e) => {
                const found = prompts.find((p) => String(p.id ?? p.title) === e.target.value);
                if (found) setSelected(found);
              }}
              className="mt-1.5 w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm text-white outline-none focus:border-primary-500/40 bg-[#0D1117]"
            >
              {prompts.map((p) => (
                <option key={p.id ?? p.title} value={p.id ?? p.title} className="bg-[#0D1117]">
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          {/* Essay textarea */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-white/50">{t("pages.student.aiChecker.yourEssay")}</label>
              <button onClick={() => setText(SAMPLE)}
                className="text-[11px] text-primary-400 hover:text-primary-300 flex items-center gap-1">
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
            <div className="mt-2 flex items-center justify-between">
              <span className={`text-xs ${wordCount < 50 ? "text-rose-400" : "text-white/40"}`}>
                {wordCount} so'z {wordCount < 50 && "· kamida 50 so'z"}
              </span>
              {result && (
                <button onClick={reset} className="text-xs text-white/40 hover:text-white flex items-center gap-1">
                  <RotateCcw className="h-3 w-3" /> Qayta
                </button>
              )}
            </div>
          </div>

          <button
            onClick={handleCheck}
            disabled={loading || wordCount < 20}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> {stages[Math.max(0, stage)] || "Tekshirilmoqda…"}</>
            ) : (
              <><Wand2 className="h-4 w-4" /> {t("pages.student.aiChecker.checkButton")} <ArrowRight className="h-4 w-4" /></>
            )}
          </button>

          {/* Loading stages */}
          {loading && (
            <div className="glass rounded-2xl p-4">
              <div className="space-y-2">
                {stages.map((s, i) => (
                  <div key={s} className={`flex items-center gap-2 text-xs transition-colors ${
                    i < stage ? "text-emerald-400" : i === stage ? "text-primary-300" : "text-white/20"
                  }`}>
                    {i < stage  ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> :
                     i === stage ? <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" /> :
                                   <div className="h-3.5 w-3.5 rounded-full border border-white/20 shrink-0" />}
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="glass rounded-2xl p-4 border border-rose-500/20 bg-rose-500/5">
              <div className="flex items-center gap-2 text-rose-400">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}
        </div>

        {/* RESULT */}
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div key="result" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }} className="space-y-4">

              {/* Score ring */}
              <div className="glass rounded-2xl p-6 flex flex-col items-center gap-4">
                <ScoreRing band={result.band} />
                <p className="text-center text-sm text-white/60 max-w-xs">{result.feedback}</p>
              </div>

              {/* 4 criteria */}
              <div className="grid grid-cols-2 gap-3">
                {result.criteria.map((c) => (
                  <div key={c.name} className="glass rounded-2xl p-4">
                    <div className="text-xs text-white/40 mb-1">{c.name}</div>
                    <div className="text-2xl font-semibold text-white">{c.score ?? "—"}</div>
                    <div className="text-[11px] text-white/50 mt-1 line-clamp-2">{c.desc}</div>
                  </div>
                ))}
              </div>

              {/* Grammar errors */}
              {result.grammarIssues?.length > 0 && (
                <div className="glass rounded-2xl p-5">
                  <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-400" /> Grammatik xatolar
                  </h4>
                  <div className="space-y-2">
                    {result.grammarIssues.map((g, i) => (
                      <div key={i} className="rounded-xl bg-white/[0.03] p-3 text-sm">
                        <div className="flex gap-2">
                          <span className="text-rose-400 line-through">{g.original}</span>
                          <ArrowRight className="h-3.5 w-3.5 text-white/30 self-center shrink-0" />
                          <span className="text-emerald-400">{g.fix}</span>
                        </div>
                        <div className="text-xs text-white/40 mt-1">{g.note}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Vocab suggestions */}
              {result.vocabSuggestions?.length > 0 && (
                <div className="glass rounded-2xl p-5">
                  <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary-400" /> Lug'at tavsiyalari
                  </h4>
                  <div className="space-y-2">
                    {result.vocabSuggestions.map((v, i) => (
                      <div key={i} className="rounded-xl bg-white/[0.03] p-3 text-sm">
                        <div className="flex gap-2">
                          <span className="text-white/50">{v.weak}</span>
                          <ArrowRight className="h-3.5 w-3.5 text-white/30 self-center shrink-0" />
                          <span className="text-primary-300 font-medium">{v.strong}</span>
                        </div>
                        <div className="text-xs text-white/40 mt-1">{v.reason}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Improved essay */}
              {result.improved && (
                <div className="glass rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-white flex items-center gap-2">
                      <PenLine className="h-4 w-4 text-secondary-400" /> Namunaviy insho
                    </h4>
                    <button onClick={() => copy(result.improved)}
                      className="text-xs text-white/40 hover:text-white flex items-center gap-1">
                      <Copy className="h-3 w-3" /> Nusxalash
                    </button>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed">{result.improved}</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="glass rounded-2xl grid place-items-center min-h-80 p-8 text-center">
              <div>
                <Sparkles className="h-12 w-12 text-primary-400/40 mx-auto mb-4" />
                <p className="text-white/50 text-sm">{t("pages.student.aiChecker.placeholder")}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
