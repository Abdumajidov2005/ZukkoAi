import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FolderKanban, Users, GraduationCap, Calendar, Search, Loader2, ArrowRight } from "lucide-react";
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

  useEffect(() => {
    if (USE_MOCK) { setGroups(teacherGroups); return; }
    groupsApi.getGroups({ page_size: 100 })
      .then((r) => { setGroups(r.results || []); setSummary(r.summary); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { groups, summary, loading };
}

export default function ManagerGroups() {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const { groups, summary, loading } = useGroups();

  const filtered = groups.filter((g) => {
    const name = USE_MOCK ? g.name : (g.name || g.name_uz || "");
    return name.toLowerCase().includes(query.toLowerCase());
  });

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
    </div>
  );

  const total   = summary?.total_students ?? groups.reduce((a, g) => a + (USE_MOCK ? g.students : (g.student_count || 0)), 0);
  const avgBand = summary?.average_band ?? "—";

  return (
    <div className="space-y-7">
      <SectionHeading title="Barcha guruhlar" subtitle="O'quv markazidagi barcha guruhlar" />

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
            <div><div className="text-xl font-semibold text-white">{total}</div><div className="text-xs text-white/40">O'quvchilar</div></div>
          </div>
        </Panel>
        <Panel className="!p-4" delay={0.1}>
          <div className="flex items-center gap-3">
            <IconTile icon={GraduationCap} accent="primary" />
            <div><div className="text-xl font-semibold text-white">{avgBand}</div><div className="text-xs text-white/40">O'rtacha band</div></div>
          </div>
        </Panel>
      </div>

      <Panel delay={0.15}>
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <input value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Guruh nomini qidirish..."
            className="w-full rounded-xl bg-white/5 border border-white/10 py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-primary-500/50" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((g, i) => {
            const name     = USE_MOCK ? g.name : (g.name || g.name_uz || "Guruh");
            const students = USE_MOCK ? g.students : g.student_count;
            const schedule = USE_MOCK ? g.schedule : g.schedule_display;
            const band     = USE_MOCK ? g.avgBand : (parseFloat(g.average_band) || null);
            const level    = USE_MOCK ? g.level : (g.level_display || g.level);
            return (
              <motion.div key={g.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-5 hover:border-primary-500/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <IconTile icon={FolderKanban} accent="primary" />
                  <Badge color="gray">{level}</Badge>
                </div>
                <h3 className="font-medium text-white">{name}</h3>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between text-white/50">
                    <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> O'quvchilar</span>
                    <span className="text-white/80">{students}</span>
                  </div>
                  {schedule && (
                    <div className="flex justify-between text-white/50">
                      <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Jadval</span>
                      <span className="text-white/80 text-xs">{schedule}</span>
                    </div>
                  )}
                  {band && (
                    <div>
                      <div className="flex justify-between text-white/50 mb-1">
                        <span>O'rtacha band</span><span className="text-white/80">{band}</span>
                      </div>
                      <ProgressBar value={band} max={9} color="primary" />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-10 text-white/40">Guruh topilmadi</div>
        )}
      </Panel>
    </div>
  );
}
