import React from "react";
import Link from "next/link";
import { Info } from "lucide-react";
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
}) => {
  const displayLocation = location || source || "Global";
  const formattedSources =
    typeof sourcesCount === "number" ? `${sourcesCount} sources` : sourcesCount;

  return (
    <div
      className={`bg-white rounded-xl border border-[#E5E7EB] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col ${className}`}
    >
      {/* Thumbnail Image Container */}
      <div className="relative w-full h-[210px] bg-slate-100 flex-shrink-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <button
          className="absolute top-2.5 right-2.5 p-1 bg-black/40 hover:bg-black/70 backdrop-blur-sm text-white rounded-full transition-colors"
          title="Article breakdown info"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      {/* Content Container */}
      <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
        <div className="space-y-2">
          {/* Category & Location Meta */}
          <div className="text-[12px] font-medium text-[#6E7280]">
            <span className="font-bold text-[#0D0D0F]">{category}</span>
            <span className="mx-1.5 font-normal text-[#9CA3AF]">·</span>
            <span>{displayLocation}</span>
          </div>

          {/* Headline Title */}
          <h3 className="text-[15px] md:text-[16px] font-bold text-[#0D0D0F] leading-snug line-clamp-3 hover:text-[#1D4ED8] transition-colors cursor-pointer tracking-tight">
            <Link href={`/news/${id}`}>
              {title}
            </Link>
          </h3>

          {excerpt && (
            <p className="text-xs text-[#6E7280] line-clamp-2 leading-relaxed pt-0.5">
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

          <div className="text-[12px] text-[#6E7280] font-medium">
            {formattedSources}
          </div>
        </div>
      </div>
    </div>
  );
};
