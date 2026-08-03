# PostHog analytics + "How We Analyze Bias" tracking

## Goal

Measure how many readers click the "How We Analyze Bias" affordance on the news
details page. The app had no product analytics at all, and no such button
existed, so this task adds both: a PostHog client integration and the button
itself.

## Skills read

- `node_modules/next/dist/docs/` — App Router client/server boundaries, rewrites
- `.agents/skills/clerk` — client hooks for identifying the signed-in user

## Existing code inspected

- `app/layout.tsx` — root layout, `ClerkProvider` wrapper
- `app/news/[id]/page.tsx` — server component rendering the bias distribution box
- `components/ui/bias-meter.tsx` — existing framing visualiser
- `proxy.ts` — Clerk middleware matcher
- `next.config.ts` — previously empty config

## Decisions and assumptions

- No "How We Analyze Bias" button existed anywhere in the repo. The closest
  affordances were two decorative `Info` icons on the details page. A real
  disclosure button is added below the bias meter, replacing the decorative
  icon in that box.
- Ingestion is reverse-proxied through `/ingest` via Next.js rewrites so ad
  blockers do not drop events. `skipTrailingSlashRedirect` is required for this.
- Pageviews are captured manually on App Router navigation because
  `capture_pageview` misses client-side route changes.
- PostHog is a no-op when `NEXT_PUBLIC_POSTHOG_KEY` is unset, so local dev and
  CI work without a key.
- Only the publishable project API key reaches browser code. No server secret is
  involved, so no new server-only env var is needed.

## Files changed

- `components/analytics/posthog-provider.tsx` (new)
- `components/ui/bias-methodology.tsx` (new)
- `app/layout.tsx`
- `app/news/[id]/page.tsx`
- `next.config.ts`
- `proxy.ts`
- `.env.example`, `AGENTS.md`
- `package.json` — adds `posthog-js`

## Implementation requirements

- Event name: `bias_methodology_clicked`.
- Properties: `article_id`, `source_name`, `bias_label`,
  `confidence_percentage`, `model`, `opened`.
- `data-attr="how-we-analyze-bias"` on the button so autocapture and heatmaps
  can also target it.
- Signed-in users are identified with their Clerk user ID; `posthog.reset()` on
  sign-out.
- The `/ingest` path is excluded from the Clerk middleware matcher.

## Security requirements

- Only `NEXT_PUBLIC_*` values reach browser code.
- No Supabase service role key, Oxylabs credentials, Gemini key, or admin secret
  is referenced by any client component.
- No scraping, analysis, or pipeline mutation is triggered from the UI.

## Acceptance criteria

- Clicking "How We Analyze Bias" expands a methodology panel and sends exactly
  one `bias_methodology_clicked` event.
- Collapsing it sends a second event with `opened: false`.
- Pageviews appear for both initial loads and client-side navigations.
- The app builds and runs with `NEXT_PUBLIC_POSTHOG_KEY` unset.

## Checks to run

- `npm run typecheck`
- `npm run lint`
- `npm run build`

## Manual test steps

1. Add `NEXT_PUBLIC_POSTHOG_KEY` (and optionally `NEXT_PUBLIC_POSTHOG_HOST`) to
   `.env.local`.
2. `npm run dev`, sign in, open any article at `/news/<id>`.
3. Confirm the "How We Analyze Bias" button renders under the bias meter and
   toggles the methodology panel.
4. In the browser network tab, confirm requests go to `/ingest/…` (same origin).
5. In PostHog → Activity, confirm `bias_methodology_clicked` arrives with the
   expected properties, and that `$pageview` fires on navigation between
   articles.
