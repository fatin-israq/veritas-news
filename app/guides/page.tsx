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
    <div className="min-h-screen bg-[#F8F8F6] text-[#0D0D0F] font-sans antialiased flex flex-col justify-between">
      <Header />

      <main className="max-w-[1280px] mx-auto px-4 md:px-8 py-10 md:py-16 w-full flex-1">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6E7280] hover:text-[#0D0D0F] transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Top News
        </Link>

        {/* Hero Section */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#B42318] bg-[#FEF3F2] px-3 py-1 rounded-full border border-[#FECDCA]">
            Veritas Reader Guides
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#0D0D0F] tracking-tight mt-4 mb-4 leading-tight">
            Educational guides to media analysis and news literacy.
          </h1>
          <p className="text-base md:text-lg text-[#6E7280] leading-relaxed">
            Explore our curated guides on interpreting political spectrum ratings, AI content insights, and bias detection methodologies.
          </p>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {guides.map((guide) => (
            <div key={guide.title} className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#B42318] bg-[#FEF3F2] px-2 py-0.5 rounded-md">
                  {guide.tag}
                </span>
                <h3 className="text-base font-bold text-[#0D0D0F]">{guide.title}</h3>
                <p className="text-xs text-[#6E7280] leading-relaxed">{guide.summary}</p>
              </div>
              <div className="text-[11px] font-semibold text-[#6E7280] pt-2 border-t border-[#F4F4F6]">
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
