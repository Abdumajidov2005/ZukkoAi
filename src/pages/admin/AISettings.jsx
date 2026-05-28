import { useState } from "react";
import { motion } from "framer-motion";
import { Cpu, Sparkles, Zap, Save, Brain, Gauge } from "lucide-react";
import { SectionHeading, Badge } from "../../components/ui/index.jsx";
import { Panel, IconTile } from "../../components/dashboard/shared.jsx";
import { useLanguage } from "../../hooks/useLanguage";

function Slider({ label, value, onChange, min = 0, max = 100, suffix = "" }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-white/70">{label}</span>
        <span className="font-medium text-primary-400">{value}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-primary-500" />
    </div>
  );
}

function Toggle({ on, onClick }) {
  return (
    <button onClick={onClick} className={`relative h-6 w-11 rounded-full transition-colors ${on ? "bg-primary-500" : "bg-white/15"}`}>
      <motion.span layout className="absolute top-0.5 h-5 w-5 rounded-full bg-white" animate={{ left: on ? 22 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }} />
    </button>
  );
}

const models = [
  { id: "gpt4o", name: "GPT-4o", desc: "Best accuracy for essay grading", active: true },
  { id: "gpt4omini", name: "GPT-4o-mini", desc: "Fast & cheap fallback", active: false },
  { id: "whisper", name: "Whisper", desc: "Speech-to-text for speaking", active: true },
];

export default function AdminAISettings() {
  const { t } = useLanguage();
  const [model, setModel] = useState("gpt4o");
  const [temp, setTemp] = useState(30);
  const [strictness, setStrictness] = useState(70);
  const [autoGrade, setAutoGrade] = useState(true);
  const [speakingEval, setSpeakingEval] = useState(true);
  const [tutorChat, setTutorChat] = useState(true);

  return (
    <div className="space-y-7">
      <SectionHeading title={t("pages.admin.aiSettings.title")} subtitle={t("pages.admin.aiSettings.subtitle")}
        action={<Badge color="secondary"><Sparkles className="h-3 w-3" /> {t("pages.admin.aiSettings.aiEngine")}</Badge>} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title={t("pages.admin.aiSettings.activeModels")} subtitle={t("pages.admin.aiSettings.selectModels")} delay={0.05}>
          <div className="space-y-3">
            {models.map((m) => (
              <button key={m.id} onClick={() => setModel(m.id)}
                className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                  model === m.id ? "border-primary-500/60 bg-primary-500/10" : "border-white/[0.06] bg-white/[0.02] hover:border-white/15"
                }`}>
                <IconTile icon={Brain} accent={model === m.id ? "primary" : "secondary"} />
                <div className="flex-1">
                  <div className="font-medium text-white">{m.name}</div>
                  <div className="text-xs text-white/40">{m.desc}</div>
                </div>
                {m.active && <Badge color="green">{t("pages.admin.aiSettings.connected")}</Badge>}
              </button>
            ))}
          </div>
        </Panel>

        <Panel title={t("pages.admin.aiSettings.gradingParams")} subtitle={t("pages.admin.aiSettings.tuneBehavior")} delay={0.1}>
          <div className="space-y-6">
            <Slider label={t("pages.admin.aiSettings.temperature")} value={temp} onChange={setTemp} suffix="%" />
            <Slider label={t("pages.admin.aiSettings.strictness")} value={strictness} onChange={setStrictness} suffix="%" />
            <div className="rounded-xl bg-white/[0.03] p-4 text-xs text-white/50">
              <div className="flex items-center gap-2 text-white/70">
                <Gauge className="h-4 w-4 text-secondary-400" /> {t("pages.admin.aiSettings.currentProfile")}
              </div>
              <p className="mt-1.5">
                {strictness >= 70 ? t("pages.admin.aiSettings.strict") : strictness >= 40 ? t("pages.admin.aiSettings.balanced") : t("pages.admin.aiSettings.lenient")}
              </p>
            </div>
          </div>
        </Panel>
      </div>

      <Panel title={t("pages.admin.aiSettings.featureToggles")} delay={0.15}>
        <div className="divide-y divide-white/[0.06]">
          {[
            { label: t("pages.admin.aiSettings.autoGrade"), desc: t("pages.admin.aiSettings.autoGradeDesc"), on: autoGrade, set: setAutoGrade, icon: Zap },
            { label: t("pages.admin.aiSettings.speakingEval"), desc: t("pages.admin.aiSettings.speakingEvalDesc"), on: speakingEval, set: setSpeakingEval, icon: Cpu },
            { label: t("pages.admin.aiSettings.tutorChat"), desc: t("pages.admin.aiSettings.tutorChatDesc"), on: tutorChat, set: setTutorChat, icon: Sparkles },
          ].map((f) => (
            <div key={f.label} className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <IconTile icon={f.icon} accent="primary" size="sm" />
                <div><div className="text-sm font-medium text-white">{f.label}</div><div className="text-xs text-white/40">{f.desc}</div></div>
              </div>
              <Toggle on={f.on} onClick={() => f.set((v) => !v)} />
            </div>
          ))}
        </div>
        <div className="mt-5 flex justify-end">
          <button className="btn-primary text-sm"><Save className="h-4 w-4" /> {t("pages.admin.aiSettings.saveSettings")}</button>
        </div>
      </Panel>
    </div>
  );
}
