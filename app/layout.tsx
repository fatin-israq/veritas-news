import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { PostHogProvider } from "@/components/analytics/posthog-provider";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Veritas News — Balanced news coverage, powered by AI",
  description: "Veritas News collects real news articles, analyzes sentiment and political framing with AI, and displays reader-friendly insights.",
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
    >
      <body className="min-h-full flex flex-col bg-[#F8F8F6] text-[#0D0D0F]">
        <ClerkProvider>
          <PostHogProvider>
            {children}
          </PostHogProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
