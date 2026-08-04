import React from "react";
import { SignIn } from "@clerk/nextjs";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#F8F8F6] dark:bg-[#09090B] text-[#0D0D0F] dark:text-[#F4F4F5] font-sans antialiased flex flex-col justify-between transition-colors duration-200">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto shadow-sm rounded-xl overflow-hidden",
              card: "border border-[#E5E7EB] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 shadow-sm",
            },
          }}
        />
      </main>
      <Footer />
    </div>
  );
}

