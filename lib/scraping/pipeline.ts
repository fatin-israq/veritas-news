import { getActiveSources } from '../supabase/queries/sources';
import { checkUrlsExist, insertArticle } from '../supabase/queries/articles';
import { createLog } from '../supabase/queries/logs';
import { fetchPageWithOxylabs } from './oxylabs';
import { getParserForSource } from './parsers';
import type { ScrapingOptions, ScrapeRunSummary } from './types';

export async function runScrapingPipeline(
  options: ScrapingOptions = {}
): Promise<ScrapeRunSummary> {
  const startTime = Date.now();
  const limitPerSource = options.limitPerSource ?? 5;

  console.log('🚀 [Scrape Pipeline] Starting manual Oxylabs scraping pipeline...');
  await createLog({
    level: 'info',
    message: 'Manual scraping pipeline initiated',
    metadata: { options },
  });

  const summary: ScrapeRunSummary = {
    status: 'completed',
    sourcesChecked: 0,
    candidatesFound: 0,
    candidatesRejected: 0,
    duplicatesSkipped: 0,
    detailPagesScraped: 0,
    articlesInserted: 0,
    articlesRejected: 0,
    articlesFailed: 0,
    totalDurationMs: 0,
    rejectionReasons: {},
    sourceSummaries: {},
  };

  try {
    let sources = await getActiveSources();

    if (options.sourceIds && options.sourceIds.length > 0) {
      sources = sources.filter(s => options.sourceIds!.includes(s.id));
    }

    if (sources.length === 0) {
      console.warn('⚠️ [Scrape Pipeline] No active sources found to scrape.');
      summary.totalDurationMs = Date.now() - startTime;
      return summary;
    }

    console.log(
      `📌 [Scrape Pipeline] Selected ${sources.length} active sources: ${sources.map(s => s.name).join(', ')}`
    );

    for (const source of sources) {
      summary.sourcesChecked++;
      const sourceSummary: {
        sourceName: string;
        candidatesFound: number;
        duplicatesSkipped: number;
        detailScraped: number;
        inserted: number;
        rejected: number;
        failed: number;
        error?: string;
      } = {
        sourceName: source.name,
        candidatesFound: 0,
        duplicatesSkipped: 0,
        detailScraped: 0,
        inserted: 0,
        rejected: 0,
        failed: 0,
      };


      console.log(`\n🔍 [Scrape Pipeline] Processing source: ${source.name} (${source.listing_url})`);

      try {
        // 1. Fetch homepage HTML live via Oxylabs
        const homepageHtml = await fetchPageWithOxylabs(source.listing_url);
        console.log(`  ✓ Homepage HTML fetched for ${source.name}`);

        // 2. Extract candidate links with parser strategy
        const parser = getParserForSource(source.parser_strategy);
        const candidateUrls = parser.extractCandidateLinks(homepageHtml, source.listing_url);

        sourceSummary.candidatesFound = candidateUrls.length;
        summary.candidatesFound += candidateUrls.length;
        console.log(`  ✓ Extracted ${candidateUrls.length} candidate URLs`);

        if (candidateUrls.length === 0) {
          summary.sourceSummaries[source.id] = sourceSummary;
          continue;
        }

        // 3. Deduplicate URLs against Supabase in max 15 URL chunks (Section 9)
        const existingUrls = await checkUrlsExist(candidateUrls);
        const newCandidateUrls = candidateUrls.filter(url => !existingUrls.has(url));

        const dupesCount = candidateUrls.length - newCandidateUrls.length;
        sourceSummary.duplicatesSkipped = dupesCount;
        summary.duplicatesSkipped += dupesCount;
        console.log(`  ✓ Skipped ${dupesCount} existing URLs (${newCandidateUrls.length} new candidates remaining)`);

        // Limit new candidates to attempt per source
        const urlsToScrape = newCandidateUrls.slice(0, limitPerSource * 2);

        let insertedForThisSource = 0;

        for (const detailUrl of urlsToScrape) {
          if (insertedForThisSource >= limitPerSource) {
            break;
          }

          try {
            console.log(`  -> Detail scraping candidate: ${detailUrl}`);
            summary.detailPagesScraped++;
            sourceSummary.detailScraped++;

            const detailHtml = await fetchPageWithOxylabs(detailUrl);
            const parsed = parser.parseArticleDetail(detailHtml, detailUrl);

            if (!parsed) {
              summary.articlesRejected++;
              sourceSummary.rejected++;
              const reason = 'Validation failed (missing image, published date, or insufficient content quality)';
              summary.rejectionReasons[reason] = (summary.rejectionReasons[reason] || 0) + 1;
              console.log(`     ❌ Rejected: ${reason}`);
              continue;
            }

            // Insert valid article into Supabase append-only
            const insertedArticle = await insertArticle({
              source_id: source.id,
              url: detailUrl,
              canonical_url: parsed.canonicalUrl,
              title: parsed.title,
              image_url: parsed.imageUrl,
              published_at: parsed.publishedAt,
              raw_text: parsed.rawText,
            });

            if (insertedArticle) {
              insertedForThisSource++;
              sourceSummary.inserted++;
              summary.articlesInserted++;
              console.log(`     ✅ Inserted: "${parsed.title.slice(0, 60)}..."`);
            }
          } catch (err: unknown) {
            summary.articlesFailed++;
            sourceSummary.failed++;
            const errMsg = err instanceof Error ? err.message : String(err);
            console.error(`     ⚠️ Error scraping candidate detail ${detailUrl}: ${errMsg}`);
          }
        }
      } catch (sourceErr: unknown) {
        const errMsg = sourceErr instanceof Error ? sourceErr.message : String(sourceErr);
        sourceSummary.error = errMsg;
        console.error(`❌ [Scrape Pipeline] Error processing source ${source.name}: ${errMsg}`);
      }

      summary.sourceSummaries[source.id] = sourceSummary;
    }
  } catch (err: unknown) {
    summary.status = 'failed';
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error(`💥 [Scrape Pipeline] Fatal pipeline error: ${errMsg}`);
  }

  summary.totalDurationMs = Date.now() - startTime;

  console.log('\n📊 [Scrape Pipeline] Pipeline execution finished summary:');
  console.log(JSON.stringify(summary, null, 2));

  await createLog({
    level: summary.status === 'completed' ? 'info' : 'error',
    message: `Scrape pipeline completed with status '${summary.status}'. Inserted ${summary.articlesInserted} articles.`,
    metadata: { summary },
  });

  return summary;
}
