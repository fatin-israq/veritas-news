import { getSupabaseAdmin } from '../server';
import type { Source, InsertSourceInput } from '../types';

export async function getActiveSources(): Promise<Source[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('sources')
    .select('*')
    .eq('active', true)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching active sources:', error.message);
    throw new Error(`Failed to fetch active sources: ${error.message}`);
  }

  return (data as Source[]) || [];
}

export async function getAllSources(): Promise<Source[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('sources')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching all sources:', error.message);
    throw new Error(`Failed to fetch sources: ${error.message}`);
  }

  return (data as Source[]) || [];
}

export async function getSourceById(id: string): Promise<Source | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('sources')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching source ${id}:`, error.message);
    throw new Error(`Failed to fetch source: ${error.message}`);
  }

  return (data as Source) || null;
}

export async function insertSource(source: InsertSourceInput): Promise<Source> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('sources')
    .insert([source])
    .select()
    .single();

  if (error) {
    console.error('Error inserting source:', error.message);
    throw new Error(`Failed to insert source: ${error.message}`);
  }

  return data as Source;
}
