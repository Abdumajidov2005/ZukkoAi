import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FolderKanban, Users, Calendar, Plus, ArrowRight, GraduationCap,
  Loader2, X, UserPlus, Trash2, ChevronDown, ChevronUp,
} from "lucide-react";
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

  // Guruh yaratish
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm]     = useState({ name_uz: "", level: "intermediate", max_students: 20 });
  const [saving, setSaving] = useState(false);

  // O'quvchi qo'shish
  const [addModal, setAddModal]       = useState(null); // group id
  const [studentId, setStudentId]     = useState("");
  const [addLoading, setAddLoading]   = useState(false);
  const [addError, setAddError]       = useState("");
  const [addSuccess, setAddSuccess]   = useState("");

  // Guruh detail expand
  const [expanded, setExpanded] = useState(null);
  const [groupStudents, setGroupStudents] = useState({});

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name_uz.trim()) return;
    setSaving(true);
    try {
      await groupsApi.createGroup(form);
      setShowCreate(false);
      setForm({ name_uz: "", level: "intermediate", max_students: 20 });
      reload();
    } catch (err) { alert(err.message || "Guruh yaratishda xatolik"); }
    finally { setSaving(false); }
  };

  const handleAddStudent = async () => {
    if (!studentId.trim()) return;
    setAddLoading(true); setAddError(""); setAddSuccess("");
    try {
      await groupsApi.addStudent(addModal, { student_id: parseInt(studentId) });
      setAddSuccess(`O'quvchi #${studentId} guruhga qo'shildi!`);
      setStudentId("");
      reload();
      // Guruh o'quvchilarini yangilash
      if (expanded === addModal) loadGroupStudents(addModal);
    } catch (err) {
      setAddError(err.message || "O'quvchini qo'shib bo'lmadi");
    } finally { setAddLoading(false); }
  };

  const handleRemoveStudent = async (groupId, membershipId, studentName) => {
    if (!confirm(`${studentName} ni guruhdan chiqarilsinmi?`)) return;
    try {
      await groupsApi.removeStudent(groupId, membershipId, { leave_reason: "other" });
      loadGroupStudents(groupId);
      reload();
    } catch (err) { alert(err.message); }
  };

  const loadGroupStudents = async (groupId) => {
    try {
      const r = await groupsApi.getStudents(groupId);
      setGroupStudents((prev) => ({ ...prev, [groupId]: r.results || [] }));
    } catch (e) { console.error(e); }
  };

  const toggleExpand = (groupId) => {
    if (expanded === groupId) { setExpanded(null); return; }
    setExpanded(groupId);
    if (!USE_MOCK) loadGroupStudents(groupId);
  };

  const openAddModal = (groupId) => {
    setAddModal(groupId);
    setStudentId(""); setAddError(""); setAddSuccess("");
  };

  const totalStudents = USE_MOCK
    ? groups.reduce((a, g) => a + g.students, 0)
    : (summary?.total_students ?? groups.reduce((a, g) => a + (g.student_count || 0), 0));

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary-400" /></div>;

  return (
    <div className="space-y-7">
      <SectionHeading title={t("pages.teacher.groups.title")} subtitle={t("pages.teacher.groups.subtitle")}
        action={
          <button onClick={() => setShowCreate(true)} className="btn-primary text-sm">
            <Plus className="h-4 w-4" /> {t("pages.teacher.groups.newGroup")}
          </button>
        }
      />

      {/* Guruh yaratish modali */}
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
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white outline-none bg-[#141A2A]">
                  {["beginner","pre_int","intermediate","upper_int","advanced"].map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1 block">Maks. o'quvchi soni</label>
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

      {/* O'quvchi qo'shish modali */}
      {addModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="glass w-full max-w-sm rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-medium text-white">O'quvchi qo'shish</h3>
              <button onClick={() => setAddModal(null)} className="text-white/40 hover:text-white"><X className="h-5 w-5" /></button>
            </div>

            <div className="rounded-xl bg-primary-500/10 border border-primary-500/20 p-3 mb-4">
              <p className="text-xs text-primary-300">
                O'quvchidan <strong>foydalanuvchi ID</strong> sini so'rang. ID ni u Profile sahifasida ko'rishi mumkin.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-white/50 mb-1 block">O'quvchi ID raqami</label>
                <input type="number" value={studentId} onChange={(e) => setStudentId(e.target.value)}
                  placeholder="Masalan: 42"
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-primary-500/50"
                  onKeyDown={(e) => e.key === "Enter" && handleAddStudent()} />
              </div>

              {addError && (
                <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-sm text-rose-400">{addError}</div>
              )}
              {addSuccess && (
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-sm text-emerald-400 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 shrink-0" /> {addSuccess}
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={() => setAddModal(null)}
                className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-white/60 hover:text-white">Yopish</button>
              <button onClick={handleAddStudent} disabled={addLoading || !studentId.trim()}
                className="btn-primary flex-1 disabled:opacity-60">
                {addLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><UserPlus className="h-4 w-4" /> Qo'shish</>}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Panel className="!p-4" delay={0}>
          <div className="flex items-center gap-3">
            <IconTile icon={FolderKanban} accent="primary" />
            <div><div className="text-xl font-semibold text-white">{groups.length}</div><div className="text-xs text-white/40">Guruhlar</div></div>
          </div>
        </Panel>
        <Panel className="!p-4" delay={0.05}>
          <div className="flex items-center gap-3">
            <IconTile icon={Users} accent="secondary" />
            <div><div className="text-xl font-semibold text-white">{totalStudents}</div><div className="text-xs text-white/40">O'quvchilar</div></div>
          </div>
        </Panel>
        <Panel className="!p-4" delay={0.1}>
          <div className="flex items-center gap-3">
            <IconTile icon={GraduationCap} accent="primary" />
            <div><div className="text-xl font-semibold text-white">{summary?.average_band ?? "—"}</div><div className="text-xs text-white/40">O'rtacha band</div></div>
          </div>
        </Panel>
      </div>

      {/* Guruhlar */}
      <div className="space-y-3">
        {groups.map((g, i) => {
          const name     = USE_MOCK ? g.name : (g.name || g.name_uz || "Guruh");
          const students = USE_MOCK ? g.students : g.student_count;
          const schedule = USE_MOCK ? g.schedule : g.schedule_display;
          const band     = USE_MOCK ? g.avgBand : (parseFloat(g.average_band) || null);
          const level    = USE_MOCK ? g.level : (g.level_display || g.level);
          const isExp    = expanded === g.id;

          return (
            <motion.div key={g.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }} className="glass rounded-2xl overflow-hidden">

              {/* Guruh header */}
              <div className="flex items-center gap-4 p-5">
                <IconTile icon={FolderKanban} accent="primary" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium text-white">{name}</h3>
                    <Badge color="gray">{level}</Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-white/40 flex-wrap">
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {students} o'quvchi</span>
                    {schedule && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {schedule}</span>}
                    {band && <span>Band: <strong className="text-white/70">{band}</strong></span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!USE_MOCK && (
                    <button onClick={() => openAddModal(g.id)}
                      className="flex items-center gap-1.5 rounded-xl bg-primary-500/10 border border-primary-500/20 px-3 py-2 text-xs text-primary-400 hover:bg-primary-500/20 transition-colors">
                      <UserPlus className="h-3.5 w-3.5" /> O'quvchi qo'shish
                    </button>
                  )}
                  <button onClick={() => toggleExpand(g.id)}
                    className="rounded-xl border border-white/10 p-2 text-white/40 hover:text-white transition-colors">
                    {isExp ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* O'quvchilar ro'yxati (expand) */}
              {isExp && !USE_MOCK && (
                <div className="border-t border-white/[0.06] px-5 pb-4">
                  <div className="text-xs text-white/40 mb-3 mt-3">Guruh o'quvchilari</div>
                  {groupStudents[g.id] ? (
                    groupStudents[g.id].length === 0 ? (
                      <div className="text-center py-4 text-white/30 text-sm">Hali o'quvchi qo'shilmagan</div>
                    ) : (
                      <div className="space-y-2">
                        {groupStudents[g.id].map((m) => (
                          <div key={m.id} className="flex items-center gap-3 rounded-xl bg-white/[0.03] px-3 py-2.5">
                            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary-500/10 text-primary-400 text-xs font-bold">
                              {(m.student?.full_name || m.student?.username || "?").slice(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm text-white truncate">{m.student?.full_name || m.student?.username}</div>
                              <div className="text-xs text-white/40">ID: #{m.student?.id} · Band: {m.student?.current_band || "—"}</div>
                            </div>
                            <button onClick={() => handleRemoveStudent(g.id, m.student?.id, m.student?.full_name || m.student?.username)}
                              className="text-white/30 hover:text-rose-400 transition-colors p-1">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )
                  ) : (
                    <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin text-primary-400" /></div>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
