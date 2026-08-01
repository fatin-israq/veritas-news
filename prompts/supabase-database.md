# Implementation Prompt: Supabase Database and Data Access Layer

## Goal
Set up the Supabase database schema, TypeScript types, client instances, and data access query layer for **Veritas News** following project rules, security guidelines, and table specifications defined in `AGENTS.md`.

---

## Skills Read
- `.agents/skills/supabase/SKILL.md` (Supabase security principles, Data API, RLS policies, client setup, and PostgREST best practices)
- `AGENTS.md` (Section 5 Architecture, Section 7 Supabase source of truth, Section 9 URL existence check, Section 14 API methods, Section 19 Pending analysis check, Section 21 Security & joined filter gotcha)

---

## Existing Code Inspected
- `package.json`: Need to install `@supabase/supabase-js`.
- `.env.local`: Contains `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.
- `AGENTS.md`: Sections 7, 9, 14, 19, 21.

---

## Decisions & Assumptions
1. **Database Schema (`supabase/schema.sql`)**:
   - Create tables: `sources`, `articles`, `article_analyses`, `logs`, `oxylabs_schedules`, `oxylabs_schedule_runs`.
   - Omit `embedding vector(1536)` from `article_analyses` for now (it will be added in Section 20 pgvector step).
   - Enable Row Level Security (RLS) on all tables in the `public` schema.
   - Add public read RLS policies for `anon` and `authenticated` roles for `sources`, `articles`, `article_analyses`, and `logs`.
   - Provide initial seed SQL for default active news sources (Reuters, BBC News, The Guardian, NPR, Fox News).
2. **Client Boundaries**:
   - `lib/supabase/client.ts`: Uses `@supabase/supabase-js` `createClient` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` for client-side reads.
   - `lib/supabase/server.ts`: Uses `createClient` with `SUPABASE_SERVICE_ROLE_KEY` for server-side pipeline writes/admin reads.
3. **Data Access Layer (`lib/supabase/queries/`)**:
   - `sources.ts`: `getActiveSources()`, `getAllSources()`, `insertSource()`
   - `articles.ts`: `getArticles()`, `getArticleById()`, `checkUrlsExist(urls: string[])` (chunked to max 15 per `.in()` call), `insertArticle()`, `markArticleAnalyzed()`
   - `analyses.ts`: `getAnalysisByArticleId()`, `insertAnalysis()`, `getPendingArticles()` (using LEFT JOIN detection logic)
   - `logs.ts`: `createLog()`, `getRecentLogs()`
4. **Read API Handlers**:
   - `GET /api/sources`: Returns active sources list.
   - `GET /api/logs`: Returns recent application logs.

---

## Files Likely to Change / Be Created
- `package.json` [MODIFY] — add `@supabase/supabase-js` dependency
- `supabase/schema.sql` [NEW] — DDL for tables, indexes, RLS policies, and seed active sources
- `lib/supabase/types.ts` [NEW] — TypeScript interfaces for DB tables & helper payload types
- `lib/supabase/client.ts` [NEW] — Browser Supabase client (anon key)
- `lib/supabase/server.ts` [NEW] — Server admin Supabase client (service role key)
- `lib/supabase/queries/sources.ts` [NEW] — Source query functions
- `lib/supabase/queries/articles.ts` [NEW] — Article query functions with <= 15 chunking for URL checks
- `lib/supabase/queries/analyses.ts` [NEW] — Analysis queries with LEFT JOIN pending checks
- `lib/supabase/queries/logs.ts` [NEW] — System log queries
- `app/api/sources/route.ts` [NEW] — `GET /api/sources` API handler
- `app/api/logs/route.ts` [NEW] — `GET /api/logs` API handler

---

## Implementation Requirements

### 1. Dependency Installation
Install `@supabase/supabase-js` in `package.json`.

### 2. Schema DDL (`supabase/schema.sql`)
Define tables with proper constraints:
- `sources`: `id` (uuid, primary key), `name` (text, not null), `listing_url` (text, not null), `parser_strategy` (text), `active` (boolean, default true), `logo_url` (text), `created_at` (timestamptz).
- `articles`: `id` (uuid, primary key), `source_id` (uuid references sources(id)), `url` (text, unique, not null), `canonical_url` (text, not null), `title` (text, not null), `image_url` (text, not null), `published_at` (timestamptz, not null), `raw_text` (text, not null), `scraped_at` (timestamptz, default now()), `analyzed_at` (timestamptz, nullable).
- `article_analyses`: `id` (uuid, primary key), `article_id` (uuid unique references articles(id)), `summary` (text, not null), `sentiment_score` (float8, not null), `sentiment_label` (text, not null), `bias_score` (float8, not null), `bias_label` (text, not null), `left_percentage` (int, not null), `center_percentage` (int, not null), `right_percentage` (int, not null), `confidence` (float8, not null), `framing_notes` (text), `loaded_terms` (jsonb), `disclaimer` (text), `model` (text, not null), `created_at` (timestamptz).
- `logs`: `id` (uuid, primary key), `level` (text, not null), `message` (text, not null), `metadata` (jsonb), `created_at` (timestamptz).
- `oxylabs_schedules`: `id` (uuid, primary key), `source_id` (uuid references sources(id)), `oxylabs_schedule_id` (text, unique, not null), `status` (text, default 'active'), `created_at` (timestamptz), `updated_at` (timestamptz).
- `oxylabs_schedule_runs`: `id` (uuid, primary key), `schedule_id` (uuid references oxylabs_schedules(id)), `oxylabs_job_id` (text), `status` (text, not null), `articles_scraped` (int, default 0), `error_message` (text), `created_at` (timestamptz).

Enable RLS on all tables and grant read access to `anon` and `authenticated` roles. Insert initial active sources into `sources`.

### 3. Clients (`lib/supabase/client.ts` & `lib/supabase/server.ts`)
- Client helper: `createClient` using `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Server helper: `getSupabaseAdmin` using `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

### 4. Query Layer & Special Rules (`lib/supabase/queries/`)
- `checkUrlsExist(urls: string[])`: Must slice inputs into max 15-item chunks before performing `.in('url', chunk)` queries (AGENTS.md Section 9).
- `getPendingArticles()`: Query articles LEFT JOINed with `article_analyses` where `article_analyses.id` is NULL (AGENTS.md Section 19).

### 5. API Routes
- `app/api/sources/route.ts`: Export `GET` handler returning active sources JSON.
- `app/api/logs/route.ts`: Export `GET` handler returning recent logs JSON.

---

## Security Requirements
- Keep `SUPABASE_SERVICE_ROLE_KEY` strictly server-side.
- Ensure RLS policies exist on all public schema tables.
- Validate inputs and return structured error responses for API handlers.

---

## Acceptance Criteria
- `@supabase/supabase-js` is installed and clean build succeeds.
- Database schema DDL in `supabase/schema.sql` is valid SQL.
- `lib/supabase/types.ts` exports typed database interfaces.
- Query functions correctly chunk `.in()` filters for candidate URL existence.
- Query functions correctly implement LEFT JOIN pending analysis logic.
- `npm run typecheck` and `npm run lint` execute with 0 errors.

---

## Verification & Manual Test Steps
1. Run `npm run typecheck` to verify TypeScript type definitions.
2. Run `npm run lint` to verify code formatting and standards.
3. Test `GET /api/sources` using `curl -s http://localhost:3000/api/sources`.
4. Test `GET /api/logs` using `curl -s http://localhost:3000/api/logs`.
