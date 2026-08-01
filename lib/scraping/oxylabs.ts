import type { OxylabsQueryResponse } from './types';

const OXYLABS_REALTIME_URL = 'https://realtime.oxylabs.io/v1/queries';

export async function fetchPageWithOxylabs(
  url: string,
  options: { render?: 'html' } = {}
): Promise<string> {
  const username = process.env.OXY_WSA_USERNAME;
  const password = process.env.OXY_WSA_PASSWORD;

  if (!username || !password) {
    throw new Error('Oxylabs credentials missing: OXY_WSA_USERNAME or OXY_WSA_PASSWORD not configured');
  }

  const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

  const payload: Record<string, unknown> = {
    source: 'universal',
    url,
  };

  if (options.render) {
    payload.render = options.render;
  }

  const response = await fetch(OXYLABS_REALTIME_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Oxylabs WSA HTTP error ${response.status}: ${errorText}`);
  }

  const data = (await response.json()) as OxylabsQueryResponse;

  if (!data.results || data.results.length === 0) {
    throw new Error(`Oxylabs WSA returned no results for URL: ${url}`);
  }

  const result = data.results[0];

  // If anti-bot challenge (613) occurred and rendering wasn't enabled yet, retry with render: "html"
  if (result.status_code === 613 && !options.render) {
    console.log(`  ℹ️ Received HTTP 613 (Anti-bot) for ${url}. Retrying with render: "html"...`);
    return fetchPageWithOxylabs(url, { render: 'html' });
  }

  if (result.status_code && result.status_code >= 400) {
    throw new Error(`Oxylabs WSA target returned HTTP ${result.status_code} for URL: ${url}`);
  }

  if (!result.content) {
    throw new Error(`Oxylabs WSA returned empty content for URL: ${url}`);
  }

  return result.content;
}
