import { getSupabaseAdmin } from '../server';
import type { Log, CreateLogInput, Json } from '../types';

export async function createLog(input: CreateLogInput): Promise<Log> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('logs')
    .insert([{
      level: input.level,
      message: input.message,
      metadata: (input.metadata || {}) as Json,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating log entry:', error.message);
    // Silent fail for logging errors so pipeline execution doesn't crash on log failures
    return {
      id: '',
      level: input.level,
      message: input.message,
      metadata: (input.metadata || {}) as Json,
      created_at: new Date().toISOString(),
    };
  }

  return data as Log;
}

export async function getRecentLogs(limit = 100): Promise<Log[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching logs:', error.message);
    throw new Error(`Failed to fetch logs: ${error.message}`);
  }

  return (data as Log[]) || [];
}
