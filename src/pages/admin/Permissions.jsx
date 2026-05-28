import { useState } from "react";
import { motion } from "framer-motion";
import { KeyRound, Check, X } from "lucide-react";
import { SectionHeading, Badge } from "../../components/ui/index.jsx";
import { Panel } from "../../components/dashboard/shared.jsx";
import { useLanguage } from "../../hooks/useLanguage";

const roles = ["Student", "Teacher", "Manager", "Admin"];
const permissions = [
  "View dashboard", "Submit essays", "Review essays", "Create tests",
  "Manage groups", "View payments", "Manage teachers", "Configure AI",
  "Manage roles", "View system logs", "Full access",
];

// matrix[permIdx][roleIdx]
function seed() {
  return permissions.map((_, pi) =>
    roles.map((_, ri) => {
      if (ri === 3) return true; // admin all
      if (pi === 0) return true; // view dashboard all
      if (ri === 0) return pi === 1; // student: submit essays only
      if (ri === 1) return pi >= 1 && pi <= 4; // teacher
      if (ri === 2) return pi >= 4 && pi <= 6; // manager
      return false;
    })
  );
}

export default function AdminPermissions() {
  const { t } = useLanguage();
  const [matrix, setMatrix] = useState(seed);

  function toggle(pi, ri) {
    if (ri === 3) return; // admin locked on
    setMatrix((m) => m.map((row, r) => r === pi ? row.map((v, c) => c === ri ? !v : v) : row));
  }

  return (
    <div className="space-y-7">
      <SectionHeading title={t("pages.admin.permissions.title")} subtitle={t("pages.admin.permissions.subtitle")}
        action={<Badge color="secondary"><KeyRound className="h-3 w-3" /> {t("pages.admin.permissions.rbac")}</Badge>} />

      <Panel delay={0.05}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-xs uppercase tracking-wide text-white/40">
                <th className="px-3 py-3 text-left font-medium">{t("pages.admin.permissions.permission")}</th>
                {roles.map((r) => <th key={r} className="px-3 py-3 text-center font-medium">{r}</th>)}
              </tr>
            </thead>
            <tbody>
              {permissions.map((p, pi) => (
                <motion.tr key={p} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: pi * 0.03 }}
                  className="border-b border-white/[0.04]">
                  <td className="px-3 py-3 text-white/80">{p}</td>
                  {roles.map((r, ri) => {
                    const on = matrix[pi][ri];
                    const locked = ri === 3;
                    return (
                      <td key={r} className="px-3 py-3 text-center">
                        <button onClick={() => toggle(pi, ri)} disabled={locked}
                          className={`mx-auto grid h-8 w-8 place-items-center rounded-lg border transition-all ${
                            on ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-400" : "border-white/[0.06] bg-white/[0.02] text-white/20"
                          } ${locked ? "cursor-not-allowed opacity-70" : "hover:border-white/20"}`}>
                          {on ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                        </button>
                      </td>
                    );
                  })}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-end">
          <button className="btn-primary text-sm">{t("pages.admin.permissions.savePermissions")}</button>
        </div>
      </Panel>
    </div>
  );
}
