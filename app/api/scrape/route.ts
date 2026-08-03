import { NextResponse } from 'next/server';
import { runScrapingPipeline } from '@/lib/scraping/pipeline';

export async function POST(request: Request) {
  // 1. Admin Secret Security Check (AGENTS.md Section 15)
  const adminSecretHeader =
    request.headers.get('x_veritas_admin_secret') ||
    request.headers.get('x-veritas-admin-secret');
  const expectedSecret =
    process.env.VERITAS_ADMIN_SECRET ||
    process.env.x_veritas_admin_secret ||
    process.env['x-veritas-admin-secret'];

  if (!expectedSecret || adminSecretHeader !== expectedSecret) {
    return NextResponse.json(
      { error: 'Unauthorized: Invalid or missing admin secret header' },
      { status: 401 }
    );
  }

  // 2. Parse request body if provided
  let options: { sourceIds?: string[]; limitPerSource?: number } = {};
  try {
    const body = await request.json();
    if (body && typeof body === 'object') {
      options = {
        sourceIds: Array.isArray(body.sourceIds) ? body.sourceIds : undefined,
        limitPerSource:
          typeof body.limitPerSource === 'number' && body.limitPerSource > 0
            ? body.limitPerSource
            : undefined,
      };
    }
  } catch {
    // Body is optional, empty body is allowed
  }

  // 3. Execute manual scraping pipeline
  try {
    const summary = await runScrapingPipeline(options);
    return NextResponse.json(summary, { status: 200 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: 'Internal scraping error', details: errorMessage },
      { status: 500 }
    );
  }
}
