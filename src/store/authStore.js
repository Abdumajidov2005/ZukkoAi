import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEMO_USERS } from "../data/mockData";
import { USE_MOCK, authApi, setToken } from "../services/api";

// ============================================================
// Auth store — JWT / role-based auth.
//
// Works in two modes (controlled by VITE_USE_MOCK in .env):
//   • MOCK (default): validates against DEMO_USERS, no server.
//   • REAL: calls authApi.login / authApi.register on your backend.
//
// The component-facing API (login/register/logout/hasRole) is
// identical in both modes, so you can switch by editing .env only.
// ============================================================

function makeAvatar(fullname = "") {
  return fullname
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // ---------- LOGIN ----------
      login: async ({ email, password }) => {
        if (!USE_MOCK) {
          try {
            // Expected backend response: { token, user }
            const data = await authApi.login({ email, password });
            setToken(data.token);
            set({ user: data.user, token: data.token, isAuthenticated: true });
            return { ok: true, user: data.user };
          } catch (err) {
            return { ok: false, error: err.message || "Login failed." };
          }
        }

        // --- mock mode ---
        await new Promise((r) => setTimeout(r, 700));
        const found = DEMO_USERS.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        if (!found) {
          return { ok: false, error: "Invalid email or password." };
        }
        const { password: _pw, ...safeUser } = found;
        const token = "demo.jwt." + btoa(found.id);
        setToken(token);
        set({ user: safeUser, token, isAuthenticated: true });
        return { ok: true, user: safeUser };
      },

      // ---------- REGISTER ----------
      register: async ({ fullname, email, password, role = "student" }) => {
        if (!USE_MOCK) {
          try {
            const data = await authApi.register({ fullname, email, password, role });
            setToken(data.token);
            set({ user: data.user, token: data.token, isAuthenticated: true });
            return { ok: true, user: data.user };
          } catch (err) {
            return { ok: false, error: err.message || "Registration failed." };
          }
        }

        // --- mock mode ---
        await new Promise((r) => setTimeout(r, 800));
        if (DEMO_USERS.some((u) => u.email === email)) {
          return { ok: false, error: "An account with this email already exists." };
        }
        const newUser = {
          id: "new-" + Date.now(),
          fullname,
          email,
          role,
          avatar: makeAvatar(fullname),
          band: null,
        };
        const token = "demo.jwt.new";
        setToken(token);
        set({ user: newUser, token, isAuthenticated: true });
        return { ok: true, user: newUser };
      },

      // ---------- LOGOUT ----------
      logout: () => {
        setToken(null);
        set({ user: null, token: null, isAuthenticated: false });
      },

      hasRole: (roles) => {
        const u = get().user;
        if (!u) return false;
        return Array.isArray(roles) ? roles.includes(u.role) : u.role === roles;
      },
    }),
    { name: "zukko-auth" }
  )
);
