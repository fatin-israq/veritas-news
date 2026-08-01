# Oxylabs Scraping Pipeline Implementation Prompt

## Goal
Implement the complete manual scraping pipeline (`POST /api/scrape`) for Veritas News using the Oxylabs Web Scraper API and Supabase. The pipeline will fetch active news source homepages from Supabase, extract candidate story card URLs, reject non-article links, deduplicate candidate URLs against existing database records (querying in chunks of max 15), scrape detail pages via Oxylabs, clean and validate content using Cheerio, enforce required fields (image URL, published date, text length/paragraphs), insert valid articles append-only into Supabase `articles` table, log detailed progress to console and `logs` table, and return a comprehensive summary object.

---

## Skills Read
- `.agents/skills/web-scraper-api`: Oxylabs Realtime Web Scraper API usage (`https://realtime.oxylabs.io/v1/queries`), `universal` source, basic auth credentials (`OXY_WSA_USERNAME`, `OXY_WSA_PASSWORD`).
- `.agents/skills/supabase`: Supabase database operations, RLS, queries, type safety, server client usage.

---

## Existing Code Inspected
- `supabase/schema.sql`: Schema definitions for `sources`, `articles`, `logs` tables.
- `supabase/seed.sql`: Default active news sources (`Reuters`, `BBC News`, `The Guardian`, `NPR`, `Fox News`).
- `lib/supabase/queries/sources.ts`: Function `getActiveSources()` fetching active sources.
- `lib/supabase/queries/articles.ts`: Functions for querying and inserting articles.
- `lib/supabase/queries/logs.ts`: Function `createLog()` for writing pipeline log events.
- `.env.local`: Environment variables configuration (`OXY_WSA_USERNAME`, `OXY_WSA_PASSWORD`, `VERITAS_ADMIN_SECRET`, Supabase credentials).
- `package.json`: Current dependencies (need `cheerio` and `zod`).

---

## Decisions and Assumptions
1. **Oxylabs API Integration**: Use the Realtime API endpoint `POST https://realtime.oxylabs.io/v1/queries` with `source: "universal"` and HTTP Basic Auth.
2. **Admin Secret Header**: Require `x-veritas-admin-secret` request header on `POST /api/scrape`, matching `VERITAS_ADMIN_SECRET`. Missing or invalid header returns `401 Unauthorized`.
3. **Source Selection & Limits**: Default to all active sources fetched from Supabase `sources` table and up to 5 valid articles per source, unless specified in request payload (`sources`, `limitPerSource`).
4. **Candidate Link Filtering**: Extract only visible article card links from homepage HTML using source-specific selectors or generic heuristics. Apply the non-article reject list (category/section, show, podcast, topic, author, search, corporate, live, game, video-only) before detail scraping.
5. **Deduplication Chunking**: Query Supabase for candidate URL existence using `.in('url', urlChunk)` with `urlChunk` size capped at **15 URLs** per query.
6. **Detail Page Validation (Article Content Gate)**:
   - Must have article-specific title (not generic site name or category).
   - Must have valid `published_at` date string (required before saving).
   - Must have valid `image_url` (required before saving).
   - Text quality check: Either 3+ clean paragraphs or 900+ clean characters after removing nav, scripts, styles, ads, social shares, and related article lists.
7. **Append-Only Storage**: Insert valid articles into `public.articles` without deleting or overwriting existing articles.
8. **Logging**: Print clear console messages during each step and log key pipeline milestones to `public.logs`. Return summary object in API response.

---

## Files Likely to Change
- `package.json` — Add `cheerio` and `zod` dependencies.
- `lib/supabase/queries/articles.ts` — Update/add chunked candidate URL check (`existingArticleUrls(urls)`) and article insertion (`insertArticles(articles)`).
- `lib/supabase/queries/logs.ts` — Ensure log helper `createLog(level, message, metadata)` handles pipeline event logging.
- `lib/scraping/types.ts` — [NEW] Define types for Oxylabs API requests/responses, scraper options, raw article data, source parser configurations, and run summaries.
- `lib/scraping/oxylabs.ts` — [NEW] Client wrapper for Oxylabs WSA Realtime API (`https://realtime.oxylabs.io/v1/queries`).
- `lib/scraping/parsers/generic.ts` — [NEW] Default Cheerio parser for link extraction, text cleaning, metadata parsing (image, published date, title).
- `lib/scraping/parsers/reuters.ts` — [NEW] Reuters-specific parser rules.
- `lib/scraping/parsers/bbc.ts` — [NEW] BBC News-specific parser rules.
- `lib/scraping/parsers/guardian.ts` — [NEW] The Guardian-specific parser rules.
- `lib/scraping/parsers/npr.ts` — [NEW] NPR-specific parser rules.
- `lib/scraping/parsers/fox.ts` — [NEW] Fox News-specific parser rules.
- `lib/scraping/parsers/index.ts` — [NEW] Parser registry routing by `parser_strategy` or fallback.
- `lib/scraping/pipeline.ts` — [NEW] Core orchestration function `runScrapingPipeline(options)`.
- `app/api/scrape/route.ts` — [NEW] API route handler for `POST /api/scrape`.

---

## Implementation Requirements

### 1. Dependencies
- Install `cheerio` and `zod`: `npm install cheerio zod`.

### 2. Database Queries (`lib/supabase/queries/articles.ts`)
- `checkExistingUrls(urls: string[]): Promise<Set<string>>`:
  - Split `urls` array into chunks of maximum 15.
  - For each chunk, query `articles` table selecting `url` where `url` is in the chunk.
  - Combine found URLs into a `Set<string>` and return.
- `insertArticles(articles: InsertArticle[]): Promise<Article[]>`:
  - Insert valid articles append-only into `public.articles`.

### 3. Oxylabs Client (`lib/scraping/oxylabs.ts`)
- Export `fetchPageWithOxylabs(url: string)`:
  - Validates `OXY_WSA_USERNAME` and `OXY_WSA_PASSWORD` environment variables.
  - Sends `POST https://realtime.oxylabs.io/v1/queries` with basic auth header `Basic ${Buffer.from(user:pass).toString('base64')}`.
  - Body: `{ source: 'universal', url }`.
  - Returns `results[0].content` (HTML string).
  - Handles HTTP or Oxylabs errors gracefully.

### 4. Article Parsers & Cleaners (`lib/scraping/parsers/`)
- Non-article reject list check:
  - Reject URLs matching patterns: `/category/`, `/sections/`, `/shows/`, `/program/`, `/podcasts/`, `/topic/`, `/author/`, `/search/`, `/live/`, `/video/`, `/games/`, `/shopping/`, `/terms`, `/privacy`, `/contact`, `/newsletter`, `foxnews.com/v/`, `bbc.com/sport`, `reuters.com/world/africa`, `npr.org/sections/politics`, etc.
- Homepage Link Extraction (`extractCandidateLinks(html, listingUrl, strategy)`):
  - Parse HTML with Cheerio.
  - Extract links from story cards/headings.
  - Resolve relative URLs to absolute URLs against `listingUrl`.
  - Filter out invalid/rejected non-article URLs.
  - Deduplicate extracted URLs.
- Article Detail Cleaning & Extraction (`parseArticleDetail(html, url, sourceName)`):
  - Extract `title`: `<h1...>` or `og:title`. Reject if generic (e.g. "Home", "Reuters", "BBC News").
  - Extract `image_url`: `og:image` or `twitter:image` or hero `<img src=...>`. Reject if missing.
  - Extract `published_at`: `article:published_time`, `<time datetime=...>`, schema.org JSON-LD `datePublished`. Parse to valid ISO string. Reject if missing.
  - Extract `raw_text`: Remove `<script>`, `<style>`, `<nav>`, `<footer>`, `<header>`, `.ad-placeholder`, `.newsletter-box`, `.related-articles`, `.social-share`.
  - Extract paragraph elements (`<p>`) or clean block text.
  - Quality check: Require at least 3 clean paragraphs OR 900+ clean characters.
  - Clean text must read like a single coherent news article.

### 5. Pipeline Orchestration (`lib/scraping/pipeline.ts`)
- `runScrapingPipeline({ sourceIds?: string[], limitPerSource?: number })`:
  1. Record start timestamp.
  2. Log scrape started to console and `logs` table.
  3. Fetch active sources from Supabase (filtered by `sourceIds` if provided).
  4. For each active source:
     - Fetch homepage HTML via Oxylabs.
     - Extract candidate links.
     - Reject links matching non-article patterns.
     - Filter candidates against Supabase using chunked `checkExistingUrls` (max 15/chunk). Record duplicates skipped count.
     - For each remaining candidate URL (up to `limitPerSource` valid articles):
       - Scrape detail page via Oxylabs.
       - Parse detail page HTML with parser strategy.
       - If validation fails (missing image, missing published date, text quality too low), increment rejected count with reason.
       - If valid, prepare article record (`source_id`, `url`, `canonical_url`, `title`, `image_url`, `published_at`, `raw_text`).
     - Insert valid articles into Supabase.
  5. Compute final metrics (duration, sources checked, candidates found, candidates rejected, duplicates skipped, articles inserted, rejections by reason).
  6. Write final summary log to `logs` table and output formatted summary to console.
  7. Return pipeline summary object.

### 6. API Route (`app/api/scrape/route.ts`)
- `POST /api/scrape`:
  - Check `x-veritas-admin-secret` header against `process.env.VERITAS_ADMIN_SECRET`. Return `401` if invalid.
  - Parse optional JSON body: `{ sourceIds?: string[], limitPerSource?: number }`.
  - Execute `runScrapingPipeline(...)`.
  - Return `200 OK` with JSON response containing the summary object.

---

## Security Requirements
- All write/mutation actions require `x-veritas-admin-secret` request header.
- Oxylabs Basic Auth credentials stored in environment variables, never hardcoded.
- Supabase queries use secure client methods.

---

## Acceptance Criteria
1. `POST /api/scrape` returns `401` if `x-veritas-admin-secret` is missing or wrong.
2. `POST /api/scrape` fetches active sources from Supabase `sources` table.
3. Candidate link extraction correctly filters out non-article pages (category/section/shows/etc.).
4. Supabase URL deduplication uses `.in()` with maximum 15 URLs per chunk.
5. Detail scraper rejects articles missing `image_url` or `published_at`, or having insufficient text (< 3 paragraphs and < 900 characters).
6. Detail scraper cleans raw article text of ads, scripts, nav, and social media widgets.
7. Valid articles are inserted into `public.articles` append-only.
8. Execution logs are stored in `public.logs` table and printed to server console.
9. Pipeline returns a complete summary object with status, duration, and counts.
10. `npm run typecheck` and `npm run build` pass without errors.

---

## Checks to Run
- `npm run typecheck`
- `npm run build`

---

## Exact Manual Test Steps Expected After Implementation
1. Ensure `.env.local` contains valid `OXY_WSA_USERNAME`, `OXY_WSA_PASSWORD`, `VERITAS_ADMIN_SECRET`, and Supabase environment variables.
2. Start the dev server: `npm run dev`.
3. In a separate terminal, test missing admin secret (should fail with 401):
   ```bash
   curl -X POST http://localhost:3000/api/scrape \
     -H "Content-Type: application/json"
   ```
4. Test manual scrape trigger with valid admin secret:
   ```bash
   curl -X POST http://localhost:3000/api/scrape \
     -H "Content-Type: application/json" \
     -H "x-veritas-admin-secret: <VERITAS_ADMIN_SECRET>" \
     -d '{"limitPerSource": 2}'
   ```
5. Observe server terminal logs for step-by-step progress output.
6. Verify response summary object for inserted article count and metrics.
