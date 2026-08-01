-- Veritas News Supabase Schema DDL
-- Core Tables: sources, articles, article_analyses, logs, oxylabs_schedules, oxylabs_schedule_runs

-- 1. Sources Table
CREATE TABLE IF NOT EXISTS public.sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  listing_url TEXT NOT NULL,
  parser_strategy TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Articles Table
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID NOT NULL REFERENCES public.sources(id) ON DELETE CASCADE,
  url TEXT NOT NULL UNIQUE,
  canonical_url TEXT NOT NULL,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  published_at TIMESTAMPTZ NOT NULL,
  raw_text TEXT NOT NULL,
  scraped_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  analyzed_at TIMESTAMPTZ
);

-- 3. Article Analyses Table
-- Note: embedding vector(768) column will be added in Section 20 after pgvector is enabled
CREATE TABLE IF NOT EXISTS public.article_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL UNIQUE REFERENCES public.articles(id) ON DELETE CASCADE,
  summary TEXT NOT NULL,
  sentiment_score DOUBLE PRECISION NOT NULL,
  sentiment_label TEXT NOT NULL,
  bias_score DOUBLE PRECISION NOT NULL,
  bias_label TEXT NOT NULL,
  left_percentage INTEGER NOT NULL,
  center_percentage INTEGER NOT NULL,
  right_percentage INTEGER NOT NULL,
  confidence DOUBLE PRECISION NOT NULL,
  framing_notes TEXT,
  loaded_terms JSONB NOT NULL DEFAULT '[]'::jsonb,
  disclaimer TEXT,
  model TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Logs Table
CREATE TABLE IF NOT EXISTS public.logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Oxylabs Schedules Table
CREATE TABLE IF NOT EXISTS public.oxylabs_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID NOT NULL REFERENCES public.sources(id) ON DELETE CASCADE,
  oxylabs_schedule_id TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Oxylabs Schedule Runs Table
CREATE TABLE IF NOT EXISTS public.oxylabs_schedule_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID NOT NULL REFERENCES public.oxylabs_schedules(id) ON DELETE CASCADE,
  oxylabs_job_id TEXT,
  status TEXT NOT NULL,
  articles_scraped INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_articles_source_id ON public.articles(source_id);
CREATE INDEX IF NOT EXISTS idx_articles_url ON public.articles(url);
CREATE INDEX IF NOT EXISTS idx_articles_analyzed_at ON public.articles(analyzed_at);
CREATE INDEX IF NOT EXISTS idx_article_analyses_article_id ON public.article_analyses(article_id);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON public.logs(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oxylabs_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oxylabs_schedule_runs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Public Read Access (anon & authenticated)
CREATE POLICY "Allow public read access to sources" ON public.sources
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow public read access to articles" ON public.articles
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow public read access to article_analyses" ON public.article_analyses
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow public read access to logs" ON public.logs
  FOR SELECT TO anon, authenticated USING (true);

