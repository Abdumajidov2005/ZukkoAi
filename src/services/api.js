// ============================================================
// ZUKKO AI — API client
// ------------------------------------------------------------
// Single place that talks to the backend. When you connect your
// real API, you usually DON'T need to touch the components:
//   1. Copy .env.example -> .env
//   2. Set VITE_API_BASE_URL to your server URL
//   3. Set VITE_USE_MOCK=false
// The stores already call this client (see authStore.js).
// ============================================================

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

// When true (default), the app runs fully on mock data with no server.
// Flip VITE_USE_MOCK=false in .env to hit the real backend.
export const USE_MOCK = String(import.meta.env.VITE_USE_MOCK ?? "true") === "true";

const TOKEN_KEY = "zukko-token";

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || null;
  } catch {
    return null;
  }
}
export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

// Core request helper. Automatically attaches the JWT, the current
// language (so the backend can localize responses) and JSON headers.
export async function apiRequest(path, { method = "GET", body, headers = {}, signal } = {}) {
  const token = getToken();
  let lang = "uz";
  try {
    const raw = localStorage.getItem("zukko-lang");
    if (raw) lang = JSON.parse(raw)?.state?.lang || "uz";
  } catch {
    /* ignore */
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    signal,
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": lang,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const message = (data && data.message) || res.statusText || "Request failed";
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

// Convenience verbs
export const api = {
  get: (path, opts) => apiRequest(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => apiRequest(path, { ...opts, method: "POST", body }),
  put: (path, body, opts) => apiRequest(path, { ...opts, method: "PUT", body }),
  patch: (path, body, opts) => apiRequest(path, { ...opts, method: "PATCH", body }),
  delete: (path, opts) => apiRequest(path, { ...opts, method: "DELETE" }),
};

// ------------------------------------------------------------
// Endpoint map — edit these paths to match your backend routes.
// Components/stores reference api.* through these helpers so the
// rest of the app never hardcodes a URL.
// ------------------------------------------------------------
export const authApi = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (payload) => api.post("/auth/register", payload),
  me: () => api.get("/auth/me"),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
};
