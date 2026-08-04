import React from "react";

export interface BiasMeterProps {
  leftPercentage: number;
  centerPercentage: number;
  rightPercentage: number;
  showScale?: boolean;
  className?: string;
}

export const BiasMeter: React.FC<BiasMeterProps> = ({
  leftPercentage,
  centerPercentage,
  rightPercentage,
  showScale = true,
  className = "",
}) => {
  // Ensure totals align to 100%
  const total = leftPercentage + centerPercentage + rightPercentage || 100;
  const leftWidth = (leftPercentage / total) * 100;
  const centerWidth = (centerPercentage / total) * 100;
  const rightWidth = (rightPercentage / total) * 100;

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      <div className="flex h-7 w-full rounded-md overflow-hidden text-[11px] font-semibold">
        {/* Left Segment */}
        {leftWidth > 0 && (
          <div
            style={{ width: `${leftWidth}%` }}
            className="bg-[#B42318] text-white flex items-center justify-center px-1 text-[10px] md:text-[11px] font-bold truncate transition-all duration-300"
            title={`Left: ${leftPercentage}%`}
          >
            {leftWidth > 10 ? `L ${leftPercentage}%` : `${leftPercentage}%`}
          </div>
        )}

        {/* Center Segment */}
        {centerWidth > 0 && (
          <div
            style={{ width: `${centerWidth}%` }}
            className="bg-[#E5E7EB] dark:bg-zinc-700 text-[#0D0D0F] dark:text-zinc-100 flex items-center justify-center px-1 text-[10px] md:text-[11px] font-bold truncate transition-all duration-300"
            title={`Center: ${centerPercentage}%`}
          >
            {centerWidth > 12 ? `Center ${centerPercentage}%` : `${centerPercentage}%`}
          </div>
        )}

        {/* Right Segment */}
        {rightWidth > 0 && (
          <div
            style={{ width: `${rightWidth}%` }}
            className="bg-[#1D4ED8] dark:bg-[#3B82F6] text-white flex items-center justify-center px-1 text-[10px] md:text-[11px] font-bold truncate transition-all duration-300"
            title={`Right: ${rightPercentage}%`}
          >
            {rightWidth > 10 ? `Right ${rightPercentage}%` : `${rightPercentage}%`}
          </div>
        )}
      </div>

      {showScale && (
        <div className="flex justify-between text-[10px] text-[#6E7280] dark:text-[#A1A1AA] font-medium px-0.5">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      )}
    </div>
  );
};

