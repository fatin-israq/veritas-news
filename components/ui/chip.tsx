import React from "react";
import { Plus } from "lucide-react";

export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  showPlus?: boolean;
  active?: boolean;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  showPlus = true,
  active = false,
  className = "",
  ...props
}) => {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer border ${
        active
          ? "bg-[#0D0D0F] text-white border-[#0D0D0F]"
          : "bg-[#F0F0F0] text-[#0D0D0F] border-[#E5E7EB] hover:bg-[#E5E5E5]"
      } ${className}`}
      {...props}
    >
      <span>{label}</span>
      {showPlus && <Plus className="w-3.5 h-3.5 opacity-70" />}
    </div>
  );
};
