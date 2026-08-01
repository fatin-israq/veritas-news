import { NextResponse } from 'next/server';
import { getActiveSources } from '@/lib/supabase/queries/sources';

export async function GET() {
  try {
    const sources = await getActiveSources();
    return NextResponse.json({
      success: true,
      count: sources.length,
      data: sources,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch sources';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
