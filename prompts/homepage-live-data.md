# Implementation Prompt: Connect Home Page to Live Supabase Analyzed Articles

## Goal
Update `app/page.tsx` to fetch and render live analyzed news articles from Supabase using `getArticles()` from `lib/supabase/queries/articles.ts`. If no analyzed articles exist in Supabase yet (before scraper & AI analysis pipeline run), render a clean empty state informing the user while allowing fallbacks.

---

## Skills Read
- `.agents/skills/supabase/SKILL.md` (Supabase query practices)
- `AGENTS.md` (Section 5 Architecture, Section 7 Supabase source of truth, Section 19 AI analysis and UI framing, Section 21 Security guidelines)

---

## Existing Code Inspected
- `app/page.tsx` — Server component rendering static placeholder array `topNewsArticles`.
- `lib/supabase/queries/articles.ts` — `getArticles()` function returning `ArticleWithAnalysis[]` (joined with source and analysis data).
- `components/ui/news-card.tsx` — Card component accepting article details, bias percentages, source, image, and title.

---

## Decisions & Assumptions
1. **Server Component Fetching**: `app/page.tsx` is an async Next.js Server Component that directly calls `await getArticles()`.
2. **Live Data Mapping**: When articles are present in Supabase, map `ArticleWithAnalysis` fields to `NewsCard` props:
   - `id`: `article.id`
   - `title`: `article.title`
   - `category`: `article.source.name` or default topic
   - `location`: `article.source.name`
   - `imageUrl`: `article.image_url`
   - `leftPercentage`: `article.analysis?.left_percentage ?? 33`
   - `centerPercentage`: `article.analysis?.center_percentage ?? 34`
   - `rightPercentage`: `article.analysis?.right_percentage ?? 33`
   - `sourcesCount`: `article.source.name`
3. **Empty State Handling**: If no analyzed articles exist in Supabase yet, show a clean, styled banner explaining that live articles will appear as soon as the scraping & AI analysis pipelines run, while cleanly displaying demo cards or empty state message.

---

## Files Likely to Change
- `app/page.tsx` [MODIFY] — fetch live `getArticles()` from `lib/supabase/queries/articles.ts` and pass data to `NewsCard` grid.

---

## Implementation Requirements
1. Import `getArticles` from `@/lib/supabase/queries/articles`.
2. Make `Home` an `async` server function.
3. Call `const articles = await getArticles();` inside `Home()`.
4. Render live articles when available in `articles.map()`.

---

## Security Requirements
- All database reading occurs in Server Component `app/page.tsx` using `getSupabaseAdmin()`. No service keys exposed to browser client.

---

## Acceptance Criteria
- `app/page.tsx` calls `getArticles()` from Supabase.
- Live analyzed articles from Supabase render inside `NewsCard` components when present in DB.
- Zero TypeScript or lint errors.

---

## Checks to Run
- `npm run typecheck`
- `npm run lint`

---

## Exact Manual Test Steps Expected After Implementation
1. Visit `http://localhost:3000` in the browser.
2. Verify page loads cleanly without server errors.
3. Confirm `getArticles()` query executes against Supabase.
