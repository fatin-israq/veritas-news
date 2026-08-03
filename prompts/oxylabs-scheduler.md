# Oxylabs Scheduler & Vercel Cron Pipeline Implementation Prompt

## Goal
Implement the complete Oxylabs Scheduler integration with Vercel Cron for automatic, once-every-two-days news homepage scraping and AI analysis. The system will sync active source homepages with Oxylabs Scheduler API (running every 48 hours), list active schedule metadata, process completed Oxylabs job runs via the scrape-to-insert pipeline (extracting candidate links, checking URL existence in chunks ≤15, detail scraping, validating article content, and saving append-only to Supabase), auto-deactivate orphan schedules, trigger pending AI article analysis, protect internal endpoints using secrets, and expose the automated pipeline via `/api/cron/pipeline` registered in `vercel.json`.

---

## Skills Read
- `.agents/skills/web-scraper-api`: Oxylabs Web Scraper API authentication, parameters, Scheduler features, `/v1/schedules` endpoints, `/runs` status filtering, raw integer handling.
- `.agents/skills/supabase`: Supabase queries, `oxylabs_schedules` and `oxylabs_schedule_runs` schema, RLS policies, logging, type safety.

---

## Existing Code Inspected
- `AGENTS.md`: Section 18 ("Oxylabs Scheduler"), Section 14 ("API route method rules"), Section 15 ("Admin secret rule"), Section 9 ("Scrape-to-insert pipeline & rules").
- `supabase/schema.sql`: Table definitions for `sources`, `articles`, `article_analyses`, `logs`, `oxylabs_schedules`, `oxylabs_schedule_runs`.
- `lib/supabase/types.ts`: TypeScript definitions for Supabase tables including `OxylabsSchedule` and `OxylabsScheduleRun`.
- `lib/scraping/oxylabs.ts`: Oxylabs API helper functions and HTTP basic auth handling.
- `lib/scraping/pipeline.ts`: Core scraping pipeline (`runScrapingPipeline`, link extraction, content gate validation, deduplication).
- `app/api/scrape/route.ts`: Manual scrape route implementation for reference on admin secret checking.
- `app/api/analyze/route.ts`: AI analysis route for processing pending articles.

---

## Decisions and Assumptions
1. **Schedule Frequency**: Scrape active source homepages once every two days (cron: `0 6 */2 * *` for Oxylabs, `15 6 */2 * *` for Vercel Cron).
2. **Oxylabs Scheduler Endpoints**:
   - `POST https://data.oxylabs.io/v1/schedules` or `https://realtime.oxylabs.io/v1/schedules` (or equivalent per live Oxylabs docs).
   - `GET /v1/schedules` to list all active schedules.
   - `PUT /v1/schedules/{id}/state` to update/deactivate orphan schedules.
   - `GET /v1/schedules/{id}/runs` to fetch run executions and filter for `result_status === 'done'`.
   - `GET /v1/queries/{job_id}/results` or run result endpoint to fetch homepage HTML.
3. **Large Integer Precision (CRITICAL)**: Oxylabs `schedule_id` and `job_id` exceed JavaScript's `Number.MAX_SAFE_INTEGER`. Always extract IDs as raw string values via regex/string searching on raw HTTP response body before any `JSON.parse` call. Never convert parsed JS numbers back to strings.
4. **Use `/runs` Endpoint (Not `/jobs`)**: Use `GET /schedules/{id}/runs` and filter for jobs with `result_status === 'done'`. Skip `pending` or `faulted` runs.
5. **Orphan Deactivation**: During schedule sync, fetch all schedule IDs from Oxylabs, compare with `oxylabs_schedules` DB table, and call `PUT /v1/schedules/{id}/state` to set state to `disabled`/`inactive` for any schedule not present in DB.
6. **Authentication & Security**:
   - `POST /api/oxylabs/schedules` and `POST /api/oxylabs/scheduled-results/process`: Require `x-veritas-admin-secret` header (matches `VERITAS_ADMIN_SECRET`). Reject with `401` if missing/invalid.
   - `GET /api/cron/pipeline`: Internal Vercel Cron endpoint. Requires `Authorization: Bearer <CRON_SECRET>` or header `x-cron-secret` matching `CRON_SECRET`. In local dev environment (when `CRON_SECRET` is not set or request is local), allow invocation for manual testing.
7. **Pipeline Resilience**: In `/api/cron/pipeline`, execute Step 1 (scheduled result processing) then Step 2 (pending AI article analysis). If Step 1 fails or returns 0 new articles, Step 2 MUST still run to analyze pre-existing unanalyzed articles.

---

## Files Likely to Change
- `vercel.json` — [NEW] Register Vercel Cron job (`15 6 */2 * *` calling `/api/cron/pipeline`).
- `lib/scraping/oxylabs-scheduler.ts` — [NEW] Oxylabs Scheduler API client wrapper with string-safe ID extraction, schedule sync, orphan deactivation, run listing, and job HTML fetching.
- `lib/supabase/queries/schedules.ts` — [NEW] Supabase DB helper functions for `oxylabs_schedules` and `oxylabs_schedule_runs`.
- `app/api/oxylabs/schedules/route.ts` — [NEW] `POST` to sync schedules with Oxylabs; `GET` to list stored schedule rows.
- `app/api/oxylabs/scheduled-results/process/route.ts` — [NEW] `POST` to fetch completed Oxylabs runs, parse homepage HTML, run candidate link extraction/detail scraping, and insert valid articles.
- `app/api/cron/pipeline/route.ts` — [NEW] `GET` endpoint for Vercel Cron pipeline execution (scheduled result processing + AI analysis).

---

## Implementation Requirements

### 1. Oxylabs Scheduler API Client (`lib/scraping/oxylabs-scheduler.ts`)
- Use HTTP Basic Auth with `OXY_WSA_USERNAME` and `OXY_WSA_PASSWORD`.
- **String-Safe ID Extraction**: Helper `parseRawOxylabsResponse(responseText: string)` using regex to extract integer `id` / `schedule_id` values as strings before `JSON.parse`.
- `createOxylabsSchedule(url: string, name: string)`:
  - Create schedule targeting source homepage URL with 2-day interval expression or cron.
  - Return created Oxylabs schedule ID (as string).
- `listOxylabsSchedules()`:
  - `GET /v1/schedules`
  - Return array of active schedule objects with string IDs.
- `deactivateOxylabsSchedule(scheduleId: string)`:
  - `PUT /v1/schedules/{scheduleId}/state` with `{ "state": "inactive" }` or `{ "status": "disabled" }`.
- `getOxylabsScheduleRuns(scheduleId: string)`:
  - `GET /v1/schedules/{scheduleId}/runs`
  - Filter for `result_status === 'done'`.
- `fetchOxylabsJobContent(jobId: string)`:
  - Fetch job result content (HTML string).

### 2. Database Queries (`lib/supabase/queries/schedules.ts`)
- `getStoredSchedules()`: Fetch all rows from `oxylabs_schedules` joined with `sources`.
- `upsertStoredSchedule(sourceId: string, oxylabsScheduleId: string)`: Insert or update row in `oxylabs_schedules`.
- `recordScheduleRun(scheduleId: string, oxylabsJobId: string, status: string, articlesScraped: number, errorMessage?: string)`: Insert log record in `oxylabs_schedule_runs`.

### 3. API Routes

#### A. Sync & List Schedules (`app/api/oxylabs/schedules/route.ts`)
- `POST`:
  - Verify `x-veritas-admin-secret` request header.
  - Fetch active sources from `sources` table.
  - For each active source, check if schedule exists; if not, create Oxylabs schedule and store in `oxylabs_schedules`.
  - Perform **Orphan Schedule Deactivation**: List all schedules from Oxylabs, compare with stored DB schedule IDs, deactivate any remote schedule missing from DB.
  - Return summary JSON with synced and deactivated schedule counts.
- `GET`:
  - Read and return stored schedules from `oxylabs_schedules` with source metadata.

#### B. Process Scheduled Results (`app/api/oxylabs/scheduled-results/process/route.ts`)
- `POST`:
  - Verify `x-veritas-admin-secret` request header.
  - Load active schedules from `oxylabs_schedules`.
  - For each schedule:
    - Fetch completed runs via `/runs` endpoint (`result_status === 'done'`).
    - Obtain homepage HTML content for the run.
    - Run the canonical scrape-to-insert pipeline logic: candidate link extraction, non-article URL rejection, deduplication check in max 15 URL chunks, detail scraping via Oxylabs, Cheerio article content gate validation (published date, image URL, clean text length), append-only insert into `articles`.
    - Record run results in `oxylabs_schedule_runs` and `logs`.
  - Return pipeline process summary.

#### C. Automatic Cron Pipeline (`app/api/cron/pipeline/route.ts`)
- `GET`:
  - Check `CRON_SECRET` authorization (skip in dev mode if `CRON_SECRET` is unset or request is local).
  - **Step 1**: Execute scheduled result processing (run pipeline on finished Oxylabs runs).
  - **Step 2**: Execute AI analysis on pending articles (call `runPendingAnalysis()` helper or endpoint logic).
  - Ensure Step 2 executes even if Step 1 throws an error or inserts 0 articles.
  - Return combined pipeline run summary JSON.

### 4. Vercel Cron Configuration (`vercel.json`)
```json
{
  "crons": [
    {
      "path": "/api/cron/pipeline",
      "schedule": "15 6 */2 * *"
    }
  ]
}
```

---

## Security Requirements
- Require `x-veritas-admin-secret` on `POST /api/oxylabs/schedules` and `POST /api/oxylabs/scheduled-results/process`. Return `401` on invalid/missing secret.
- Protect `GET /api/cron/pipeline` using `CRON_SECRET`. Return `401` if invalid. Allow local execution without `CRON_SECRET` for testing.
- Do not expose secret keys in client-side code or URL parameters.

---

## Acceptance Criteria
- [ ] Schedule sync creates Oxylabs schedules for all active sources and saves records in `oxylabs_schedules`.
- [ ] Orphan Oxylabs schedules are detected and deactivated.
- [ ] Large integers (`schedule_id`, `job_id`) are safely handled as strings without precision truncation.
- [ ] Process route reads completed job HTML from `/runs` (`result_status === 'done'`) and inserts valid articles into Supabase append-only.
- [ ] Cron route `/api/cron/pipeline` executes both scheduled result processing and pending AI analysis in sequence.
- [ ] `vercel.json` registers cron job for every two days (`15 6 */2 * *`).
- [ ] Proper error handling and server console summary logs emitted for all steps.

---

## Checks to Run
1. `npm run build` — Verify TypeScript compilation and Next.js route validation.
2. `npm run lint` — Confirm code style and syntax compliance.

---

## Manual Test Steps
1. **Sync Schedules**:
   ```bash
   curl -X POST http://localhost:3000/api/oxylabs/schedules \
     -H "x-veritas-admin-secret: veritas-local-admin-secret"
   ```
2. **List Schedules**:
   ```bash
   curl http://localhost:3000/api/oxylabs/schedules
   ```
3. **Process Scheduled Results**:
   ```bash
   curl -X POST http://localhost:3000/api/oxylabs/scheduled-results/process \
     -H "x-veritas-admin-secret: veritas-local-admin-secret"
   ```
4. **Trigger Cron Pipeline**:
   ```bash
   curl http://localhost:3000/api/cron/pipeline
   ```
