import React from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function HelpPage() {
  const faqs = [
    {
      q: "How does Veritas News measure political framing?",
      a: "Our AI pipeline utilizes Google Gemini models via Vercel AI SDK to analyze article body text. It evaluates tone, source citations, emphasis, and loaded terms to estimate Left, Center, and Right percentage breakdowns.",
    },
    {
      q: "Where does the news data come from?",
      a: "News articles are scraped directly from active, verified source homepages (such as Reuters, BBC, NPR, Fox News, Guardian) using Oxylabs Web Scraper API.",
    },
    {
      q: "What does the Bias Score mean?",
      a: "The derived bias score ranges from -1.0 (strongly Left) to +1.0 (strongly Right), computed as (Right% - Left%) / 100. A score near 0 indicates balanced or centered framing.",
    },
    {
      q: "Is news analysis objective truth?",
      a: "No, framing indicators are explicitly AI-estimated summaries to assist reader awareness and perspective comparison. Original canonical articles are always linked.",
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
            Help Center
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#0D0D0F] tracking-tight mt-4 mb-4 leading-tight">
            How can we help you today?
          </h1>
          <p className="text-base md:text-lg text-[#6E7280] leading-relaxed">
            Find answers to common questions about Veritas News features, scraping pipelines, AI sentiment analysis, and bias scores.
          </p>
        </div>

        {/* FAQs Accordion/Grid */}
        <div className="space-y-6 mb-16 max-w-4xl">
          <h2 className="text-xl font-extrabold text-[#0D0D0F]">Frequently Asked Questions</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-2">
                <h3 className="text-sm font-bold text-[#0D0D0F]">{item.q}</h3>
                <p className="text-xs text-[#6E7280] leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
