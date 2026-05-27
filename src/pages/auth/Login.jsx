import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Zap } from "lucide-react";
import AuthLayout from "../../components/layout/AuthLayout";
import { useAuthStore } from "../../store/authStore";
import { ROLE_HOME } from "../../data/mockData";

const DEMO = [
  { role: "Student", email: "student@zukko.ai" },
  { role: "Teacher", email: "teacher@zukko.ai" },
  { role: "Manager", email: "manager@zukko.ai" },
  { role: "Admin", email: "admin@zukko.ai" },
];

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((s) => s.login);

  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e?.preventDefault();
    setError("");
    setLoading(true);
    const res = await login(form);
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    const dest = location.state?.from?.pathname || ROLE_HOME[res.user.role];
    navigate(dest, { replace: true });
  };

  const quickFill = (email) => setForm({ email, password: "1234" });

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to continue your learning journey."
      footer={<>Don't have an account? <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium">Sign up</Link></>}
    >
      <form onSubmit={submit} className="space-y-4">
        <InputField icon={Mail} type="email" placeholder="Email address" value={form.email}
          onChange={(v) => setForm({ ...form, email: v })} />
        <InputField icon={Lock} type={show ? "text" : "password"} placeholder="Password" value={form.password}
          onChange={(v) => setForm({ ...form, password: v })}
          trailing={
            <button type="button" onClick={() => setShow((s) => !s)} className="text-white/40 hover:text-white/70">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          } />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-white/50 cursor-pointer">
            <input type="checkbox" className="rounded border-white/20 bg-white/5 text-primary-500 focus:ring-0" />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-primary-400 hover:text-primary-300">Forgot password?</Link>
        </div>

        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-2.5 text-sm text-rose-400">
            {error}
          </motion.p>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Log in <ArrowRight className="h-4 w-4" /></>}
        </button>
      </form>

      {/* Demo accounts */}
      <div className="mt-6">
        <div className="flex items-center gap-2 text-xs text-white/40">
          <Zap className="h-3.5 w-3.5 text-primary-400" /> Quick demo login (password: 1234)
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {DEMO.map((d) => (
            <button
              key={d.role}
              type="button"
              onClick={() => quickFill(d.email)}
              className="rounded-xl glass px-3 py-2 text-left text-xs hover:border-primary-500/40 transition-colors"
            >
              <div className="font-medium text-white">{d.role}</div>
              <div className="text-white/40 truncate">{d.email}</div>
            </button>
          ))}
        </div>
      </div>
    </AuthLayout>
  );
}

export function InputField({ icon: Icon, trailing, value, onChange, ...props }) {
  return (
    <div className="relative">
      {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />}
      <input
        {...props}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl bg-white/5 border border-white/10 py-3 pl-10 pr-10 text-sm text-white placeholder:text-white/30 outline-none focus:border-primary-500/50 transition-colors"
      />
      {trailing && <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{trailing}</div>}
    </div>
  );
}
