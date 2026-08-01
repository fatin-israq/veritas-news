import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "NewsLens — Balanced news coverage, powered by AI",
  description: "NewsLens collects real news articles, analyzes sentiment and political framing with AI, and displays reader-friendly insights.",
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
        {children}
      </body>
    </html>
  );
}
