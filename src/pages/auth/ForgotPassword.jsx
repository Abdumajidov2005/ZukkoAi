import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Loader2, MailCheck, ArrowLeft } from "lucide-react";
import AuthLayout from "../../components/layout/AuthLayout";
import { InputField } from "./Login";
import { useLanguage } from "../../hooks/useLanguage";

export default function ForgotPassword() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSent(true);
  };

  return (
    <AuthLayout
      title={sent ? t("auth.resetSent") : t("auth.forgotTitle")}
      subtitle={sent ? "" : t("auth.forgotSubtitle")}
      footer={<Link to="/login" className="inline-flex items-center gap-1.5 text-primary-400 hover:text-primary-300"><ArrowLeft className="h-3.5 w-3.5" /> {t("auth.backToLogin")}</Link>}
    >
      {sent ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-400">
            <MailCheck className="h-7 w-7" />
          </div>
          <p className="mt-5 text-white/70">{t("auth.resetSentDesc")}</p>
          <p className="mt-2 text-sm text-white/40">{email}</p>
        </motion.div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <InputField icon={Mail} type="email" placeholder={t("common.email")} value={email} onChange={setEmail} />
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>{t("auth.sendResetLink")} <ArrowRight className="h-4 w-4" /></>}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
