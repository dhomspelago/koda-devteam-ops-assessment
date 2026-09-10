# Koda Devteam Ops Assessment

Monorepo with a Laravel JSON API (`backend/`) and a React SPA (`frontend/`). Laravel does not serve the UI — the SPA is the only frontend.

## Structure

```
koda-devteam-ops-assessment/
  README.md
  backend/     Laravel API (SQLite, Pest, /api/v1)
  frontend/    Vite + React + TypeScript + Tailwind
```

## Prerequisites

- PHP 8.3+ (8.4 tested)
- Composer 2.x
- Node.js 20+
- npm

## First run

### Backend (API)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

API listens on [http://127.0.0.1:8000](http://127.0.0.1:8000).

Health check: [http://127.0.0.1:8000/api/v1/health](http://127.0.0.1:8000/api/v1/health)

### Frontend (SPA)

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

SPA listens on [http://localhost:5173](http://localhost:5173).

Vite proxies `/api` to `http://127.0.0.1:8000`, so the SPA can call `/api/v1/...` without CORS during local development. Laravel CORS is also configured for `FRONTEND_URL` (default `http://localhost:5173`) when the SPA talks to the API host directly.

## Smoke test

1. Start both servers.
2. Open the SPA — it fetches `/api/v1/health` and shows **API reachable** when the backend is up.
3. Or run backend tests:

```bash
cd backend
php artisan test
```

## Notes

- API routes are versioned under `/api/v1`.
- Built-in Laravel health probe remains at `/up`.
- Auth, domain models, Docker, and CI are intentionally out of scope for this scaffold.
