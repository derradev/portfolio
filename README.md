# William Malone — Portfolio monorepo

Full-stack portfolio: public Next.js site, Express API on Supabase, and a React admin CMS.

## Packages

| Package | Stack | Dev port |
|---------|-------|----------|
| `packages/frontend` | Next.js 14, Tailwind | [http://localhost:3000](http://localhost:3000) |
| `packages/backend` | Express, TypeScript | [http://localhost:3001](http://localhost:3001) |
| `packages/admin` | Vite, React | [http://localhost:3002](http://localhost:3002) |

## Quick start

```bash
npm install
npm run dev
```

- **API**: `http://localhost:3001/api`
- **Production API**: `https://api.william-malone.com/api` (see [docs/VERCEL_ENV_SETUP.md](./docs/VERCEL_ENV_SETUP.md))

## Repo layout

- **`sql/`** — Supabase schema (`database_setup.sql`), seeds, and migration helpers ([sql/README.md](./sql/README.md))
- **`docs/`** — Setup, deployment, testing, and troubleshooting ([docs/README.md](./docs/README.md))
- **`cypress/`** — E2E tests (`npm run test:e2e`)
- **`scripts/`** — Vercel-related shell helpers

## Tech stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS  
- **Backend**: Node.js, Express, Supabase (PostgreSQL + Auth)  
- **Deployment**: Vercel (see [docs/VERCEL_DEPLOYMENT.md](./docs/VERCEL_DEPLOYMENT.md))

## Documentation

Start with [docs/DATABASE_SETUP.md](./docs/DATABASE_SETUP.md) for a new database, then [docs/DEPLOYMENT_GUIDE.md](./docs/DEPLOYMENT_GUIDE.md) for going live.

## Database setup (short path)

1. In Supabase SQL editor, run `sql/database_setup.sql`, then `sql/seed_data.sql`.
2. Copy env vars from the Supabase dashboard into `packages/backend/.env.development` (see [docs/DATABASE_SETUP.md](./docs/DATABASE_SETUP.md)).
