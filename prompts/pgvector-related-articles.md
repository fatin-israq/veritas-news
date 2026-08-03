# pgvector & Related Articles Implementation Prompt

## Goal
Enable pgvector support in Supabase, update the database schema and types to support vector embeddings (`vector(768)`), update the AI analysis pipeline to generate and store embeddings via Gemini `text-embedding-004`, add vector similarity query helper `getRelatedArticles`, and display cosine similarity-based Related Articles on the news details page strictly following Section 20 of `AGENTS.md`.

---

## Skills Read
- `.agents/skills/supabase`
- `.agents/skills/ai-sdk`

---

## Existing Code Inspected
- `AGENTS.md` (Section 20 & 21)
- `supabase/schema.sql` (Database DDL)
- `lib/supabase/types.ts` (`ArticleAnalysis`, `InsertAnalysisInput`, `Database` schema definition)
- `lib/supabase/queries/articles.ts` (`getArticleById`, `getArticles`, `insertArticle`)
- `lib/supabase/queries/analyses.ts` (`getPendingArticles`, `insertAnalysis`, `getAnalysisByArticleId`)
- `lib/ai/analysis.ts` (AI structured analysis generation)
- `lib/ai/client.ts` (Google AI SDK client configuration)
- `app/api/analyze/route.ts` (AI analysis batch execution pipeline)
- `app/news/[id]/page.tsx` (News details page component)

---

## Decisions & Assumptions
1. **Database Schema & Vector Extension**:
   - Enable `vector` extension in Supabase Postgres.
   - Add `embedding vector(768)` column to `public.article_analyses`.
   - Create an IVFFlat / HNSW cosine index on `article_analyses(embedding vector_cosine_ops)`.
   - Create Supabase RPC function `match_related_articles` for efficient vector cosine distance search (`1 - (embedding <=> target_embedding)`).
   - Update `supabase/schema.sql` and `lib/supabase/types.ts`.
2. **Embedding Generation**:
   - Use `embed` from Vercel AI SDK (`ai`) with `google.textEmbeddingModel('text-embedding-004')` from `@ai-sdk/google`.
   - Embed title + body content for each article during analysis.
   - Update `insertAnalysis` and `lib/ai/analysis.ts` / `/api/analyze` pipeline to calculate embedding.
   - Update `analyzed_at` on `articles` table only after both analysis and embedding are stored in Supabase.
3. **Pending Check & Backfill**:
   - Update `getPendingArticles` in `lib/supabase/queries/analyses.ts` to pick up articles missing analysis OR articles missing embeddings (`embedding IS NULL`) to support seamless backfill without re-running full LLM text analysis.
4. **Vector Similarity Function (`getRelatedArticles`)**:
   - Add `getRelatedArticles(articleId: string, embedding: number[])` to `lib/supabase/queries/articles.ts`.
   - Returns up to 5 articles sorted by cosine distance (`<=>`), excluding the current article and excluding articles without embeddings.
5. **News Details Page UI Update**:
   - Fetch `relatedArticles` using `getRelatedArticles(article.id, analysis.embedding)` when `analysis.embedding` exists.
   - If `analysis.embedding` is not present or no related articles are returned, do not display the Related Articles section.
   - Each related article card displays source name, image, title, sentiment, bias label, and link to `/news/[id]`.

---

## Files Likely to Change
- [MODIFY] [schema.sql](file:///Users/israq/Documents/Development/veritas-news/supabase/schema.sql) — Add `vector` extension, `embedding vector(768)` column, index, and `match_related_articles` RPC function
- [MODIFY] [types.ts](file:///Users/israq/Documents/Development/veritas-news/lib/supabase/types.ts) — Add `embedding?: number[] | null` to `ArticleAnalysis`, `InsertAnalysisInput`, and `Database`
- [MODIFY] [analysis.ts](file:///Users/israq/Documents/Development/veritas-news/lib/ai/analysis.ts) — Add `generateArticleEmbedding` function using `embed` and `google.textEmbeddingModel('text-embedding-004')`
- [MODIFY] [analyses.ts](file:///Users/israq/Documents/Development/veritas-news/lib/supabase/queries/analyses.ts) — Update `getPendingArticles` to detect articles with missing analysis OR missing embedding; update `insertAnalysis` / add `updateAnalysisEmbedding` helper
- [MODIFY] [articles.ts](file:///Users/israq/Documents/Development/veritas-news/lib/supabase/queries/articles.ts) — Add `getRelatedArticles(articleId, embedding)`
- [MODIFY] [route.ts](file:///Users/israq/Documents/Development/veritas-news/app/api/analyze/route.ts) — Integrate embedding generation and backfill in analysis pipeline
- [MODIFY] [page.tsx](file:///Users/israq/Documents/Development/veritas-news/app/news/%5Bid%5D/page.tsx) — Replace generic fallback related articles with vector similarity search results

---

## Implementation Requirements

### 1. Database Schema & Migration (`supabase/schema.sql`)
- Run SQL on Supabase:
  ```sql
  CREATE EXTENSION IF NOT EXISTS vector;

  ALTER TABLE public.article_analyses
    ADD COLUMN IF NOT EXISTS embedding vector(768);

  CREATE INDEX IF NOT EXISTS idx_article_analyses_embedding
    ON public.article_analyses USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);

  CREATE OR REPLACE FUNCTION match_related_articles(
    target_article_id UUID,
    target_embedding vector(768),
    match_count INT DEFAULT 5
  )
  RETURNS TABLE (
    id UUID,
    source_id UUID,
    url TEXT,
    canonical_url TEXT,
    title TEXT,
    image_url TEXT,
    published_at TIMESTAMPTZ,
    raw_text TEXT,
    scraped_at TIMESTAMPTZ,
    analyzed_at TIMESTAMPTZ,
    source JSONB,
    analysis JSONB
  )
  LANGUAGE plpgsql
  AS $$
  BEGIN
    RETURN QUERY
    SELECT
      a.id,
      a.source_id,
      a.url,
      a.canonical_url,
      a.title,
      a.image_url,
      a.published_at,
      a.raw_text,
      a.scraped_at,
      a.analyzed_at,
      to_jsonb(s.*) AS source,
      to_jsonb(an.*) AS analysis
    FROM article_analyses an
    JOIN articles a ON a.id = an.article_id
    JOIN sources s ON s.id = a.source_id
    WHERE an.embedding IS NOT NULL
      AND a.analyzed_at IS NOT NULL
      AND a.id != target_article_id
    ORDER BY an.embedding <=> target_embedding ASC
    LIMIT match_count;
  END;
  $$;
  ```

### 2. AI Embedding Generator (`lib/ai/analysis.ts`)
- Use AI SDK `embed` with `google.textEmbeddingModel('text-embedding-004')`.
- Input string: Title + Body text.
- Returns `number[]` array of length 768.

### 3. Pipeline Update (`app/api/analyze/route.ts` & `lib/supabase/queries/analyses.ts`)
- `getPendingArticles`: include articles without `article_analyses` OR with `article_analyses.embedding IS NULL`.
- In `analyzeArticle` or `/api/analyze`, generate embedding for each article.
- Save `embedding` into `article_analyses`.
- Update `articles.analyzed_at` only after both analysis and embedding are persisted.

### 4. Vector Query Function (`lib/supabase/queries/articles.ts`)
- Implement `getRelatedArticles(articleId: string, embedding: number[])`:
  Calls RPC `match_related_articles` with `target_article_id` and `target_embedding`.

### 5. News Details Page UI (`app/news/[id]/page.tsx`)
- Retrieve `liveArticle` which includes `analysis.embedding`.
- If `analysis.embedding` exists and is non-empty, fetch `getRelatedArticles(id, analysis.embedding)`.
- Render "Related Articles" section showing vector-similar articles. Hide section if no embedding or no results.

---

## Security Requirements
- All vector operations and DB calls execute server-side using service role or standard server client.
- No raw secrets or API keys exposed to browser.

---

## Acceptance Criteria
1. `public.article_analyses` table contains `embedding vector(768)` column.
2. `POST /api/analyze` generates and saves embeddings alongside analysis data.
3. `analyzed_at` is updated only after embedding and analysis are saved.
4. Existing articles missing embeddings are automatically backfilled when running `POST /api/analyze`.
5. `getRelatedArticles(articleId, embedding)` returns up to 5 vector-similar articles sorted by cosine distance.
6. The news details page shows the Related Articles section using vector similarity when embeddings are present, and hides it when no embedding is available.

---

## Checks to Run
- `npm run typecheck`
- `npm run lint`

---

## Manual Test Steps
1. Execute the ALTER TABLE & RPC function SQL in Supabase SQL Editor.
2. Trigger AI analysis with embeddings:
   ```bash
   curl -X POST http://localhost:3000/api/analyze \
     -H "Content-Type: application/json" \
     -H "x_veritas_admin_secret: asdfjkhaslkdfj" \
     -d '{"limit": 5}'
   ```
3. Inspect database to confirm `embedding` vector values are stored in `article_analyses`:
   ```sql
   SELECT a.title, an.bias_label, (an.embedding IS NOT NULL) AS has_embedding
   FROM article_analyses an
   JOIN articles a ON a.id = an.article_id;
   ```
4. Navigate to an article details page (`/news/<article_id>`) in the browser and verify the "Related Live Stories" section displays up to 5 semantically related articles based on vector similarity.
