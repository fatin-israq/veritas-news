import * as cheerio from 'cheerio';
import type { SourceParser, ParsedArticleDetail } from '../types';
import { GenericParser } from './generic';

export const NPRParser: SourceParser = {
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

        if (!fullUrl.hostname.includes('npr.org')) return;

        const path = fullUrl.pathname;

        // NPR article format: /yyyy/mm/dd/id/slug or /yyyy/mm/dd/id
        const isNprArticle = /^\/\d{4}\/\d{2}\/\d{2}\/\d{6,}/.test(path);

        if (isNprArticle) {
          candidates.add(fullUrl.toString());
        }
      } catch {
        // ignore
      }
    });

    if (candidates.size < 3) {
      const genericCandidates = GenericParser.extractCandidateLinks(html, listingUrl);
      genericCandidates.forEach(url => {
        if (/^\/\d{4}\//.test(new URL(url).pathname)) {
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
