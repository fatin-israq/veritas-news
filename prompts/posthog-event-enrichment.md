# PostHog: enrich `article_opened` + adopt `data-attr` autocapture

## Goal

Improve PostHog instrumentation without new dependencies:

1. **Enrich `article_opened`** — currently no code captures it (old events only carried
   `article_id`, `source_name`, and an `article_category` that duplicated the source name).
   Re-introduce the event on the news card click with human-readable, segmentable
   properties so click analysis needs no Supabase join.
2. **Adopt `data-attr` autocapture** — reuse the existing `data-attr="how-we-analyze-bias"`
   pattern (already on the bias disclosure) across the main clickable surfaces so PostHog
   autocapture tracks them with stable, readable element identifiers and no extra
   `posthog.capture` calls.

## Skills read

- None required (front-end analytics change only). AGENTS.md sections 5, 21 (server/client
  boundaries — `posthog-js` is client-only, already used in `bias-methodology.tsx`).

## Existing code inspected

- `components/analytics/posthog-provider.tsx` — `posthog.init` with `defaults: "2025-05-24"`
  (autocapture on by default), manual `$pageview`, Clerk `identify`.
- `components/ui/bias-methodology.tsx` — existing `posthog.capture` + `data-attr` pattern.
- `components/ui/news-card.tsx` — client card wrapped in a `next/link`.
- `components/news/paginated-article-list.tsx` — `normalizeArticle` maps DB rows to card props.
- `app/news/[id]/page.tsx` — details page (related links, save/share, original source, newsletter).
- `components/layout/header.tsx` — subscribe/login CTAs, nav, category pills.
- `lib/supabase/types.ts` — `ArticleAnalysis` (`sentiment_label`, `bias_label`, `confidence`).
- `components/ui/button.tsx` — spreads `...props`, so `data-attr` passes through.

## Decisions / assumptions

- `article_opened` fires from `NewsCard` (client) on link click, before navigation.
- `position_in_feed` is the 1-based global rank across pagination (`startIndex + idx + 1`),
  so we can see whether readers click top cards or scroll.
- `confidence` is sent as the raw 0–1 model value (matches `article_analyses.confidence`).
- Autocapture is already enabled, so `data-attr` needs no init change.
- Fallback demo cards (no analysis) send `undefined` for analysis-derived props — acceptable.

## Files likely to change

- `components/ui/news-card.tsx`
- `components/news/paginated-article-list.tsx`
- `app/news/[id]/page.tsx`
- `components/layout/header.tsx`

## Implementation requirements

### #1 `article_opened`
- Add optional props to `NewsCard`: `sentimentLabel`, `biasLabel`, `confidence`,
  `publishedAt`, `positionInFeed`.
- On the card `Link` `onClick`, `posthog.capture("article_opened", { article_id,
  article_title, source_name, sentiment_label, bias_label, confidence, published_at,
  position_in_feed })`.
- In `normalizeArticle`, extract `sentiment_label`, `bias_label`, `confidence` from
  `analysis` and `published_at` from the article; pass through the list `map` with the
  computed `positionInFeed`.

### #2 `data-attr`
- Add stable `data-attr` values to: news-card link + info button; details-page save/share,
  original-source link, related-article links, newsletter subscribe; header subscribe/login,
  nav items, category pills.

## Security requirements

- Client-only analytics; no secrets. No server modules touched. `posthog-js` already client.

## Acceptance criteria

- Clicking a card emits `article_opened` with all enriched properties populated (live data).
- Autocaptured clicks carry the new `data-attr` identifiers.
- `npm run typecheck` and `npm run lint` pass.

## Checks to run

- `npm run typecheck`
- `npm run lint`

## Manual test steps

1. `npm run dev`, open the homepage.
2. In PostHog Activity (or the debugger), click a card → confirm `article_opened` with
   `article_title`, `source_name`, `sentiment_label`, `bias_label`, `confidence`,
   `published_at`, `position_in_feed`.
3. Click save/share/related/subscribe/nav → confirm autocaptured `$autocapture` events
   carry the corresponding `data-attr`.
