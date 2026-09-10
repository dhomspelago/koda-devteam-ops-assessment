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

- Docker Desktop (backend)
- Node.js 20+ and npm (frontend)
- Optional on the host: PHP 8.3+ / Composer (only if you skip Docker)

## First run

### Backend (API) — Docker (recommended)

```bash
cd backend
cp .env.example .env
# set APP_KEY if empty: docker compose run --rm app php artisan key:generate
make up
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

### Default users

After seeding (`php artisan db:seed`):

| Email | Name | Password |
|-------|------|----------|
| `admin@example.com` | Admin | `password` |
| `test1@example.com` … `test5@example.com` | Test User 1–5 | `password` |

Seeding also inserts **12 sample projects** (Acme Corporation, GreenLeaf Cafe, etc.) for the Projects UI.

Use `admin@example.com` / `password` for local login.

### Auth examples

```bash
# Login
curl -s -X POST http://localhost:8000/api/v1/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Current user (replace TOKEN)
curl -s http://localhost:8000/api/v1/me \
  -H "Authorization: Bearer TOKEN" \
  -H "Accept: application/json"

# Logout
curl -s -X POST http://localhost:8000/api/v1/logout \
  -H "Authorization: Bearer TOKEN" \
  -H "Accept: application/json"
```

Protected Users CRUD lives under `/api/v1/users` (requires the bearer token).

### Frontend (Next.js)

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

App listens on [http://localhost:3000](http://localhost:3000).

Next.js rewrites `/api` to `http://127.0.0.1:8000`, so the app can call `/api/v1/...` without CORS during local development. Laravel CORS is also configured for `FRONTEND_URL` (default `http://localhost:3000`) when the frontend talks to the API host directly.

## Smoke test

1. Start backend Docker (`make up`) and the frontend (`npm run dev`).
2. Open [http://localhost:3000](http://localhost:3000) and sign in with `admin@example.com` / `password`.
3. On **Users** (`/`), confirm the seeded users list, then create / edit / delete a user.
4. On **Projects** (`/projects`), confirm the 12 sample projects, then exercise filters, sort, pagination, and create / edit / delete.
5. Optionally open [http://localhost:8000/docs](http://localhost:8000/docs) and try the API with the default user.
6. Or run backend tests:

```bash
cd backend
make test
```

## Notes

- API routes are versioned under `/api/v1`.
- Built-in Laravel health probe remains at `/up`.
- OpenAPI docs use LenTraq-style annotations under `backend/app/Swagger/` (UI at `/docs`).
- Auth uses Laravel Sanctum personal access tokens.
