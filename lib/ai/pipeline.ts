import {
  getPendingArticles,
  insertAnalysis,
  getAnalysisByArticleId,
  updateAnalysisEmbedding,
} from '../supabase/queries/analyses';
import { markArticleAnalyzed, getArticleById } from '../supabase/queries/articles';
import { createLog } from '../supabase/queries/logs';
import { analyzeArticle, generateArticleEmbedding } from './analysis';
import type { Article } from '../supabase/types';

export interface AnalysisPipelineSummary {
  status: 'success' | 'partial_success' | 'failed';
  total_pending: number;
  analyzed_count: number;
  failed_count: number;
  duration_ms: number;
  results: Array<{
    article_id: string;
    title: string;
    status: 'success' | 'failed';
    error?: string;
    bias_label?: string;
    sentiment_label?: string;
    has_embedding?: boolean;
  }>;
}

export async function runPendingAnalysisPipeline(options: {
  limit?: number;
  articleIds?: string[];
} = {}): Promise<AnalysisPipelineSummary> {
  const startTime = Date.now();
  console.log('[AI Analysis] Pipeline starting...');

  let targetArticles: Article[] = [];

  if (options.articleIds && options.articleIds.length > 0) {
    console.log(`[AI Analysis] Target requested for ${options.articleIds.length} specific article IDs.`);
    for (const id of options.articleIds) {
      const art = await getArticleById(id);
      if (art) {
        targetArticles.push(art);
      }
    }
  } else {
    console.log('[AI Analysis] Fetching pending articles via LEFT JOIN check...');
    targetArticles = await getPendingArticles(options.limit);
  }

  console.log(`[AI Analysis] Found ${targetArticles.length} target articles to process.`);

  if (targetArticles.length === 0) {
    const durationMs = Date.now() - startTime;
    const summary: AnalysisPipelineSummary = {
      status: 'success',
      total_pending: 0,
      analyzed_count: 0,
      failed_count: 0,
      duration_ms: durationMs,
      results: [],
    };

    await createLog({
      level: 'info',
      message: 'AI Analysis pipeline completed (no pending articles).',
      metadata: { summary },
    });

    return summary;
  }

  let analyzedCount = 0;
  let failedCount = 0;
  const resultsSummary: AnalysisPipelineSummary['results'] = [];

  for (let i = 0; i < targetArticles.length; i++) {
    const article = targetArticles[i];
    console.log(
      `[AI Analysis] [${i + 1}/${targetArticles.length}] Processing article: "${article.title}" (${article.id})`
    );

    try {
      const existingAnalysis = await getAnalysisByArticleId(article.id);

      if (existingAnalysis) {
        console.log(`[AI Analysis] Backfilling missing embedding for article "${article.title}"...`);
        const embedding = await generateArticleEmbedding(article.title, article.raw_text);
        await updateAnalysisEmbedding(article.id, embedding);
        await markArticleAnalyzed(article.id);

        analyzedCount++;
        console.log(`[AI Analysis] Successfully backfilled embedding for article "${article.title}".`);

        resultsSummary.push({
          article_id: article.id,
          title: article.title,
          status: 'success',
          bias_label: existingAnalysis.bias_label,
          sentiment_label: existingAnalysis.sentiment_label,
          has_embedding: true,
        });
      } else {
        const analysisInput = await analyzeArticle(article.id, article.title, article.raw_text);
        const embedding = await generateArticleEmbedding(article.title, article.raw_text);

        analysisInput.embedding = embedding;

        const savedAnalysis = await insertAnalysis(analysisInput);
        await markArticleAnalyzed(article.id);

        analyzedCount++;
        console.log(
          `[AI Analysis] Successfully analyzed article & saved embedding for "${article.title}": Bias=${savedAnalysis.bias_label} (${savedAnalysis.left_percentage}%L / ${savedAnalysis.center_percentage}%C / ${savedAnalysis.right_percentage}%R), Sentiment=${savedAnalysis.sentiment_label}`
        );

        resultsSummary.push({
          article_id: article.id,
          title: article.title,
          status: 'success',
          bias_label: savedAnalysis.bias_label,
          sentiment_label: savedAnalysis.sentiment_label,
          has_embedding: true,
        });
      }
    } catch (err) {
      failedCount++;
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error(
        `[AI Analysis] Failed to process article "${article.title}" (${article.id}):`,
        errorMessage
      );

      resultsSummary.push({
        article_id: article.id,
        title: article.title,
        status: 'failed',
        error: errorMessage,
      });
    }
  }

  const durationMs = Date.now() - startTime;

  const finalSummary: AnalysisPipelineSummary = {
    status: failedCount === 0 ? 'success' : 'partial_success',
    total_pending: targetArticles.length,
    analyzed_count: analyzedCount,
    failed_count: failedCount,
    duration_ms: durationMs,
    results: resultsSummary,
  };

  console.log(
    `[AI Analysis] Pipeline complete in ${durationMs}ms. Analyzed: ${analyzedCount}, Failed: ${failedCount}.`
  );

  await createLog({
    level: failedCount === 0 ? 'info' : 'warn',
    message: `AI Analysis pipeline completed: ${analyzedCount} analyzed, ${failedCount} failed.`,
    metadata: { finalSummary },
  });

  return finalSummary;
}
