# Implementation Prompt: Comprehensive README.md for Veritas News

## Goal
Create a comprehensive, visually appealing, concise, and well-structured `README.md` for the Veritas News codebase following the `/create-readme` skill guidelines and `AGENTS.md` project rules.

## Skills Read
- `.agents/skills/create-readme` (read from `/Users/israq/.gemini/config/skills/create-readme/SKILL.md`)
- `.agents/skills/ai-sdk`
- `.agents/skills/supabase`
- `.agents/skills/oxylabs-web-scraper`
- `.agents/skills/clerk`

## Existing Code Inspected
- `AGENTS.md`
- `package.json`
- `.env.example`
- `app/` (page.tsx, news/[id]/page.tsx, api routes)
- `lib/` (ai/, scraping/, supabase/)
- `supabase/schema.sql`
- `public/screenshots/homepage-preview.jpg`
- `public/screenshots/article-detail-preview.jpg`

## Decisions or Assumptions
- Use GFM (GitHub Flavored Markdown) and GitHub admonitions (`> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`).
- Include Shields.io tech stack badge icons at the top of the header.
- Completely remove emojis from all headings and content in `README.md`.
- Include high-quality UI preview screenshots in the interface showcase section.
- Focus on clear architecture, feature highlights, environment configuration, setup instructions, database schema summary, and API endpoint documentation.
- Exclude sections like LICENSE, CONTRIBUTING, CHANGELOG per `create-readme` skill rules.

## Files Likely to Change
- `README.md`

## Implementation Requirements
1. **Header & Badges**: Project title, tagline, Shields.io tech stack badge icons (Next.js, TypeScript, Supabase, Tailwind CSS, Vercel AI SDK, Google Gemini, Clerk, PostHog).
2. **Interface Showcase / Screenshots**:
   - Embed UI preview screenshots displaying the news dashboard and full AI article analysis view.
3. **Key Features**:
   - Automated & Manual Web Scraping via Oxylabs API & Oxylabs Scheduler.
   - AI Analysis Engine with Google Gemini & Vercel AI SDK (sentiment scoring, political framing estimation, loaded terms detection, neutral summaries).
   - Vector Similarity Search via Supabase `pgvector` for related article discovery.
   - Reader-Friendly UI with sentiment indicators, political spectrum breakdown, and article details.
   - Admin & Cron Security via header secret (`x_veritas_admin_secret`) and Vercel `CRON_SECRET`.
4. **Architecture Overview**: Brief breakdown of layers (UI, API Routes, Scraping Engine, AI Processing, Supabase Persistence & Vector Storage).
5. **Getting Started & Environment Setup**:
   - Prerequisites (Node.js 20+, Supabase project, Clerk account, Oxylabs credentials, Gemini API key).
   - Environment variables setup based on `.env.example`.
   - Local installation & dev server start (`npm install`, `npm run dev`).
6. **Database Schema & Migrations**: Overview of core tables (`sources`, `articles`, `article_analyses`, `logs`, `oxylabs_schedules`, `oxylabs_schedule_runs`) and vector similarity search setup (`supabase/schema.sql`).
7. **API Endpoints**:
   - `POST /api/scrape` - Trigger manual web scraping.
   - `POST /api/analyze` - Trigger AI analysis on pending articles.
   - `GET/POST /api/oxylabs/schedules` & `/api/oxylabs/scheduled-results/process` - Schedule & job processing.
   - `GET /api/cron/pipeline` - Vercel Cron pipeline integration.
   - `GET /api/sources`, `GET /api/logs` - Source listing and execution audit logs.
8. **Admonitions**: Use GitHub admonition callouts (`> [!NOTE]`, `> [!IMPORTANT]`, `> [!TIP]`) for key architectural boundaries, administrative security headers, and AI estimation disclaimers.

## Security Requirements
- Document that mutation API routes require `x_veritas_admin_secret` header.
- Remind users never to expose `SUPABASE_SERVICE_ROLE_KEY`, `VERITAS_ADMIN_SECRET`, or `CRON_SECRET` in client-side code.

## Acceptance Criteria
- `README.md` contains zero emojis.
- Tech stack badge icons are rendered at the top of the header.
- UI screenshots are embedded and rendered properly.
- Formatting uses valid GFM and clean layout.
- All core features, tech stack, configuration, and API routes are accurately described matching `AGENTS.md` and actual codebase implementation.

## Checks to Run
- `npm run typecheck`
- `npm run lint`

## Exact Manual Test Steps Expected After Implementation
1. Inspect `README.md` in markdown viewer/editor to verify rendering, layout, links, embedded screenshots, and code block formatting.
2. Verify all setup steps in `README.md` match actual project environment variables in `.env.example`.

