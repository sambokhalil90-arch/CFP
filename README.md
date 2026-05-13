# CFP Performance Coach (MVP)

A Vite + React MVP for CFP drill practice with Supabase-backed question storage.

## What is included

- React + Vite app with these screens:
  - Dashboard
  - Drill Setup
  - Question
  - Review
  - Mistake Log
  - Weak Area Dashboard
- Supabase client wiring (`src/supabase.js`) using Vite env vars.
- SQL schema in `supabase/schema.sql`.
- Seed data in `supabase/seed.sql` with 20 original CFP-style questions.
- Local fallback sample data in `src/sampleQuestions.js` if Supabase env vars are not set.

---

## 1) Prerequisites

- Node.js 18+ (Node 20 recommended)
- npm 9+
- A Supabase project (free tier is fine)
- A web-based coding environment is fine; no desktop tooling is required.

---

## 2) Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create an env file at the project root:

   ```bash
   cp .env.example .env
   ```

3. Fill in `.env` values:

   ```env
   VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   ```

4. In Supabase SQL Editor, run:
   - `supabase/schema.sql`
   - then `supabase/seed.sql`

5. Start the app:

   ```bash
   npm run dev
   ```

6. Open the URL shown by Vite (usually `http://localhost:5173`).

---

## 3) Environment variables

The app uses Vite client env vars:

- `VITE_SUPABASE_URL` (required for Supabase mode)
- `VITE_SUPABASE_ANON_KEY` (required for Supabase mode)

If either is missing, the app automatically falls back to built-in sample data so you can still test the full UI flow.

---

## 4) Database setup details

### Schema

Run `supabase/schema.sql` to create:

- `questions`
- `attempts`
- `recommendations`

### Seed

Run `supabase/seed.sql` to insert 20 original CFP-style questions across major planning domains.

---

## 5) Build check

Run:

```bash
npm run build
```

This produces a production build in `dist/`.

---

## 6) Vercel deployment

1. Push this repo to GitHub.
2. In Vercel, import the project.
3. Framework preset: **Vite** (auto-detected).
4. Set environment variables in Vercel project settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy.

Build command: `npm run build`  
Output directory: `dist`

---

## 7) Current scope (MVP)

- No auth
- No payments
- No premium features

This is intentional for immediate testability.
