import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Reverse proxy for PostHog so analytics requests are first-party and are not
  // dropped by ad blockers.
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  // Required so PostHog API requests with a trailing slash are not redirected.
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
