import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Loader2, GraduationCap, Users } from "lucide-react";
import AuthLayout from "../../components/layout/AuthLayout";
import { InputField } from "./Login";
import { useAuthStore } from "../../store/authStore";
import { ROLE_HOME } from "../../data/mockData";

const ROLES = [
  { id: "student", label: "Student", icon: GraduationCap, desc: "Learn & practice" },
  { id: "teacher", label: "Teacher", icon: Users, desc: "Teach & review" },
];

export default function Register() {
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);

  const [form, setForm] = useState({ fullname: "", email: "", password: "", role: "student" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 4) {
      setError("Password must be at least 4 characters.");
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
      title="Create your account"
      subtitle="Start with 3 free AI essay checks — no card required."
      footer={<>Already have an account? <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">Log in</Link></>}
    >
      <form onSubmit={submit} className="space-y-4">
        {/* role selector */}
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
                <div className="mt-2 text-sm font-medium text-white">{r.label}</div>
                <div className="text-[11px] text-white/40">{r.desc}</div>
              </button>
            );
          })}
        </div>

        <InputField icon={User} placeholder="Full name" value={form.fullname} onChange={(v) => setForm({ ...form, fullname: v })} />
        <InputField icon={Mail} type="email" placeholder="Email address" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
        <InputField icon={Lock} type="password" placeholder="Password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} />

        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-2.5 text-sm text-rose-400">
            {error}
          </motion.p>
        )}

        <p className="text-xs text-white/40">
          By signing up you agree to our <span className="text-primary-400">Terms</span> and <span className="text-primary-400">Privacy Policy</span>.
        </p>

        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Create account <ArrowRight className="h-4 w-4" /></>}
        </button>
      </form>
    </AuthLayout>
  );
}
