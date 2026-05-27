import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEMO_USERS } from "../data/mockData";

// ============================================================
// Auth store — JWT/role-based auth simulated client-side.
// In production: Axios + refresh token interceptor.
// ============================================================
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async ({ email, password }) => {
        // simulate network latency
        await new Promise((r) => setTimeout(r, 700));
        const found = DEMO_USERS.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        if (!found) {
          return { ok: false, error: "Invalid email or password." };
        }
        const { password: _pw, ...safeUser } = found;
        set({
          user: safeUser,
          token: "demo.jwt." + btoa(found.id),
          isAuthenticated: true,
        });
        return { ok: true, user: safeUser };
      },

      register: async ({ fullname, email, role = "student" }) => {
        await new Promise((r) => setTimeout(r, 800));
        if (DEMO_USERS.some((u) => u.email === email)) {
          return { ok: false, error: "An account with this email already exists." };
        }
        const newUser = {
          id: "new-" + Date.now(),
          fullname,
          email,
          role,
          avatar: fullname.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase(),
          band: null,
        };
        set({ user: newUser, token: "demo.jwt.new", isAuthenticated: true });
        return { ok: true, user: newUser };
      },

      logout: () => set({ user: null, token: null, isAuthenticated: false }),

      hasRole: (roles) => {
        const u = get().user;
        if (!u) return false;
        return Array.isArray(roles) ? roles.includes(u.role) : u.role === roles;
      },
    }),
    { name: "zukko-auth" }
  )
);
