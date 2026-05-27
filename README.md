# ZUKKO AI — AI-Powered English / IELTS Learning Platform

A premium, futuristic multi-role SaaS frontend for learning English and preparing for IELTS, powered by a simulated AI engine. Built with React, Vite, Tailwind CSS, Framer Motion, Zustand and React Router.

## Features

- **Landing page** — hero, bento feature grid, dashboard preview, testimonials, pricing, FAQ and contact.
- **Auth** — login, register, forgot-password with role-based redirects and a JWT-style demo session (persisted via Zustand).
- **AI Writing Checker** (core feature) — paste an essay and get a simulated IELTS band, per-criterion breakdown, grammar issues, vocabulary suggestions, a rewritten model answer and AI feedback.
- **Four role dashboards**, each behind a protected route:
  - **Student** — Overview, AI Writing Checker, IELTS Tests (interactive quiz runner), Vocabulary (flashcards), Speaking (mock recorder + AI evaluation), Progress, Homework, Leaderboard, Profile.
  - **Teacher** — Students, Groups, Essay review queue, Assignments, Statistics, Messages, Attendance.
  - **Manager** — Analytics, Teachers, Groups, Payments, Courses, Reports.
  - **Admin** — Users, Roles, Permissions matrix, AI Settings, Subscription, System Analytics, Database, Logs, API Management.
- **Premium UX** — glassmorphism, neon glow, animated charts (Recharts), Framer Motion transitions, floating AI Tutor chat, notifications, dark/light theme toggle and a fully responsive layout.

## Demo accounts

All accounts use the password **1234**.

| Role    | Email              |
|---------|--------------------|
| Student | student@zukko.ai   |
| Teacher | teacher@zukko.ai   |
| Manager | manager@zukko.ai   |
| Admin   | admin@zukko.ai     |

The login screen also has one-tap quick-login buttons for each role.

## Getting started

```bash
npm install      # install dependencies
npm run dev      # start dev server (http://localhost:5173)
npm run build    # production build -> dist/
npm run preview  # preview the production build
npm run lint     # run ESLint
```

## Tech & architecture

- **React 19 + Vite** — fast dev server and an optimized, code-split production build (each dashboard page is lazy-loaded on demand).
- **Tailwind CSS** — custom design tokens in tailwind.config.js; reusable component classes (.glass, .gradient-text, .btn-primary, ...) in src/index.css.
- **Framer Motion** — entrance animations and page transitions.
- **Zustand** (with persist) — authStore (session) and uiStore (theme, sidebar, notifications).
- **React Router** — public, auth and role-prefixed protected routes (/app/*, /teacher/*, /manager/*, /admin/*).
- **Recharts** — all data visualizations.
- **lucide-react** — icon set.

### Project structure

```
src/
  App.jsx                  # all routes (lazy-loaded dashboards)
  main.jsx                 # BrowserRouter entry
  index.css                # design system / component classes
  data/mockData.js         # mock API layer (all demo data)
  store/                   # Zustand stores (auth, ui)
  hooks/                   # useTheme, useAIChecker, useInView
  components/
    ui/                    # StatCard, Badge, GlassCard, Avatar, Background...
    layout/                # ProtectedRoute, AuthLayout, DashboardLayout
    landing/               # Hero, Features, Pricing, FAQ, navbar, footer...
    dashboard/             # Sidebar, Topbar, AITutor, navConfig, shared helpers
  pages/
    public/ auth/ student/ teacher/ manager/ admin/
```

## Notes

- The "AI" is **simulated client-side** (see src/hooks/useAIChecker.js) so the app runs entirely in the browser with no backend or API keys. The mock data layer in src/data/mockData.js is structured so it could be swapped for real API calls.
- public/_redirects and public/vercel.json provide SPA fallback so deep links work when deployed to static hosts (Netlify / Vercel).

---

Built as a frontend showcase. All data is fictional.
