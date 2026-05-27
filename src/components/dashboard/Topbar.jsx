import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Search, Bell, Sun, Moon, Sparkles } from "lucide-react";
import { useUIStore } from "../../store/uiStore";
import { useAuthStore } from "../../store/authStore";
import { useTheme } from "../../hooks/useTheme";

export default function Topbar({ onOpenTutor }) {
  const { setMobileNav, notifications, markAllRead } = useUIStore();
  const user = useAuthStore((s) => s.user);
  const { theme, toggleTheme } = useTheme();
  const [notifOpen, setNotifOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-bg/70 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-4 md:px-6 py-3">
        <button onClick={() => setMobileNav(true)} className="lg:hidden grid h-9 w-9 place-items-center rounded-xl glass text-white/70">
          <Menu className="h-5 w-5" />
        </button>

        {/* search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <input
            placeholder="Search…"
            className="w-full rounded-xl bg-white/5 border border-white/10 py-2 pl-10 pr-4 text-sm text-white placeholder:text-white/30 outline-none focus:border-primary-500/40 transition-colors"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* AI tutor quick button (students) */}
          {user?.role === "student" && (
            <button
              onClick={onOpenTutor}
              className="hidden sm:flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600/80 to-secondary-500/80 px-3.5 py-2 text-sm font-medium text-white shadow-glow hover:-translate-y-0.5 transition-transform"
            >
              <Sparkles className="h-4 w-4" /> AI Tutor
            </button>
          )}

          {/* theme */}
          <button onClick={toggleTheme} className="grid h-9 w-9 place-items-center rounded-xl glass text-white/70 hover:text-white transition-colors">
            {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
          </button>

          {/* notifications */}
          <div className="relative">
            <button
              onClick={() => { setNotifOpen((o) => !o); if (!notifOpen) markAllRead(); }}
              className="relative grid h-9 w-9 place-items-center rounded-xl glass text-white/70 hover:text-white transition-colors"
            >
              <Bell className="h-[18px] w-[18px]" />
              {unread > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                  {unread}
                </span>
              )}
            </button>
            <AnimatePresence>
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    className="absolute right-0 z-40 mt-2 w-80 rounded-2xl glass-strong shadow-card overflow-hidden"
                  >
                    <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
                      <span className="text-sm font-medium text-white">Notifications</span>
                      <span className="text-xs text-primary-400">Mark all read</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((n) => (
                        <div key={n.id} className="flex gap-3 px-4 py-3 hover:bg-white/5 transition-colors">
                          <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary-500/15 text-primary-400">
                            <Sparkles className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-white">{n.title}</div>
                            <div className="text-xs text-white/50">{n.desc}</div>
                            <div className="mt-0.5 text-[10px] text-white/30">{n.time} ago</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* avatar */}
          <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-primary-600 to-secondary-500 text-xs font-semibold text-white">
            {user?.avatar}
          </div>
        </div>
      </div>
    </header>
  );
}
