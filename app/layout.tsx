import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { PostHogProvider } from "@/components/analytics/posthog-provider";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Veritas News — Balanced news coverage, powered by AI",
  description: "Veritas News collects real news articles, analyzes sentiment and political framing with AI, and displays reader-friendly insights.",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full antialiased font-sans`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('veritas-theme');
                  var theme = (saved === 'light' || saved === 'dark' || saved === 'system') ? saved : 'light';
                  var isDark = false;
                  if (theme === 'dark') {
                    isDark = true;
                  } else if (theme === 'system') {
                    isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  } else {
                    isDark = false;
                  }
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#F8F8F6] dark:bg-[#09090B] text-[#0D0D0F] dark:text-[#F4F4F5] transition-colors duration-200">

        <ClerkProvider>
          <PostHogProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </PostHogProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}

