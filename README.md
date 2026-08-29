# CycleLink MM

B2B circular economy platform for Myanmar businesses to list and discover industrial & plastic surplus.

## Setup

```bash
git clone https://github.com/hydnmyo/CycleLink_mm.git
cd CycleLink_mm
npm install
npm run dev
```

Browse, search, listing detail, and the impact page work locally. They read `/api/listings` when Functions and Database are available, and fall back to sample Myanmar listings otherwise.

## Authentication (Netlify Identity)

Login and signup use `@netlify/identity`. Identity does **not** work on local `npm run dev`. Deploy to Netlify, then:

1. Open **Project configuration → Identity**
2. Keep registration **Open**
3. Turn **Autoconfirm** on so hackathon signups skip the confirmation email

After deploy, businesses can register with name, industry, location, contact person, email, phone, password, and a registration document. Listing surplus and sending inquiries require that session.

## Database

Listings, businesses, and inquiries live in Netlify Database (Postgres + Drizzle).

```bash
npm run db:migrate
```

That command applies migrations to the **local** development database only. Hosted preview and production databases are migrated automatically on deploy. Do not run `drizzle-kit push` against a Netlify-hosted database.

## Scripts

- `npm run dev` — Vite + Netlify plugin (functions/DB locally)
- `npm run build` — production build
- `npm run db:generate` — generate a Drizzle migration from `db/schema.ts`
- `npm run db:migrate` — apply pending migrations to the local DB
