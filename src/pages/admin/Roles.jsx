import { motion } from "framer-motion";
import { Shield, Users, Plus, Check } from "lucide-react";
import { SectionHeading } from "../../components/ui/index.jsx";
import { IconTile } from "../../components/dashboard/shared.jsx";
import { rolesData } from "../../data/mockData";
import { useLanguage } from "../../hooks/useLanguage";

export default function AdminRoles() {
  const { t } = useLanguage();
  return (
    <div className="space-y-7">
      <SectionHeading title={t("pages.admin.roles.title")} subtitle={t("pages.admin.roles.subtitle")}
        action={<button className="btn-primary text-sm"><Plus className="h-4 w-4" /> {t("pages.admin.roles.newRole")}</button>} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {rolesData.map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }} className="glass rounded-2xl p-5">
            <div className="flex items-start justify-between">
              <IconTile icon={Shield} accent={r.color === "secondary" ? "secondary" : "primary"} size="lg" />
              <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.05] px-2.5 py-1 text-xs text-white/60">
                <Users className="h-3 w-3" /> {r.users}
              </span>
            </div>
            <h3 className="mt-4 font-medium text-white">{r.name}</h3>
            <p className="text-xs text-white/40">{r.permissions.length} {t("pages.admin.roles.permissions")}</p>

            <div className="mt-4 space-y-1.5">
              {r.permissions.map((p) => (
                <div key={p} className="flex items-center gap-2 text-xs text-white/60">
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="capitalize">{p.replace(/_/g, " ")}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
