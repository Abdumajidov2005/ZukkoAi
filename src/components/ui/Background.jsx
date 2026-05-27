import { motion } from "framer-motion";

// Layered futuristic background: grid + glow blobs + faint particles.
export default function Background({ particles = true, dense = false }) {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* base */}
      <div className="absolute inset-0 bg-bg" />

      {/* grid */}
      <div className="absolute inset-0 bg-grid-pattern bg-[size:48px_48px] opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

      {/* glow blobs */}
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-40 -left-32 h-[34rem] w-[34rem] rounded-full bg-primary-600/25 blur-[120px]"
      />
      <motion.div
        animate={{ x: [0, -50, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 -right-40 h-[30rem] w-[30rem] rounded-full bg-secondary-500/20 blur-[120px]"
      />
      {dense && (
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-1/3 h-[26rem] w-[26rem] rounded-full bg-glow/20 blur-[120px]"
        />
      )}

      {/* particles */}
      {particles && (
        <div className="absolute inset-0">
          {Array.from({ length: 22 }).map((_, i) => {
            const left = (i * 47) % 100;
            const top = (i * 31) % 100;
            const dur = 6 + (i % 6);
            return (
              <motion.span
                key={i}
                className="absolute h-1 w-1 rounded-full bg-primary-400/60"
                style={{ left: `${left}%`, top: `${top}%` }}
                animate={{ y: [0, -24, 0], opacity: [0.2, 0.9, 0.2] }}
                transition={{ duration: dur, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
