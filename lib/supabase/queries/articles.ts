import { getSupabaseAdmin } from '../server';
import type { Article, ArticleWithAnalysis, InsertArticleInput } from '../types';

/**
 * Checks which candidate URLs already exist in Supabase.
 * Strictly complies with AGENTS.md Section 9:
 * "query in small chunks and never pass more than 15 URLs to a single .in() filter."
 */
export async function checkUrlsExist(urls: string[]): Promise<Set<string>> {
  if (!urls || urls.length === 0) {
    return new Set<string>();
  }

  const supabase = getSupabaseAdmin();
  const existingUrls = new Set<string>();
  const CHUNK_SIZE = 15;

  for (let i = 0; i < urls.length; i += CHUNK_SIZE) {
    const chunk = urls.slice(i, i + CHUNK_SIZE);
    const { data, error } = await supabase
      .from('articles')
      .select('url')
      .in('url', chunk);

    if (error) {
      console.error('Error checking existing article URLs:', error.message);
      throw new Error(`Failed to check existing URLs: ${error.message}`);
    }

    if (data) {
      for (const row of data as Array<{ url: string }>) {
        existingUrls.add(row.url);
      }
    }
  }

  return existingUrls;
}

/**
 * Fetches articles with their associated source and analysis data.
 * Useful for the home page cards feed.
 */
export async function getArticles(limit = 50): Promise<ArticleWithAnalysis[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      source:sources(*),
      analysis:article_analyses(*)
    `)
    .not('analyzed_at', 'is', null)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching articles:', error.message);
    throw new Error(`Failed to fetch articles: ${error.message}`);
  }

  return (data as unknown as ArticleWithAnalysis[]) || [];
}

/**
 * Fetches a single article detail with source and analysis.
 */
export async function getArticleById(id: string): Promise<ArticleWithAnalysis | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      source:sources(*),
      analysis:article_analyses(*)
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching article ${id}:`, error.message);
    throw new Error(`Failed to fetch article: ${error.message}`);
  }

  return (data as unknown as ArticleWithAnalysis) || null;
}

/**
 * Inserts a valid article into Supabase. Append-only during scraping.
 */
export async function insertArticle(article: InsertArticleInput): Promise<Article> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('articles')
    .insert([article])
    .select()
    .single();

  if (error) {
    console.error('Error inserting article:', error.message);
    throw new Error(`Failed to insert article: ${error.message}`);
  }

  return data as Article;
}

/**
 * Updates an article's analyzed_at timestamp after successful AI analysis saving.
 */
export async function markArticleAnalyzed(articleId: string, timestamp = new Date().toISOString()): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from('articles')
    .update({ analyzed_at: timestamp })
    .eq('id', articleId);

  if (error) {
    console.error(`Error updating analyzed_at for article ${articleId}:`, error.message);
    throw new Error(`Failed to mark article as analyzed: ${error.message}`);
  }
}

/**
 * Finds related articles by vector similarity search (cosine distance).
 * Strictly complies with AGENTS.md Section 20.
 */
export async function getRelatedArticles(
  articleId: string,
  embedding: number[] | string,
  limit = 5
): Promise<ArticleWithAnalysis[]> {
  let parsedEmbedding: number[] = [];
  if (Array.isArray(embedding)) {
    parsedEmbedding = embedding;
  } else if (typeof embedding === 'string') {
    try {
      parsedEmbedding = JSON.parse(embedding);
    } catch {
      return [];
    }
  }

  if (!articleId || !parsedEmbedding || !Array.isArray(parsedEmbedding) || parsedEmbedding.length === 0) {
    return [];
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.rpc('match_related_articles', {
    target_article_id: articleId,
    target_embedding: parsedEmbedding,
    match_count: limit,
  });

  if (error) {
    console.error(`Error fetching related articles for ${articleId}:`, error.message);
    return [];
  }

  if (!data) return [];

  return (data as Array<{
    id: string;
    source_id: string;
    url: string;
    canonical_url: string;
    title: string;
    image_url: string;
    published_at: string;
    raw_text: string;
    scraped_at: string;
    analyzed_at: string | null;
    source: Record<string, unknown>;
    analysis: Record<string, unknown>;
  }>).map((row) => ({
    id: row.id,
    source_id: row.source_id,
    url: row.url,
    canonical_url: row.canonical_url,
    title: row.title,
    image_url: row.image_url,
    published_at: row.published_at,
    raw_text: row.raw_text,
    scraped_at: row.scraped_at,
    analyzed_at: row.analyzed_at,
    source: row.source as unknown as ArticleWithAnalysis['source'],
    analysis: row.analysis as unknown as ArticleWithAnalysis['analysis'],
  }));
}

