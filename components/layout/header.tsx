"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Globe,
  ChevronRight,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Header: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark" | "auto">("light");
  const [activeNav, setActiveNav] = useState("Home");

  const categories = [
    "World Cup",
    "IPL",
    "Social Media",
    "Business & Markets",
    "Health & Medicine",
    "Soccer",
    "Artificial Intelligence",
    "Arsenal FC",
    "Extreme Weather and Disasters",
  ];

  return (
    <>
      {/* Top Utility Bar (Renders at top of page, scrolls naturally out of view) */}
      <div className="bg-[#F4F4F6] text-[#6E7280] text-[12px] px-4 md:px-8 py-2 border-b border-[#E5E7EB]">
        <div className="max-w-[1280px] mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left Utilities */}
          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="hover:text-[#0D0D0F] transition-colors font-medium"
            >
              Browser Extension
            </Link>

            {/* Theme Selector */}
            <div className="flex items-center gap-1 bg-[#E5E7EB]/60 p-0.5 rounded-md text-[11px]">
              <span className="px-1.5 font-medium text-[#6E7280]">Theme:</span>
              <button
                onClick={() => setTheme("light")}
                className={`px-2 py-0.5 rounded font-medium transition-colors ${
                  theme === "light"
                    ? "bg-white text-[#0D0D0F] shadow-2xs"
                    : "text-[#6E7280] hover:text-[#0D0D0F]"
                }`}
              >
                Light
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`px-2 py-0.5 rounded font-medium transition-colors ${
                  theme === "dark"
                    ? "bg-white text-[#0D0D0F] shadow-2xs"
                    : "text-[#6E7280] hover:text-[#0D0D0F]"
                }`}
              >
                Dark
              </button>
              <button
                onClick={() => setTheme("auto")}
                className={`px-2 py-0.5 rounded font-medium transition-colors ${
                  theme === "auto"
                    ? "bg-white text-[#0D0D0F] shadow-2xs"
                    : "text-[#6E7280] hover:text-[#0D0D0F]"
                }`}
              >
                Auto
              </button>
            </div>
          </div>

          {/* Right Utilities */}
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-medium text-[#0D0D0F]">
              Monday, June 1, 2026
            </span>

            <button className="flex items-center gap-1 hover:text-[#0D0D0F] transition-colors font-medium">
              <MapPin className="w-3.5 h-3.5" />
              <span>Set Location</span>
            </button>

            <button className="flex items-center gap-1 hover:text-[#0D0D0F] transition-colors font-medium">
              <Globe className="w-3.5 h-3.5" />
              <span>International Edition</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Header Navigation */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-[#E5E7EB] shadow-xs">
        {/* Main Navigation Bar */}
        <div className="px-4 md:px-8 py-3 bg-white">
          <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-4">
            {/* Left: Logo & Navigation Links */}
            <div className="flex items-center gap-6 md:gap-8">
              <Link href="/" className="flex items-center gap-1.5 group">
                <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#0D0D0F] font-sans">
                  Veritas
                </span>
                <span className="text-xs font-semibold text-[#6E7280] self-end mb-1">
                  News
                </span>
                <span className="w-2 h-2 rounded-full bg-[#B42318] self-end mb-1.5 ml-0.5"></span>
              </Link>

              <nav className="hidden md:flex items-center gap-6 text-[14px] font-semibold">
                <button
                  onClick={() => setActiveNav("Home")}
                  className={`transition-colors pb-0.5 ${
                    activeNav === "Home"
                      ? "text-[#0D0D0F] border-b-2 border-[#0D0D0F]"
                      : "text-[#6E7280] hover:text-[#0D0D0F]"
                  }`}
                >
                  Home
                </button>

                <button
                  onClick={() => setActiveNav("For You")}
                  className={`flex items-center gap-0.5 transition-colors pb-0.5 ${
                    activeNav === "For You"
                      ? "text-[#0D0D0F] border-b-2 border-[#0D0D0F]"
                      : "text-[#6E7280] hover:text-[#0D0D0F]"
                  }`}
                >
                  For You
                  <span className="text-[#B42318] font-bold text-[11px]">*</span>
                </button>

                <button
                  onClick={() => setActiveNav("Local")}
                  className={`transition-colors pb-0.5 ${
                    activeNav === "Local"
                      ? "text-[#0D0D0F] border-b-2 border-[#0D0D0F]"
                      : "text-[#6E7280] hover:text-[#0D0D0F]"
                  }`}
                >
                  Local
                </button>

                <button
                  onClick={() => setActiveNav("Blindspot")}
                  className={`transition-colors pb-0.5 ${
                    activeNav === "Blindspot"
                      ? "text-[#0D0D0F] border-b-2 border-[#0D0D0F]"
                      : "text-[#6E7280] hover:text-[#0D0D0F]"
                  }`}
                >
                  Blindspot
                </button>
              </nav>
            </div>

            {/* Right: Subscribe & Login Action Buttons in Main Navbar */}
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                className="h-8 md:h-9 text-[12px] md:text-[13px] px-3.5 md:px-4 rounded-md font-semibold bg-[#0D0D0F] text-white hover:bg-black transition-colors"
              >
                Subscribe
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 md:h-9 text-[12px] md:text-[13px] px-3.5 md:px-4 rounded-md font-semibold border-[#E5E7EB] text-[#0D0D0F] hover:bg-slate-100 transition-colors"
              >
                Login
              </Button>
            </div>
          </div>
        </div>

        {/* Category Pills Slider Bar */}
        <div className="border-t border-[#E5E7EB] px-4 md:px-8 py-2 bg-white overflow-hidden">
          <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 flex-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F4F4F6] hover:bg-[#E5E7EB] text-[#0D0D0F] text-[12px] font-semibold rounded-lg whitespace-nowrap transition-colors flex-shrink-0"
                >
                  <span>{cat}</span>
                  <Plus className="w-3 h-3 text-[#6E7280]" />
                </button>
              ))}
            </div>

            <button
              aria-label="Scroll topics right"
              className="p-1.5 bg-[#F4F4F6] hover:bg-[#E5E7EB] rounded-lg text-[#0D0D0F] flex-shrink-0 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
