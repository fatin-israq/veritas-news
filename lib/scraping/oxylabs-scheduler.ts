const OXYLABS_SCHEDULES_URL = 'https://data.oxylabs.io/v1/schedules';
const OXYLABS_DATA_URL = 'https://data.oxylabs.io/v1';

export interface OxylabsRemoteSchedule {
  id: string; // 64-bit safe string
  name?: string;
  url?: string;
  source?: string;
  cron?: string;
  state?: string;
  status?: string;
}

export interface OxylabsRunItem {
  id: string; // 64-bit safe job_id or run_id string
  job_id?: string;
  schedule_id?: string;
  result_status?: 'done' | 'pending' | 'faulted' | string;
  status?: string;
  created_at?: string;
}

function getAuthHeader(): string {
  const username = process.env.OXY_WSA_USERNAME;
  const password = process.env.OXY_WSA_PASSWORD;

  if (!username || !password) {
    throw new Error('Oxylabs credentials missing: OXY_WSA_USERNAME or OXY_WSA_PASSWORD not configured');
  }

  return `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
}

/**
 * Safely parses JSON response containing large 64-bit integers by wrapping unquoted
 * numeric ID sequences (>10 digits) in quotes before JSON.parse executes.
 */

export function parseRawOxylabsResponse<T>(rawText: string): T {
  // Regex to match "id": 123456789012345678 or "schedule_id": 123456... or "job_id": 123456...
  const safeText = rawText.replace(
    /"(id|schedule_id|job_id|run_id)"\s*:\s*(\d{10,})/g,
    '"$1": "$2"'
  );
  return JSON.parse(safeText) as T;
}

/**
 * Creates an Oxylabs Scheduler job for a source homepage URL, set to execute every two days.
 */
export async function createOxylabsSchedule(
  url: string,
  sourceName: string
): Promise<string> {
  const authHeader = getAuthHeader();

  const payload = {
    cron: '0 6 */2 * *',
    end_time: '2099-12-31T23:59:59Z',
    items: [
      {
        source: 'universal',
        url,
      },
    ],
    client_notes: `Veritas News Schedule for ${sourceName}`,
  };

  const response = await fetch(OXYLABS_SCHEDULES_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader,
    },
    body: JSON.stringify(payload),
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(`Oxylabs Create Schedule HTTP error ${response.status}: ${responseText}`);
  }

  const parsed = parseRawOxylabsResponse<{ id?: string; schedule_id?: string; results?: Array<{ id: string }> }>(responseText);

  const scheduleId = parsed.id || parsed.schedule_id || (parsed.results && parsed.results[0]?.id);

  if (!scheduleId) {
    throw new Error(`Failed to extract schedule ID from Oxylabs response: ${responseText}`);
  }

  return String(scheduleId);
}

/**
 * Fetches all remote schedules configured in Oxylabs.
 */
export async function listOxylabsSchedules(): Promise<OxylabsRemoteSchedule[]> {
  const authHeader = getAuthHeader();

  const response = await fetch(OXYLABS_SCHEDULES_URL, {
    method: 'GET',
    headers: {
      Authorization: authHeader,
    },
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(`Oxylabs List Schedules HTTP error ${response.status}: ${responseText}`);
  }

  const parsed = parseRawOxylabsResponse<OxylabsRemoteSchedule[] | { schedules?: OxylabsRemoteSchedule[]; results?: OxylabsRemoteSchedule[] }>(responseText);

  if (Array.isArray(parsed)) {
    return parsed;
  }
  return parsed.schedules || parsed.results || [];
}

/**
 * Deactivates an Oxylabs schedule.
 */
export async function deactivateOxylabsSchedule(scheduleId: string): Promise<boolean> {
  const authHeader = getAuthHeader();

  const url = `${OXYLABS_SCHEDULES_URL}/${scheduleId}/state`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader,
    },
    body: JSON.stringify({ state: 'inactive' }),
  });

  if (!response.ok) {
    console.warn(`⚠️ Warning: Failed to deactivate Oxylabs schedule ${scheduleId} (HTTP ${response.status})`);
    return false;
  }

  return true;
}

/**
 * Gets runs for a specific schedule ID, returning only runs with result_status === 'done'.
 */
export async function getOxylabsScheduleRuns(scheduleId: string): Promise<OxylabsRunItem[]> {
  const authHeader = getAuthHeader();

  const url = `${OXYLABS_SCHEDULES_URL}/${scheduleId}/runs`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: authHeader,
    },
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(`Oxylabs Get Schedule Runs HTTP error ${response.status} for schedule ${scheduleId}: ${responseText}`);
  }

  const parsed = parseRawOxylabsResponse<OxylabsRunItem[] | { runs?: OxylabsRunItem[]; results?: OxylabsRunItem[] }>(responseText);

  const rawRuns = Array.isArray(parsed) ? parsed : parsed.runs || parsed.results || [];

  // Always filter for result_status === 'done' per Section 18
  return rawRuns.filter(run => (run.result_status === 'done' || run.status === 'done'));
}

/**
 * Fetches HTML content for a completed Oxylabs job ID.
 */
export async function fetchOxylabsJobContent(jobId: string): Promise<string> {
  const authHeader = getAuthHeader();

  const endpoints = [
    `${OXYLABS_DATA_URL}/queries/${jobId}/results`,
    `${OXYLABS_DATA_URL}/jobs/${jobId}/results`,
  ];

  let lastError = '';

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          Authorization: authHeader,
        },
      });

      const responseText = await response.text();

      if (!response.ok) {
        lastError = `HTTP ${response.status}: ${responseText}`;
        continue;
      }

      const parsed = parseRawOxylabsResponse<{ results?: Array<{ content?: string }> }>(responseText);

      if (parsed.results && parsed.results.length > 0 && parsed.results[0].content) {
        return parsed.results[0].content;
      }
    } catch (err: unknown) {
      lastError = err instanceof Error ? err.message : String(err);
    }
  }

  throw new Error(`Failed to fetch job content for job ${jobId}: ${lastError}`);
}
