import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, LogOut, ChevronLeft, X } from "lucide-react";
import { NAV_CONFIG } from "./navConfig";
import { useAuthStore } from "../../store/authStore";
import { useUIStore } from "../../store/uiStore";

export default function Sidebar() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { sidebarOpen, toggleSidebar, mobileNavOpen, setMobileNav } = useUIStore();

  const cfg = NAV_CONFIG[user?.role] || NAV_CONFIG.student;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const content = (collapsed) => (
    <div className="flex h-full flex-col">
      {/* logo */}
      <div className="flex items-center justify-between px-4 py-5">
        <NavLink to="/" className="flex items-center gap-2.5 overflow-hidden">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary-600 to-secondary-500 shadow-glow">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <span className="font-display text-lg font-semibold text-white whitespace-nowrap">
              ZUKKO<span className="gradient-text"> AI</span>
            </span>
          )}
        </NavLink>
        <button onClick={() => setMobileNav(false)} className="lg:hidden text-white/50">
          <X className="h-5 w-5" />
        </button>
      </div>

      {!collapsed && (
        <div className="px-5 pb-2">
          <span className="text-[11px] uppercase tracking-wider text-white/30">{cfg.title} Panel</span>
        </div>
      )}

      {/* nav */}
      <nav className="flex-1 space-y-1 px-3 overflow-y-auto">
        {cfg.items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setMobileNav(false)}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                isActive
                  ? "bg-gradient-to-r from-primary-500/20 to-secondary-500/10 text-white border border-primary-500/30"
                  : "text-white/55 hover:text-white hover:bg-white/5 border border-transparent"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`h-[18px] w-[18px] shrink-0 ${isActive ? "text-primary-400" : ""}`} />
                {!collapsed && <span className="flex-1 whitespace-nowrap">{item.label}</span>}
                {!collapsed && item.badge && (
                  <span className="rounded-md bg-primary-500/20 px-1.5 py-0.5 text-[10px] font-medium text-primary-300">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* user + logout */}
      <div className="border-t border-white/5 p-3">
        <div className={`flex items-center gap-3 rounded-xl px-2 py-2 ${collapsed ? "justify-center" : ""}`}>
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary-600 to-secondary-500 text-xs font-semibold text-white">
            {user?.avatar}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-white">{user?.fullname}</div>
              <div className="truncate text-[11px] text-white/40 capitalize">{user?.role}</div>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className={`mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/55 hover:bg-rose-500/10 hover:text-rose-400 transition-colors ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut className="h-[18px] w-[18px]" />
          {!collapsed && "Log out"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex sticky top-0 h-screen shrink-0 flex-col border-r border-white/5 bg-bg-soft/80 backdrop-blur-xl transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-[76px]"
        }`}
      >
        {content(!sidebarOpen)}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 grid h-6 w-6 place-items-center rounded-full glass-strong text-white/60 hover:text-white"
        >
          <ChevronLeft className={`h-3.5 w-3.5 transition-transform ${!sidebarOpen ? "rotate-180" : ""}`} />
        </button>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileNavOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileNav(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-white/5 bg-bg-soft lg:hidden"
            >
              {content(false)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
