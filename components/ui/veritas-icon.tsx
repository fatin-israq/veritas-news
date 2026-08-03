import React from "react";

export interface VeritasIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  variant?: "default" | "dark" | "light" | "monochrome";
  showBackground?: boolean;
  className?: string;
}

export const VeritasIcon: React.FC<VeritasIconProps> = ({
  size = 32,
  variant = "default",
  showBackground = true,
  className = "",
  style,
  ...props
}) => {
  const sizeValue = typeof size === "number" ? `${size}px` : size;

  // Variant color definitions
  const leftWingColor =
    variant === "monochrome"
      ? "#888888"
      : variant === "dark"
      ? "#0D0D0F"
      : "url(#vi-left-wing)";

  const rightWingColor =
    variant === "monochrome" ? "#444444" : "url(#vi-right-wing)";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="none"
      width={sizeValue}
      height={sizeValue}
      className={`inline-block flex-shrink-0 align-middle ${className}`}
      style={{ width: sizeValue, height: sizeValue, ...style }}
      aria-label="Veritas News Logo"
      role="img"
      {...props}
    >
      <defs>
        {/* Background Gradient */}
        <linearGradient id="vi-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#141417" />
          <stop offset="100%" stop-color="#09090B" />
        </linearGradient>

        {/* Left Wing Gradient */}
        <linearGradient id="vi-left-wing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF" />
          <stop offset="100%" stop-color="#94A3B8" />
        </linearGradient>

        {/* Right Wing Gradient */}
        <linearGradient id="vi-right-wing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#EF4444" />
          <stop offset="50%" stop-color="#B42318" />
          <stop offset="100%" stop-color="#7F1D1D" />
        </linearGradient>

        {/* Center Fold Prism */}
        <linearGradient id="vi-prism" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FCA5A5" />
          <stop offset="100%" stop-color="#DC2626" />
        </linearGradient>

        {/* Subtle Glow Shadow */}
        <filter id="vi-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="10"
            stdDeviation="14"
            flood-color="#B42318"
            flood-opacity="0.3"
          />
        </filter>
      </defs>

      {/* Container Background (if enabled) */}
      {showBackground && (
        <>
          <rect width="512" height="512" rx="120" fill="url(#vi-bg)" />
          <rect
            width="500"
            height="500"
            x="6"
            y="6"
            rx="114"
            stroke="#FFFFFF"
            strokeOpacity="0.1"
            strokeWidth="6"
          />
        </>
      )}

      {/* Veritas Emblem Mark */}
      <g filter={showBackground ? "url(#vi-glow)" : undefined}>
        {/* Left Wing (Structure/Pillar) */}
        <path
          d="M120 120 L236 384 C244 402 268 402 276 384 L296 338 L196 120 Z"
          fill={leftWingColor}
        />

        {/* Right Wing (Crimson Analytical Focus) */}
        <path
          d="M392 120 L276 384 C268 402 244 402 236 384 L216 338 L316 120 Z"
          fill={rightWingColor}
        />

        {/* Overlapping Spectrum Prism */}
        <path
          d="M208 190 L360 120 L392 120 L228 196 Z"
          fill="url(#vi-prism)"
          opacity={0.95}
        />
        <path
          d="M228 240 L340 188 L358 188 L244 246 Z"
          fill="#F87171"
          opacity={0.8}
        />

        {/* Veritas Red Accent Dot */}
        <circle cx="396" cy="116" r="26" fill="#EF4444" />
        <circle cx="396" cy="116" r="12" fill="#FFFFFF" />
      </g>
    </svg>
  );
};
