import * as cheerio from 'cheerio';
import type { SourceParser, ParsedArticleDetail } from '../types';
import { GenericParser } from './generic';

export const ReutersParser: SourceParser = {
  extractCandidateLinks(html: string, listingUrl: string): string[] {
    const $ = cheerio.load(html);
    const candidates = new Set<string>();
    const baseUrl = new URL(listingUrl);

    $('a[href]').each((_, el) => {
      const href = $(el).attr('href');
      if (!href) return;

      try {
        const fullUrl = new URL(href, baseUrl.origin);
        fullUrl.hash = '';

        if (!fullUrl.hostname.includes('reuters.com')) return;

        const path = fullUrl.pathname;

        // Reuters article URLs end with date string like -202.../ or have specific article ID pattern
        // Example: /world/us/us-economy-growth-2026-08-01/
        const isArticlePattern =
          /-\d{4}-\d{2}-\d{2}\/?$/i.test(path) ||
          /\/\d{4}-\d{2}-\d{2}\/?$/i.test(path) ||
          (path.split('/').filter(Boolean).length >= 3 && /-[a-z0-9]{8,}\/?$/i.test(path));

        const isSection =
          /^\/(world|business|markets|sustainability|legal|breakingviews|technology|graphics|sports|lifestyle)\/?$/i.test(path) ||
          /^\/world\/[a-z-]+\/?$/i.test(path);

        if (isArticlePattern && !isSection) {
          candidates.add(fullUrl.toString());
        }
      } catch {
        // ignore
      }
    });

    // Fallback to generic parser if candidates list is small
    if (candidates.size < 3) {
      const genericCandidates = GenericParser.extractCandidateLinks(html, listingUrl);
      genericCandidates.forEach(url => candidates.add(url));
    }

    return Array.from(candidates);
  },

  parseArticleDetail(html: string, url: string): ParsedArticleDetail | null {
    return GenericParser.parseArticleDetail(html, url);
  },
};
