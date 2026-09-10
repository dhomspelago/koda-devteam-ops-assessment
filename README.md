# Koda Devteam Ops Assessment

Monorepo with a Laravel JSON API (`backend/`) and a Next.js frontend (`frontend/`). Laravel does not serve the UI — the Next.js app is the only frontend.

## Structure

```
koda-devteam-ops-assessment/
  README.md
  backend/     Laravel API (Docker: nginx + php-fpm + MySQL, Pest, /api/v1)
  frontend/    Next.js + React + TypeScript + Tailwind
```

## Prerequisites

Install these before running locally:

- **Docker Desktop** — backend stack (nginx + php-fpm + MySQL)
- **Node.js 20+** and **npm** — frontend

## Programs and stack used

| Area | Stack |
|------|--------|
| Backend | PHP 8.4 (Docker image) / Laravel 13, Sanctum, MySQL 8, Pest, l5-swagger (OpenAPI), Laravel Pint |
| Frontend | Next.js 15, React 19, TypeScript, Tailwind 4, TanStack Query, Zod, Axios, Better Auth|
| Tooling | Docker Compose, npm, **Cursor** (AI-assisted development) |

## Setup and run

### 1. Backend (API) — Docker (recommended)

```bash
cd backend
cp .env.example .env
# set APP_KEY if empty: docker compose run --rm app php artisan key:generate
docker compose up -d
# or: docker compose up -d --build
docker compose exec app php artisan db:seed
docker compose exec app php artisan l5-swagger:generate
```

| Service | URL / port |
|---------|------------|
| API (nginx) | [http://localhost:8000](http://localhost:8000) |
| MySQL | `localhost:3306` (`koda` / `koda` / `secret`) |
| Swagger UI | [http://localhost:8000/docs](http://localhost:8000/docs) |

Health check: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)

Useful Make targets: `make logs`, `make shell`, `make migrate`, `make test`, `make down`, `make fresh`.

`DB_HOST=mysql` is correct inside Compose. If you run PHP on the host against the published MySQL port, use `DB_HOST=127.0.0.1`.

API auth and Users/Projects CRUD can be verified via Swagger at `/docs` or by signing in through the frontend (below).

### 2. Default users

After seeding (`php artisan db:seed`):

| Email | Name | Password |
|-------|------|----------|
| `admin@example.com` | Admin | `password` |

Seeding also inserts **12 sample projects** (Acme Corporation, GreenLeaf Cafe, etc.) for the Projects UI.

Use `admin@example.com` / `password` for local login.

### 3. Frontend (Next.js)

```bash
cd frontend
npm install
cp .env.example .env
# set BETTER_AUTH_SECRET to a random string (e.g. openssl rand -base64 32)
npm run dev
```

App listens on [http://localhost:3000](http://localhost:3000).

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | Client API base (default `/api/v1`) |
| `BACKEND_URL` | Laravel origin for Next rewrites (default `http://127.0.0.1:8000`) |
| `BETTER_AUTH_SECRET` | Required secret for Better Auth sessions |
| `BETTER_AUTH_URL` | App URL (default `http://localhost:3000`) |

Next.js rewrites `/api` to `BACKEND_URL`, so the app can call `/api/v1/...` without CORS during local development. Laravel CORS is also configured for `FRONTEND_URL` (default `http://localhost:3000`) when the frontend talks to the API host directly.

## Smoke test

1. Start backend Docker (`make up`) and the frontend (`npm run dev`).
2. Open [http://localhost:3000](http://localhost:3000) and sign in with `admin@example.com` / `password`.
3. On **Users** (`/`), confirm the seeded users list, then create / edit / delete a user.
4. On **Projects** (`/projects`), confirm the 12 sample projects, then exercise filters, sort, pagination, and create / edit / delete.
5. Optionally open [http://localhost:8000/docs](http://localhost:8000/docs) and try the API with the default user.
6. Or run backend tests:

```bash
cd backend
docker compose exec app php artisan test
```

## Technical reflection

I would have preferred a **multi-repo** layout (separate backend and frontend repositories). The Google Drive submission only accepts **one repository**, so I delivered this as a **single monorepo** with `backend/` and `frontend/` kept clearly separated.

On the **backend**, I used Laravel’s **MVC** shape with a **Service Layer** for query and business orchestration, plus **DTOs** where they clarify inputs (for example index/filter query objects). Validation lives in Form Requests, responses use API Resources, routes are versioned under `/api/v1`, and auth uses **Laravel Sanctum** personal access tokens. Controllers are mostly single-action (invokable) to keep HTTP thin. OpenAPI lives under `app/Swagger/` rather than on controllers.

On the **frontend**, I used **Next.js** (App Router) with Zod schemas, TanStack Query hooks, and Axios against the API. For authentication I used **Better Auth without a database**: it owns the browser session/cookie layer, bridges to Laravel’s login endpoint, and stores the Sanctum token so API calls send `Authorization: Bearer …`.

I used **Cursor** as an AI coding assistant where it sped up scaffolding and boilerplate; architecture choices, validation, and behavior were reviewed and owned by me.

## Notes

- API routes are versioned under `/api/v1`.
- Built-in Laravel health probe remains at `/up`.
- OpenAPI docs use LenTraq-style annotations under `backend/app/Swagger/` (UI at `/docs`).
- Auth uses Laravel Sanctum personal access tokens on the API; the UI session is Better Auth (no Better Auth DB).
