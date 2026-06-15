# GSFSGroup

Career platform + AI API key platform for ambitious professionals.

- **Find your next role** — 1-10 curated jobs every week, AI-matched to your skills.
- **Get a free AI API key** on signup, with daily limits. Pro / Extra plans unlock more job boards and better LLM models.
- **AI Resume Builder, Interview Coach, Career Path Planner, Courses** all in one place.
- **Admin console** for managing users, jobs, API keys, and viewing analytics.

## Project layout

```
mern-simple/
├── backend/                    # Express + JWT auth + in-memory store
│   └── server.js               # all routes: auth, jobs, api keys, billing, analytics, contact
├── frontend/                   # Vite + React 18 (JavaScript only)
│   ├── public/                 # static assets (drop bot-girl.gif here for the chatbot avatar)
│   └── src/
│       ├── main.jsx
│       ├── App.jsx             # landing + auth pages + view switcher
│       ├── App.css             # all styles
│       ├── api/client.js       # tiny fetch wrapper with JWT auth header
│       └── components/
│           ├── ChatBot.jsx     # "Aria" — AI chat assistant in the bottom-right
│           ├── Dashboards.jsx  # full user + admin dashboard (sidebar + pages)
│           └── Icons.jsx       # inline SVG icon library
├── package.json                # root scripts
└── README.md
```

## Tech

- **Vite 5 + React 18** (JavaScript only, no TypeScript)
- **Express + bcryptjs + jsonwebtoken** for auth
- **In-memory data store** (no MongoDB needed to run locally)
- **Plain CSS** with design tokens — no framework

## Quick start

```bash
npm run install:all   # installs root, backend, frontend deps
npm run dev           # starts backend (5000) + frontend (5173)
```

Open **http://127.0.0.1:5173/**.

## Production build

```bash
npm run build         # builds frontend into frontend/dist
npm start             # backend serves the built bundle + API on :5000
```

Then open **http://localhost:5000/**.

## Demo accounts (auto-seeded)

| Role  | Email                       | Password   |
|-------|-----------------------------|------------|
| Admin | `admin@gsfsgroup.demo`      | `admin123` |
| User  | `demo@gsfsgroup.demo`       | `demo1234` |

You can also **create a new account** at any time from the Sign Up page.

## Routes

| Path                     | Description                          | Auth     |
|--------------------------|--------------------------------------|----------|
| `GET /api/hello`         | Demo route, returns seed stats       | public   |
| `POST /api/auth/signup`  | `{ name, email, password }`          | public   |
| `POST /api/auth/login`   | `{ email, password }`                | public   |
| `GET /api/auth/me`       | current user                         | user     |
| `PATCH /api/auth/me`     | update name                          | user     |
| `GET /api/jobs`          | list jobs (filter `?featured=true`)  | public   |
| `POST /api/jobs/:id/apply` | record application                 | user     |
| `GET /api/api-keys/mine` | list own API keys                    | user     |
| `POST /api/api-keys/mine`| create new key                       | user     |
| `POST /api/billing/checkout` | upgrade plan (`{ plan: 'pro' \| 'extra' }`) | user |
| `POST /api/contact`      | store contact form submission        | public   |
| `GET /api/users`         | list users                           | admin    |
| `PATCH /api/users/:id/role` | change user role                  | admin    |
| `DELETE /api/users/:id`  | delete user                          | admin    |
| `POST /api/jobs`         | create job                           | admin    |
| `PUT /api/jobs/:id`      | update job                           | admin    |
| `DELETE /api/jobs/:id`   | delete job                           | admin    |
| `GET /api/api-keys`      | list all keys                        | admin    |
| `GET /api/analytics/overview` | totals + 7-day chart           | admin    |
| `GET /api/analytics/events`   | event log                     | admin    |

## Notes

- Data is in-memory — restarting the backend clears all users, jobs, and keys (seed re-runs).
- The bot avatar uses `/bot-girl.gif` if present in `frontend/public/`, otherwise a CSS fallback.
- In dev, the Vite dev server proxies `/api/*` to the backend on `:5000`.
