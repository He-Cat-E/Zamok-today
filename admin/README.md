# Zamok Today — Admin panel

Next.js admin app (port **3001**) using the same backend API as the public site.

## Setup

```bash
cd admin
cp .env.local.example .env.local
npm install
```

Ensure `backend/.env` includes:

```env
ADMIN_ORIGIN=http://localhost:3001
ADMIN_EMAIL=admin@zamok.local
ADMIN_PASSWORD=your-secure-password
```

On first API start, a **super admin** is created if none exists (using `ADMIN_EMAIL` / `ADMIN_PASSWORD`).

## Run

From repo root:

```bash
npm run dev:backend   # port 4000
npm run dev:admin     # port 3001
```

Open [http://localhost:3001](http://localhost:3001) → login only (no register / forgot password / email verify).

## API

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/admin/auth/login` | Admin login (`admin_token` cookie) |
| POST | `/api/admin/auth/logout` | Clear session |
| GET | `/api/admin/auth/me` | Current admin (requires auth) |

Admin sessions use a separate cookie (`admin_token`) from public users (`auth_token`).
