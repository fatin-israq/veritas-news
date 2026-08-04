import React from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-xs text-[#6E7280]">Last updated: June 1, 2026</p>
        </div>

        {/* Content Box */}
        <div className="bg-white p-8 md:p-10 rounded-2xl border border-[#E5E7EB] shadow-xs max-w-4xl space-y-6 text-xs text-[#0D0D0F] leading-relaxed mb-16">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#0D0D0F]">1. Information We Collect</h2>
            <p className="text-[#6E7280]">
              Veritas News collects authentication details via Clerk when users create an account or log in. We do not sell personal data or track browsing history outside of our platform.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#0D0D0F]">2. How We Use Data</h2>
            <p className="text-[#6E7280]">
              Account information is strictly used to customize news feed preferences, manage subscription status, and maintain secure session state with Supabase and Clerk.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#0D0D0F]">3. Scraped News Articles & Attribution</h2>
            <p className="text-[#6E7280]">
              All scraped news text is processed for AI sentiment and framing analysis. Original publisher URLs and source references are permanently retained to ensure proper attribution.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#0D0D0F]">4. Contact Privacy Team</h2>
            <p className="text-[#6E7280]">
              If you have questions regarding your data or wish to request data deletion, contact us at <a href="mailto:privacy@veritasnews.com" className="font-bold text-[#B42318] underline">privacy@veritasnews.com</a>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
