import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FolderKanban, Users, Calendar, Plus, ArrowRight, GraduationCap, Loader2, X } from "lucide-react";
import { SectionHeading, Badge, ProgressBar } from "../../components/ui/index.jsx";
import { Panel, IconTile } from "../../components/dashboard/shared.jsx";
import { groupsApi } from "../../services/api";
import { USE_MOCK } from "../../services/api";
import { teacherGroups } from "../../data/mockData";
import { useLanguage } from "../../hooks/useLanguage";

function useGroups() {
  const [groups, setGroups]   = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(!USE_MOCK);

  const load = async () => {
    if (USE_MOCK) { setGroups(teacherGroups); return; }
    try {
      const res = await groupsApi.getGroups();
      setGroups(res.results || []);
      setSummary(res.summary);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);
  return { groups, summary, loading, reload: load };
}

export default function TeacherGroups() {
  const { t } = useLanguage();
  const { groups, summary, loading, reload } = useGroups();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name_uz: "", level: "intermediate", max_students: 20 });
  const [saving, setSaving] = useState(false);

  const totalStudents = USE_MOCK
    ? groups.reduce((a, g) => a + g.students, 0)
    : (summary?.total_students ?? groups.reduce((a, g) => a + (g.student_count || 0), 0));

  const avgBand = USE_MOCK ? "6.5" : (summary?.average_band ?? "—");

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name_uz.trim()) return;
    setSaving(true);
    try {
      await groupsApi.createGroup(form);
      setShowCreate(false);
      setForm({ name_uz: "", level: "intermediate", max_students: 20 });
      reload();
    } catch (err) {
      alert(err.message || "Guruh yaratishda xatolik");
    } finally { setSaving(false); }
  };

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary-400" /></div>;

  return (
    <div className="space-y-7">
      <SectionHeading title={t("pages.teacher.groups.title")} subtitle={t("pages.teacher.groups.subtitle")}
        action={
          <button onClick={() => setShowCreate(true)} className="btn-primary text-sm">
            <Plus className="h-4 w-4" /> {t("pages.teacher.groups.newGroup")}
          </button>
        } />

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="glass w-full max-w-md rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-medium text-white">Yangi guruh yaratish</h3>
              <button onClick={() => setShowCreate(false)} className="text-white/40 hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs text-white/50 mb-1 block">Guruh nomi (UZ)</label>
                <input value={form.name_uz} onChange={(e) => setForm({ ...form, name_uz: e.target.value })}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-primary-500/50"
                  placeholder="Masalan: IELTS-Intensive-A" required />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1 block">Daraja</label>
                <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-primary-500/50 bg-[#141A2A]">
                  {["beginner","pre_int","intermediate","upper_int","advanced"].map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1 block">Maksimal o'quvchi soni</label>
                <input type="number" min={1} max={100} value={form.max_students}
                  onChange={(e) => setForm({ ...form, max_students: parseInt(e.target.value) })}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-primary-500/50" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreate(false)}
                  className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-white/60 hover:text-white">Bekor</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-60">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Yaratish"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <Panel className="!p-4" delay={0}>
          <div className="flex items-center gap-3">
            <IconTile icon={FolderKanban} accent="primary" />
            <div><div className="text-xl font-semibold text-white">{groups.length}</div><div className="text-xs text-white/40">{t("pages.teacher.groups.groups")}</div></div>
          </div>
        </Panel>
        <Panel className="!p-4" delay={0.05}>
          <div className="flex items-center gap-3">
            <IconTile icon={Users} accent="secondary" />
            <div><div className="text-xl font-semibold text-white">{totalStudents}</div><div className="text-xs text-white/40">{t("pages.teacher.groups.totalStudents")}</div></div>
          </div>
        </Panel>
        <Panel className="!p-4" delay={0.1}>
          <div className="flex items-center gap-3">
            <IconTile icon={GraduationCap} accent="primary" />
            <div><div className="text-xl font-semibold text-white">{avgBand}</div><div className="text-xs text-white/40">{t("pages.teacher.groups.avgBand")}</div></div>
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((g, i) => {
          const name       = USE_MOCK ? g.name : (g.name || g.name_uz || "Guruh");
          const students   = USE_MOCK ? g.students : g.student_count;
          const schedule   = USE_MOCK ? g.schedule : g.schedule_display;
          const band       = USE_MOCK ? g.avgBand : (parseFloat(g.average_band) || null);
          const level      = USE_MOCK ? g.level : (g.level_display || g.level);
          return (
            <motion.div key={g.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="glass group rounded-2xl p-5 transition-colors hover:border-primary-500/40">
              <div className="flex items-start justify-between">
                <IconTile icon={FolderKanban} accent="primary" size="lg" />
                <Badge color="gray">{level}</Badge>
              </div>
              <h3 className="mt-4 font-medium text-white">{name}</h3>
              <div className="mt-3 space-y-2.5 text-sm">
                <div className="flex items-center justify-between text-white/50">
                  <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {t("pages.teacher.groups.students")}</span>
                  <span className="text-white/80">{students}</span>
                </div>
                {schedule && (
                  <div className="flex items-center justify-between text-white/50">
                    <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {t("pages.teacher.groups.schedule")}</span>
                    <span className="text-white/80 text-xs">{schedule}</span>
                  </div>
                )}
                <div>
                  <div className="mb-1 flex items-center justify-between text-white/50">
                    <span>{t("pages.teacher.groups.avgBand")}</span>
                    <span className="text-white/80">{band ?? "—"}</span>
                  </div>
                  {band && <ProgressBar value={band} max={9} color="primary" />}
                </div>
              </div>
              <button className="mt-4 flex w-full items-center justify-center gap-1 rounded-xl border border-white/[0.06] py-2 text-sm text-white/60 transition-colors hover:border-primary-500/40 hover:text-white">
                {t("pages.teacher.groups.viewGroup")} <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
