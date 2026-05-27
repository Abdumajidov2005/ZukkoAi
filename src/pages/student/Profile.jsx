import { useState } from "react";
import { motion } from "framer-motion";
import {
  User, Mail, Award, Calendar, Bell, Moon, Sun, Globe, Shield, Camera, Save, Flame, Target, BookOpen,
} from "lucide-react";
import { SectionHeading, Badge, Avatar } from "../../components/ui/index.jsx";
import { Panel } from "../../components/dashboard/shared.jsx";
import { useAuthStore } from "../../store/authStore";
import { useUIStore } from "../../store/uiStore";

function Field({ label, value, onChange, icon: Icon, type = "text" }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-white/50">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />}
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-white/30 focus:border-primary-500/50 focus:outline-none" />
      </div>
    </div>
  );
}

function Toggle({ on, onClick }) {
  return (
    <button onClick={onClick}
      className={`relative h-6 w-11 rounded-full transition-colors ${on ? "bg-primary-500" : "bg-white/15"}`}>
      <motion.span layout className="absolute top-0.5 h-5 w-5 rounded-full bg-white"
        animate={{ left: on ? 22 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
    </button>
  );
}

export default function StudentProfile() {
  const user = useAuthStore((s) => s.user);
  const { theme, toggleTheme } = useUIStore();
  const [name, setName] = useState(user?.fullname || "");
  const [email, setEmail] = useState(user?.email || "");
  const [notifs, setNotifs] = useState(true);
  const [weekly, setWeekly] = useState(false);

  return (
    <div className="space-y-7">
      <SectionHeading title="Profile" subtitle="Manage your account and preferences." />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* identity card */}
        <Panel className="lg:col-span-1" delay={0}>
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <Avatar initials={user?.avatar || "AK"} size="lg" ring />
              <button className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-primary-500 text-white">
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-white">{user?.fullname}</h3>
            <p className="text-sm text-white/40">{user?.email}</p>
            <Badge color="primary"><Shield className="h-3 w-3" /> {user?.group || "IELTS Student"}</Badge>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/[0.06] pt-5">
            {[["6.5", "Band", Award], ["12", "Streak", Flame], ["7.0", "Target", Target]].map(([v, l, Ic]) => (
              <div key={l} className="text-center">
                <Ic className="mx-auto mb-1 h-4 w-4 text-primary-400" />
                <div className="text-lg font-semibold text-white">{v}</div>
                <div className="text-[11px] text-white/40">{l}</div>
              </div>
            ))}
          </div>
        </Panel>

        {/* edit form */}
        <Panel title="Personal Information" className="lg:col-span-2" delay={0.1}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full Name" value={name} onChange={setName} icon={User} />
            <Field label="Email Address" value={email} onChange={setEmail} icon={Mail} type="email" />
            <Field label="Date of Birth" value="2003-04-12" onChange={() => {}} icon={Calendar} type="date" />
            <Field label="Native Language" value="Uzbek" onChange={() => {}} icon={Globe} />
          </div>
          <div className="mt-5 flex justify-end">
            <button className="btn-primary text-sm"><Save className="h-4 w-4" /> Save changes</button>
          </div>
        </Panel>
      </div>

      {/* preferences */}
      <Panel title="Preferences" delay={0.15}>
        <div className="divide-y divide-white/[0.06]">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              {theme === "dark" ? <Moon className="h-5 w-5 text-primary-400" /> : <Sun className="h-5 w-5 text-amber-400" />}
              <div><div className="text-sm font-medium text-white">Theme</div><div className="text-xs text-white/40">Switch between dark and light mode</div></div>
            </div>
            <Toggle on={theme === "dark"} onClick={toggleTheme} />
          </div>
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-secondary-400" />
              <div><div className="text-sm font-medium text-white">Push notifications</div><div className="text-xs text-white/40">Homework reminders & AI feedback alerts</div></div>
            </div>
            <Toggle on={notifs} onClick={() => setNotifs((v) => !v)} />
          </div>
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-primary-400" />
              <div><div className="text-sm font-medium text-white">Weekly progress report</div><div className="text-xs text-white/40">Get a summary every Sunday by email</div></div>
            </div>
            <Toggle on={weekly} onClick={() => setWeekly((v) => !v)} />
          </div>
        </div>
      </Panel>
    </div>
  );
}
