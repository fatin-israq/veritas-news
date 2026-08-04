import React from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ArrowLeft, Download, Mail } from "lucide-react";
import Link from "next/link";

export default function PressPage() {
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
            Press & Media Room
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#0D0D0F] dark:text-[#F4F4F5] tracking-tight mt-4 mb-4 leading-tight">
            News releases, brand assets, and press contact information.
          </h1>
          <p className="text-base md:text-lg text-[#6E7280] dark:text-[#A1A1AA] leading-relaxed">
            Access official Veritas News press kits, media guidelines, logos, and contact details for journalists and researchers.
          </p>
        </div>

        {/* Press Releases & Assets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white dark:bg-[#18181B] p-8 rounded-2xl border border-[#E5E7EB] dark:border-[#27272A] shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-[#0D0D0F] dark:text-[#F4F4F5]">Brand Assets & Logos</h2>
            <p className="text-xs text-[#6E7280] dark:text-[#A1A1AA] leading-relaxed">
              Download high-resolution vector logos, Veritas News brand guidelines, and UI screenshots for editorial use.
            </p>
            <div className="pt-2">
              <a
                href="/icon.svg"
                download="veritas-news-logo.svg"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0D0D0F] dark:bg-[#F4F4F5] text-white dark:text-[#0D0D0F] text-xs font-bold rounded-xl hover:bg-black dark:hover:bg-white transition-colors"
              >
                <Download className="w-4 h-4" />
                Download Vector Logo (SVG)
              </a>
            </div>
          </div>

          <div className="bg-white dark:bg-[#18181B] p-8 rounded-2xl border border-[#E5E7EB] dark:border-[#27272A] shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-[#0D0D0F] dark:text-[#F4F4F5]">Press Contacts</h2>
            <p className="text-xs text-[#6E7280] dark:text-[#A1A1AA] leading-relaxed">
              For press inquiries, media interviews, and data licensing requests, reach out directly to our communications team.
            </p>
            <div className="pt-2">
              <a
                href="mailto:press@veritasnews.com"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#F4F4F6] dark:bg-[#27272A] text-[#0D0D0F] dark:text-[#F4F4F5] border border-[#E5E7EB] dark:border-[#27272A] text-xs font-bold rounded-xl hover:bg-[#E5E7EB] dark:hover:bg-zinc-700 transition-colors"
              >
                <Mail className="w-4 h-4" />
                press@veritasnews.com
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

