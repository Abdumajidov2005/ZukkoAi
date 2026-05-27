import { motion } from "framer-motion";

// Glassmorphism card. Variants: glass | gradient | solid
export default function GlassCard({
  children,
  className = "",
  variant = "glass",
  hover = true,
  glow = false,
  as = "div",
  ...rest
}) {
  const base =
    "relative rounded-2xl overflow-hidden transition-all duration-300";
  const variants = {
    glass: "glass",
    gradient: "gradient-border",
    solid: "bg-bg-card border border-white/[0.06]",
  };
  const hoverCls = hover
    ? "hover:border-primary-500/40 hover:-translate-y-0.5"
    : "";
  const glowCls = glow ? "shadow-glow" : "shadow-card";

  const MotionTag = motion[as] || motion.div;

  return (
    <MotionTag
      className={`${base} ${variants[variant]} ${hoverCls} ${glowCls} ${className}`}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
