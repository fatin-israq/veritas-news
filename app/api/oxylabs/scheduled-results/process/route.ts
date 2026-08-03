import { NextResponse } from 'next/server';
import { processScheduledResultsPipeline } from '@/lib/scraping/scheduler-pipeline';

/**
 * POST /api/oxylabs/scheduled-results/process
 * Manually trigger processing of completed Oxylabs scheduled runs.
 * Requires x-veritas-admin-secret header.
 */
export async function POST(request: Request) {
  // 1. Admin Secret Security Check (AGENTS.md Section 15)
  const adminSecretHeader = request.headers.get('x-veritas-admin-secret');
  const expectedSecret =
    process.env.VERITAS_ADMIN_SECRET || process.env['x-veritas-admin-secret'];

  if (!expectedSecret || adminSecretHeader !== expectedSecret) {
    return NextResponse.json(
      { error: 'Unauthorized: Invalid or missing x-veritas-admin-secret header' },
      { status: 401 }
    );
  }

  // 2. Optional body options
  let options: { limitPerSource?: number } = {};
  try {
    const body = await request.json();
    if (body && typeof body === 'object') {
      options = {
        limitPerSource:
          typeof body.limitPerSource === 'number' && body.limitPerSource > 0
            ? body.limitPerSource
            : undefined,
      };
    }
  } catch {
    // Body is optional
  }

  try {
    const summary = await processScheduledResultsPipeline(options);
    return NextResponse.json(summary, { status: 200 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: 'Internal processing error', details: errorMessage },
      { status: 500 }
    );
  }
}
