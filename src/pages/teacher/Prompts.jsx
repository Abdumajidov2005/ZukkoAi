import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PenLine, Plus, X, Pencil, Trash2, Loader2, FileText, AlertTriangle,
  CheckCircle2, EyeOff, Eye,
} from "lucide-react";
import { SectionHeading, Badge } from "../../components/ui/index.jsx";
import { EmptyState } from "../../components/dashboard/shared.jsx";
import { writingApi, USE_MOCK } from "../../services/api";
import { useLanguage } from "../../hooks/useLanguage";

const EMPTY_FORM = {
  title: "",
  body: "",
  task_type: "task2",
  difficulty: "medium",
  is_active: true,
};

const diffColor = { easy: "green", medium: "amber", hard: "red" };

export default function TeacherPrompts() {
  const { t } = useLanguage();

  const [list, setList]       = useState([]);
  const [loading, setLoading] = useState(!USE_MOCK);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm]       = useState(EMPTY_FORM);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState(null);
  const [busyId, setBusyId]   = useState(null); // delete / toggle uchun

  const loadPrompts = useCallback(() => {
    if (USE_MOCK) return;
    setLoading(true);
    writingApi.getPrompts({ page_size: 50 })
      .then((r) => setList(r.results || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadPrompts(); }, [loadPrompts]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError(null);
    setShowForm(true);
  };

  const openEdit = async (item) => {
    setError(null);
    setEditingId(item.id);
    setShowForm(true);
    // body ro'yxatda yo'q — detaldan olamiz
    setForm({
      title: item.title || "",
      body: "",
      task_type: item.task_type || "task2",
      difficulty: item.difficulty || "medium",
      is_active: item.is_active ?? true,
    });
    try {
      const d = await writingApi.getPrompt(item.id);
      setForm({
        title: d.title || "",
        body: d.body || "",
        task_type: d.task_type || "task2",
        difficulty: d.difficulty || "medium",
        is_active: d.is_active ?? true,
      });
    } catch (e) { setError(e.message); }
  };

  const closeForm = () => { setShowForm(false); setEditingId(null); setForm(EMPTY_FORM); setError(null); };

  const save = async () => {
    if (!form.title.trim() || !form.body.trim()) {
      setError("Sarlavha va topshiriq matni majburiy.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (editingId) await writingApi.updatePrompt(editingId, form);
      else           await writingApi.createPrompt(form);
      closeForm();
      loadPrompts();
    } catch (e) {
      setError(e.message || "Saqlashda xatolik.");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (item) => {
    setBusyId(item.id);
    try {
      await writingApi.patchPrompt(item.id, { is_active: !item.is_active });
      loadPrompts();
    } catch (e) { setError(e.message); }
    finally { setBusyId(null); }
  };

  const remove = async (item) => {
    if (!window.confirm(`"${item.title}" mavzusini o'chirilsinmi?`)) return;
    setBusyId(item.id);
    try {
      await writingApi.deletePrompt(item.id);
      loadPrompts();
    } catch (e) { setError(e.message); }
    finally { setBusyId(null); }
  };

  if (USE_MOCK) {
    return (
      <div className="space-y-7">
        <SectionHeading title="Insho mavzulari" subtitle="O'quvchilar tanlaydigan IELTS writing topshiriqlari." />
        <div className="glass rounded-2xl p-6 text-center text-sm text-white/50">
          Bu sahifa haqiqiy backend bilan ishlaydi. <code className="text-white/70">VITE_USE_MOCK=false</code> qilib qo'ying.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <SectionHeading
        title="Insho mavzulari"
        subtitle="O'quvchilar AI tekshiruvida tanlaydigan IELTS writing topshiriqlari."
        action={
          <button onClick={() => (showForm ? closeForm() : openCreate())} className="btn-primary text-sm">
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? t("common.cancel") : "Yangi mavzu"}
          </button>
        }
      />

      {/* CREATE / EDIT FORM */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="glass overflow-hidden rounded-2xl p-5"
          >
            <h3 className="mb-4 font-medium text-white">
              {editingId ? "Mavzuni tahrirlash" : "Yangi mavzu qo'shish"}
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs text-white/50">Mavzu sarlavhasi *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="masalan: Some people think technology makes life more complex. Do you agree?"
                  maxLength={255}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-primary-500/50 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs text-white/50">Topshiriq matni *</label>
                <textarea
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  placeholder="To'liq topshiriq matni: vazifa shartlari, kamida 250 so'z yozish kerakligi va h.k."
                  rows={5}
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm leading-relaxed text-white placeholder:text-white/30 focus:border-primary-500/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs text-white/50">Task turi</label>
                <select
                  value={form.task_type}
                  onChange={(e) => setForm({ ...form, task_type: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white focus:border-primary-500/50 focus:outline-none bg-[#0D1117]"
                >
                  <option value="task2" className="bg-[#0D1117]">Task 2 — Insho</option>
                  <option value="task1" className="bg-[#0D1117]">Task 1 — Grafik/Xat</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs text-white/50">Qiyinlik</label>
                <select
                  value={form.difficulty}
                  onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white focus:border-primary-500/50 focus:outline-none bg-[#0D1117]"
                >
                  <option value="easy" className="bg-[#0D1117]">Oson</option>
                  <option value="medium" className="bg-[#0D1117]">O'rta</option>
                  <option value="hard" className="bg-[#0D1117]">Qiyin</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="flex cursor-pointer items-center gap-2.5 text-sm text-white/70">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="h-4 w-4 rounded border-white/20 bg-white/5 accent-primary-500"
                  />
                  Faol (o'quvchilarga ko'rinadi)
                </label>
              </div>
            </div>

            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/5 px-3 py-2.5 text-sm text-rose-400">
                <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
              </div>
            )}

            <div className="mt-4 flex justify-end gap-3">
              <button onClick={closeForm} className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/60 hover:text-white">
                {t("common.cancel")}
              </button>
              <button onClick={save} disabled={saving} className="btn-primary text-sm disabled:opacity-50">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                {editingId ? t("common.save") : t("common.create")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LIST */}
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary-400" />
        </div>
      ) : list.length === 0 ? (
        <div className="glass rounded-2xl p-8">
          <EmptyState icon={FileText} title="Hali mavzu yo'q" subtitle="“Yangi mavzu” tugmasi orqali birinchi topshiriqni qo'shing." />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className={`glass rounded-2xl p-5 ${p.is_active ? "" : "opacity-60"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-500/10 text-primary-400">
                  <PenLine className="h-5 w-5" />
                </div>
                <div className="flex flex-wrap items-center justify-end gap-1.5">
                  <Badge color="gray">{p.task_type === "task1" ? "Task 1" : "Task 2"}</Badge>
                  {p.difficulty && (
                    <Badge color={diffColor[p.difficulty] || "gray"}>{p.difficulty}</Badge>
                  )}
                  <Badge color={p.is_active ? "green" : "gray"}>
                    {p.is_active ? "Faol" : "Yashirin"}
                  </Badge>
                </div>
              </div>

              <h3 className="mt-3 line-clamp-3 text-sm font-medium leading-snug text-white">{p.title}</h3>

              <div className="mt-4 flex items-center gap-2 border-t border-white/5 pt-3">
                <button
                  onClick={() => toggleActive(p)}
                  disabled={busyId === p.id}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-white/50 hover:bg-white/5 hover:text-white disabled:opacity-40"
                >
                  {p.is_active ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  {p.is_active ? "Yashirish" : "Faollashtirish"}
                </button>
                <button
                  onClick={() => openEdit(p)}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-white/50 hover:bg-white/5 hover:text-white"
                >
                  <Pencil className="h-3.5 w-3.5" /> {t("common.edit")}
                </button>
                <button
                  onClick={() => remove(p)}
                  disabled={busyId === p.id}
                  className="ml-auto flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-rose-400/80 hover:bg-rose-500/10 hover:text-rose-400 disabled:opacity-40"
                >
                  {busyId === p.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                  {t("common.delete")}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
