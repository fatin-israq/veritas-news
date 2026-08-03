import { NextResponse } from 'next/server';
import { processScheduledResultsPipeline } from '@/lib/scraping/scheduler-pipeline';
import { runPendingAnalysisPipeline } from '@/lib/ai/pipeline';
import { createLog } from '@/lib/supabase/queries/logs';

export const dynamic = 'force-dynamic';

/**
 * GET /api/cron/pipeline
 * Vercel Cron Endpoint (runs every two days).
 * 1. Process completed Oxylabs scheduled runs (scrape & insert valid articles).
 * 2. Immediately run AI analysis on all pending valid articles (even if step 1 fails).
 */
export async function GET(request: Request) {
  const startTime = Date.now();
  const cronSecret = process.env.CRON_SECRET;

  // Verify CRON_SECRET if configured in environment
  if (cronSecret) {
    const authHeader = request.headers.get('authorization');
    const cronHeader = request.headers.get('x-cron-secret');
    const token = authHeader ? authHeader.replace(/^Bearer\s+/i, '') : cronHeader;

    if (token !== cronSecret) {
      console.warn('⚠️ [Cron Pipeline] Unauthorized access attempt to /api/cron/pipeline');
      return NextResponse.json(
        { error: 'Unauthorized: Invalid CRON_SECRET token' },
        { status: 401 }
      );
    }
  } else {
    console.log('ℹ️ [Cron Pipeline] CRON_SECRET not set in environment. Running in dev bypass mode.');
  }

  console.log('⏰ [Cron Pipeline] Starting automatic 2-day pipeline execution...');
  await createLog({
    level: 'info',
    message: 'Vercel Cron automatic pipeline started',
    metadata: {},
  });

  let step1Result: unknown = null;
  let step1Error: string | null = null;
  let step2Result: unknown = null;
  let step2Error: string | null = null;

  // Step 1: Process scheduled results
  try {
    console.log('\n--- [Cron Pipeline Step 1] Processing Oxylabs Scheduled Results ---');
    step1Result = await processScheduledResultsPipeline();
    console.log('✅ [Cron Pipeline Step 1] Completed successfully.');
  } catch (err: unknown) {
    step1Error = err instanceof Error ? err.message : String(err);
    console.error('❌ [Cron Pipeline Step 1] Failed:', step1Error);
  }

  // Step 2: Always run AI analysis for pending articles (even if Step 1 failed)
  try {
    console.log('\n--- [Cron Pipeline Step 2] Running Pending AI Article Analysis ---');
    step2Result = await runPendingAnalysisPipeline();
    console.log('✅ [Cron Pipeline Step 2] Completed successfully.');
  } catch (err: unknown) {
    step2Error = err instanceof Error ? err.message : String(err);
    console.error('❌ [Cron Pipeline Step 2] Failed:', step2Error);
  }

  const durationMs = Date.now() - startTime;

  const summary = {
    status: !step1Error && !step2Error ? 'success' : 'partial_success',
    durationMs,
    step1_scraping: {
      success: !step1Error,
      error: step1Error,
      details: step1Result,
    },
    step2_analysis: {
      success: !step2Error,
      error: step2Error,
      details: step2Result,
    },
  };

  console.log(`\n🎉 [Cron Pipeline] Automatic pipeline completed in ${durationMs}ms:`, JSON.stringify(summary, null, 2));

  await createLog({
    level: summary.status === 'success' ? 'info' : 'warn',
    message: `Vercel Cron pipeline completed in ${durationMs}ms with status '${summary.status}'.`,
    metadata: summary,
  });

  return NextResponse.json(summary, { status: 200 });
}
