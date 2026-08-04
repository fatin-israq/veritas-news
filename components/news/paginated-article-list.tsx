"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NewsCard } from "@/components/ui/news-card";
import type { ArticleWithAnalysis } from "@/lib/supabase/types";

export interface StandardArticleItem {
  id: string;
  category?: string;
  location?: string;
  source?: string;
  title: string;
  imageUrl?: string;
  leftPercentage?: number;
  centerPercentage?: number;
  rightPercentage?: number;
  sourcesCount?: number | string;
}

export type GenericArticle = ArticleWithAnalysis | StandardArticleItem;

export interface PaginatedArticleListProps {
  articles: GenericArticle[];
  hasLiveData?: boolean;
}

// Helper to normalize article data whether it comes from Supabase or fallback array
function normalizeArticle(article: GenericArticle) {
  if ("analysis" in article) {
    const dbArticle = article as ArticleWithAnalysis;
    return {
      id: dbArticle.id,
      category: dbArticle.source?.name || "News",
      location: dbArticle.source?.name || "Global",
      source: dbArticle.source?.name,
      title: dbArticle.title,
      imageUrl: dbArticle.image_url,
      leftPercentage: dbArticle.analysis?.left_percentage ?? 33,
      centerPercentage: dbArticle.analysis?.center_percentage ?? 34,
      rightPercentage: dbArticle.analysis?.right_percentage ?? 33,
      sourcesCount: dbArticle.source?.name || "1 source",
    };
  } else {
    const fallback = article as StandardArticleItem;
    return {
      id: fallback.id,
      category: fallback.category || "News",
      location: fallback.location || "Global",
      source: fallback.source,
      title: fallback.title,
      imageUrl: fallback.imageUrl,
      leftPercentage: fallback.leftPercentage ?? 33,
      centerPercentage: fallback.centerPercentage ?? 34,
      rightPercentage: fallback.rightPercentage ?? 33,
      sourcesCount: fallback.sourcesCount ?? "1 source",
    };
  }
}

// Helper for generating pagination range with smart ellipsis
function getPaginationRange(currentPage: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "...", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
}

export const PaginatedArticleList: React.FC<PaginatedArticleListProps> = ({
  articles,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Selector state for items per page: 'auto' | '6' | '12' | '24' | '48'
  const [pageSizeSelection, setPageSizeSelection] = useState<string>("auto");
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Client-side viewport detection for mobile (<768px) vs desktop (>=768px)
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setIsMobileView(isMobile);
    };

    // Set initial size on mount safely
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Compute effective items per page
  const itemsPerPage =
    pageSizeSelection === "auto"
      ? isMobileView
        ? 6
        : 12
      : parseInt(pageSizeSelection, 10);

  const totalArticles = articles.length;
  const totalPages = Math.max(1, Math.ceil(totalArticles / itemsPerPage));

  // Ensure current page remains within valid bounds if totalPages shrinks
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalArticles);
  const currentArticles = articles.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);

    // Smooth scroll to container top when navigating
    if (containerRef.current) {
      const topOffset = containerRef.current.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  };

  const paginationRange = getPaginationRange(currentPage, totalPages);

  return (
    <div ref={containerRef} className="w-full space-y-8">
      {/* News Cards Grid: Single column on mobile (6 per page), 3 columns on desktop (12 per page) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-300 ease-in-out">
        {currentArticles.map((article) => {
          const item = normalizeArticle(article);
          return (
            <NewsCard
              key={item.id}
              id={item.id}
              category={item.category}
              location={item.location}
              source={item.source}
              title={item.title}
              imageUrl={item.imageUrl}
              leftPercentage={item.leftPercentage}
              centerPercentage={item.centerPercentage}
              rightPercentage={item.rightPercentage}
              sourcesCount={item.sourcesCount}
            />
          );
        })}
      </div>

      {/* Pagination Controls Section */}
      <div className="pt-6 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
        {/* Current range summary */}
        <div className="text-xs sm:text-sm text-[#6E7280] font-medium text-center sm:text-left">
          Showing <span className="font-semibold text-[#0D0D0F]">{totalArticles > 0 ? startIndex + 1 : 0}</span> to{" "}
          <span className="font-semibold text-[#0D0D0F]">{endIndex}</span> of{" "}
          <span className="font-semibold text-[#0D0D0F]">{totalArticles}</span> articles
        </div>

        {/* Page Buttons & Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto">
          {/* Items Per Page Dropdown */}
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-[#6E7280] mr-1">
            <label htmlFor="items-per-page-select" className="hidden sm:inline font-medium text-xs text-[#6E7280]">
              Per page:
            </label>
            <select
              id="items-per-page-select"
              value={pageSizeSelection}
              onChange={(e) => {
                setPageSizeSelection(e.target.value);
                setCurrentPage(1);
              }}
              className="h-11 sm:h-9 px-2.5 py-1 text-xs sm:text-sm font-medium text-[#0D0D0F] bg-white border border-[#E5E7EB] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0D0D0F] transition-colors cursor-pointer"
              aria-label="Select articles per page"
            >
              <option value="auto">Auto ({isMobileView ? "6" : "12"})</option>
              <option value="6">6 per page</option>
              <option value="12">12 per page</option>
              <option value="24">24 per page</option>
              <option value="48">48 per page</option>
            </select>
          </div>

          {/* Navigation Controls Container */}
          <div className="flex items-center space-x-1.5">
            {/* Previous Page Button */}
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className={`min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px] px-2.5 sm:px-3 py-1.5 flex items-center justify-center space-x-1 text-xs sm:text-sm font-medium rounded-lg border transition-all duration-150 ${
                currentPage === 1
                  ? "bg-[#F4F4F6] text-[#9CA3AF] border-[#E5E7EB] cursor-not-allowed"
                  : "bg-white text-[#0D0D0F] border-[#E5E7EB] hover:bg-[#F4F4F6] active:bg-[#E5E7EB] shadow-sm"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden xs:inline">Prev</span>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {paginationRange.map((page, idx) => {
                if (page === "...") {
                  return (
                    <span
                      key={`ellipsis-${idx}`}
                      className="min-h-[44px] min-w-[32px] sm:min-h-[36px] sm:min-w-[32px] flex items-center justify-center text-xs text-[#9CA3AF]"
                    >
                      ...
                    </span>
                  );
                }

                const isCurrent = page === currentPage;
                return (
                  <button
                    key={`page-${page}`}
                    type="button"
                    onClick={() => handlePageChange(page as number)}
                    aria-current={isCurrent ? "page" : undefined}
                    aria-label={`Page ${page}`}
                    className={`min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px] px-2 sm:px-3 py-1.5 flex items-center justify-center text-xs sm:text-sm font-semibold rounded-lg transition-all duration-150 ${
                      isCurrent
                        ? "bg-[#0D0D0F] text-white border border-[#0D0D0F] shadow-sm"
                        : "bg-white text-[#0D0D0F] border border-[#E5E7EB] hover:bg-[#F4F4F6] active:bg-[#E5E7EB]"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            {/* Next Page Button */}
            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className={`min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px] px-2.5 sm:px-3 py-1.5 flex items-center justify-center space-x-1 text-xs sm:text-sm font-medium rounded-lg border transition-all duration-150 ${
                currentPage === totalPages
                  ? "bg-[#F4F4F6] text-[#9CA3AF] border-[#E5E7EB] cursor-not-allowed"
                  : "bg-white text-[#0D0D0F] border-[#E5E7EB] hover:bg-[#F4F4F6] active:bg-[#E5E7EB] shadow-sm"
              }`}
            >
              <span className="hidden xs:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
