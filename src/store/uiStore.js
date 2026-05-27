import { create } from "zustand";
import { persist } from "zustand/middleware";

// ============================================================
// UI store — theme + sidebar + notifications
// ============================================================
export const useUIStore = create(
  persist(
    (set, get) => ({
      theme: "dark",
      sidebarOpen: true, // desktop
      mobileNavOpen: false,

      toggleTheme: () => {
        const next = get().theme === "dark" ? "light" : "dark";
        set({ theme: next });
      },
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setMobileNav: (v) => set({ mobileNavOpen: v }),

      notifications: [
        { id: "n1", title: "AI feedback ready", desc: "Your essay scored Band 6.5", time: "2m", read: false, type: "ai" },
        { id: "n2", title: "New homework", desc: "Writing Task 2 due tomorrow", time: "1h", read: false, type: "homework" },
        { id: "n3", title: "Leaderboard", desc: "You moved up to rank #4 🎉", time: "3h", read: true, type: "achievement" },
      ],
      markAllRead: () =>
        set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
    }),
    { name: "zukko-ui" }
  )
);
