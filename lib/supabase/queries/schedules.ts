import { getSupabaseAdmin } from '../server';
import type { OxylabsSchedule, OxylabsScheduleRun, Source } from '../types';

export type OxylabsScheduleWithSource = OxylabsSchedule & {
  source: Source;
};

export async function getStoredSchedules(): Promise<OxylabsScheduleWithSource[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('oxylabs_schedules')
    .select('*, source:sources(*)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching oxylabs schedules:', error.message);
    throw new Error(`Failed to fetch oxylabs schedules: ${error.message}`);
  }

  return (data as unknown as OxylabsScheduleWithSource[]) || [];
}

export async function getStoredScheduleBySourceId(
  sourceId: string
): Promise<OxylabsSchedule | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('oxylabs_schedules')
    .select('*')
    .eq('source_id', sourceId)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching schedule for source ${sourceId}:`, error.message);
    throw new Error(`Failed to fetch schedule for source: ${error.message}`);
  }

  return (data as OxylabsSchedule) || null;
}

export async function upsertStoredSchedule(
  sourceId: string,
  oxylabsScheduleId: string,
  status: string = 'active'
): Promise<OxylabsSchedule> {
  const supabase = getSupabaseAdmin();

  // Check if schedule already exists for source
  const existing = await getStoredScheduleBySourceId(sourceId);

  if (existing) {
    const { data, error } = await supabase
      .from('oxylabs_schedules')
      .update({
        oxylabs_schedule_id: oxylabsScheduleId,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating oxylabs schedule:', error.message);
      throw new Error(`Failed to update oxylabs schedule: ${error.message}`);
    }

    return data as OxylabsSchedule;
  }

  const { data, error } = await supabase
    .from('oxylabs_schedules')
    .insert([
      {
        source_id: sourceId,
        oxylabs_schedule_id: oxylabsScheduleId,
        status,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error inserting oxylabs schedule:', error.message);
    throw new Error(`Failed to insert oxylabs schedule: ${error.message}`);
  }

  return data as OxylabsSchedule;
}

export async function updateScheduleStatus(
  id: string,
  status: string
): Promise<OxylabsSchedule> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('oxylabs_schedules')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating status for schedule ${id}:`, error.message);
    throw new Error(`Failed to update schedule status: ${error.message}`);
  }

  return data as OxylabsSchedule;
}

export async function recordScheduleRun(
  scheduleId: string,
  oxylabsJobId: string | null,
  status: string,
  articlesScraped: number,
  errorMessage: string | null = null
): Promise<OxylabsScheduleRun> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('oxylabs_schedule_runs')
    .insert([
      {
        schedule_id: scheduleId,
        oxylabs_job_id: oxylabsJobId,
        status,
        articles_scraped: articlesScraped,
        error_message: errorMessage,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error recording oxylabs schedule run:', error.message);
    throw new Error(`Failed to record schedule run: ${error.message}`);
  }

  return data as OxylabsScheduleRun;
}
