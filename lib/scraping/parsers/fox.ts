import * as cheerio from 'cheerio';
import type { SourceParser, ParsedArticleDetail } from '../types';
import { GenericParser } from './generic';

export const FoxParser: SourceParser = {
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

        if (!fullUrl.hostname.includes('foxnews.com')) return;

        const path = fullUrl.pathname;

        // Reject videos (/v/), shows, live-news, games
        if (
          /\/v\//i.test(path) ||
          /\/shows\//i.test(path) ||
          /\/live-news\//i.test(path) ||
          /\/person\//i.test(path) ||
          /\/category\//i.test(path)
        ) {
          return;
        }

        // Fox news articles usually have path like /world/... or /politics/... or /us/... with long slug
        const segments = path.split('/').filter(Boolean);
        const isFoxArticle =
          segments.length >= 2 &&
          (segments[0] === 'us' ||
            segments[0] === 'politics' ||
            segments[0] === 'world' ||
            segments[0] === 'opinion' ||
            segments[0] === 'media' ||
            segments[0] === 'lifestyle' ||
            segments[0] === 'tech') &&
          segments[1].length > 15;

        if (isFoxArticle) {
          candidates.add(fullUrl.toString());
        }
      } catch {
        // ignore
      }
    });

    if (candidates.size < 3) {
      const genericCandidates = GenericParser.extractCandidateLinks(html, listingUrl);
      genericCandidates.forEach(url => {
        if (!url.includes('/v/') && !url.includes('/shows/')) {
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
