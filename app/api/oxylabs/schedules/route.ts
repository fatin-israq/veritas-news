import { NextResponse } from 'next/server';
import { getActiveSources } from '@/lib/supabase/queries/sources';
import {
  getStoredSchedules,
  upsertStoredSchedule,
} from '@/lib/supabase/queries/schedules';
import { createLog } from '@/lib/supabase/queries/logs';
import {
  createOxylabsSchedule,
  listOxylabsSchedules,
  deactivateOxylabsSchedule,
} from '@/lib/scraping/oxylabs-scheduler';

/**
 * GET /api/oxylabs/schedules
 * Read stored schedule rows from Supabase oxylabs_schedules with source metadata.
 */
export async function GET() {
  try {
    const schedules = await getStoredSchedules();
    return NextResponse.json({ schedules }, { status: 200 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: 'Failed to fetch oxylabs schedules', details: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * POST /api/oxylabs/schedules
 * Sync active sources with Oxylabs Scheduler API (every 2 days) and deactivate orphan schedules.
 */
export async function POST(request: Request) {
  // 1. Admin secret security check (AGENTS.md Section 15)
  const adminSecretHeader = request.headers.get('x-veritas-admin-secret');
  const expectedSecret =
    process.env.VERITAS_ADMIN_SECRET || process.env['x-veritas-admin-secret'];

  if (!expectedSecret || adminSecretHeader !== expectedSecret) {
    return NextResponse.json(
      { error: 'Unauthorized: Invalid or missing x-veritas-admin-secret header' },
      { status: 401 }
    );
  }

  console.log('🔄 [Oxylabs Scheduler Sync] Initiating schedule synchronization...');
  await createLog({
    level: 'info',
    message: 'Oxylabs schedule sync started',
    metadata: {},
  });

  try {
    const activeSources = await getActiveSources();
    const existingStoredSchedules = await getStoredSchedules();

    let createdCount = 0;
    let existingCount = 0;
    const activeScheduleIdsInDb = new Set<string>();

    for (const source of activeSources) {
      const stored = existingStoredSchedules.find(s => s.source_id === source.id);

      if (stored && stored.status === 'active') {
        existingCount++;
        activeScheduleIdsInDb.add(stored.oxylabs_schedule_id);
        console.log(`  ✓ Source ${source.name} already has active schedule ID: ${stored.oxylabs_schedule_id}`);
      } else {
        console.log(`  ➕ Creating new Oxylabs schedule for ${source.name} (${source.listing_url})...`);
        const remoteId = await createOxylabsSchedule(source.listing_url, source.name);
        await upsertStoredSchedule(source.id, remoteId, 'active');
        activeScheduleIdsInDb.add(remoteId);
        createdCount++;
        console.log(`  ✅ Schedule created for ${source.name} with ID: ${remoteId}`);
      }
    }

    // 2. Orphan Schedule Deactivation (AGENTS.md Section 18)
    let deactivatedOrphansCount = 0;
    try {
      console.log('🔍 Checking for orphan schedules on Oxylabs...');
      const remoteSchedules = await listOxylabsSchedules();

      for (const remote of remoteSchedules) {
        if (remote.id && !activeScheduleIdsInDb.has(remote.id)) {
          console.log(`  ⚠️ Found orphan schedule ID ${remote.id} on Oxylabs. Deactivating...`);
          const success = await deactivateOxylabsSchedule(remote.id);
          if (success) {
            deactivatedOrphansCount++;
          }
        }
      }
    } catch (orphanErr: unknown) {
      const errMsg = orphanErr instanceof Error ? orphanErr.message : String(orphanErr);
      console.warn(`  ⚠️ Warning during orphan schedule check: ${errMsg}`);
    }

    const updatedSchedules = await getStoredSchedules();

    const summary = {
      status: 'success',
      activeSourcesCount: activeSources.length,
      createdCount,
      existingCount,
      deactivatedOrphansCount,
      schedules: updatedSchedules,
    };

    console.log('✅ [Oxylabs Scheduler Sync] Synchronization complete:', summary);
    await createLog({
      level: 'info',
      message: `Oxylabs schedule sync complete. Created ${createdCount}, active ${existingCount}, deactivated ${deactivatedOrphansCount} orphans.`,
      metadata: { summary },
    });

    return NextResponse.json(summary, { status: 200 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('💥 [Oxylabs Scheduler Sync] Error during sync:', errorMessage);
    await createLog({
      level: 'error',
      message: `Oxylabs schedule sync failed: ${errorMessage}`,
      metadata: { error: errorMessage },
    });

    return NextResponse.json(
      { error: 'Failed to sync oxylabs schedules', details: errorMessage },
      { status: 500 }
    );
  }
}
