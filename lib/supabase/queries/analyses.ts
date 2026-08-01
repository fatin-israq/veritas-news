import { getSupabaseAdmin } from '../server';
import type { Article, ArticleAnalysis, InsertAnalysisInput } from '../types';

/**
 * Detects articles pending AI analysis.
 * Strictly complies with AGENTS.md Section 19:
 * "detect pending articles by LEFT JOINing articles to article_analyses.
 *  Never rely on analyzed_at IS NULL alone... An article is pending when no article_analyses row exists for it."
 *
 * And complies with AGENTS.md Section 21:
 * "fetch the joined data without a filter and apply the condition in JavaScript after the query returns."
 */
export async function getPendingArticles(limit?: number): Promise<Article[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      article_analyses(id)
    `)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching pending articles:', error.message);
    throw new Error(`Failed to fetch pending articles: ${error.message}`);
  }

  if (!data) return [];

  // Filter in JavaScript for rows where article_analyses is null or empty array
  const pendingArticles: Article[] = [];

  for (const item of data as unknown as Array<Article & { article_analyses: Array<{ id: string }> | null }>) {
    const analyses = item.article_analyses;
    const hasAnalysis = Array.isArray(analyses) ? analyses.length > 0 : Boolean(analyses);

    if (!hasAnalysis) {
      // Destructure to remove joined field before returning clean Article object
      const { article_analyses, ...article } = item;
      void article_analyses; // eliminate unused variable warning
      pendingArticles.push(article as Article);
    }
  }

  if (limit && limit > 0) {
    return pendingArticles.slice(0, limit);
  }

  return pendingArticles;
}

export async function getAnalysisByArticleId(articleId: string): Promise<ArticleAnalysis | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('article_analyses')
    .select('*')
    .eq('article_id', articleId)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching analysis for article ${articleId}:`, error.message);
    throw new Error(`Failed to fetch article analysis: ${error.message}`);
  }

  return (data as ArticleAnalysis) || null;
}

export async function insertAnalysis(analysis: InsertAnalysisInput): Promise<ArticleAnalysis> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('article_analyses')
    .insert([analysis])
    .select()
    .single();

  if (error) {
    console.error('Error inserting article analysis:', error.message);
    throw new Error(`Failed to insert article analysis: ${error.message}`);
  }

  return data as ArticleAnalysis;
}
