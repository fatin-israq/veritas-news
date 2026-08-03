"use client";

import React, { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import posthog from "posthog-js";
import { PostHogProvider as PostHogJSProvider } from "posthog-js/react";

const posthogKey =
  process.env.NEXT_PUBLIC_POSTHOG_KEY ||
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

if (typeof window !== "undefined" && posthogKey && !posthog.__loaded) {
  posthog.init(posthogKey, {
    // Requests go through the Next.js rewrite in next.config.ts so ad blockers
    // do not silently drop analytics traffic.
    api_host: "/ingest",
    ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.posthog.com",
    defaults: "2025-05-24",
    // Pageviews are captured manually below so App Router client navigations
    // are not missed.
    capture_pageview: false,
  });
}

/** Captures a $pageview on every App Router navigation. */
const PageviewTracker: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!posthogKey || !pathname) return;

    const query = searchParams.toString();
    posthog.capture("$pageview", {
      $current_url: `${window.location.origin}${pathname}${query ? `?${query}` : ""}`,
    });
  }, [pathname, searchParams]);

  return null;
};

/** Links captured events to the signed-in Clerk user. */
const ClerkIdentity: React.FC = () => {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (!posthogKey || !isLoaded) return;

    if (isSignedIn && userId) {
      posthog.identify(userId, {
        email: user?.primaryEmailAddress?.emailAddress,
        name: user?.fullName ?? undefined,
      });
    } else {
      posthog.reset();
    }
  }, [isLoaded, isSignedIn, userId, user]);

  return null;
};

export const PostHogProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  if (!posthogKey) {
    return <>{children}</>;
  }

  return (
    <PostHogJSProvider client={posthog}>
      <React.Suspense fallback={null}>
        <PageviewTracker />
      </React.Suspense>
      <ClerkIdentity />
      {children}
    </PostHogJSProvider>
  );
};
