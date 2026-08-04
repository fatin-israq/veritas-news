"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Globe,
  ChevronRight,
  Plus,
} from "lucide-react";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { VeritasIcon } from "@/components/ui/veritas-icon";
import { useTheme } from "@/components/theme-provider";

export const Header: React.FC = () => {
  const { theme, setTheme, mounted } = useTheme();
  const currentTheme = mounted ? theme : "light";
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
      <div className="bg-[#F4F4F6] dark:bg-[#121215] text-[#6E7280] dark:text-[#A1A1AA] text-[12px] px-4 md:px-8 py-2 border-b border-[#E5E7EB] dark:border-[#27272A] transition-colors duration-200">
        <div className="max-w-[1280px] mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left Utilities */}
          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="hover:text-[#0D0D0F] dark:hover:text-[#F4F4F5] transition-colors font-medium"
            >
              Browser Extension
            </Link>

            {/* Theme Selector */}
            <div className="flex items-center gap-1 bg-[#E5E7EB]/60 dark:bg-[#27272A]/80 p-0.5 rounded-md text-[11px] transition-colors">
              <span className="px-1.5 font-medium text-[#6E7280] dark:text-[#A1A1AA]">Theme:</span>
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`px-2 py-0.5 rounded font-medium transition-colors cursor-pointer ${
                  currentTheme === "light"
                    ? "bg-white dark:bg-[#18181B] text-[#0D0D0F] dark:text-[#F4F4F5] shadow-2xs"
                    : "text-[#6E7280] dark:text-[#A1A1AA] hover:text-[#0D0D0F] dark:hover:text-[#F4F4F5]"
                }`}
              >
                Light
              </button>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`px-2 py-0.5 rounded font-medium transition-colors cursor-pointer ${
                  currentTheme === "dark"
                    ? "bg-white dark:bg-[#18181B] text-[#0D0D0F] dark:text-[#F4F4F5] shadow-2xs"
                    : "text-[#6E7280] dark:text-[#A1A1AA] hover:text-[#0D0D0F] dark:hover:text-[#F4F4F5]"
                }`}
              >
                Dark
              </button>
              <button
                type="button"
                onClick={() => setTheme("system")}
                className={`px-2 py-0.5 rounded font-medium transition-colors cursor-pointer ${
                  currentTheme === "system"
                    ? "bg-white dark:bg-[#18181B] text-[#0D0D0F] dark:text-[#F4F4F5] shadow-2xs"
                    : "text-[#6E7280] dark:text-[#A1A1AA] hover:text-[#0D0D0F] dark:hover:text-[#F4F4F5]"
                }`}
              >
                Auto
              </button>
            </div>


          </div>

          {/* Right Utilities */}
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-medium text-[#0D0D0F] dark:text-[#F4F4F5]">
              Monday, June 1, 2026
            </span>

            <button className="flex items-center gap-1 hover:text-[#0D0D0F] dark:hover:text-[#F4F4F5] transition-colors font-medium">
              <MapPin className="w-3.5 h-3.5" />
              <span>Set Location</span>
            </button>

            <button className="flex items-center gap-1 hover:text-[#0D0D0F] dark:hover:text-[#F4F4F5] transition-colors font-medium">
              <Globe className="w-3.5 h-3.5" />
              <span>International Edition</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Header Navigation */}
      <header className="sticky top-0 z-50 w-full bg-white dark:bg-[#09090B] border-b border-[#E5E7EB] dark:border-[#27272A] shadow-xs transition-colors duration-200">
        {/* Main Navigation Bar */}
        <div className="px-4 md:px-8 py-3 bg-white dark:bg-[#09090B] transition-colors duration-200">
          <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-4">
            {/* Left: Logo & Navigation Links */}
            <div className="flex items-center gap-6 md:gap-8">
              <Link href="/" className="flex items-center gap-2 group">
                <VeritasIcon size={32} className="w-7 h-7 md:w-8 md:h-8 transition-transform group-hover:scale-105" />
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#0D0D0F] dark:text-[#F4F4F5] font-sans">
                    Veritas
                  </span>
                  <span className="text-xs font-semibold text-[#6E7280] dark:text-[#A1A1AA]">
                    News
                  </span>
                </div>
              </Link>

              <nav className="hidden md:flex items-center gap-6 text-[14px] font-semibold">
                <button
                  onClick={() => setActiveNav("Home")}
                  data-attr="nav-home"
                  className={`transition-colors pb-0.5 ${
                    activeNav === "Home"
                      ? "text-[#0D0D0F] dark:text-[#F4F4F5] border-b-2 border-[#0D0D0F] dark:border-[#F4F4F5]"
                      : "text-[#6E7280] dark:text-[#A1A1AA] hover:text-[#0D0D0F] dark:hover:text-[#F4F4F5]"
                  }`}
                >
                  Home
                </button>

                <button
                  onClick={() => setActiveNav("For You")}
                  data-attr="nav-for-you"
                  className={`flex items-center gap-0.5 transition-colors pb-0.5 ${
                    activeNav === "For You"
                      ? "text-[#0D0D0F] dark:text-[#F4F4F5] border-b-2 border-[#0D0D0F] dark:border-[#F4F4F5]"
                      : "text-[#6E7280] dark:text-[#A1A1AA] hover:text-[#0D0D0F] dark:hover:text-[#F4F4F5]"
                  }`}
                >
                  For You
                  <span className="text-[#B42318] dark:text-[#EF4444] font-bold text-[11px]">*</span>
                </button>

                <button
                  onClick={() => setActiveNav("Local")}
                  data-attr="nav-local"
                  className={`transition-colors pb-0.5 ${
                    activeNav === "Local"
                      ? "text-[#0D0D0F] dark:text-[#F4F4F5] border-b-2 border-[#0D0D0F] dark:border-[#F4F4F5]"
                      : "text-[#6E7280] dark:text-[#A1A1AA] hover:text-[#0D0D0F] dark:hover:text-[#F4F4F5]"
                  }`}
                >
                  Local
                </button>

                <button
                  onClick={() => setActiveNav("Blindspot")}
                  data-attr="nav-blindspot"
                  className={`transition-colors pb-0.5 ${
                    activeNav === "Blindspot"
                      ? "text-[#0D0D0F] dark:text-[#F4F4F5] border-b-2 border-[#0D0D0F] dark:border-[#F4F4F5]"
                      : "text-[#6E7280] dark:text-[#A1A1AA] hover:text-[#0D0D0F] dark:hover:text-[#F4F4F5]"
                  }`}
                >
                  Blindspot
                </button>
              </nav>
            </div>

            {/* Right: Subscribe & Login/User Account Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                data-attr="header-subscribe"
                className="h-8 md:h-9 text-[12px] md:text-[13px] px-3.5 md:px-4 rounded-md font-semibold bg-[#0D0D0F] dark:bg-[#F4F4F5] text-white dark:text-[#0D0D0F] hover:bg-black dark:hover:bg-white transition-colors"
              >
                Subscribe
              </Button>
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <Button
                    variant="outline"
                    size="sm"
                    data-attr="header-login"
                    className="h-8 md:h-9 text-[12px] md:text-[13px] px-3.5 md:px-4 rounded-md font-semibold border-[#E5E7EB] dark:border-[#27272A] text-[#0D0D0F] dark:text-[#F4F4F5] hover:bg-slate-100 dark:hover:bg-[#27272A] transition-colors"
                  >
                    Login
                  </Button>
                </SignInButton>
              </Show>
              <Show when="signed-in">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8 rounded-full ring-2 ring-[#0D0D0F]/10 dark:ring-white/20",
                    },
                  }}
                />
              </Show>
            </div>
          </div>
        </div>

        {/* Category Pills Slider Bar */}
        <div className="border-t border-[#E5E7EB] dark:border-[#27272A] px-4 md:px-8 py-2 bg-white dark:bg-[#09090B] overflow-hidden transition-colors duration-200">
          <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 flex-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  data-attr="category-pill"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F4F4F6] dark:bg-[#18181B] hover:bg-[#E5E7EB] dark:hover:bg-[#27272A] text-[#0D0D0F] dark:text-[#F4F4F5] text-[12px] font-semibold rounded-lg whitespace-nowrap transition-colors flex-shrink-0"
                >
                  <span>{cat}</span>
                  <Plus className="w-3 h-3 text-[#6E7280] dark:text-[#A1A1AA]" />
                </button>
              ))}
            </div>

            <button
              aria-label="Scroll topics right"
              className="p-1.5 bg-[#F4F4F6] dark:bg-[#18181B] hover:bg-[#E5E7EB] dark:hover:bg-[#27272A] rounded-lg text-[#0D0D0F] dark:text-[#F4F4F5] flex-shrink-0 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

