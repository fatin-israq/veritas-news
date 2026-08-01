import { NextResponse } from 'next/server';
import { getPendingArticles, insertAnalysis, getAnalysisByArticleId, updateAnalysisEmbedding } from '@/lib/supabase/queries/analyses';
import { markArticleAnalyzed, getArticleById } from '@/lib/supabase/queries/articles';
import { createLog } from '@/lib/supabase/queries/logs';
import { analyzeArticle, generateArticleEmbedding } from '@/lib/ai/analysis';
import type { Article } from '@/lib/supabase/types';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const startTime = Date.now();

  // 1. Authenticate using x-veritas-admin-secret
  const adminSecret = request.headers.get('x-veritas-admin-secret');
  const expectedSecret = process.env.VERITAS_ADMIN_SECRET;

  if (!expectedSecret || adminSecret !== expectedSecret) {
    return NextResponse.json(
      { error: 'Unauthorized: Invalid or missing admin secret' },
      { status: 401 }
    );
  }

  try {
    // Parse request body if available
    let limit: number | undefined;
    let articleIds: string[] | undefined;

    try {
      const body = await request.json();
      if (typeof body.limit === 'number' && body.limit > 0) {
        limit = body.limit;
      }
      if (Array.isArray(body.articleIds) && body.articleIds.length > 0) {
        articleIds = body.articleIds.map(String);
      }
    } catch {
      // Body is optional; proceed with defaults if no JSON body provided
    }

    console.log('[AI Analysis] Pipeline starting...');

    let targetArticles: Article[] = [];

    if (articleIds && articleIds.length > 0) {
      console.log(`[AI Analysis] Target requested for ${articleIds.length} specific article IDs.`);
      for (const id of articleIds) {
        const art = await getArticleById(id);
        if (art) {
          targetArticles.push(art);
        }
      }
    } else {
      console.log('[AI Analysis] Fetching pending articles via LEFT JOIN check...');
      targetArticles = await getPendingArticles(limit);
    }

    console.log(`[AI Analysis] Found ${targetArticles.length} target articles to process.`);

    if (targetArticles.length === 0) {
      const durationMs = Date.now() - startTime;
      const summary = {
        status: 'success',
        message: 'No pending articles found requiring analysis or vector embedding backfill.',
        total_pending: 0,
        analyzed_count: 0,
        failed_count: 0,
        duration_ms: durationMs,
        results: [],
      };

      await createLog({
        level: 'info',
        message: 'AI Analysis pipeline completed (no pending articles).',
        metadata: summary,
      });

      return NextResponse.json(summary);
    }

    let analyzedCount = 0;
    let failedCount = 0;
    const resultsSummary: Array<{
      article_id: string;
      title: string;
      status: 'success' | 'failed';
      error?: string;
      bias_label?: string;
      sentiment_label?: string;
      has_embedding?: boolean;
    }> = [];

    // Process target articles
    for (let i = 0; i < targetArticles.length; i++) {
      const article = targetArticles[i];
      console.log(
        `[AI Analysis] [${i + 1}/${targetArticles.length}] Processing article: "${article.title}" (${article.id})`
      );

      try {
        const existingAnalysis = await getAnalysisByArticleId(article.id);

        if (existingAnalysis) {
          // Analysis exists, but embedding is missing — backfill embedding only
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
          // Run full AI analysis + embedding generation
          const analysisInput = await analyzeArticle(article.id, article.title, article.raw_text);
          const embedding = await generateArticleEmbedding(article.title, article.raw_text);

          analysisInput.embedding = embedding;

          // Save analysis record with embedding to Supabase
          const savedAnalysis = await insertAnalysis(analysisInput);

          // Update article analyzed_at timestamp only after analysis and embedding are saved
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

    const finalSummary = {
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

    // Record log entry in Supabase logs table
    await createLog({
      level: failedCount === 0 ? 'info' : 'warn',
      message: `AI Analysis pipeline completed: ${analyzedCount} analyzed, ${failedCount} failed.`,
      metadata: finalSummary,
    });

    return NextResponse.json(finalSummary);
  } catch (error) {
    const durationMs = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);

    console.error('[AI Analysis] Fatal pipeline error:', errorMessage);

    await createLog({
      level: 'error',
      message: `AI Analysis pipeline fatal error: ${errorMessage}`,
      metadata: { error: errorMessage, duration_ms: durationMs },
    });

    return NextResponse.json(
      {
        error: 'AI Analysis pipeline execution failed',
        details: errorMessage,
        duration_ms: durationMs,
      },
      { status: 500 }
    );
  }
}
