# Deploy admin dashboard to Vercel

## Project settings (required)

In the Vercel project **Settings → General**:

| Setting | Value |
|--------|--------|
| **Root Directory** | `admin` |
| **Framework Preset** | Next.js |
| **Build Command** | `npm run build` (default) |
| **Output Directory** | *(leave empty — do not set `.next` or `out`)* |
| **Install Command** | `npm install` (default) |

If **Root Directory** is wrong, the site shows a platform `404: NOT_FOUND` (not the Next.js 404 page).

## Environment variables

| Name | Example |
|------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | `https://your-api.example.com` |

Use your production backend URL (no trailing slash).

## Monorepo (repo root linked to Vercel)

If you cannot set Root Directory to `admin`, the repo root `vercel.json` and `vercel-build` script build the admin app from `admin/`. Prefer setting **Root Directory** to `admin` instead.

## After changing settings

Redeploy: **Deployments → … → Redeploy** (or push a new commit).
