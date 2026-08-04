import React from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function GuidesPage() {
  const guides = [
    {
      title: "Understanding Political Framing Percentages",
      tag: "Media Literacy",
      summary: "Learn how Left, Center, and Right percentages are calculated from text phrasing, quoted sources, and emphasis.",
      readTime: "4 min read",
    },
    {
      title: "Spotting Media Blindspots",
      tag: "Analysis",
      summary: "A practical guide to identifying topics covered intensely by specific partisan outlets while omitted by others.",
      readTime: "6 min read",
    },
    {
      title: "Reading AI Sentiment vs. Political Bias",
      tag: "AI Insights",
      summary: "Distinguish between emotional tone (Positive / Neutral / Negative) and political perspective indicators.",
      readTime: "5 min read",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F8F6] dark:bg-[#09090B] text-[#0D0D0F] dark:text-[#F4F4F5] font-sans antialiased flex flex-col justify-between transition-colors duration-200">

      <Header />

      <main className="max-w-[1280px] mx-auto px-4 md:px-8 py-10 md:py-16 w-full flex-1">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6E7280] dark:text-[#A1A1AA] hover:text-[#0D0D0F] dark:hover:text-[#F4F4F5] transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Top News
        </Link>

        {/* Hero Section */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#B42318] dark:text-[#EF4444] bg-[#FEF3F2] dark:bg-red-950/40 px-3 py-1 rounded-full border border-[#FECDCA] dark:border-red-800">
            Veritas Reader Guides
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#0D0D0F] dark:text-[#F4F4F5] tracking-tight mt-4 mb-4 leading-tight">
            Educational guides to media analysis and news literacy.
          </h1>
          <p className="text-base md:text-lg text-[#6E7280] dark:text-[#A1A1AA] leading-relaxed">
            Explore our curated guides on interpreting political spectrum ratings, AI content insights, and bias detection methodologies.
          </p>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {guides.map((guide) => (
            <div key={guide.title} className="bg-white dark:bg-[#18181B] p-6 rounded-2xl border border-[#E5E7EB] dark:border-[#27272A] shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#B42318] dark:text-[#EF4444] bg-[#FEF3F2] dark:bg-red-950/40 px-2 py-0.5 rounded-md border border-[#FECDCA]/40 dark:border-red-800/40">
                  {guide.tag}
                </span>
                <h3 className="text-base font-bold text-[#0D0D0F] dark:text-[#F4F4F5]">{guide.title}</h3>
                <p className="text-xs text-[#6E7280] dark:text-[#A1A1AA] leading-relaxed">{guide.summary}</p>
              </div>
              <div className="text-[11px] font-semibold text-[#6E7280] dark:text-[#A1A1AA] pt-2 border-t border-[#F4F4F6] dark:border-[#27272A]">
                {guide.readTime}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

