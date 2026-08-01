import React from "react";
import { auth } from "@clerk/nextjs/server";
import {
  Bookmark,
  Share2,
  MoreHorizontal,
  Info,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export default async function NewsDetailsPage() {
  await auth.protect();
  const relatedStories = [
    {
      id: "r1",
      category: "World",
      location: "Middle East",
      title: "Iran Says It Will Not Negotiate Under 'Maximum Pressure'",
      date: "May 29, 2026",
      readTime: "8 min read",
      imageUrl:
        "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: "r2",
      category: "Politics",
      location: "United States",
      title: "Bipartisan Group Urges Diplomacy With Iran",
      date: "May 28, 2026",
      readTime: "5 min read",
      imageUrl:
        "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: "r3",
      category: "Politics",
      location: "United States",
      title: "US Sanctions More Iranian Entities Over Nuclear Program",
      date: "May 28, 2026",
      readTime: "6 min read",
      imageUrl:
        "https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: "r4",
      category: "Science",
      location: "Nuclear Policy",
      title: "What's in the 2015 Iran Nuclear Deal?",
      date: "May 25, 2026",
      readTime: "10 min read",
      imageUrl:
        "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: "r5",
      category: "World",
      location: "Middle East",
      title: "Oman Hosts Another Round of US-Iran Nuclear Talks",
      date: "May 27, 2026",
      readTime: "7 min read",
      imageUrl:
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: "r6",
      category: "World",
      location: "Middle East",
      title: "Israel Reaffirms Red Line Over Iranian Nuclear Program",
      date: "May 24, 2026",
      readTime: "6 min read",
      imageUrl:
        "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=400&auto=format&fit=crop",
    },
  ];

  const topSources = [
    { name: "Fox News", bias: "Right", color: "text-[#1D4ED8]" },
    { name: "The Wall Street Journal", bias: "Center", color: "text-[#6E7280]" },
    { name: "Reuters", bias: "Center", color: "text-[#6E7280]" },
    { name: "BBC", bias: "Center", color: "text-[#6E7280]" },
    { name: "CNN", bias: "Left", color: "text-[#B42318]" },
    { name: "The New York Times", bias: "Center", color: "text-[#6E7280]" },
    { name: "The Washington Post", bias: "Center", color: "text-[#6E7280]" },
    { name: "Newsmax", bias: "Right", color: "text-[#1D4ED8]" },
  ];

  return (
    <div className="min-h-screen bg-[#F8F8F6] text-[#0D0D0F] font-sans antialiased flex flex-col justify-between">
      {/* Header Navigation */}
      <Header />

      {/* Main Content Layout Container */}
      <main className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* LEFT COLUMN: Article Content (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Meta Category & Location */}
            <div className="text-xs font-semibold text-[#6E7280] tracking-wide">
              <span>Politics</span>
              <span className="mx-1.5 text-[#9CA3AF]">·</span>
              <span>United States</span>
            </div>

            {/* Main Article Headline */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#0D0D0F] tracking-tight leading-[1.2]">
              Trump Sends Iran Revised Peace Proposal With Tougher Terms: Report
            </h1>

            {/* Author Byline & Actions Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E7EB] pb-4 text-xs md:text-sm text-[#6E7280]">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-[#0D0D0F]">By David Morgan</span>
                <span>|</span>
                <span>May 31, 2026</span>
                <span>|</span>
                <span>12 min read</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 text-[#0D0D0F] font-medium text-xs">
                <button className="flex items-center gap-1 hover:text-[#1D4ED8] transition-colors">
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
                <button className="flex items-center gap-1 hover:text-[#1D4ED8] transition-colors">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
                <button className="p-1 hover:text-[#1D4ED8] transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Hero Image Container */}
            <div className="space-y-2">
              <div className="w-full h-[280px] md:h-[420px] rounded-xl overflow-hidden bg-slate-100 relative border border-[#E5E7EB]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=1200&auto=format&fit=crop"
                  alt="President Donald Trump in the Cabinet Room"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-[11px] md:text-[12px] text-[#6E7280] leading-snug">
                President Donald Trump in the Cabinet Room at the White House, Washington, D.C., May 30, 2026.
                <br />
                Photo: Andrew Harnik/Getty Images
              </p>
            </div>

            {/* Inline Bias Distribution Box */}
            <div className="bg-[#F4F4F6] border border-[#E5E7EB] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-[#0D0D0F]">
                <div className="flex items-center gap-1.5">
                  <span>Bias Distribution</span>
                  <Info className="w-3.5 h-3.5 text-[#6E7280]" />
                </div>
              </div>

              {/* Segmented Bar */}
              <div className="h-7 w-full flex rounded-md overflow-hidden font-bold text-[11px] text-white">
                <div
                  style={{ width: "20%" }}
                  className="bg-[#B42318] flex items-center justify-center"
                >
                  Left 20%
                </div>
                <div
                  style={{ width: "31%" }}
                  className="bg-[#E5E7EB] text-[#0D0D0F] flex items-center justify-center"
                >
                  Center 31%
                </div>
                <div
                  style={{ width: "49%" }}
                  className="bg-[#1D4ED8] flex items-center justify-center"
                >
                  Right 49%
                </div>
              </div>

              <div className="text-[11px] text-[#6E7280] font-medium">
                12 sources
              </div>
            </div>

            {/* Article Text Content */}
            <article className="text-[15px] md:text-[16px] leading-[1.75] text-[#374151] space-y-5 pt-2">
              <p>
                The Trump administration has sent Iran a revised nuclear deal proposal that includes
                tougher terms on uranium enrichment and stronger verification measures, according to a
                report published Saturday.
              </p>

              <p>
                The new proposal, delivered through intermediaries in Oman, requires Iran to halt all uranium
                enrichment on its soil and ship its stockpile of enriched uranium out of the country. It also
                demands unrestricted access for international inspectors to all Iranian nuclear facilities,
                including military sites.
              </p>

              <p className="pl-4 border-l-2 border-[#0D0D0F] font-medium text-[#0D0D0F] italic my-2">
                &ldquo;This is a take-it-or-leave-it proposal,&rdquo; a senior administration official told the Wall Street
                Journal. &ldquo;The President wants a deal, but he will not accept a weak agreement that puts
                America or our allies at risk.&rdquo;
              </p>

              <p>
                Iran has not yet officially responded to the proposal. However, Iranian Foreign Minister
                Hossein Amir-Abdollahian said last week that any deal must respect Iran&apos;s right to peaceful
                nuclear energy and include the lifting of all U.S. sanctions.
              </p>

              <p>
                The revised proposal comes after several rounds of indirect talks between U.S. and Iranian
                officials failed to produce a breakthrough. The Trump administration has warned that if
                diplomacy fails, it is prepared to take other action to prevent Iran from obtaining a nuclear
                weapon.
              </p>

              <p>
                European allies have urged both sides to continue negotiations. &ldquo;We believe diplomacy is
                still the best path forward,&rdquo; said a spokesperson for the EU&apos;s foreign policy chief.
              </p>

              <p>
                Israel, which has long opposed the 2015 nuclear deal with Iran, praised the Trump
                administration&apos;s tougher stance. &ldquo;This is the kind of leadership that was missing in the past,&rdquo;
                said Israeli Prime Minister Benjamin Netanyahu in a statement.
              </p>

              <p>
                The fate of the proposal now rests with Iran, as global attention remains focused on
                whether a new nuclear agreement can be reached—or if tensions will escalate further.
              </p>
            </article>

            {/* Related Stories Section */}
            <div className="border-t border-[#E5E7EB] pt-8 mt-10">
              <h2 className="text-xl font-bold text-[#0D0D0F] mb-6">
                Related Stories
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedStories.map((story) => (
                  <div
                    key={story.id}
                    className="bg-white border border-[#E5E7EB] rounded-xl p-3 flex items-center gap-3 hover:shadow-sm transition-shadow cursor-pointer"
                  >
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={story.imageUrl}
                        alt={story.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="text-[11px] text-[#6E7280] font-medium">
                        <span>{story.category}</span>
                        <span className="mx-1">·</span>
                        <span>{story.location}</span>
                      </div>
                      <h3 className="text-xs font-bold text-[#0D0D0F] leading-snug line-clamp-2 hover:text-[#1D4ED8] transition-colors">
                        {story.title}
                      </h3>
                      <div className="text-[10px] text-[#9CA3AF]">
                        {story.date} · {story.readTime}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Analysis & Breakdown Sidebar (4 Cols) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* CARD 1: Bias Analysis */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#F4F4F6] pb-3">
                <h3 className="text-sm font-bold text-[#0D0D0F]">Bias Analysis</h3>
                <Info className="w-4 h-4 text-[#6E7280] cursor-pointer" />
              </div>

              <div>
                <div className="text-xs font-medium text-[#6E7280]">Overall Bias</div>
                <div className="text-2xl font-black text-[#1D4ED8] tracking-tight mt-0.5">
                  Right 49%
                </div>
                <div className="text-xs text-[#6E7280] mt-0.5">
                  Based on 12 balanced sources
                </div>
              </div>

              {/* Progress Breakdown Bars */}
              <div className="space-y-2.5 pt-1">
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-[#0D0D0F]">Left</span>
                    <span className="font-semibold text-[#B42318]">20%</span>
                  </div>
                  <div className="w-full bg-[#F4F4F6] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#B42318] h-full" style={{ width: "20%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-[#0D0D0F]">Center</span>
                    <span className="font-semibold text-[#6E7280]">31%</span>
                  </div>
                  <div className="w-full bg-[#F4F4F6] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#CBD5E1] h-full" style={{ width: "31%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-[#0D0D0F]">Right</span>
                    <span className="font-semibold text-[#1D4ED8]">49%</span>
                  </div>
                  <div className="w-full bg-[#F4F4F6] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#1D4ED8] h-full" style={{ width: "49%" }}></div>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-[#6E7280] leading-relaxed pt-1">
                Our analysis is based on the political leaning of the publication and how the story is
                framed. Sources are weighted by reliability and recency.
              </p>

              <Button
                variant="outline"
                className="w-full text-xs font-semibold h-9 rounded-lg border-[#E5E7EB] text-[#0D0D0F] hover:bg-[#F4F4F6]"
              >
                How We Analyze Bias
              </Button>
            </div>

            {/* CARD 2: AI Summary */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#F4F4F6] pb-3">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-[#0D0D0F]">AI Summary</h3>
                </div>
                <Info className="w-4 h-4 text-[#6E7280] cursor-pointer" />
              </div>

              <div className="text-xs text-[#6E7280]">
                Generated May 31, 2026 · 3 min read
              </div>

              {/* Bullet Points List */}
              <ul className="space-y-3 text-xs leading-relaxed text-[#374151] list-disc pl-4">
                <li>
                  The Trump administration has sent Iran a revised nuclear deal proposal with
                  tougher terms, including a complete halt to uranium enrichment and the removal of
                  enriched uranium stockpiles.
                </li>
                <li>
                  The proposal also demands unrestricted inspector access to all nuclear sites,
                  including military facilities.
                </li>
                <li>
                  Iran has not responded officially but says any deal must respect its right to
                  peaceful nuclear energy and include sanctions relief.
                </li>
                <li>
                  The U.S. warns it is prepared to take other action if diplomacy fails, while
                  European allies urge continued negotiations.
                </li>
                <li>
                  Israel supports the tougher stance, praising the administration&apos;s determination
                  to prevent Iran from acquiring nuclear weapons.
                </li>
              </ul>

              <div className="text-[11px] text-[#9CA3AF] pt-1">
                AI summaries can make mistakes.
              </div>

              <Button
                variant="outline"
                className="w-full text-xs font-semibold h-9 rounded-lg border-[#E5E7EB] text-[#0D0D0F] hover:bg-[#F4F4F6]"
              >
                Provide Feedback
              </Button>
            </div>

            {/* CARD 3: Source Breakdown */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#F4F4F6] pb-3">
                <h3 className="text-sm font-bold text-[#0D0D0F]">Source Breakdown</h3>
                <Info className="w-4 h-4 text-[#6E7280] cursor-pointer" />
              </div>

              <div className="text-xs font-semibold text-[#0D0D0F]">
                12 Total Sources
              </div>

              {/* Summary spectrum bars for sources */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#6E7280]">Left</span>
                  <div className="flex items-center gap-2 flex-1 mx-3">
                    <div className="w-full bg-[#F4F4F6] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#B42318] h-full" style={{ width: "20%" }}></div>
                    </div>
                  </div>
                  <span className="font-semibold text-[#0D0D0F]">2 (20%)</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#6E7280]">Center</span>
                  <div className="flex items-center gap-2 flex-1 mx-3">
                    <div className="w-full bg-[#F4F4F6] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#CBD5E1] h-full" style={{ width: "31%" }}></div>
                    </div>
                  </div>
                  <span className="font-semibold text-[#0D0D0F]">4 (31%)</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#6E7280]">Right</span>
                  <div className="flex items-center gap-2 flex-1 mx-3">
                    <div className="w-full bg-[#F4F4F6] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#1D4ED8] h-full" style={{ width: "49%" }}></div>
                    </div>
                  </div>
                  <span className="font-semibold text-[#0D0D0F]">6 (49%)</span>
                </div>
              </div>

              {/* Top Sources Table */}
              <div className="pt-2 border-t border-[#F4F4F6] space-y-2">
                <div className="flex justify-between text-[11px] font-semibold text-[#6E7280] pb-1">
                  <span>Top Sources</span>
                  <span>Bias</span>
                </div>

                {topSources.map((source, index) => (
                  <div
                    key={index}
                    className="flex justify-between text-xs py-0.5 border-b border-[#F8F8F6] last:border-none"
                  >
                    <span className="font-medium text-[#0D0D0F]">{source.name}</span>
                    <span className={`font-semibold ${source.color}`}>{source.bias}</span>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                className="w-full text-xs font-semibold h-9 rounded-lg border-[#E5E7EB] text-[#0D0D0F] hover:bg-[#F4F4F6] mt-2"
              >
                View All Sources
              </Button>
            </div>
          </aside>
        </div>

        {/* BOTTOM NEWSLETTER SIGNUP BANNER */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 md:p-8 mt-12 mb-4 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xs">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-extrabold text-[#0D0D0F] tracking-tight">
              Stay Informed. Stay Balanced.
            </h3>
            <p className="text-xs md:text-sm text-[#6E7280]">
              Get the top stories and bias analysis delivered to your inbox.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto max-w-md">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 text-xs md:text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D0D0F] flex-1 bg-white text-[#0D0D0F]"
            />
            <Button
              variant="primary"
              className="bg-[#0D0D0F] text-white px-5 py-2 rounded-lg font-semibold text-xs md:text-sm hover:bg-black transition-colors whitespace-nowrap"
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
