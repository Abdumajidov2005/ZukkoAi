import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Loader2 } from "lucide-react";

const CANNED = [
  "Great question! In IELTS Writing Task 2, a strong introduction paraphrases the prompt and states your position clearly. Try: 'It is often argued that…' followed by your stance.",
  "To boost your Lexical Resource band, swap common words for topic-specific ones — e.g. 'good' → 'beneficial', 'big problem' → 'significant challenge'. Aim for precision, not just big words.",
  "For coherence, link ideas with varied connectors: 'consequently', 'in contrast', 'moreover'. Avoid starting every sentence with 'And' or 'But'.",
  "Speaking fluency improves with the PPF technique: Point, Pause, Flow. Give your point, take a tiny breath, then expand naturally without filler words.",
];

const SUGGESTIONS = [
  "How do I improve my Task 2 introduction?",
  "Give me harder vocabulary for 'environment'",
  "Check my coherence",
];

export default function AITutor({ open, onClose }) {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi! I'm your ZUKKO AI Tutor 👋 Ask me anything about IELTS, grammar, vocabulary or your essays." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = (text) => {
    const content = (text ?? input).trim();
    if (!content) return;
    setMessages((m) => [...m, { role: "user", text: content }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = CANNED[Math.floor(Math.random() * CANNED.length)];
      setMessages((m) => [...m, { role: "ai", text: reply }]);
      setTyping(false);
    }, 1100);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm sm:hidden"
          />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ type: "spring", damping: 26, stiffness: 280 }}
            className="fixed bottom-4 right-4 z-50 flex h-[560px] w-[calc(100vw-2rem)] sm:w-96 flex-col rounded-3xl glass-strong shadow-glow overflow-hidden"
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-white/5 px-4 py-3.5 bg-gradient-to-r from-primary-600/20 to-secondary-500/10">
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary-600 to-secondary-500 shadow-glow">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">AI Tutor</div>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online · GPT-4o
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-white/50 hover:bg-white/5 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* messages */}
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm ${m.role === "user"
                    ? "bg-gradient-to-r from-primary-600 to-primary-500 text-white"
                    : "glass text-white/85"
                    }`}>
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="glass rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((d) => (
                        <motion.span
                          key={d}
                          className="h-1.5 w-1.5 rounded-full bg-primary-400"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: d * 0.2 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* suggestions */}
            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-2 px-4 pb-2">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => send(s)} className="rounded-full glass px-3 py-1.5 text-[11px] text-white/60 hover:text-white hover:border-primary-500/40 transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* input */}
            <div className="border-t border-white/5 p-3">
              <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5 focus-within:border-primary-500/40 transition-colors">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="Ask your tutor…"
                  className="flex-1 bg-transparent py-1.5 text-sm text-white placeholder:text-white/30 outline-none"
                />
                <button onClick={() => send()} disabled={!input.trim()} className="grid h-8 w-8 place-items-center rounded-lg bg-primary-600 text-white disabled:opacity-40 hover:bg-primary-500 transition-colors">
                  {typing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
