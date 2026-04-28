## Zamok Today — Aviasales-style clone (starter)

Monorepo starter:

- `frontend/`: Next.js (React) + Redux Toolkit + Tailwind CSS
- `backend/`: Node.js + Express + MongoDB (Mongoose)

### Prerequisites

- Node.js (you already have it)
- A package manager: **npm** (recommended) or pnpm/yarn
- MongoDB (local or Atlas)

### Setup

Create environment files:

- `backend/.env`

```env
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/zamok_today
CLIENT_ORIGIN=http://localhost:3000
```

- `frontend/.env.local`

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

Install deps (from repo root):

```bash
cd backend
npm install
cd ..\frontend
npm install
```

Run dev servers:

```bash
cd backend
npm run dev
```

In a second terminal:

```bash
cd frontend
npm run dev
```

Open `http://localhost:3000`.

