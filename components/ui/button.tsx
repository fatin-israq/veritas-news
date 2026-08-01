import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "text";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#0D0D0F] disabled:opacity-50 disabled:pointer-events-none rounded-[6px]";

    const variantStyles = {
      primary:
        "bg-[#0D0D0F] text-white hover:bg-[#252529] active:bg-[#000000]",
      secondary:
        "bg-[#F0F0F0] text-[#0D0D0F] hover:bg-[#E5E5E5] active:bg-[#D8D8D8]",
      outline:
        "border border-[#E5E7EB] bg-white text-[#0D0D0F] hover:bg-[#F8F8F6] active:bg-[#F0F0F0]",
      text:
        "bg-transparent text-[#0D0D0F] hover:text-[#1D4ED8] hover:bg-[#F0F0FD]/50",
    };

    const sizeStyles = {
      sm: "px-3 py-1.5 text-xs font-medium",
      md: "px-4 py-2 text-sm font-medium",
      lg: "px-5 py-2.5 text-base font-semibold",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
