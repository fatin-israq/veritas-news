import React from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
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
            Legal & Compliance
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#0D0D0F] tracking-tight mt-4 mb-4 leading-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-[#6E7280]">Last updated: June 1, 2026</p>
        </div>

        {/* Content Box */}
        <div className="bg-white p-8 md:p-10 rounded-2xl border border-[#E5E7EB] shadow-xs max-w-4xl space-y-6 text-xs text-[#0D0D0F] leading-relaxed mb-16">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#0D0D0F]">1. Acceptance of Terms</h2>
            <p className="text-[#6E7280]">
              By accessing Veritas News, you agree to these Terms of Service. If you do not agree to these terms, please refrain from using the platform.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#0D0D0F]">2. AI Disclaimer</h2>
            <p className="text-[#6E7280]">
              Political framing scores, sentiment labels, and neutral summaries are generated algorithmically by Google Gemini models via Vercel AI SDK. They are provided for informational and educational purposes only and should not be construed as definitive statements of editorial truth.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#0D0D0F]">3. Intellectual Property & Copyright</h2>
            <p className="text-[#6E7280]">
              Scraped news text and media remain the property of their respective publishers. Veritas News acts as an indexing and analytical service, providing direct links back to original canonical sources.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#0D0D0F]">4. Account Usage & Acceptable Conduct</h2>
            <p className="text-[#6E7280]">
              Users must not attempt to circumvent API administrative headers (`x_veritas_admin_secret`), disrupt scraping endpoints, or abuse automated system resources.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
