/* eslint-disable react-refresh/only-export-components */
import { motion } from "framer-motion";

// Shared recharts tooltip styling used across every dashboard page
export const tooltipStyle = {
  background: "#141A2A",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 12,
  fontSize: 12,
  color: "#fff",
};

export const CHART_COLORS = ["#7C3AED", "#06B6D4", "#8B5CF6", "#22d3ee", "#a78bfa"];

// Generic glass panel with title + optional action
export function Panel({ title, subtitle, action, children, className = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`glass rounded-2xl p-5 ${className}`}
    >
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            {title && <h3 className="font-medium text-white">{title}</h3>}
            {subtitle && <p className="text-xs text-white/40">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </motion.div>
  );
}

// Lightweight data table. columns: [{ key, label, align, render }]
export function DataTable({ columns, rows, rowKey = "id", onRowClick }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/[0.06] text-xs uppercase tracking-wide text-white/40">
            {columns.map((c) => (
              <th
                key={c.key}
                className={`px-3 py-3 font-medium ${c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : ""}`}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <motion.tr
              key={row[rowKey] ?? i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={`border-b border-white/[0.04] transition-colors hover:bg-white/[0.03] ${onRowClick ? "cursor-pointer" : ""}`}
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={`px-3 py-3.5 text-white/80 ${c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : ""}`}
                >
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Small soft icon tile
export function IconTile({ icon: Icon, accent = "primary", size = "md" }) {
  const accents = {
    primary: "bg-primary-500/15 text-primary-400",
    secondary: "bg-secondary-500/15 text-secondary-400",
    green: "bg-emerald-500/15 text-emerald-400",
    amber: "bg-amber-500/15 text-amber-400",
    red: "bg-rose-500/15 text-rose-400",
  };
  const sizes = { sm: "h-8 w-8 rounded-lg", md: "h-10 w-10 rounded-xl", lg: "h-12 w-12 rounded-xl" };
  const iconSizes = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-6 w-6" };
  return (
    <div className={`grid shrink-0 place-items-center ${sizes[size]} ${accents[accent]}`}>
      {Icon && <Icon className={iconSizes[size]} />}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {Icon && (
        <div className="mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-white/[0.04] text-white/30">
          <Icon className="h-6 w-6" />
        </div>
      )}
      <p className="text-sm font-medium text-white/70">{title}</p>
      {subtitle && <p className="mt-1 text-xs text-white/40">{subtitle}</p>}
    </div>
  );
}
