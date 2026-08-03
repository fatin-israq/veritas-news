export interface OxylabsQueryResponse {
  results: Array<{
    content: string;
    status_code: number;
    url: string;
    [key: string]: unknown;
  }>;
}

export interface ScrapingOptions {
  sourceIds?: string[];
  limitPerSource?: number;
}

export interface ParsedArticleDetail {
  title: string;
  imageUrl: string;
  publishedAt: string; // ISO string
  rawText: string;
  canonicalUrl: string;
}

export interface ArticleRejection {
  url: string;
  reason: string;
}

export interface ScrapeRunSummary {
  status: 'completed' | 'failed' | 'partial';
  sourcesChecked: number;
  candidatesFound: number;
  candidatesRejected: number;
  duplicatesSkipped: number;
  detailPagesScraped: number;
  articlesInserted: number;
  articlesRejected: number;
  articlesFailed: number;
  totalDurationMs: number;
  rejectionReasons: Record<string, number>;
  sourceSummaries: Record<
    string,
    {
      sourceName: string;
      candidatesFound: number;
      duplicatesSkipped: number;
      detailScraped: number;
      inserted: number;
      rejected: number;
      failed: number;
      error?: string;
    }
  >;
}

export interface SourceParser {
  extractCandidateLinks(html: string, listingUrl: string): string[];
  parseArticleDetail(html: string, url: string): ParsedArticleDetail | null;
}
