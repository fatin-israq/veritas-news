"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
            Contact Us
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#0D0D0F] dark:text-[#F4F4F5] tracking-tight mt-4 mb-4 leading-tight">
            Get in touch with the Veritas team.
          </h1>
          <p className="text-base md:text-lg text-[#6E7280] dark:text-[#A1A1AA] leading-relaxed">
            Have questions about our AI bias detection algorithms, feedback on article summaries, or partnership inquiries? Send us a message below.
          </p>
        </div>

        {/* Contact Form & Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
          <div className="md:col-span-7 bg-white dark:bg-[#18181B] p-8 rounded-2xl border border-[#E5E7EB] dark:border-[#27272A] shadow-xs">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#0D0D0F] dark:text-[#F4F4F5]">Message Received!</h3>
                <p className="text-xs text-[#6E7280] dark:text-[#A1A1AA]">
                  Thank you for reaching out. Our support team will respond within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 bg-[#F4F4F6] dark:bg-[#27272A] text-[#0D0D0F] dark:text-[#F4F4F5] text-xs font-bold rounded-xl hover:bg-[#E5E7EB] dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#0D0D0F] dark:text-[#F4F4F5] mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jane Doe"
                    className="w-full px-4 py-2.5 text-xs bg-[#F8F8F6] dark:bg-[#121215] border border-[#E5E7EB] dark:border-[#27272A] rounded-xl text-[#0D0D0F] dark:text-[#F4F4F5] focus:outline-none focus:border-[#0D0D0F] dark:focus:border-[#F4F4F5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0D0D0F] dark:text-[#F4F4F5] mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane@example.com"
                    className="w-full px-4 py-2.5 text-xs bg-[#F8F8F6] dark:bg-[#121215] border border-[#E5E7EB] dark:border-[#27272A] rounded-xl text-[#0D0D0F] dark:text-[#F4F4F5] focus:outline-none focus:border-[#0D0D0F] dark:focus:border-[#F4F4F5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0D0D0F] dark:text-[#F4F4F5] mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Feedback, Support, or Inquiries"
                    className="w-full px-4 py-2.5 text-xs bg-[#F8F8F6] dark:bg-[#121215] border border-[#E5E7EB] dark:border-[#27272A] rounded-xl text-[#0D0D0F] dark:text-[#F4F4F5] focus:outline-none focus:border-[#0D0D0F] dark:focus:border-[#F4F4F5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0D0D0F] dark:text-[#F4F4F5] mb-1">Message</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write your message here..."
                    className="w-full px-4 py-2.5 text-xs bg-[#F8F8F6] dark:bg-[#121215] border border-[#E5E7EB] dark:border-[#27272A] rounded-xl text-[#0D0D0F] dark:text-[#F4F4F5] focus:outline-none focus:border-[#0D0D0F] dark:focus:border-[#F4F4F5]"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#0D0D0F] dark:bg-[#F4F4F5] text-white dark:text-[#0D0D0F] text-xs font-bold rounded-xl hover:bg-black dark:hover:bg-white transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            )}
          </div>

          <div className="md:col-span-5 space-y-6">
            <div className="bg-white dark:bg-[#18181B] p-6 rounded-2xl border border-[#E5E7EB] dark:border-[#27272A] shadow-xs space-y-3">
              <h3 className="text-base font-bold text-[#0D0D0F] dark:text-[#F4F4F5]">Direct Email Support</h3>
              <p className="text-xs text-[#6E7280] dark:text-[#A1A1AA] leading-relaxed">
                For general support questions:
              </p>
              <a href="mailto:support@veritasnews.com" className="text-xs font-bold text-[#B42318] dark:text-[#EF4444] hover:underline block">
                support@veritasnews.com
              </a>
            </div>

            <div className="bg-white dark:bg-[#18181B] p-6 rounded-2xl border border-[#E5E7EB] dark:border-[#27272A] shadow-xs space-y-3">
              <h3 className="text-base font-bold text-[#0D0D0F] dark:text-[#F4F4F5]">Data & Scraping Partnership</h3>
              <p className="text-xs text-[#6E7280] dark:text-[#A1A1AA] leading-relaxed">
                Publishers interested in integrating source feeds:
              </p>
              <a href="mailto:partners@veritasnews.com" className="text-xs font-bold text-[#B42318] dark:text-[#EF4444] hover:underline block">
                partners@veritasnews.com
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

