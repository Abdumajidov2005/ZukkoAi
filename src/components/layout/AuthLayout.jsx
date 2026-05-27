import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, CheckCircle2 } from "lucide-react";
import Background from "../../components/ui/Background";

const HIGHLIGHTS = [
  "Instant AI band scores on every essay",
  "Full IELTS mock tests & speaking analysis",
  "A 24/7 AI tutor in your pocket",
];

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="relative min-h-screen lg:grid lg:grid-cols-2">
      <Background particles={false} />

      {/* Left brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/15 via-transparent to-secondary-500/10" />
        <Link to="/" className="relative flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary-600 to-secondary-500 shadow-glow">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-lg font-semibold text-white">ZUKKO<span className="gradient-text"> AI</span></span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <h2 className="font-display text-4xl font-semibold leading-tight text-white text-balance">
            Your fastest path to a <span className="gradient-text">higher band.</span>
          </h2>
          <ul className="mt-8 space-y-4">
            {HIGHLIGHTS.map((h, i) => (
              <motion.li
                key={h}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.12 }}
                className="flex items-center gap-3 text-white/70"
              >
                <CheckCircle2 className="h-5 w-5 text-primary-400" />
                {h}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <div className="relative text-sm text-white/40">
          "I improved a full band in two months." — Sardor M.
        </div>
      </div>

      {/* Right form */}
      <div className="relative flex items-center justify-center p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="lg:hidden mb-8 inline-flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary-600 to-secondary-500 shadow-glow">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-display text-lg font-semibold text-white">ZUKKO<span className="gradient-text"> AI</span></span>
          </Link>

          <h1 className="font-display text-3xl font-semibold tracking-tight text-white">{title}</h1>
          {subtitle && <p className="mt-2 text-white/50">{subtitle}</p>}

          <div className="mt-8">{children}</div>

          {footer && <div className="mt-6 text-center text-sm text-white/50">{footer}</div>}
        </motion.div>
      </div>
    </div>
  );
}
