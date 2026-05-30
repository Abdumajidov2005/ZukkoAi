# ZukkoAI — Frontend

IELTS tayyorgarlik platformasi. React + Vite + TailwindCSS.

## Ishga tushirish

```bash
npm install
npm run dev
```

Brauzerda: http://localhost:5173

## Muhit o'zgaruvchilari

`.env` fayli allaqachon sozlangan:

```env
VITE_API_BASE_URL=https://zukko.pythonanywhere.com
VITE_USE_MOCK=false
```

**Mock rejimga o'tish** (backend yo'q bo'lganda):
```env
VITE_USE_MOCK=true
```

## Deploy (Vercel)

1. GitHub ga push qiling
2. Vercel da import qiling
3. Environment variables qo'shing:
   - `VITE_API_BASE_URL` = `https://zukko.pythonanywhere.com`
   - `VITE_USE_MOCK` = `false`

## Loyiha strukturasi

```
src/
├── pages/
│   ├── auth/          # Login, Register
│   ├── student/       # Dashboard, AIChecker, Progress, Homework...
│   ├── teacher/       # Students, Essays, Groups...
│   ├── manager/       # Analytics, Payments...
│   └── admin/         # Users, Settings...
├── services/
│   └── api.js         # Barcha API endpointlar
├── store/
│   └── authStore.js   # Auth state (Zustand)
└── hooks/
    └── useAIChecker.js # Essay tekshirish hook
```

## Rollar

| Backend roli | Frontend roli | Dashboard |
|---|---|---|
| `student` | `student` | `/app/overview` |
| `teacher` | `teacher` | `/teacher/students` |
| `center`  | `manager` | `/manager/analytics` |
| `admin`   | `admin`   | `/admin/users` |

> ⚠️ Backend `center` roli yuboradi, frontend uni `manager` ga moslashtiradi.

## Muhim texnik eslatmalar

- **JWT refresh**: Token muddati o'tsa avtomatik yangilanadi
- **Essay timeout**: AI tekshiruv 120 sek kutadi (backend 30-60 sek ishlov beradi)
- **Vite proxy**: Development da CORS muammo bo'lmasligi uchun `/api` va `/token` proxy orqali yo'naltiriladi
