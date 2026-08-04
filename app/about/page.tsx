import React from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ShieldCheck, Cpu, Eye, Scale, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
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
            About Veritas News
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#0D0D0F] dark:text-[#F4F4F5] tracking-tight mt-4 mb-4 leading-tight">
            Balanced news coverage, analyzed with transparent AI.
          </h1>
          <p className="text-base md:text-lg text-[#6E7280] dark:text-[#A1A1AA] leading-relaxed">
            Veritas News automatically scrapes real-time news articles across major global publishers, evaluates political framing and sentiment using Google Gemini models, and highlights coverage blindspots to help readers see every perspective.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white dark:bg-[#18181B] p-6 rounded-2xl border border-[#E5E7EB] dark:border-[#27272A] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#0D0D0F] dark:text-[#F4F4F5]">Multi-Perspective Analysis</h3>
            <p className="text-xs text-[#6E7280] dark:text-[#A1A1AA] leading-relaxed">
              We break down articles by political spectrum weight (Left, Center, Right) to expose framing rather than dictating opinions.
            </p>
          </div>

          <div className="bg-white dark:bg-[#18181B] p-6 rounded-2xl border border-[#E5E7EB] dark:border-[#27272A] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#0D0D0F] dark:text-[#F4F4F5]">AI SDK & Gemini Engine</h3>
            <p className="text-xs text-[#6E7280] dark:text-[#A1A1AA] leading-relaxed">
              Powered by Vercel AI SDK and Google Gemini models, delivering structured framing summaries, loaded term analysis, and confidence scores.
            </p>
          </div>

          <div className="bg-white dark:bg-[#18181B] p-6 rounded-2xl border border-[#E5E7EB] dark:border-[#27272A] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#0D0D0F] dark:text-[#F4F4F5]">Blindspot Detection</h3>
            <p className="text-xs text-[#6E7280] dark:text-[#A1A1AA] leading-relaxed">
              Discover stories heavily covered by one side of the political spectrum but under-reported by others.
            </p>
          </div>

          <div className="bg-white dark:bg-[#18181B] p-6 rounded-2xl border border-[#E5E7EB] dark:border-[#27272A] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#0D0D0F] dark:text-[#F4F4F5]">Source Integrity</h3>
            <p className="text-xs text-[#6E7280] dark:text-[#A1A1AA] leading-relaxed">
              Automated high-scale ingestion via Oxylabs Web Scraper API guarantees original canonical source citations.
            </p>
          </div>
        </div>

        {/* Mission Statement Callout */}
        <div className="bg-gradient-to-br from-[#0D0D0F] to-[#1A1A1E] dark:from-[#18181B] dark:to-[#0D0D0F] text-white p-8 md:p-12 rounded-3xl shadow-md border border-[#27272A] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <h2 className="text-2xl font-bold">Our Commitment to Readers</h2>
            <p className="text-sm text-neutral-300 leading-relaxed">
              Veritas News is an open, transparent news intelligence application designed to combat echo chambers and media polarization.
            </p>
          </div>
          <Link
            href="/"
            className="px-6 py-3 bg-white text-[#0D0D0F] rounded-xl font-bold text-xs hover:bg-neutral-100 transition-colors whitespace-nowrap"
          >
            Explore News Feed
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

