import * as cheerio from 'cheerio';
import type { SourceParser, ParsedArticleDetail } from '../types';
import { GenericParser } from './generic';

export const BBCParser: SourceParser = {
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

        if (!fullUrl.hostname.includes('bbc.com')) return;

        const path = fullUrl.pathname;

        // Reject sport, live, iplayer, sounds, etc.
        if (
          /\/sport\//i.test(path) ||
          /\/live\//i.test(path) ||
          /\/weather\//i.test(path) ||
          /\/iplayer\//i.test(path) ||
          /\/sounds\//i.test(path)
        ) {
          return;
        }

        // BBC article patterns:
        // /news/articles/c...
        // /news/world-us-canada-12345678
        const isArticlePattern =
          /\/news\/articles\/[a-z0-9]+/i.test(path) ||
          (path.startsWith('/news/') && /-[0-9]{7,}$/.test(path));

        if (isArticlePattern) {
          candidates.add(fullUrl.toString());
        }
      } catch {
        // ignore
      }
    });

    if (candidates.size < 3) {
      const genericCandidates = GenericParser.extractCandidateLinks(html, listingUrl);
      genericCandidates.forEach(url => {
        if (!url.includes('/sport/') && !url.includes('/live/')) {
          candidates.add(url);
        }
      });
    }

    return Array.from(candidates);
  },

  parseArticleDetail(html: string, url: string): ParsedArticleDetail | null {
    return GenericParser.parseArticleDetail(html, url);
  },
};
