# Implementation Prompt: Rename Admin Secret Variable from x-veritas-admin-secret to x_veritas_admin_secret

## Goal
Rename the environment variable and header reference from `x-veritas-admin-secret` to `x_veritas_admin_secret` across `.env.local`, `.env.example`, API routes (`/api/scrape`, `/api/analyze`, `/api/oxylabs/schedules`, `/api/oxylabs/scheduled-results/process`), and documentation while supporting backward compatibility for both header and environment variable variants so that the project does not break.

## Skills Read
- `.agents/skills/supabase` (for project configuration standards)

## Existing Code Inspected
- `.env.local`
- `.env.example`
- `AGENTS.md`
- `app/api/analyze/route.ts`
- `app/api/oxylabs/scheduled-results/process/route.ts`
- `app/api/oxylabs/schedules/route.ts`
- `app/api/scrape/route.ts`
- `prompts/ai-analysis.md`
- `prompts/oxylabs-scheduler.md`
- `prompts/oxylabs-scraping.md`
- `prompts/pgvector-related-articles.md`

## Decisions or Assumptions
- In `.env.local` and `.env.example`, change `x-veritas-admin-secret` key to `x_veritas_admin_secret`.
- In API route handlers, update header retrieval and environment variable lookups to check `x_veritas_admin_secret` (as well as `x-veritas-admin-secret` and `VERITAS_ADMIN_SECRET`) to ensure zero-downtime transition and complete protection.
- In documentation (`AGENTS.md` and prompt files), document `x_veritas_admin_secret` as the standard variable/header name.

## Files Likely to Change
- `.env.local`
- `.env.example`
- `AGENTS.md`
- `app/api/analyze/route.ts`
- `app/api/oxylabs/scheduled-results/process/route.ts`
- `app/api/oxylabs/schedules/route.ts`
- `app/api/scrape/route.ts`
- `prompts/ai-analysis.md`
- `prompts/oxylabs-scheduler.md`
- `prompts/oxylabs-scraping.md`
- `prompts/pgvector-related-articles.md`

## Implementation Requirements
1. **Environment Variables**:
   - Change `x-veritas-admin-secret=...` to `x_veritas_admin_secret=...` in `.env.local`.
   - Update `.env.example` to reflect `x_veritas_admin_secret`.

2. **API Route Handlers**:
   - In `app/api/analyze/route.ts`, `app/api/oxylabs/scheduled-results/process/route.ts`, `app/api/oxylabs/schedules/route.ts`, and `app/api/scrape/route.ts`:
     - Inspect request headers for both `x_veritas_admin_secret` and `x-veritas-admin-secret`.
     - Check `process.env.VERITAS_ADMIN_SECRET || process.env.x_veritas_admin_secret || process.env['x-veritas-admin-secret']`.

3. **Documentation**:
   - Update `AGENTS.md` and prompt files where `x-veritas-admin-secret` is documented as the request header or env var name to use `x_veritas_admin_secret`.

## Security Requirements
- Missing or invalid secret must still return `401 Unauthorized`.
- Secret must never be exposed to browser code or logged in full.

## Acceptance Criteria
- `.env.local` contains `x_veritas_admin_secret`.
- API endpoints authenticate requests carrying header `x_veritas_admin_secret`.
- Existing curl commands or automated calls using either `x_veritas_admin_secret` or `x-veritas-admin-secret` succeed when providing the valid secret.
- Requests without a valid secret are rejected with HTTP 401.

## Checks to Run
- `npm run build` or `npx tsc --noEmit` to verify type safety across modified files.

## Exact Manual Test Steps
1. Run a request with `x_veritas_admin_secret` header:
   ```bash
   curl -i -X POST http://localhost:3000/api/scrape \
     -H "x_veritas_admin_secret: asdfjkhaslkdfj" \
     -H "Content-Type: application/json" \
     -d '{"limitPerSource": 1}'
   ```
2. Verify response is `200 OK` (or valid processing result) rather than `401 Unauthorized`.
3. Test with an invalid secret:
   ```bash
   curl -i -X POST http://localhost:3000/api/scrape \
     -H "x_veritas_admin_secret: wrong_secret"
   ```
4. Verify response is `401 Unauthorized`.
