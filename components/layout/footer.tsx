import React from "react";
import Link from "next/link";
import { VeritasIcon } from "@/components/ui/veritas-icon";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#0D0D0F] text-white pt-12 pb-8 px-4 md:px-8 mt-12 border-t border-black">
      <div className="max-w-[1280px] mx-auto space-y-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 justify-between">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2">
              <VeritasIcon size={32} className="w-7 h-7 md:w-8 md:h-8" />
              <div className="flex items-baseline gap-1">
                <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-sans">
                  Veritas
                </span>
                <span className="text-xs font-semibold text-neutral-400">
                  News
                </span>
              </div>
            </div>
            <p className="text-xs text-neutral-400 max-w-[240px] leading-relaxed">
              Balanced news coverage powered by AI.
            </p>
          </div>

          {/* Navigation Links Columns */}
          <div className="md:col-span-7 grid grid-cols-3 gap-6">
            {/* Company Column */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                Company
              </h4>
              <ul className="space-y-2 text-xs text-neutral-400 font-medium">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Press
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Help Column */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                Help
              </h4>
              <ul className="space-y-2 text-xs text-neutral-400 font-medium">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect Column */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                Connect
              </h4>
              <div className="flex items-center gap-3 text-neutral-400">
                {/* X / Twitter Icon */}
                <Link
                  href="#"
                  className="hover:text-white transition-colors font-extrabold text-sm"
                  aria-label="X (Twitter)"
                >
                  X
                </Link>

                {/* LinkedIn Icon */}
                <Link
                  href="#"
                  className="hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg
                    className="w-4 h-4 fill-current"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                </Link>

                {/* YouTube Icon */}
                <Link
                  href="#"
                  className="hover:text-white transition-colors"
                  aria-label="YouTube"
                >
                  <svg
                    className="w-4 h-4 fill-current"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </Link>

                {/* Play Store / Media Icon */}
                <Link
                  href="#"
                  className="hover:text-white transition-colors"
                  aria-label="Play Store"
                >
                  <svg
                    className="w-4 h-4 fill-current"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M3 22v-20l18 10-18 10z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Line */}
        <div className="pt-6 border-t border-neutral-800 text-[11px] text-neutral-500 font-medium">
          © 2026 Veritas News. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
