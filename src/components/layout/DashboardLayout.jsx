import { useState } from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Sidebar from "../dashboard/Sidebar";
import Topbar from "../dashboard/Topbar";
import AITutor from "../dashboard/AITutor";
import { useAuthStore } from "../../store/authStore";

export default function DashboardLayout() {
  const [tutorOpen, setTutorOpen] = useState(false);
  const user = useAuthStore((s) => s.user);

  return (
    <div className="relative flex min-h-screen bg-bg">
      {/* subtle background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-pattern bg-[size:48px_48px] opacity-30 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="absolute -top-40 right-0 h-96 w-96 rounded-full bg-primary-600/10 blur-[120px]" />
      </div>

      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenTutor={() => setTutorOpen(true)} />
        <main className="flex-1 px-4 md:px-6 lg:px-8 py-6 md:py-8">
          <motion.div
            key={typeof window !== "undefined" ? window.location.pathname : "page"}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mx-auto max-w-7xl"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Floating AI tutor button (students) */}
      {user?.role === "student" && !tutorOpen && (
        <motion.button
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
          onClick={() => setTutorOpen(true)}
          className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-500 shadow-glow"
        >
          <Sparkles className="h-6 w-6 text-white" />
          <span className="absolute inset-0 rounded-2xl bg-primary-500/40 animate-ping" style={{ animationDuration: "3s" }} />
        </motion.button>
      )}

      <AITutor open={tutorOpen} onClose={() => setTutorOpen(false)} />
    </div>
  );
}
