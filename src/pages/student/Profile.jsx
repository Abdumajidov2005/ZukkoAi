import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User, Mail, Award, Bell, Moon, Sun, Globe, Save,
  Flame, Target, BookOpen, Users, Search, CheckCircle2, Loader2, FolderKanban,
} from "lucide-react";
import { SectionHeading, Badge, Avatar } from "../../components/ui/index.jsx";
import { Panel } from "../../components/dashboard/shared.jsx";
import { useAuthStore } from "../../store/authStore";
import { useUIStore } from "../../store/uiStore";
import { useLanguage } from "../../hooks/useLanguage";
import { groupsApi, dashboardApi } from "../../services/api";
import { USE_MOCK } from "../../services/api";

function Toggle({ on, onClick }) {
  return (
    <button onClick={onClick}
      className={`relative h-6 w-11 rounded-full transition-colors ${on ? "bg-primary-500" : "bg-white/15"}`}>
      <motion.span layout className="absolute top-0.5 h-5 w-5 rounded-full bg-white"
        animate={{ left: on ? 22 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
    </button>
  );
}

// O'quvchi guruhga qo'shilish komponenti
function JoinGroupSection({ userId }) {
  const [groups, setGroups]       = useState([]);
  const [query, setQuery]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [joining, setJoining]     = useState(null);
  const [success, setSuccess]     = useState(null);
  const [error, setError]         = useState("");
  const [myGroups, setMyGroups]   = useState([]);

  // Mavjud guruhlarni yuklash
  useEffect(() => {
    if (USE_MOCK) return;
    setLoading(true);
    // Teacher guruhlarini ko'rish uchun endpoint yo'q — hozircha bo'sh ko'rsatamiz
    // Bu endpoint backendda qo'shilishi kerak: GET /api/groups/available/
    setLoading(false);
  }, []);

  if (USE_MOCK) return null;

  return (
    <Panel title="Guruhga qo'shilish" delay={0.3}>
      <p className="text-sm text-white/50 mb-4">
        O'qituvchingiz sizni guruhga qo'shishi uchun <span className="text-primary-400 font-medium">foydalanuvchi ID</span> ingizni bering.
      </p>

      {/* Foydalanuvchi ID ko'rsatish */}
      <div className="rounded-xl bg-primary-500/10 border border-primary-500/20 p-4 mb-4">
        <div className="text-xs text-white/50 mb-1">Sizning foydalanuvchi ID ingiz</div>
        <div className="text-2xl font-bold text-primary-400">#{userId || "—"}</div>
        <div className="text-xs text-white/40 mt-1">Bu raqamni o'qituvchingizga bering</div>
      </div>

      <div className="text-xs text-white/30 text-center">
        O'qituvchi sizni guruhga qo'shgandan so'ng, guruh ma'lumotlari dashboardda ko'rinadi
      </div>

      {success && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span className="text-sm text-emerald-400">{success}</span>
        </div>
      )}
      {error && (
        <div className="mt-3 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-sm text-rose-400">{error}</div>
      )}
    </Panel>
  );
}

export default function StudentProfile() {
  const { t }       = useLanguage();
  const user        = useAuthStore((s) => s.user);
  const { theme, toggleTheme } = useUIStore();

  const [name, setName]     = useState(user?.fullname || "");
  const [email, setEmail]   = useState(user?.email || "");
  const [notifs, setNotifs] = useState(true);
  const [weekly, setWeekly] = useState(false);
  const [stats, setStats]   = useState(null);

  useEffect(() => {
    if (USE_MOCK) return;
    dashboardApi.stats().then(setStats).catch(() => {});
  }, []);

  return (
    <div className="space-y-7">
      <SectionHeading title={t("pages.student.profile.title")} subtitle={t("pages.student.profile.subtitle")} />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profil kartasi */}
        <Panel className="lg:col-span-1" delay={0}>
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <Avatar initials={user?.avatar || "??"} size="xl" />
            </div>
            <h3 className="font-semibold text-white text-lg">{user?.fullname || "—"}</h3>
            <div className="text-sm text-white/50 mt-0.5">{user?.email}</div>
            <Badge color="primary" className="mt-2">{user?.role}</Badge>
          </div>

          <div className="mt-6 space-y-3">
            {[
              { icon: Award,    label: "Joriy band",   value: stats?.current_band ?? "—" },
              { icon: Flame,    label: "Streak",        value: stats?.daily_streak != null ? `${stats.daily_streak} kun` : "—" },
              { icon: BookOpen, label: "Insholar",      value: stats?.total_submissions ?? "—" },
              { icon: Target,   label: "Mock testlar",  value: stats?.total_mock_tests ?? "—" },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2.5">
                <span className="flex items-center gap-2 text-sm text-white/60">
                  <s.icon className="h-4 w-4 text-primary-400" /> {s.label}
                </span>
                <span className="text-sm font-medium text-white">{s.value}</span>
              </div>
            ))}
          </div>

          {/* User ID */}
          <div className="mt-4 rounded-xl bg-white/[0.03] px-3 py-2.5 text-center">
            <div className="text-xs text-white/40">Foydalanuvchi ID</div>
            <div className="text-lg font-bold text-primary-400 mt-0.5">#{user?.id || "—"}</div>
          </div>
        </Panel>

        {/* O'ng panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Ma'lumotlar */}
          <Panel title="Shaxsiy ma'lumotlar" delay={0.1}>
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-white/50">To'liq ism</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <input value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-3 text-sm text-white focus:border-primary-500/50 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-white/50">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <input value={email} onChange={(e) => setEmail(e.target.value)} type="email"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-3 text-sm text-white focus:border-primary-500/50 focus:outline-none" />
                </div>
              </div>
            </div>
            <button className="btn-primary mt-4 text-sm">
              <Save className="h-4 w-4" /> Saqlash
            </button>
          </Panel>

          {/* Sozlamalar */}
          <Panel title="Sozlamalar" delay={0.2}>
            <div className="space-y-4">
              {[
                { icon: Bell,  label: "Bildirishnomalar",       sub: "Yangi topshiriqlar haqida",    on: notifs, set: setNotifs },
                { icon: Bell,  label: "Haftalik hisobot",        sub: "Band progressi xulosasi",       on: weekly, set: setWeekly },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/[0.04]">
                      <s.icon className="h-4 w-4 text-white/60" />
                    </div>
                    <div>
                      <div className="text-sm text-white">{s.label}</div>
                      <div className="text-xs text-white/40">{s.sub}</div>
                    </div>
                  </div>
                  <Toggle on={s.on} onClick={() => s.set((v) => !v)} />
                </div>
              ))}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/[0.04]">
                    {theme === "dark" ? <Moon className="h-4 w-4 text-white/60" /> : <Sun className="h-4 w-4 text-white/60" />}
                  </div>
                  <div>
                    <div className="text-sm text-white">Mavzu</div>
                    <div className="text-xs text-white/40">{theme === "dark" ? "Qorong'u" : "Yorug'"} rejim</div>
                  </div>
                </div>
                <Toggle on={theme === "dark"} onClick={toggleTheme} />
              </div>
            </div>
          </Panel>

          {/* Guruhga qo'shilish */}
          <JoinGroupSection userId={user?.id} />
        </div>
      </div>
    </div>
  );
}
