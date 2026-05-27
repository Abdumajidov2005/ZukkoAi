import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

// --- Stat / KPI card ---
export function StatCard({ icon: Icon, label, value, change, trend = "up", accent = "primary", delay = 0 }) {
  const accents = {
    primary: "from-primary-600/20 to-primary-500/5 text-primary-400",
    secondary: "from-secondary-500/20 to-secondary-500/5 text-secondary-400",
  };
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-emerald-400" : trend === "down" ? "text-rose-400" : "text-white/40";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass rounded-2xl p-5 hover:border-primary-500/40 transition-colors group"
    >
      <div className="flex items-start justify-between">
        <div className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${accents[accent]}`}>
          {Icon && <Icon className="h-5 w-5" />}
        </div>
        {change != null && (
          <span className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
            <TrendIcon className="h-3.5 w-3.5" />
            {change}
          </span>
        )}
      </div>
      <div className="mt-4">
        <div className="text-2xl font-semibold text-white tracking-tight">{value}</div>
        <div className="mt-0.5 text-sm text-white/50">{label}</div>
      </div>
    </motion.div>
  );
}

// --- Badge ---
export function Badge({ children, color = "primary", size = "sm" }) {
  const colors = {
    primary: "bg-primary-500/15 text-primary-400 border-primary-500/25",
    secondary: "bg-secondary-500/15 text-secondary-400 border-secondary-500/25",
    green: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
    amber: "bg-amber-500/15 text-amber-400 border-amber-500/25",
    red: "bg-rose-500/15 text-rose-400 border-rose-500/25",
    gray: "bg-white/10 text-white/60 border-white/15",
  };
  const sizes = { sm: "text-[11px] px-2 py-0.5", md: "text-xs px-2.5 py-1" };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-medium ${colors[color]} ${sizes[size]}`}>
      {children}
    </span>
  );
}

// --- Section heading (dashboard) ---
export function SectionHeading({ title, subtitle, action }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-semibold tracking-tight text-white">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-white/50">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// --- Progress bar ---
export function ProgressBar({ value, max = 100, color = "primary", showLabel = false }) {
  const pct = Math.min(100, (value / max) * 100);
  const colors = {
    primary: "from-primary-600 to-primary-400",
    secondary: "from-secondary-500 to-secondary-400",
    green: "from-emerald-600 to-emerald-400",
    amber: "from-amber-500 to-amber-400",
    red: "from-rose-600 to-rose-400",
  };
  return (
    <div className="w-full">
      <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full bg-gradient-to-r ${colors[color]}`}
        />
      </div>
      {showLabel && <div className="mt-1 text-right text-xs text-white/40">{Math.round(pct)}%</div>}
    </div>
  );
}

// --- Avatar ---
export function Avatar({ initials, size = "md", ring = false }) {
  const sizes = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm", lg: "h-14 w-14 text-lg" };
  return (
    <div
      className={`grid place-items-center rounded-full bg-gradient-to-br from-primary-600 to-secondary-500 font-semibold text-white ${sizes[size]} ${
        ring ? "ring-2 ring-primary-500/40 ring-offset-2 ring-offset-bg" : ""
      }`}
    >
      {initials}
    </div>
  );
}
