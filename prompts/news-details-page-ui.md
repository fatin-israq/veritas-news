# Implementation Prompt: NewsLens News Details Page UI

## Goal
Implement the pixel-perfect **NewsLens News Details Page UI** based on the attached UI reference image. The page features the top navigation bar, article breadcrumbs/meta headers, action bar (Save, Share), full-width main hero image with caption, inline bias distribution spectrum bar, detailed article body paragraphs, a 2-column "Related Stories" grid, an interactive right sidebar with "Bias Analysis", "AI Summary", and "Source Breakdown", a newsletter subscription banner, and the dark footer.

---

## Skills Read
- `AGENTS.md` (Project rules, UI design standards, route structure, prompt file workflow)
- `node_modules/next/dist/docs/` (Next.js App Router, dynamic routes, layout patterns)

---

## Existing Code Inspected
- `app/layout.tsx` — Global root layout with Poppins font and metadata.
- `app/page.tsx` — Homepage featuring the Top News card grid.
- `app/globals.css` — Styling tokens and theme colors.
- `components/layout/header.tsx` — Header component with utility top bar, main navbar, and category pills slider.
- `components/layout/footer.tsx` — Dark theme footer component.
- `components/ui/bias-meter.tsx` — Segmented bias spectrum visualizer component.
- `components/ui/news-card.tsx` — News article card component.
- `components/ui/button.tsx` — Standard UI button variants.

---

## Visual Interpretation & Detailed UI Specifications

### 1. Page Route & Overall Layout Structure
- **Route**: `app/news/[id]/page.tsx` (Dynamic route accessible via `/news/1` or any news article card click from homepage).
- **Layout Grid**:
  - Max container width: `max-w-[1280px] mx-auto px-4 md:px-8 py-8 w-full`.
  - Desktop: 12-column grid (`grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10`).
  - **Main Article Column** (Left 8 columns: `lg:col-span-8`).
  - **Sidebar Column** (Right 4 columns: `lg:col-span-4 space-y-6`).

### 2. Main Article Column (Left, `lg:col-span-8`)
- **Breadcrumb / Topic Tag**: `Politics · United States` in `text-xs font-semibold text-[#6E7280] uppercase tracking-wider mb-2`.
- **Headline**: `Trump Sends Iran Revised Peace Proposal With Tougher Terms: Report` in `text-2xl md:text-4xl font-extrabold text-[#0D0D0F] tracking-tight leading-tight mb-3 font-sans`.
- **Article Byline & Action Bar**:
  - Left meta: `By David Morgan` · `May 31, 2026` · `12 min read` in `text-xs md:text-sm text-[#6E7280] font-medium flex items-center gap-2 flex-wrap`.
  - Right actions: `Save` (Bookmark icon), `Share` (Share icon), `...` (More options dropdown/menu).
  - Divider line underneath (`border-b border-[#E5E7EB] pb-4 mb-6`).
- **Main Hero Image**:
  - High quality article image (`https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=1200&auto=format&fit=crop`).
  - Aspect ratio aspect-video or rounded-xl overflow-hidden shadow-xs.
  - Image Caption: `President Donald Trump in the Cabinet Room at the White House, Washington, D.C., May 30, 2026. Photo: Andrew Harnik/Getty Images` (`text-[12px] text-[#6E7280] mt-2 mb-6 italic leading-snug`).
- **Inline Bias Distribution Bar**:
  - Card box (`bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-4 mb-6`).
  - Top header: `Bias Distribution` with info `(i)` icon.
  - Segmented bar: `Left 20%` (Red `#B42318`), `Center 31%` (Silver `#E5E7EB`), `Right 49%` (Blue `#1D4ED8`).
  - Subtext: `12 sources` on bottom-left.
- **Article Paragraph Body**:
  - Clean readable article typography (`text-[16px] leading-[1.75] text-[#1F2937] space-y-5 font-normal`).
  - Includes 8 full, well-formatted news paragraphs with direct quotes, diplomacy updates, and statements from US, Iranian, European, and Israeli officials.
- **Related Stories Section**:
  - Header: `Related Stories` (`text-xl font-extrabold text-[#0D0D0F] border-t border-[#E5E7EB] pt-8 mb-6`).
  - 2-Column Grid (`grid grid-cols-1 md:grid-cols-2 gap-4`):
    - 6 compact horizontal/vertical story cards with thumbnail images, category tags, titles, date, and read time:
      1. *World · Middle East*: "Iran Says It Will Not Negotiate Under 'Maximum Pressure'" (`May 29, 2026 · 8 min read`)
      2. *Politics · United States*: "Bipartisan Group Urges Diplomacy With Iran" (`May 28, 2026 · 5 min read`)
      3. *Politics · United States*: "US Sanctions More Iranian Entities Over Nuclear Program" (`May 28, 2026 · 6 min read`)
      4. *Science · Nuclear Policy*: "What's in the 2015 Iran Nuclear Deal?" (`May 25, 2026 · 10 min read`)
      5. *World · Middle East*: "Oman Hosts Another Round of US-Iran Nuclear Talks" (`May 27, 2026 · 7 min read`)
      6. *World · Middle East*: "Israel Reaffirms Red Line Over Iranian Nuclear Program" (`May 24, 2026 · 6 min read`)

### 3. Right Intelligence Sidebar (`lg:col-span-4`)
- **Card 1: Bias Analysis**:
  - Card container: `bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-2xs`.
  - Header: `Bias Analysis` with `(i)` info icon tooltip.
  - Overall Bias badge/text: `Right 49%` (`text-2xl font-black text-[#1D4ED8] mt-1 mb-0.5`).
  - Subhead: `Based on 12 balanced sources` (`text-xs text-[#6E7280] mb-4`).
  - Percentage Breakdown Bars:
    - `Left 20%` (Red bar `#B42318`)
    - `Center 31%` (Gray bar `#E5E7EB`)
    - `Right 49%` (Blue bar `#1D4ED8`)
  - Description: `Our analysis is based on the political leaning of the publication and how the story is framed. Sources are weighted by reliability and recency.` (`text-xs text-[#6E7280] leading-relaxed mt-4 mb-4`).
  - Button: `How We Analyze Bias` (`w-full border border-[#E5E7EB] text-[#0D0D0F] hover:bg-[#F9FAFB] rounded-lg py-2 text-xs font-semibold`).

- **Card 2: AI Summary**:
  - Card container: `bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-2xs`.
  - Header: `AI Summary` with `(i)` info icon tooltip.
  - Subhead: `Generated May 31, 2026 · 3 min read` (`text-xs text-[#6E7280] mb-4`).
  - 5 concise bullet points with bullet discs detailing key takeaways of the nuclear deal proposal, inspector demands, Iran response, US/EU positions, and Israeli reaction.
  - Footer disclaimer: `AI summaries can make mistakes.` (`text-[11px] text-[#9CA3AF] mt-4 mb-3`).
  - Button: `Provide Feedback` (`w-full border border-[#E5E7EB] text-[#0D0D0F] hover:bg-[#F9FAFB] rounded-lg py-2 text-xs font-semibold`).

- **Card 3: Source Breakdown**:
  - Card container: `bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-2xs`.
  - Header: `Source Breakdown` with `(i)` info icon tooltip.
  - Subhead: `12 Total Sources` (`text-xs font-semibold text-[#0D0D0F] mb-3`).
  - Spectrum bars for sources count:
    - `Left` 2 (20%)
    - `Center` 4 (31%)
    - `Right` 6 (49%)
  - Top Sources Table (`Top Sources` header on left, `Bias` on right):
    - Fox News -> `Right` (blue)
    - The Wall Street Journal -> `Center` (gray)
    - Reuters -> `Center` (gray)
    - BBC -> `Center` (gray)
    - CNN -> `Left` (red)
    - The New York Times -> `Center` (gray)
    - The Washington Post -> `Center` (gray)
    - Newsmax -> `Right` (blue)
  - Button: `View All Sources` (`w-full border border-[#E5E7EB] text-[#0D0D0F] hover:bg-[#F9FAFB] rounded-lg py-2 text-xs font-semibold mt-4`).

### 4. Bottom Newsletter Subscription Banner
- Container: `bg-white border border-[#E5E7EB] rounded-xl p-6 md:p-8 mt-12 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xs`.
- Left content:
  - `Stay Informed. Stay Balanced.` (`text-xl font-extrabold text-[#0D0D0F]`).
  - `Get the top stories and bias analysis delivered to your inbox.` (`text-sm text-[#6E7280] mt-1`).
- Right controls:
  - Email input (`Enter your email`, border `#E5E7EB`, rounded-lg, px-4 py-2 text-sm) + `Subscribe` solid black button (`bg-[#0D0D0F] text-white px-6 py-2 rounded-lg font-semibold text-sm hover:bg-black`).

---

## Decisions & Assumptions
- We will construct `app/news/[id]/page.tsx` as a dynamic server/client Next.js route component so clicking any news card or navigating directly to `/news/1` or `/news/trump-sends-iran-revised-peace-proposal` loads the article detail page smoothly.
- Update `components/ui/news-card.tsx` so clicking on cards wraps in `<Link href={`/news/${id}`}>`.
- Use Lucide icons for `Bookmark`, `Share2`, `MoreHorizontal`, `Info`, `Sparkles`, `ChevronRight`, `Mail`.

---

## Files Likely to Change
- [NEW] `prompts/news-details-page-ui.md`
- [NEW] `app/news/[id]/page.tsx`
- [MODIFY] `components/ui/news-card.tsx`

---

## Implementation Requirements
1. Build `app/news/[id]/page.tsx` with all components specified in the visual breakdown.
2. Render Header (`Header`) at top and Footer (`Footer`) at bottom.
3. Build the 2-column layout (Left Article Column + Right Sidebar Cards).
4. Implement Article Title, Byline, Meta, Bookmark/Share action icons, and hero image with Getty Images photo caption.
5. Implement the inline `Bias Distribution` meter.
6. Render the 8 complete article text paragraphs.
7. Render the 6 "Related Stories" cards grid.
8. Render the 3 Sidebar Cards ("Bias Analysis", "AI Summary", "Source Breakdown") with exact bias meters, bullet points, source listings, and action buttons.
9. Render the bottom newsletter signup box.
10. Link homepage cards (`components/ui/news-card.tsx`) to `/news/[id]`.

---

## Security Requirements
- Client-side UI rendering only. No sensitive API credentials exposed.

---

## Acceptance Criteria
- [ ] Route `/news/1` (and all news card clicks) opens the full news detail page.
- [ ] Header and Footer render seamlessly around the page content.
- [ ] 2-column desktop layout (8-col article, 4-col sidebar) responsive on mobile.
- [ ] Headline, Byline, Save/Share icons, Hero Image, and photo caption render accurately.
- [ ] Inline Bias Distribution bar renders with red, gray, and blue segment percentages.
- [ ] Article body text renders with quotes and structured paragraphs.
- [ ] Related Stories grid displays 6 story cards with images, tags, titles, dates, and read times.
- [ ] Sidebar displays "Bias Analysis" with Right 49% badge and spectrum breakdown.
- [ ] Sidebar displays "AI Summary" with bullet points and feedback button.
- [ ] Sidebar displays "Source Breakdown" with source list (Fox News, WSJ, Reuters, BBC, CNN, NYT, WaPo, Newsmax) and bias labels.
- [ ] Bottom Newsletter subscription section renders with email input and Subscribe button.
- [ ] `npm run typecheck` and `npm run lint` pass cleanly with zero errors.

---

## Checks to Run
- `npm run typecheck`
- `npm run lint`

---

## Exact Manual Test Steps Expected After Implementation
1. Open `http://localhost:3000` in the browser.
2. Click on the first news card ("Trump Sends Iran Revised Peace Proposal With Tougher Terms: Report").
3. Verify navigation to `/news/1` (or test navigating directly to `http://localhost:3000/news/1`).
4. Verify the top header, breadcrumb (`Politics · United States`), main title, byline (`By David Morgan`), and action icons (`Save`, `Share`, `...`).
5. Verify hero image and photo caption text below the image.
6. Verify the inline `Bias Distribution` bar (Left 20%, Center 31%, Right 49%).
7. Check article body paragraphs and quotes.
8. Inspect the 6 cards in the "Related Stories" section.
9. Inspect the right sidebar cards:
   - "Bias Analysis" card (Overall Bias Right 49%, L 20%, C 31%, R 49%, button).
   - "AI Summary" card (5 bullet points, feedback button).
   - "Source Breakdown" card (12 Total Sources, breakdown bars, source list with Left/Center/Right tags, button).
10. Check the bottom Newsletter box ("Stay Informed. Stay Balanced.").
11. Check dark footer rendering at the bottom of the page.
