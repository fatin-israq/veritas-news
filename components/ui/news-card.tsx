"use client";

import React from "react";
import Link from "next/link";
import { Info } from "lucide-react";
import posthog from "posthog-js";
import { BiasMeter } from "./bias-meter";

export interface NewsCardProps {
  id?: string;
  category?: string;
  location?: string;
  source?: string;
  title: string;
  excerpt?: string;
  imageUrl?: string;
  leftPercentage?: number;
  centerPercentage?: number;
  rightPercentage?: number;
  sourcesCount?: number | string;
  className?: string;
  // Analytics: enriched properties for the `article_opened` event.
  sentimentLabel?: string;
  biasLabel?: string;
  confidence?: number;
  publishedAt?: string;
  positionInFeed?: number;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  id = "1",
  category = "Politics",
  location = "United States",
  source,
  title,
  excerpt,
  imageUrl = "https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=800&auto=format&fit=crop",
  leftPercentage = 25,
  centerPercentage = 50,
  rightPercentage = 25,
  sourcesCount = "12 sources",
  className = "",
  sentimentLabel,
  biasLabel,
  confidence,
  publishedAt,
  positionInFeed,
}) => {
  const displayLocation = location || source || "Global";
  const formattedSources =
    typeof sourcesCount === "number" ? `${sourcesCount} sources` : sourcesCount;

  // Fires before navigation so we can rank articles by reader interest with
  // human-readable, segmentable properties (no Supabase join needed downstream).
  const handleOpen = () => {
    posthog.capture("article_opened", {
      article_id: id,
      article_title: title,
      source_name: source ?? category,
      sentiment_label: sentimentLabel,
      bias_label: biasLabel,
      confidence,
      published_at: publishedAt,
      position_in_feed: positionInFeed,
    });
  };

  return (
    <div
      className={`bg-white dark:bg-[#18181B] rounded-xl border border-[#E5E7EB] dark:border-[#27272A] overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col group ${className}`}
    >
      {/* Article Link wrapper covering Image and Main Details */}
      <Link
        href={`/news/${id}`}
        prefetch={false}
        onClick={handleOpen}
        data-attr="news-card-link"
        className="flex flex-col flex-1 cursor-pointer"
      >
        {/* Thumbnail Image Container */}
        <div className="relative w-full h-[210px] bg-slate-100 dark:bg-zinc-800 flex-shrink-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            data-attr="news-card-info"
            className="absolute top-2.5 right-2.5 p-1 bg-black/40 hover:bg-black/70 backdrop-blur-sm text-white rounded-full transition-colors z-10"
            title="Article breakdown info"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        {/* Content Container */}
        <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
          <div className="space-y-2">
            {/* Category & Location Meta */}
            <div className="text-[12px] font-medium text-[#6E7280] dark:text-[#A1A1AA]">
              <span className="font-bold text-[#0D0D0F] dark:text-[#F4F4F5]">{category}</span>
              <span className="mx-1.5 font-normal text-[#9CA3AF] dark:text-zinc-500">·</span>
              <span>{displayLocation}</span>
            </div>

            {/* Headline Title */}
            <h3 className="text-[15px] md:text-[16px] font-bold text-[#0D0D0F] dark:text-[#F4F4F5] leading-snug line-clamp-3 group-hover:text-[#1D4ED8] dark:group-hover:text-[#60A5FA] transition-colors tracking-tight">
              {title}
            </h3>

            {excerpt && (
              <p className="text-xs text-[#6E7280] dark:text-[#A1A1AA] line-clamp-2 leading-relaxed pt-0.5">
                {excerpt}
              </p>
            )}
          </div>

          {/* Bias Meter & Sources Count */}
          <div className="space-y-2.5 pt-1">
            <BiasMeter
              leftPercentage={leftPercentage}
              centerPercentage={centerPercentage}
              rightPercentage={rightPercentage}
              showScale={false}
            />

            <div className="text-[12px] text-[#6E7280] dark:text-[#A1A1AA] font-medium">
              {formattedSources}
            </div>
          </div>
        </div>
      </Link>
    </div>

  );
};
