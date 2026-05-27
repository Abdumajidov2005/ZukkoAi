import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Check, RotateCw, ChevronLeft, ChevronRight, Sparkles, GraduationCap, Search,
} from "lucide-react";
import { SectionHeading, Badge, ProgressBar } from "../../components/ui/index.jsx";
import { Panel, IconTile } from "../../components/dashboard/shared.jsx";
import { vocabularyWords } from "../../data/mockData";

export default function StudentVocabulary() {
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [query, setQuery] = useState("");
  const [known, setKnown] = useState(() =>
    Object.fromEntries(vocabularyWords.map((w) => [w.word, w.learned]))
  );

  const learnedCount = Object.values(known).filter(Boolean).length;
  const card = vocabularyWords[cardIdx];

  function flip() { setFlipped((f) => !f); }
  function go(dir) {
    setFlipped(false);
    setCardIdx((i) => (i + dir + vocabularyWords.length) % vocabularyWords.length);
  }
  function markKnown() {
    setKnown((k) => ({ ...k, [card.word]: true }));
    go(1);
  }

  const filtered = vocabularyWords.filter((w) =>
    w.word.toLowerCase().includes(query.toLowerCase()) ||
    w.meaning.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-7">
      <SectionHeading
        title="Vocabulary Builder"
        subtitle="Master academic words with spaced-repetition flashcards."
        action={<Badge color="secondary"><Sparkles className="h-3 w-3" /> AI curated</Badge>}
      />

      {/* progress strip */}
      <div className="grid gap-4 md:grid-cols-3">
        <Panel className="!p-4 md:col-span-2" delay={0}>
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/70">Mastery progress</span>
            <span className="font-medium text-white">{learnedCount}/{vocabularyWords.length} words</span>
          </div>
          <div className="mt-3"><ProgressBar value={learnedCount} max={vocabularyWords.length} color="secondary" /></div>
        </Panel>
        <Panel className="!p-4" delay={0.05}>
          <div className="flex items-center gap-3">
            <IconTile icon={GraduationCap} accent="primary" />
            <div>
              <div className="text-xl font-semibold text-white">C1</div>
              <div className="text-xs text-white/40">Current level</div>
            </div>
          </div>
        </Panel>
      </div>

      {/* Flashcard */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="mb-3 text-sm font-medium text-white/60">Flashcards</h3>
          <div className="relative h-64 [perspective:1200px]">
            <motion.div
              onClick={flip}
              className="relative h-full w-full cursor-pointer [transform-style:preserve-3d]"
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* front */}
              <div className="glass absolute inset-0 grid place-items-center rounded-3xl p-6 text-center [backface-visibility:hidden]">
                <div>
                  <Badge color="primary">{card.level}</Badge>
                  <h2 className="mt-4 font-display text-4xl font-semibold gradient-text">{card.word}</h2>
                  <p className="mt-4 text-xs text-white/40">Tap to reveal meaning</p>
                </div>
              </div>
              {/* back */}
              <div className="glass-strong absolute inset-0 grid place-items-center rounded-3xl p-6 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <div>
                  <p className="text-lg font-medium text-white">{card.meaning}</p>
                  <p className="mt-3 text-sm italic text-white/50">"{card.example}"</p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button onClick={() => go(-1)} className="btn-ghost text-sm"><ChevronLeft className="h-4 w-4" /></button>
            <div className="flex gap-2">
              <button onClick={flip} className="btn-ghost text-sm"><RotateCw className="h-4 w-4" /> Flip</button>
              <button onClick={markKnown} className="btn-primary text-sm"><Check className="h-4 w-4" /> I know it</button>
            </div>
            <button onClick={() => go(1)} className="btn-ghost text-sm"><ChevronRight className="h-4 w-4" /></button>
          </div>
          <p className="mt-3 text-center text-xs text-white/30">{cardIdx + 1} / {vocabularyWords.length}</p>
        </div>

        {/* Word list */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium text-white/60">Word List</h3>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…"
                className="w-40 rounded-lg border border-white/10 bg-white/[0.03] py-1.5 pl-8 pr-2 text-xs text-white placeholder:text-white/30 focus:border-primary-500/50 focus:outline-none" />
            </div>
          </div>
          <div className="space-y-2">
            <AnimatePresence>
              {filtered.map((w, i) => (
                <motion.div key={w.word} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="glass flex items-center gap-3 rounded-xl p-3.5">
                  <IconTile icon={BookOpen} accent={known[w.word] ? "green" : "primary"} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{w.word}</span>
                      <Badge color="gray">{w.level}</Badge>
                    </div>
                    <div className="truncate text-xs text-white/40">{w.meaning}</div>
                  </div>
                  {known[w.word] && <Check className="h-4 w-4 text-emerald-400" />}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
