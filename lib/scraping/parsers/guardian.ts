import * as cheerio from 'cheerio';
import type { SourceParser, ParsedArticleDetail } from '../types';
import { GenericParser } from './generic';

export const GuardianParser: SourceParser = {
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

        if (!fullUrl.hostname.includes('theguardian.com')) return;

        const path = fullUrl.pathname;

        // The Guardian articles must contain date pattern: /202.../mon/dd/slug
        // e.g. /us-news/2026/aug/01/white-house-statement
        const isGuardianArticle = /\/\d{4}\/[a-z]{3}\/\d{1,2}\//i.test(path);

        if (isGuardianArticle) {
          candidates.add(fullUrl.toString());
        }
      } catch {
        // ignore
      }
    });

    if (candidates.size < 3) {
      const genericCandidates = GenericParser.extractCandidateLinks(html, listingUrl);
      genericCandidates.forEach(url => {
        if (/\/\d{4}\//.test(url)) {
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
