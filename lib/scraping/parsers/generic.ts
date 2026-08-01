import * as cheerio from 'cheerio';
import type { ParsedArticleDetail, SourceParser } from '../types';

/**
 * Non-article reject patterns based on AGENTS.md Section 9:
 * Rejects category/section, show, podcast, topic, author, search, corporate, live, game, product/shopping, etc.
 */
const NON_ARTICLE_PATTERNS = [
  /\/category\//i,
  /\/sections?\//i,
  /\/shows?\//i,
  /\/programs?\//i,
  /\/podcasts?\//i,
  /\/topics?\//i,
  /\/tags?\//i,
  /\/authors?\//i,
  /\/search\//i,
  /\/live\//i,
  /\/liveblog\//i,
  /\/games?\//i,
  /\/shopping\//i,
  /\/reviews?\//i,
  /\/products?\//i,
  /\/newsletters?\//i,
  /\/subscribe/i,
  /\/subscriptions/i,
  /\/terms/i,
  /\/privacy/i,
  /\/contact/i,
  /\/about/i,
  /\/help/i,
  /\/support/i,
  /\/video\//i,
  /\/v\//i,
  /\/audio\//i,
  /\/gallery\//i,
  /\/pictures\//i,
  /\/photos\//i,
  /\/weather\//i,
  /\/sports?\//i,
];

export function isNonArticleUrl(urlStr: string): boolean {
  try {
    const url = new URL(urlStr);
    const path = url.pathname.toLowerCase();

    // Homepage or root paths
    if (path === '/' || path === '' || path === '/index.html') {
      return true;
    }

    // Check pattern list
    for (const pattern of NON_ARTICLE_PATTERNS) {
      if (pattern.test(path)) {
        return true;
      }
    }

    return false;
  } catch {
    return true;
  }
}

export function isCandidateArticleUrl(urlStr: string): boolean {
  if (isNonArticleUrl(urlStr)) {
    return false;
  }

  try {
    const url = new URL(urlStr);
    const path = url.pathname;

    // Split path into segments ignoring empty strings
    const segments = path.split('/').filter(Boolean);

    // Single short segment like /world or /politics is usually a category/section page
    if (segments.length === 1 && segments[0].length < 25 && !/\d/.test(segments[0])) {
      return false; // Rejected category page
    }


    // Articles typically have longer paths, dates, or IDs
    // Date pattern (e.g. /2026/08/01/ or /2026-08-01/)
    const hasDatePattern = /\/\d{4}\/\d{1,2}\/\d{1,2}\//.test(path) || /\/\d{4}-\d{2}-\d{2}/.test(path);
    const hasArticleId = /-[a-z0-9]{8,}$/i.test(path) || /\/articles\//i.test(path) || /-[0-9]{5,}/.test(path);
    const isLongSlug = segments.some(s => s.length > 20 || s.split('-').length >= 3);

    return hasDatePattern || hasArticleId || isLongSlug;
  } catch {
    return false;
  }
}

export const GenericParser: SourceParser = {
  extractCandidateLinks(html: string, listingUrl: string): string[] {
    const $ = cheerio.load(html);
    const candidates = new Set<string>();
    const baseUrl = new URL(listingUrl);

    $('a[href]').each((_, el) => {
      const href = $(el).attr('href');
      if (!href) return;

      try {
        const fullUrl = new URL(href, baseUrl.origin).toString();

        // Must belong to the same host domain (or subdomain)
        const targetUrl = new URL(fullUrl);
        if (!targetUrl.hostname.includes(baseUrl.hostname.replace('www.', ''))) {
          return;
        }

        // Clean query/hash
        targetUrl.hash = '';
        const cleanUrl = targetUrl.toString();

        if (isCandidateArticleUrl(cleanUrl)) {
          candidates.add(cleanUrl);
        }
      } catch {
        // Invalid URL ignore
      }
    });

    return Array.from(candidates);
  },

  parseArticleDetail(html: string, url: string): ParsedArticleDetail | null {
    const $ = cheerio.load(html);

    // 1. Title Extraction
    let title =
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('h1').first().text() ||
      $('title').text();

    title = title ? title.trim() : '';

    if (!title || title.length < 5) {
      return null;
    }

    // Clean title suffix if any (e.g., " | BBC News")
    title = title.split(' - ')[0].split(' | ')[0].trim();

    // 2. Image URL Extraction (Required per Section 13)
    const imageUrl =
      $('meta[property="og:image"]').attr('content') ||
      $('meta[property="og:image:secure_url"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      $('article img').first().attr('src') ||
      $('main img').first().attr('src');

    if (!imageUrl || !imageUrl.startsWith('http')) {
      return null;
    }

    // 3. Published Date Extraction (Required per Section 13)
    let rawDate =
      $('meta[property="article:published_time"]').attr('content') ||
      $('meta[name="parsely-pub-date"]').attr('content') ||
      $('meta[name="publish-date"]').attr('content') ||
      $('time[datetime]').attr('datetime') ||
      $('time').first().text();

    // Try schema.org JSON-LD datePublished fallback
    if (!rawDate) {
      $('script[type="application/ld+json"]').each((_, el) => {
        try {
          const json = JSON.parse($(el).html() || '{}');
          const date = json.datePublished || json.dateCreated || (Array.isArray(json) && json[0]?.datePublished);
          if (date) rawDate = String(date);
        } catch {
          // ignore JSON parse error
        }
      });
    }

    if (!rawDate) {
      return null;
    }

    let publishedAt: string;
    try {
      const parsedDate = new Date(rawDate);
      if (isNaN(parsedDate.getTime())) {
        return null;
      }
      publishedAt = parsedDate.toISOString();
    } catch {
      return null;
    }

    // 4. Canonical URL
    const canonicalUrl = $('link[rel="canonical"]').attr('href') || url;

    // 5. Clean Article Body Text
    // Remove unwanted non-article elements
    $(
      'script, style, nav, footer, header, form, iframe, noscript, svg, ' +
        '.ad, .ad-placeholder, .advertisement, .newsletter-box, .newsletter-signup, ' +
        '.related-articles, .related-content, .most-viewed, .social-share, .share-buttons, ' +
        '[role="navigation"], [role="banner"], [role="contentinfo"]'
    ).remove();

    // Collect article text paragraphs
    const paragraphs: string[] = [];
    const articleContainer = $('article, main, [role="main"], .article-body, .story-body').first();
    const scope = articleContainer.length ? articleContainer : $('body');

    scope.find('p').each((_, el) => {
      const text = $(el).text().trim();
      // Skip empty or short boilerplate paragraphs
      if (text.length > 20 && !/subscribe|sign up|copyright|follow us/i.test(text)) {
        paragraphs.push(text);
      }
    });

    const rawText = paragraphs.join('\n\n').trim();

    // Body Quality check (Section 13):
    // Body quality can pass by either: 3 or more meaningful paragraphs, OR 900 or more meaningful characters
    const passParagraphs = paragraphs.length >= 3;
    const passCharLength = rawText.length >= 900;

    if (!passParagraphs && !passCharLength) {
      return null;
    }

    return {
      title,
      imageUrl,
      publishedAt,
      rawText,
      canonicalUrl,
    };
  },
};
