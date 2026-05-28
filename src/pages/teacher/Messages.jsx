import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Search, Circle } from "lucide-react";
import { SectionHeading, Avatar, Badge } from "../../components/ui/index.jsx";
import { teacherStudents } from "../../data/mockData";
import { useLanguage } from "../../hooks/useLanguage";

const seedThreads = {
  ts1: [
    { from: "them", text: "Hello teacher, I submitted my essay. Could you check the conclusion?", time: "10:24" },
    { from: "me", text: "Sure Aziza, I'll review it today. Your introduction was much stronger this time!", time: "10:31" },
    { from: "them", text: "Thank you so much! 😊", time: "10:32" },
  ],
  ts2: [{ from: "them", text: "When is the next mock test?", time: "Yesterday" }],
  ts3: [{ from: "me", text: "Great progress on your speaking, Nilufar.", time: "2d ago" }],
};

export default function TeacherMessages() {
  const { t } = useLanguage();
  const [activeId, setActiveId] = useState("ts1");
  const [threads, setThreads] = useState(seedThreads);
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");

  const contacts = teacherStudents.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()));
  const active = teacherStudents.find((s) => s.id === activeId);
  const msgs = threads[activeId] || [];

  function send() {
    if (!draft.trim()) return;
    setThreads((t) => ({ ...t, [activeId]: [...(t[activeId] || []), { from: "me", text: draft, time: "now" }] }));
    setDraft("");
  }

  return (
    <div className="space-y-7">
      <SectionHeading title={t("pages.teacher.messages.title")} subtitle={t("pages.teacher.messages.subtitle")} />

      <div className="glass grid h-[32rem] grid-cols-1 overflow-hidden rounded-2xl md:grid-cols-3">
        {/* contacts */}
        <div className="border-r border-white/[0.06] md:col-span-1">
          <div className="border-b border-white/[0.06] p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("common.search")}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/30 focus:border-primary-500/50 focus:outline-none" />
            </div>
          </div>
          <div className="max-h-[26rem] overflow-y-auto">
            {contacts.map((c) => {
              const last = (threads[c.id] || [])[(threads[c.id] || []).length - 1];
              return (
                <button key={c.id} onClick={() => setActiveId(c.id)}
                  className={`flex w-full items-center gap-3 border-b border-white/[0.04] p-3 text-left transition-colors ${
                    activeId === c.id ? "bg-primary-500/10" : "hover:bg-white/[0.03]"
                  }`}>
                  <div className="relative">
                    <Avatar initials={c.avatar} size="sm" />
                    {c.status === "active" && <Circle className="absolute -bottom-0.5 -right-0.5 h-3 w-3 fill-emerald-400 text-emerald-400" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-white">{c.name}</div>
                    <div className="truncate text-xs text-white/40">{last?.text || t("pages.teacher.messages.noMessages")}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* chat */}
        <div className="flex flex-col md:col-span-2">
          {active && (
            <div className="flex items-center gap-3 border-b border-white/[0.06] p-4">
              <Avatar initials={active.avatar} size="sm" />
              <div>
                <div className="text-sm font-medium text-white">{active.name}</div>
                <div className="text-xs text-white/40">{active.group}</div>
              </div>
              <Badge color="green" >{t("pages.teacher.messages.online")}</Badge>
            </div>
          )}
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {msgs.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                  m.from === "me" ? "bg-gradient-to-br from-primary-600 to-primary-500 text-white" : "glass text-white/80"
                }`}>
                  <p>{m.text}</p>
                  <p className={`mt-1 text-[10px] ${m.from === "me" ? "text-white/60" : "text-white/30"}`}>{m.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex items-center gap-2 border-t border-white/[0.06] p-3">
            <input value={draft} onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()} placeholder={t("pages.teacher.messages.typePlaceholder")}
              className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-primary-500/50 focus:outline-none" />
            <button onClick={send} className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary-600 to-secondary-500 text-white">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
