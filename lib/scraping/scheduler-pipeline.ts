import { getStoredSchedules, recordScheduleRun } from '../supabase/queries/schedules';
import { checkUrlsExist, insertArticle } from '../supabase/queries/articles';
import { createLog } from '../supabase/queries/logs';
import { fetchPageWithOxylabs } from './oxylabs';
import {
  getOxylabsScheduleRuns,
  fetchOxylabsJobContent,
} from './oxylabs-scheduler';
import { getParserForSource } from './parsers';

export interface ScheduledProcessSummary {
  status: 'completed' | 'failed';
  schedulesProcessed: number;
  runsProcessed: number;
  candidatesFound: number;
  duplicatesSkipped: number;
  detailPagesScraped: number;
  articlesInserted: number;
  articlesRejected: number;
  articlesFailed: number;
  totalDurationMs: number;
  scheduleSummaries: Record<string, unknown>;
}

export async function processScheduledResultsPipeline(
  options: { limitPerSource?: number } = {}
): Promise<ScheduledProcessSummary> {
  const startTime = Date.now();
  const limitPerSource = options.limitPerSource ?? 5;

  console.log('🚀 [Scheduled Results Pipeline] Processing scheduled Oxylabs runs...');
  await createLog({
    level: 'info',
    message: 'Scheduled results processing initiated',
    metadata: { options },
  });

  const summary: ScheduledProcessSummary = {
    status: 'completed',
    schedulesProcessed: 0,
    runsProcessed: 0,
    candidatesFound: 0,
    duplicatesSkipped: 0,
    detailPagesScraped: 0,
    articlesInserted: 0,
    articlesRejected: 0,
    articlesFailed: 0,
    totalDurationMs: 0,
    scheduleSummaries: {},
  };

  try {
    const storedSchedules = await getStoredSchedules();
    const activeSchedules = storedSchedules.filter(s => s.status === 'active' && s.source && s.source.active);

    if (activeSchedules.length === 0) {
      console.log('ℹ️ [Scheduled Results Pipeline] No active schedules found in database.');
      summary.totalDurationMs = Date.now() - startTime;
      return summary;
    }

    console.log(`📌 [Scheduled Results Pipeline] Loaded ${activeSchedules.length} active schedule(s).`);

    for (const schedule of activeSchedules) {
      summary.schedulesProcessed++;
      const source = schedule.source;

      const scheduleSummary = {
        sourceName: source.name,
        oxylabsScheduleId: schedule.oxylabs_schedule_id,
        runsProcessed: 0,
        candidatesFound: 0,
        duplicatesSkipped: 0,
        articlesInserted: 0,
        articlesRejected: 0,
        error: undefined as string | undefined,
      };

      console.log(`\n🔍 Checking runs for schedule ${schedule.oxylabs_schedule_id} (${source.name})...`);

      try {
        // Fetch completed runs (result_status === 'done')
        const runs = await getOxylabsScheduleRuns(schedule.oxylabs_schedule_id);

        if (runs.length === 0) {
          console.log(`  ℹ️ No completed 'done' runs found for ${source.name}.`);
          summary.scheduleSummaries[schedule.id] = scheduleSummary;
          continue;
        }

        console.log(`  ✓ Found ${runs.length} completed 'done' run(s) for ${source.name}.`);

        for (const run of runs) {
          const jobId = run.job_id || run.id;
          summary.runsProcessed++;
          scheduleSummary.runsProcessed++;

          console.log(`  -> Processing Oxylabs job result: ${jobId}`);

          try {
            // 1. Fetch homepage HTML from completed scheduled job
            const homepageHtml = await fetchOxylabsJobContent(jobId);
            console.log(`     ✓ Fetched homepage HTML from job ${jobId}`);

            // 2. Extract candidate links with parser strategy
            const parser = getParserForSource(source.parser_strategy);
            const candidateUrls = parser.extractCandidateLinks(homepageHtml, source.listing_url);

            scheduleSummary.candidatesFound += candidateUrls.length;
            summary.candidatesFound += candidateUrls.length;
            console.log(`     ✓ Extracted ${candidateUrls.length} candidate URLs`);

            if (candidateUrls.length === 0) {
              await recordScheduleRun(schedule.id, jobId, 'completed', 0);
              continue;
            }

            // 3. Deduplicate candidate URLs in max 15 URL chunks (Section 9)
            const existingUrls = await checkUrlsExist(candidateUrls);
            const newCandidateUrls = candidateUrls.filter(url => !existingUrls.has(url));

            const dupes = candidateUrls.length - newCandidateUrls.length;
            scheduleSummary.duplicatesSkipped += dupes;
            summary.duplicatesSkipped += dupes;
            console.log(`     ✓ Skipped ${dupes} existing URLs (${newCandidateUrls.length} new candidates remaining)`);

            // Limit new candidates per source run
            const urlsToScrape = newCandidateUrls.slice(0, limitPerSource * 2);
            let insertedForThisRun = 0;

            for (const detailUrl of urlsToScrape) {
              if (insertedForThisRun >= limitPerSource) {
                break;
              }

              try {
                console.log(`     -> Detail scraping candidate: ${detailUrl}`);
                summary.detailPagesScraped++;

                const detailHtml = await fetchPageWithOxylabs(detailUrl);
                const parsed = parser.parseArticleDetail(detailHtml, detailUrl);

                if (!parsed) {
                  summary.articlesRejected++;
                  scheduleSummary.articlesRejected++;
                  console.log(`        ❌ Rejected candidate validation`);
                  continue;
                }

                // Insert valid article append-only
                const inserted = await insertArticle({
                  source_id: source.id,
                  url: detailUrl,
                  canonical_url: parsed.canonicalUrl,
                  title: parsed.title,
                  image_url: parsed.imageUrl,
                  published_at: parsed.publishedAt,
                  raw_text: parsed.rawText,
                });

                if (inserted) {
                  insertedForThisRun++;
                  scheduleSummary.articlesInserted++;
                  summary.articlesInserted++;
                  console.log(`        ✅ Inserted article: "${parsed.title.slice(0, 60)}..."`);
                }
              } catch (detailErr: unknown) {
                summary.articlesFailed++;
                const errMsg = detailErr instanceof Error ? detailErr.message : String(detailErr);
                console.error(`        ⚠️ Error scraping detail ${detailUrl}: ${errMsg}`);
              }
            }

            // Record schedule run status in database
            await recordScheduleRun(schedule.id, jobId, 'completed', insertedForThisRun);
          } catch (jobErr: unknown) {
            const errMsg = jobErr instanceof Error ? jobErr.message : String(jobErr);
            console.error(`     ❌ Error processing job ${jobId}: ${errMsg}`);
            await recordScheduleRun(schedule.id, jobId, 'failed', 0, errMsg);
          }
        }
      } catch (scheduleErr: unknown) {
        const errMsg = scheduleErr instanceof Error ? scheduleErr.message : String(scheduleErr);
        scheduleSummary.error = errMsg;
        console.error(`❌ Error processing schedule for source ${source.name}: ${errMsg}`);
      }

      summary.scheduleSummaries[schedule.id] = scheduleSummary;
    }
  } catch (fatalErr: unknown) {
    summary.status = 'failed';
    const errMsg = fatalErr instanceof Error ? fatalErr.message : String(fatalErr);
    console.error(`💥 [Scheduled Results Pipeline] Fatal pipeline error: ${errMsg}`);
  }

  summary.totalDurationMs = Date.now() - startTime;

  console.log('\n📊 [Scheduled Results Pipeline] Finished summary:');
  console.log(JSON.stringify(summary, null, 2));

  await createLog({
    level: summary.status === 'completed' ? 'info' : 'error',
    message: `Scheduled results pipeline finished. Inserted ${summary.articlesInserted} articles from ${summary.runsProcessed} runs.`,
    metadata: { summary },
  });

  return summary;
}
