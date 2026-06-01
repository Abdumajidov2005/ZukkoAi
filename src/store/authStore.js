import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEMO_USERS } from "../data/mockData";
import { USE_MOCK, authApi, setToken, setRefreshToken } from "../services/api";

const ROLE_MAP = {
  student: "student",
  teacher: "teacher",
  center:  "manager",
  admin:   "admin",
};

export const ROLE_HOME = {
  student: "/app/overview",
  teacher: "/teacher/students",
  manager: "/manager/analytics",
  admin:   "/admin/users",
};

function makeAvatar(fullname = "") {
  return fullname.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function decodeJWT(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return {};
  }
}

function userFromPayload(payload, fallbackEmail = "") {
  const rawRole  = payload.role || "student";
  const role     = ROLE_MAP[rawRole] || rawRole;
  const fullname = payload.full_name || payload.username || fallbackEmail.split("@")[0];
  return {
    id:       payload.user_id,
    email:    payload.email || fallbackEmail,
    fullname,
    username: payload.username || "",
    role,
    avatar:   makeAvatar(fullname),
  };
}

// Register javobidan username olish
// Backend: { full_name, email, password, role } → { full_name, email, role, username?, ... }
function extractUsername(registerResponse, fallbackEmail) {
  // Backend username qaytarishi mumkin yoki email dan olamiz
  return registerResponse?.username || fallbackEmail.split("@")[0];
}

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user:            null,
      token:           null,
      isAuthenticated: false,

      // ── LOGIN ──────────────────────────────────────────────
      // username — bu Django username (email bilan bir xil bo'lishi mumkin yoki alohida)
      login: async ({ email, password, username }) => {
        if (!USE_MOCK) {
          try {
            // Avval username bilan sinab ko'ramiz, bo'lmasa email bilan
            const loginId = username || email;
            const data = await authApi.login({ username: loginId, password });
            setToken(data.access);
            setRefreshToken(data.refresh);
            const payload = decodeJWT(data.access);
            const user    = userFromPayload(payload, email || loginId);
            set({ user, token: data.access, isAuthenticated: true });
            return { ok: true, user };
          } catch (err) {
            // Agar username bilan xato bo'lsa va email boshqacha bo'lsa, email bilan urinib ko'r
            if (username && username !== email && email) {
              try {
                const data2 = await authApi.login({ username: email, password });
                setToken(data2.access);
                setRefreshToken(data2.refresh);
                const payload2 = decodeJWT(data2.access);
                const user2    = userFromPayload(payload2, email);
                set({ user: user2, token: data2.access, isAuthenticated: true });
                return { ok: true, user: user2 };
              } catch {}
            }
            const msg =
              err.data?.detail ||
              err.data?.non_field_errors?.[0] ||
              err.message ||
              "Login amalga oshmadi.";
            return { ok: false, error: msg };
          }
        }
        // mock
        await new Promise((r) => setTimeout(r, 600));
        const found = DEMO_USERS.find(
          (u) => u.email.toLowerCase() === (email || "").toLowerCase() && u.password === password
        );
        if (!found) return { ok: false, error: "Email yoki parol noto'g'ri." };
        const { password: _pw, ...safeUser } = found;
        setToken("demo.jwt." + btoa(found.id));
        set({ user: safeUser, token: "demo.jwt." + btoa(found.id), isAuthenticated: true });
        return { ok: true, user: safeUser };
      },

      // ── REGISTER ───────────────────────────────────────────
      register: async ({ fullname, email, password, role = "student" }) => {
        if (!USE_MOCK) {
          try {
            const backendRole = role === "manager" ? "center" : role;
            // Register qilish
            const regData = await authApi.register({
              full_name: fullname,
              email,
              password,
              role: backendRole,
            });

            // Register javobidan username olish
            // Backend username qaytarsa ishlatamiz, bo'lmasa email bilan urinib ko'ramiz
            const username = extractUsername(regData, email);

            // Login qilish — username bilan ham, email bilan ham urinib ko'ramiz
            return await get().login({ email, password, username });

          } catch (err) {
            const msg =
              err.data?.email?.[0] ||
              err.data?.username?.[0] ||
              err.data?.full_name?.[0] ||
              err.data?.password?.[0] ||
              err.data?.detail ||
              err.message ||
              "Ro'yxatdan o'tish amalga oshmadi.";
            return { ok: false, error: msg };
          }
        }
        // mock
        await new Promise((r) => setTimeout(r, 700));
        if (DEMO_USERS.some((u) => u.email === email))
          return { ok: false, error: "Bu email bilan hisob mavjud." };
        const newUser = {
          id: "new-" + Date.now(), fullname, email,
          role, avatar: makeAvatar(fullname), band: null,
        };
        setToken("demo.jwt.new");
        set({ user: newUser, token: "demo.jwt.new", isAuthenticated: true });
        return { ok: true, user: newUser };
      },

      // ── LOGOUT ─────────────────────────────────────────────
      logout: () => {
        setToken(null);
        setRefreshToken(null);
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
