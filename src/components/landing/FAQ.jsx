import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Minus, Sparkles, ArrowRight, Mail, MapPin, Send } from "lucide-react";
import { faqs } from "../../data/mockData";

export function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm text-white/70">
            <Sparkles className="h-3.5 w-3.5 text-secondary-400" /> Questions
          </span>
          <h2 className="mt-6 font-display text-4xl md:text-5xl font-semibold tracking-tight text-white">
            Frequently <span className="gradient-text">asked</span>
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`glass rounded-2xl overflow-hidden transition-colors ${isOpen ? "border-primary-500/40" : ""}`}
              >
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-medium text-white">{f.q}</span>
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full glass">
                    {isOpen ? <Minus className="h-4 w-4 text-primary-400" /> : <Plus className="h-4 w-4 text-white/60" />}
                  </span>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="px-6 pb-5 text-sm leading-relaxed text-white/55">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="gradient-border rounded-3xl p-8 md:p-14 shadow-glow overflow-hidden relative">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary-600/20 blur-3xl" />
          <div className="grid lg:grid-cols-2 gap-10 items-center relative">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-white text-balance">
                Ready to reach your <span className="gradient-text">target band?</span>
              </h2>
              <p className="mt-4 text-white/55">
                Join thousands of learners and dozens of schools already using ZUKKO AI.
                Have a question? Send us a message.
              </p>
              <div className="mt-8 space-y-3 text-sm text-white/60">
                <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-primary-400" /> hello@zukko.ai</div>
                <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-secondary-400" /> Tashkent, Uzbekistan</div>
              </div>
            </div>

            <div className="glass-strong rounded-2xl p-6">
              {sent ? (
                <div className="text-center py-10">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-500/20 text-emerald-400">
                    <Send className="h-6 w-6" />
                  </div>
                  <p className="mt-4 font-medium text-white">Message sent!</p>
                  <p className="text-sm text-white/50">We'll get back to you within 24h.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Field label="Full name" placeholder="Aziza Karimova" />
                  <Field label="Email" placeholder="you@email.com" type="email" />
                  <div>
                    <label className="text-xs text-white/50">Message</label>
                    <textarea
                      rows={3}
                      placeholder="How can we help?"
                      className="mt-1.5 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-primary-500/50 transition-colors resize-none"
                    />
                  </div>
                  <button onClick={() => setSent(true)} className="btn-primary w-full">
                    Send message <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, type = "text", placeholder }) {
  return (
    <div>
      <label className="text-xs text-white/50">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-primary-500/50 transition-colors"
      />
    </div>
  );
}

export function Footer() {
  const navigate = useNavigate();
  const cols = [
    { title: "Product", links: ["Features", "Pricing", "AI Checker", "Dashboard"] },
    { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
    { title: "Resources", links: ["IELTS Guide", "Help Center", "Community", "API Docs"] },
  ];
  return (
    <footer className="relative border-t border-white/5 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid md:grid-cols-5 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary-600 to-secondary-500 shadow-glow">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="font-display text-lg font-semibold text-white">ZUKKO<span className="gradient-text"> AI</span></span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-white/45">
              The AI-powered English learning platform for serious learners and the schools that teach them.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <div className="text-sm font-medium text-white">{c.title}</div>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l}>
                    <button
                      onClick={() => navigate("/register")}
                      className="text-sm text-white/45 hover:text-white transition-colors"
                    >
                      {l}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5 pt-6 text-xs text-white/40">
          <span>© 2026 ZUKKO AI. All rights reserved.</span>
          <div className="flex gap-6">
            <span className="hover:text-white/70 cursor-pointer">Privacy</span>
            <span className="hover:text-white/70 cursor-pointer">Terms</span>
            <span className="hover:text-white/70 cursor-pointer">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
