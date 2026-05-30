// ============================================================
// ZUKKO AI — API client (Production ready)
// ============================================================

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://zukko.pythonanywhere.com";
export const USE_MOCK = String(import.meta.env.VITE_USE_MOCK ?? "true") === "true";

const ACCESS_KEY  = "zukko-access";
const REFRESH_KEY = "zukko-refresh";

export function getToken()       { try { return localStorage.getItem(ACCESS_KEY)  || null; } catch { return null; } }
export function setToken(t)      { try { t ? localStorage.setItem(ACCESS_KEY, t)  : localStorage.removeItem(ACCESS_KEY);  } catch {} }
export function getRefreshToken(){ try { return localStorage.getItem(REFRESH_KEY) || null; } catch { return null; } }
export function setRefreshToken(t){ try { t ? localStorage.setItem(REFRESH_KEY, t): localStorage.removeItem(REFRESH_KEY); } catch {} }

// Silent token refresh — bir vaqtda bir marta
let _refreshPromise = null;
async function refreshAccessToken() {
  if (_refreshPromise) return _refreshPromise;
  _refreshPromise = (async () => {
    const refresh = getRefreshToken();
    if (!refresh) throw new Error("No refresh token");
    const res = await fetch(`${API_BASE_URL}/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) { setToken(null); setRefreshToken(null); throw new Error("Session expired"); }
    const data = await res.json();
    setToken(data.access);
    return data.access;
  })();
  try   { return await _refreshPromise; }
  finally { _refreshPromise = null; }
}

function getLang() {
  try { const r = localStorage.getItem("zukko-lang"); return r ? JSON.parse(r)?.state?.lang || "uz" : "uz"; }
  catch { return "uz"; }
}

// Essay submit 30-60 sek ketishi mumkin — timeout 90 sek
const DEFAULT_TIMEOUT = 90_000;
const ESSAY_TIMEOUT   = 120_000;

export async function apiRequest(path, {
  method = "GET", body, headers = {}, signal, skipAuth = false, timeout,
} = {}) {
  const ms = timeout ?? (path.includes("/writing/submit") ? ESSAY_TIMEOUT : DEFAULT_TIMEOUT);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  // Tashqi signal bilan ham ulash
  if (signal) signal.addEventListener("abort", () => controller.abort());

  const token = getToken();

  const doFetch = (tok) =>
    fetch(`${API_BASE_URL}${path}`, {
      method,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": getLang(),
        ...(tok && !skipAuth ? { Authorization: `Bearer ${tok}` } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

  try {
    let res = await doFetch(token);

    // 401 → token yangilash va qayta urinish
    if (res.status === 401 && !skipAuth) {
      try {
        const newToken = await refreshAccessToken();
        res = await doFetch(newToken);
      } catch {
        setToken(null); setRefreshToken(null);
        window.location.href = "/login";
        throw new Error("Session expired");
      }
    }

    let data = null;
    const text = await res.text();
    if (text) { try { data = JSON.parse(text); } catch { data = text; } }

    if (!res.ok) {
      const message =
        data?.detail ||
        data?.message ||
        (data?.non_field_errors?.[0]) ||
        Object.values(data || {})?.[0]?.[0] ||
        res.statusText ||
        "So'rov bajarilmadi";
      const err = new Error(message);
      err.status = res.status;
      err.data   = data;
      throw err;
    }
    return data;

  } catch (err) {
    if (err.name === "AbortError") throw new Error("So'rov vaqti tugadi. Qayta urinib ko'ring.");
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export const api = {
  get:    (path, opts)        => apiRequest(path, { ...opts, method: "GET" }),
  post:   (path, body, opts)  => apiRequest(path, { ...opts, method: "POST",  body }),
  put:    (path, body, opts)  => apiRequest(path, { ...opts, method: "PUT",   body }),
  patch:  (path, body, opts)  => apiRequest(path, { ...opts, method: "PATCH", body }),
  delete: (path, opts)        => apiRequest(path, { ...opts, method: "DELETE" }),
};

// ── AUTH ─────────────────────────────────────────────────────
export const authApi = {
  login:    (creds)   => apiRequest("/token/",              { method: "POST", body: creds,   skipAuth: true }),
  register: (payload) => apiRequest("/api/users/register/", { method: "POST", body: payload, skipAuth: true }),
  refresh:  (refresh) => apiRequest("/token/refresh/",      { method: "POST", body: { refresh }, skipAuth: true }),
};

// ── DASHBOARD ────────────────────────────────────────────────
export const dashboardApi = {
  stats:             ()         => api.get("/api/dashboard/stats/"),
  bandProgress:      (p = {})   => api.get(`/api/dashboard/band-progress/?${new URLSearchParams(p)}`),
  skills:            (p = {})   => api.get(`/api/dashboard/skills/?${new URLSearchParams(p)}`),
  weeklyActivity:    ()         => api.get("/api/dashboard/weekly-activity/"),
  homework:          (p = {})   => api.get(`/api/dashboard/homework/?${new URLSearchParams(p)}`),
  recentSubmissions: (p = {})   => api.get(`/api/dashboard/recent-submissions/?${new URLSearchParams(p)}`),
};

// ── WRITING ──────────────────────────────────────────────────
export const writingApi = {
  getPrompts:         (p = {})      => api.get(`/api/writing/prompts/?${new URLSearchParams(p)}`),
  getPrompt:          (id)          => api.get(`/api/writing/prompts/${id}/`),
  createPrompt:       (body)        => api.post("/api/writing/prompts/create/", body),
  updatePrompt:       (id, body)    => api.put(`/api/writing/prompts/${id}/update/`, body),
  deletePrompt:       (id)          => api.delete(`/api/writing/prompts/${id}/delete/`),

  submit:             (body)        => apiRequest("/api/writing/submit/", { method: "POST", body, timeout: ESSAY_TIMEOUT }),
  getSubmissions:     (p = {})      => api.get(`/api/writing/submissions/?${new URLSearchParams(p)}`),
  getSubmission:      (id)          => api.get(`/api/writing/submissions/${id}/`),
  getProgress:        (p = {})      => api.get(`/api/writing/progress/?${new URLSearchParams(p)}`),

  teacherSubmissions: (p = {})      => api.get(`/api/writing/teacher/submissions/?${new URLSearchParams(p)}`),
  teacherSubmission:  (id)          => api.get(`/api/writing/teacher/submissions/${id}/`),
  teacherFeedback:    (id, body)    => api.post(`/api/writing/teacher/submissions/${id}/feedback/`, body),
  studentProgress:    (sid, p = {}) => api.get(`/api/writing/teacher/students/${sid}/progress/?${new URLSearchParams(p)}`),
};

// ── GROUPS ───────────────────────────────────────────────────
export const groupsApi = {
  getGroups:     (p = {})         => api.get(`/api/groups/?${new URLSearchParams(p)}`),
  createGroup:   (body)           => api.post("/api/groups/create/", body),
  getGroup:      (id)             => api.get(`/api/groups/${id}/`),
  updateGroup:   (id, body)       => api.put(`/api/groups/${id}/update/`, body),
  deleteGroup:   (id)             => api.delete(`/api/groups/${id}/delete/`),
  getStudents:   (id, p = {})     => api.get(`/api/groups/${id}/students/?${new URLSearchParams(p)}`),
  addStudent:    (id, body)       => api.post(`/api/groups/${id}/students/add/`, body),
  removeStudent: (id, sid, body)  => api.post(`/api/groups/${id}/students/${sid}/remove/`, body),
  teacherStudents:(p = {})        => api.get(`/api/groups/teacher/students/?${new URLSearchParams(p)}`),
};

// ── SUBSCRIPTION & PAYMENTS ──────────────────────────────────
export const subscriptionApi = {
  getPlans:    ()           => api.get("/api/subscription/plans/"),
  getPlan:     (id)         => api.get(`/api/subscription/plans/${id}/`),
  getMy:       ()           => api.get("/api/subscription/my/"),
  getUsage:    ()           => api.get("/api/subscription/usage/"),
  cancel:      ()           => api.post("/api/subscription/cancel/"),
  adminGrant:  (body)       => api.post("/api/subscription/admin/grant/", body),
  adminCreate: (body)       => api.post("/api/subscription/admin/plans/", body),
  adminUpdate: (id, body)   => api.put(`/api/subscription/admin/plans/${id}/`, body),
  adminDelete: (id)         => api.delete(`/api/subscription/admin/plans/${id}/delete/`),
};

export const paymentsApi = {
  checkout:  (body)  => api.post("/api/payments/checkout/", body),
  verify:    (txId)  => api.get(`/api/payments/verify/${txId}/`),
  history:   (p={})  => api.get(`/api/payments/history/?${new URLSearchParams(p)}`),
  getDetail: (id)    => api.get(`/api/payments/${id}/`),
};
