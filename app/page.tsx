import React from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { NewsCard } from "@/components/ui/news-card";
import { getArticles } from "@/lib/supabase/queries/articles";
import type { ArticleWithAnalysis } from "@/lib/supabase/types";

export const revalidate = 60; // Revalidate live home page data every 60 seconds

export default async function Home() {
  let dbArticles: ArticleWithAnalysis[] = [];
  let dbError: string | null = null;

  try {
    dbArticles = await getArticles(50);
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
  ];

  const hasLiveData = dbArticles.length > 0;

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

        {/* News Cards Grid (3 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hasLiveData
            ? dbArticles.map((article) => (
                <NewsCard
                  key={article.id}
                  id={article.id}
                  category={article.source?.name || "News"}
                  location={article.source?.name || "Global"}
                  source={article.source?.name}
                  title={article.title}
                  imageUrl={article.image_url}
                  leftPercentage={article.analysis?.left_percentage ?? 33}
                  centerPercentage={article.analysis?.center_percentage ?? 34}
                  rightPercentage={article.analysis?.right_percentage ?? 33}
                  sourcesCount={article.source?.name || "1 source"}
                />
              ))
            : fallbackArticles.map((article) => (
                <NewsCard
                  key={article.id}
                  id={article.id}
                  category={article.category}
                  location={article.location}
                  title={article.title}
                  imageUrl={article.imageUrl}
                  leftPercentage={article.leftPercentage}
                  centerPercentage={article.centerPercentage}
                  rightPercentage={article.rightPercentage}
                  sourcesCount={article.sourcesCount}
                />
              ))}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}