import React from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PaginatedArticleList } from "@/components/news/paginated-article-list";
import { getArticles } from "@/lib/supabase/queries/articles";
import type { ArticleWithAnalysis } from "@/lib/supabase/types";

export const revalidate = 60; // Revalidate live home page data every 60 seconds

export default async function Home() {
  let dbArticles: ArticleWithAnalysis[] = [];
  let dbError: string | null = null;

  try {
    dbArticles = await getArticles(100);
  } catch (err) {
    console.error("Error loading articles from Supabase:", err);
    dbError = err instanceof Error ? err.message : "Failed to load database articles";
  }

  // Static demo fallback articles when 0 analyzed articles exist in Supabase yet
  const fallbackArticles = [
    {
      id: "1",
      category: "Politics",
      location: "United States",
      title: "Trump Sends Iran Revised Peace Proposal With Tougher Terms: Report",
      leftPercentage: 20,
      centerPercentage: 31,
      rightPercentage: 49,
      sourcesCount: 12,
      imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "2",
      category: "Health",
      location: "United States",
      title: "Researchers Make Case for Grapes as a 'Superfood' After Review of Health Evidence",
      leftPercentage: 18,
      centerPercentage: 42,
      rightPercentage: 40,
      sourcesCount: 7,
      imageUrl: "https://images.unsplash.com/photo-1596368708356-6e1e1025ee73?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "3",
      category: "Science",
      location: "Switzerland",
      title: "CERN Finds High-Significance Hint of Physics Beyond Standard Model",
      leftPercentage: 18,
      centerPercentage: 62,
      rightPercentage: 22,
      sourcesCount: 8,
      imageUrl: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "4",
      category: "World",
      location: "Nicaragua",
      title: "Indigenous Leader Brooklyn Rivera Dies in Nicaragua After Nearly 3 Years of Detention",
      leftPercentage: 54,
      centerPercentage: 28,
      rightPercentage: 18,
      sourcesCount: 63,
      imageUrl: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "5",
      category: "World",
      location: "Middle East",
      title: "UN Security Council to Hold Emergency Meeting as Israel Pushes Deeper into Lebanon",
      leftPercentage: 22,
      centerPercentage: 35,
      rightPercentage: 43,
      sourcesCount: 15,
      imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "6",
      category: "Business",
      location: "Global",
      title: "Oil Prices Dip as OPEC+ Considers Output Increase Amid Weak Demand",
      leftPercentage: 25,
      centerPercentage: 50,
      rightPercentage: 25,
      sourcesCount: 11,
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00cd?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "7",
      category: "Technology",
      location: "United States",
      title: "SpaceX Launches Starship Test Flight in Milestone for Mars Program",
      leftPercentage: 12,
      centerPercentage: 45,
      rightPercentage: 43,
      sourcesCount: 9,
      imageUrl: "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "8",
      category: "Business",
      location: "United States",
      title: "Apple Unveils AI-Powered Features Across iPhone, iPad and Mac",
      leftPercentage: 15,
      centerPercentage: 40,
      rightPercentage: 45,
      sourcesCount: 10,
      imageUrl: "https://images.unsplash.com/photo-1510519138161-584457934448?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "9",
      category: "Climate",
      location: "Global",
      title: "2025 on Track to Be Among Top 3 Hottest Years, EU Climate Service Says",
      leftPercentage: 33,
      centerPercentage: 34,
      rightPercentage: 33,
      sourcesCount: 14,
      imageUrl: "https://images.unsplash.com/photo-1569163139599-0f4517e36f31?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "10",
      category: "Economy",
      location: "United States",
      title: "Fed Holds Rates Steady, Signals Caution on Inflation and Growth Outlook",
      leftPercentage: 30,
      centerPercentage: 45,
      rightPercentage: 25,
      sourcesCount: 13,
      imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "11",
      category: "Soccer",
      location: "Europe",
      title: "Real Madrid Win Champions League After Comeback Victory in Final",
      leftPercentage: 10,
      centerPercentage: 20,
      rightPercentage: 70,
      sourcesCount: 26,
      imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "12",
      category: "Environment",
      location: "Canada",
      title: "Wildfires Force Thousands to Evacuate Across Western Canada",
      leftPercentage: 27,
      centerPercentage: 33,
      rightPercentage: 40,
      sourcesCount: 17,
      imageUrl: "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?q=80&w=800&auto=format&fit=crop",
    },
  ];

  const hasLiveData = dbArticles.length > 0;
  const articlesToDisplay = hasLiveData ? dbArticles : fallbackArticles;

  return (
    <div className="min-h-screen bg-[#F8F8F6] text-[#0D0D0F] font-sans antialiased flex flex-col justify-between">
      {/* Header Navigation & Category Filter */}
      <Header />

      {/* Main Container */}
      <main className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 w-full flex-1">
        {/* Section Heading */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0D0D0F] tracking-tight">
            Top News
          </h1>
          <p className="text-xs text-[#6E7280] mt-1">
            Real-time news stories analyzed for political framing and sentiment.
          </p>
        </div>

        {dbError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
            <strong>Supabase Query Notice:</strong> {dbError}
          </div>
        )}

        {/* Paginated Article List (Single column 6 items on mobile, 3 columns 12 items on desktop) */}
        <PaginatedArticleList
          articles={articlesToDisplay}
          hasLiveData={hasLiveData}
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}