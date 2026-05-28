import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Loader2, GraduationCap, Users } from "lucide-react";
import AuthLayout from "../../components/layout/AuthLayout";
import { InputField } from "./Login";
import { useAuthStore } from "../../store/authStore";
import { useLanguage } from "../../hooks/useLanguage";
import { ROLE_HOME } from "../../data/mockData";

const ROLES = [
  { id: "student", icon: GraduationCap },
  { id: "teacher", icon: Users },
];

export default function Register() {
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);
  const { t } = useLanguage();

  const [form, setForm] = useState({ fullname: "", email: "", password: "", role: "student" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 4) {
      setError(t("auth.passwordMin"));
      return;
    }
    setLoading(true);
    const res = await register(form);
    setLoading(false);
    if (!res.ok) return setError(res.error);
    navigate(ROLE_HOME[res.user.role], { replace: true });
  };

  return (
    <AuthLayout
      title={t("auth.registerTitle")}
      subtitle={t("auth.registerSubtitle")}
      footer={<>{t("auth.haveAccount")} <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">{t("common.signIn")}</Link></>}
    >
      <form onSubmit={submit} className="space-y-4">
        {/* role selector */}
        <div>
          <div className="mb-2 text-xs text-white/50">{t("auth.iAmA")}</div>
          <div className="grid grid-cols-2 gap-3">
            {ROLES.map((r) => {
              const active = form.role === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setForm({ ...form, role: r.id })}
                  className={`rounded-xl border p-3.5 text-left transition-all ${
                    active ? "border-primary-500/60 bg-primary-500/10 shadow-glow" : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <r.icon className={`h-5 w-5 ${active ? "text-primary-400" : "text-white/50"}`} />
                  <div className="mt-2 text-sm font-medium text-white">{t(`roles.${r.id}`)}</div>
                </button>
              );
            })}
          </div>
        </div>

        <InputField icon={User} placeholder={t("common.fullName")} value={form.fullname} onChange={(v) => setForm({ ...form, fullname: v })} />
        <InputField icon={Mail} type="email" placeholder={t("common.email")} value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
        <InputField icon={Lock} type="password" placeholder={t("common.password")} value={form.password} onChange={(v) => setForm({ ...form, password: v })} />

        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-2.5 text-sm text-rose-400">
            {error}
          </motion.p>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>{t("common.signUp")} <ArrowRight className="h-4 w-4" /></>}
        </button>
      </form>
    </AuthLayout>
  );
}
