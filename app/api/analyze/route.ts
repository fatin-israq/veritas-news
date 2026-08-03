import { NextResponse } from 'next/server';
import { runPendingAnalysisPipeline } from '@/lib/ai/pipeline';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  // 1. Authenticate using x-veritas-admin-secret
  const adminSecret = request.headers.get('x-veritas-admin-secret');
  const expectedSecret =
    process.env.VERITAS_ADMIN_SECRET || process.env['x-veritas-admin-secret'];

  if (!expectedSecret || adminSecret !== expectedSecret) {
    return NextResponse.json(
      { error: 'Unauthorized: Invalid or missing admin secret' },
      { status: 401 }
    );
  }

  try {
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
      // Body is optional
    }

    const summary = await runPendingAnalysisPipeline({ limit, articleIds });
    return NextResponse.json(summary);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        error: 'AI Analysis pipeline execution failed',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
