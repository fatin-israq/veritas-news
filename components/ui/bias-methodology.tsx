"use client";

import React, { useState } from "react";
import { Info, ChevronDown } from "lucide-react";
import posthog from "posthog-js";

export interface BiasMethodologyProps {
  articleId: string;
  sourceName: string;
  biasLabel: string;
  confidencePercentage: number;
  modelName: string;
}

/**
 * "How We Analyze Bias" disclosure. Explains the AI framing methodology and
 * captures a `bias_methodology_clicked` event so we can measure how many
 * readers care about how the scores are produced.
 */
export const BiasMethodology: React.FC<BiasMethodologyProps> = ({
  articleId,
  sourceName,
  biasLabel,
  confidencePercentage,
  modelName,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);

    posthog.capture("bias_methodology_clicked", {
      article_id: articleId,
      source_name: sourceName,
      bias_label: biasLabel,
      confidence_percentage: confidencePercentage,
      model: modelName,
      opened: nextOpen,
    });
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        data-attr="how-we-analyze-bias"
        className="flex items-center gap-1.5 text-[11px] font-semibold text-[#1D4ED8] hover:text-[#0D0D0F] transition-colors"
      >
        <Info className="w-3.5 h-3.5" />
        <span>How We Analyze Bias</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-3 text-[11px] leading-relaxed text-[#4B5563] space-y-2">
          <p>
            Every article is passed to <strong>{modelName}</strong>, which reads
            only the article text — never the outlet&apos;s reputation — and
            estimates how much of the framing leans left, center, and right. The
            three percentages always add up to 100%.
          </p>
          <p>
            The model also returns a confidence score ({confidencePercentage}%
            here). When the evidence is weak, the framing label is marked
            unclear and confidence stays low.
          </p>
          <p className="text-[#9CA3AF] italic">
            These are AI estimates, not objective truth. Use them as a prompt to
            read critically, not as a verdict on the publisher.
          </p>
        </div>
      )}
    </div>
  );
};
