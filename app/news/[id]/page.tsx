import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import {
  Bookmark,
  Share2,
  ExternalLink,
  Info,
  Sparkles,
  AlertCircle,
  Tag,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { getArticleById, getRelatedArticles } from "@/lib/supabase/queries/articles";
import { BiasMeter } from "@/components/ui/bias-meter";
import { BiasMethodology } from "@/components/ui/bias-methodology";
import type { ArticleWithAnalysis } from "@/lib/supabase/types";

export const revalidate = 60;

type Props = {
  params: Promise<{ id: string }>;
};

// Static fallback articles for demo IDs ("1" through "6")
const fallbackArticlesMap: Record<string, {
  title: string;
  category: string;
  location: string;
  byline: string;
  date: string;
  readTime: string;
  imageUrl: string;
  caption: string;
  leftPercentage: number;
  centerPercentage: number;
  rightPercentage: number;
  biasLabel: string;
  summary: string[];
  body: string[];
}> = {
  "1": {
    title: "Trump Sends Iran Revised Peace Proposal With Tougher Terms: Report",
    category: "Politics",
    location: "United States",
    byline: "David Morgan",
    date: "May 31, 2026",
    readTime: "12 min read",
    imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=1200&auto=format&fit=crop",
    caption: "President Donald Trump in the Cabinet Room at the White House, Washington, D.C., May 30, 2026. Photo: Andrew Harnik/Getty Images",
    leftPercentage: 20,
    centerPercentage: 31,
    rightPercentage: 49,
    biasLabel: "Right 49%",
    summary: [
      "The Trump administration has sent Iran a revised nuclear deal proposal with tougher terms, including a complete halt to uranium enrichment.",
      "The proposal demands unrestricted inspector access to all nuclear sites, including military facilities.",
      "Iran has not responded officially but says any deal must respect its right to peaceful nuclear energy.",
      "The U.S. warns it is prepared to take other action if diplomacy fails, while European allies urge continued negotiations.",
      "Israel supports the tougher stance, praising the administration's determination."
    ],
    body: [
      "The Trump administration has sent Iran a revised nuclear deal proposal that includes tougher terms on uranium enrichment and stronger verification measures, according to a report published Saturday.",
      "The new proposal, delivered through intermediaries in Oman, requires Iran to halt all uranium enrichment on its soil and ship its stockpile of enriched uranium out of the country. It also demands unrestricted access for international inspectors to all Iranian nuclear facilities, including military sites.",
      "\"This is a take-it-or-leave-it proposal,\" a senior administration official told reporters. \"The President wants a deal, but he will not accept a weak agreement that puts America or our allies at risk.\"",
      "Iran has not yet officially responded to the proposal. However, Iranian Foreign Minister Hossein Amir-Abdollahian said last week that any deal must respect Iran's right to peaceful nuclear energy and include the lifting of all U.S. sanctions.",
      "The revised proposal comes after several rounds of indirect talks between U.S. and Iranian officials failed to produce a breakthrough. The Trump administration has warned that if diplomacy fails, it is prepared to take other action to prevent Iran from obtaining a nuclear weapon."
    ]
  }
};

export default async function NewsDetailsPage({ params }: Props) {
  await auth.protect();
  const { id } = await params;

  let liveArticle: ArticleWithAnalysis | null = null;
  let dbError: string | null = null;

  try {
    liveArticle = await getArticleById(id);
  } catch (err) {
    console.error(`Error fetching article detail for ID ${id}:`, err);
    dbError = err instanceof Error ? err.message : "Failed to load article from database";
  }

  // Fetch vector-similar related articles using pgvector cosine similarity
  let relatedArticles: ArticleWithAnalysis[] = [];
  const articleEmbedding = liveArticle?.analysis?.embedding;

  if (liveArticle && articleEmbedding) {
    try {
      relatedArticles = await getRelatedArticles(liveArticle.id, articleEmbedding, 5);
    } catch (err) {
      console.error(`Error fetching vector related articles for ${id}:`, err);
    }
  }

  // Handle fallback demo items if ID is static or article not found in DB
  const fallback = fallbackArticlesMap[id];

  if (!liveArticle && !fallback && !dbError) {
    notFound();
  }

  // Determine display values from live database record or fallback
  const title = liveArticle?.title || fallback?.title || "Article Details";
  const imageUrl = liveArticle?.image_url || fallback?.imageUrl || "https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=1200&auto=format&fit=crop";
  const sourceName = liveArticle?.source?.name || fallback?.category || "News";
  const publishedDate = liveArticle?.published_at
    ? new Date(liveArticle.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : fallback?.date || "Recently published";

  const originalUrl = liveArticle?.url;

  // Analysis Data
  const analysis = liveArticle?.analysis;
  const leftPct = analysis?.left_percentage ?? fallback?.leftPercentage ?? 33;
  const centerPct = analysis?.center_percentage ?? fallback?.centerPercentage ?? 34;
  const rightPct = analysis?.right_percentage ?? fallback?.rightPercentage ?? 33;
  const biasLabel = analysis?.bias_label
    ? analysis.bias_label.toUpperCase()
    : fallback?.biasLabel || "BALANCED";
  const sentimentLabel = analysis?.sentiment_label || "neutral";
  const sentimentScore = analysis?.sentiment_score ?? 0;
  const confidencePct = analysis?.confidence ? Math.round(analysis.confidence * 100) : 85;
  const framingNotes = analysis?.framing_notes;
  const summaryText = analysis?.summary;
  const disclaimer = analysis?.disclaimer || "AI-estimated analysis. Framing and sentiment are generated by AI models and do not represent absolute factual truth.";
  const modelName = analysis?.model || "gemini-3.5-flash";

  // Parse raw text into readable paragraphs
  const rawTextParagraphs = liveArticle?.raw_text
    ? liveArticle.raw_text
        .split(/\n\n+|\r\n\r\n+/)
        .map((p) => p.trim())
        .filter((p) => p.length > 30)
    : fallback?.body || ["No body text available for this article."];

  // Parse loaded terms if available
  let loadedTermsList: Array<{ term: string; context?: string }> = [];
  if (analysis?.loaded_terms && Array.isArray(analysis.loaded_terms)) {
    loadedTermsList = analysis.loaded_terms as unknown as Array<{ term: string; context?: string }>;
  }

  return (
    <div className="min-h-screen bg-[#F8F8F6] dark:bg-[#09090B] text-[#0D0D0F] dark:text-[#F4F4F5] font-sans antialiased flex flex-col justify-between transition-colors duration-200">
      {/* Header Navigation */}
      <Header />

      {/* Main Content Layout Container */}
      <main className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 w-full flex-1">
        {dbError && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-700 dark:text-red-300">
            <strong>Database Notice:</strong> {dbError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* LEFT COLUMN: Article Content (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Meta Category & Source */}
            <div className="text-xs font-semibold text-[#6E7280] dark:text-[#A1A1AA] tracking-wide flex items-center gap-2">
              <span className="bg-[#0D0D0F] dark:bg-[#F4F4F5] text-white dark:text-[#0D0D0F] px-2 py-0.5 rounded text-[11px] font-bold">
                {sourceName}
              </span>
              <span className="text-[#9CA3AF] dark:text-zinc-600">·</span>
              <span>{publishedDate}</span>
            </div>

            {/* Main Article Headline */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#0D0D0F] dark:text-[#F4F4F5] tracking-tight leading-[1.2]">
              {title}
            </h1>

            {/* Author Byline & Actions Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E7EB] dark:border-[#27272A] pb-4 text-xs md:text-sm text-[#6E7280] dark:text-[#A1A1AA]">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-[#0D0D0F] dark:text-[#F4F4F5]">Source: {sourceName}</span>
                {originalUrl && (
                  <>
                    <span>|</span>
                    <a
                      href={originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-attr="original-source-link"
                      className="text-[#1D4ED8] dark:text-[#60A5FA] hover:underline flex items-center gap-1 font-medium"
                    >
                      Original Source <ExternalLink className="w-3 h-3" />
                    </a>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 text-[#0D0D0F] dark:text-[#F4F4F5] font-medium text-xs">
                <button data-attr="article-save" className="flex items-center gap-1 hover:text-[#1D4ED8] dark:hover:text-[#60A5FA] transition-colors cursor-pointer">
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
                <button data-attr="article-share" className="flex items-center gap-1 hover:text-[#1D4ED8] dark:hover:text-[#60A5FA] transition-colors cursor-pointer">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Hero Image Container */}
            <div className="space-y-2">
              <div className="w-full h-[280px] md:h-[420px] rounded-xl overflow-hidden bg-slate-100 dark:bg-zinc-800 relative border border-[#E5E7EB] dark:border-[#27272A]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Inline Bias Distribution Box */}
            <div className="bg-[#F4F4F6] dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-[#0D0D0F] dark:text-[#F4F4F5]">
                <div className="flex items-center gap-1.5">
                  <span>AI Bias Distribution & Framing</span>
                </div>
                <span className="text-[11px] text-[#6E7280] dark:text-[#A1A1AA] font-normal">
                  Confidence: {confidencePct}%
                </span>
              </div>

              {/* Bias Meter Visualizer */}
              <BiasMeter
                leftPercentage={leftPct}
                centerPercentage={centerPct}
                rightPercentage={rightPct}
                showScale={true}
              />

              <BiasMethodology
                articleId={id}
                sourceName={sourceName}
                biasLabel={biasLabel}
                confidencePercentage={confidencePct}
                modelName={modelName}
              />
            </div>

            {/* Article Text Content */}
            <article className="text-[15px] md:text-[16px] leading-[1.75] text-[#374151] dark:text-[#D4D4D8] space-y-5 pt-2">
              {rawTextParagraphs.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </article>

            {/* Related Stories Section */}
            {relatedArticles.length > 0 && (
              <div className="border-t border-[#E5E7EB] dark:border-[#27272A] pt-8 mt-10">
                <h2 className="text-xl font-bold text-[#0D0D0F] dark:text-[#F4F4F5] mb-6">
                  Related Live Stories
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {relatedArticles.map((story) => (
                    <Link
                      key={story.id}
                      href={`/news/${story.id}`}
                      data-attr="related-article-link"
                      className="bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] rounded-xl p-3 flex items-center gap-3 hover:shadow-sm transition-shadow cursor-pointer group"
                    >
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-100 dark:bg-zinc-800 flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={story.image_url}
                          alt={story.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="text-[11px] text-[#6E7280] dark:text-[#A1A1AA] font-medium">
                          <span>{story.source?.name || "News"}</span>
                        </div>
                        <h3 className="text-xs font-bold text-[#0D0D0F] dark:text-[#F4F4F5] leading-snug line-clamp-2 group-hover:text-[#1D4ED8] dark:group-hover:text-[#60A5FA] transition-colors">
                          {story.title}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: AI Analysis & Breakdown Sidebar (4 Cols) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* CARD 1: AI Framing & Bias Analysis */}
            <div className="bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] rounded-xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#F4F4F6] dark:border-[#27272A] pb-3">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#1D4ED8] dark:text-[#60A5FA]" />
                  <h3 className="text-sm font-bold text-[#0D0D0F] dark:text-[#F4F4F5]">AI Framing Analysis</h3>
                </div>
                <Info className="w-4 h-4 text-[#6E7280] dark:text-[#A1A1AA]" />
              </div>

              <div>
                <div className="text-xs font-medium text-[#6E7280] dark:text-[#A1A1AA]">AI-Estimated Framing Label</div>
                <div className="text-2xl font-black text-[#1D4ED8] dark:text-[#60A5FA] tracking-tight mt-0.5 uppercase">
                  {biasLabel}
                </div>
                <div className="text-xs text-[#6E7280] dark:text-[#A1A1AA] mt-0.5 flex items-center gap-2">
                  <span>Sentiment: <strong className="capitalize text-[#0D0D0F] dark:text-[#F4F4F5]">{sentimentLabel}</strong> ({sentimentScore})</span>
                </div>
              </div>

              {/* Progress Breakdown Bars */}
              <div className="space-y-2.5 pt-1">
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-[#0D0D0F] dark:text-[#F4F4F5]">Left Framing</span>
                    <span className="font-semibold text-[#B42318] dark:text-[#EF4444]">{leftPct}%</span>
                  </div>
                  <div className="w-full bg-[#F4F4F6] dark:bg-[#27272A] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#B42318] dark:bg-[#EF4444] h-full" style={{ width: `${leftPct}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-[#0D0D0F] dark:text-[#F4F4F5]">Center Framing</span>
                    <span className="font-semibold text-[#6E7280] dark:text-[#A1A1AA]">{centerPct}%</span>
                  </div>
                  <div className="w-full bg-[#F4F4F6] dark:bg-[#27272A] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#CBD5E1] dark:bg-zinc-600 h-full" style={{ width: `${centerPct}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-[#0D0D0F] dark:text-[#F4F4F5]">Right Framing</span>
                    <span className="font-semibold text-[#1D4ED8] dark:text-[#60A5FA]">{rightPct}%</span>
                  </div>
                  <div className="w-full bg-[#F4F4F6] dark:bg-[#27272A] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#1D4ED8] dark:bg-[#3B82F6] h-full" style={{ width: `${rightPct}%` }}></div>
                  </div>
                </div>
              </div>

              {framingNotes && (
                <div className="pt-2 border-t border-[#F4F4F6] dark:border-[#27272A]">
                  <div className="text-xs font-bold text-[#0D0D0F] dark:text-[#F4F4F5] mb-1">Framing Notes</div>
                  <p className="text-[12px] text-[#4B5563] dark:text-[#D4D4D8] leading-relaxed italic bg-slate-50 dark:bg-[#121215] p-2.5 rounded-lg border border-slate-100 dark:border-[#27272A]">
                    &quot;{framingNotes}&quot;
                  </p>
                </div>
              )}
            </div>

            {/* CARD 2: AI Summary */}
            <div className="bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] rounded-xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#F4F4F6] dark:border-[#27272A] pb-3">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-[#0D0D0F] dark:text-[#F4F4F5]">AI Neutral Summary</h3>
                </div>
                <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">{modelName}</span>
              </div>

              {summaryText ? (
                <div className="text-xs text-[#374151] dark:text-[#D4D4D8] leading-relaxed space-y-3">
                  <p className="whitespace-pre-line">{summaryText}</p>
                </div>
              ) : (
                <ul className="space-y-3 text-xs leading-relaxed text-[#374151] dark:text-[#D4D4D8] list-disc pl-4">
                  {fallback?.summary.map((pt, idx) => (
                    <li key={idx}>{pt}</li>
                  ))}
                </ul>
              )}

              <div className="text-[11px] text-[#9CA3AF] dark:text-zinc-500 pt-1 italic flex items-center gap-1">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                <span>{disclaimer}</span>
              </div>
            </div>

            {/* CARD 3: Loaded Terms & Language Analysis */}
            {loadedTermsList.length > 0 && (
              <div className="bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] rounded-xl p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-[#F4F4F6] dark:border-[#27272A] pb-2">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <h3 className="text-sm font-bold text-[#0D0D0F] dark:text-[#F4F4F5]">Loaded Vocabulary</h3>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  {loadedTermsList.map((item, idx) => (
                    <div key={idx} className="bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 rounded-lg p-2 text-xs">
                      <div className="font-bold text-amber-900 dark:text-amber-300">{item.term}</div>
                      {item.context && <div className="text-[11px] text-amber-800/90 dark:text-amber-400/90 mt-0.5">{item.context}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* BOTTOM NEWSLETTER SIGNUP BANNER */}
        <div className="bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] rounded-xl p-6 md:p-8 mt-12 mb-4 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xs">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-extrabold text-[#0D0D0F] dark:text-[#F4F4F5] tracking-tight">
              Stay Informed. Stay Balanced.
            </h3>
            <p className="text-xs md:text-sm text-[#6E7280] dark:text-[#A1A1AA]">
              Get the top stories and bias analysis delivered to your inbox.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto max-w-md">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 text-xs md:text-sm border border-[#E5E7EB] dark:border-[#27272A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D0D0F] dark:focus:ring-[#F4F4F5] flex-1 bg-white dark:bg-[#121215] text-[#0D0D0F] dark:text-[#F4F4F5]"
            />
            <Button
              variant="primary"
              data-attr="newsletter-subscribe"
              className="bg-[#0D0D0F] dark:bg-[#F4F4F5] text-white dark:text-[#0D0D0F] px-5 py-2 rounded-lg font-semibold text-xs md:text-sm hover:bg-black dark:hover:bg-white transition-colors whitespace-nowrap"
            >
              Subscribe
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

