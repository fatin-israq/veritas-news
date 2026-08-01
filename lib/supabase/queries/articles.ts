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
