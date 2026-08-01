# Implementation Prompt: Veritas News Homepage UI

## Goal
Implement the pixel-perfect **Veritas News Homepage UI** based on the provided reference screenshot. The page will feature a top utility bar, main brand navigation header, horizontal topic filter bar, a "Top News" section with a 3-column responsive grid of news cards displaying AI bias spectrum breakdown and source counts, and a complete dark footer.

---

## Skills Read
- `AGENTS.md` (Project rules, architecture guidelines, UI design rules, prompt file conventions)
- `node_modules/next/dist/docs/` (Next.js layout, client/server components, routing)

---

## Existing Code Inspected
- `app/globals.css` — Global styles, design tokens, Poppins font integration, and custom color variables.
- `app/layout.tsx` — Root layout with font configuration (`Poppins`) and HTML structure.
- `app/page.tsx` — Current placeholder page.
- `components/ui/bias-meter.tsx` — Segmented horizontal bar component for Left, Center, Right percentages.
- `components/ui/news-card.tsx` — Reusable card component for news articles.
- `components/ui/chip.tsx` — Category pill component with icon support.
- `components/ui/button.tsx` — Primary, secondary, outline button styles.

---

## Visual Interpretation & UI Requirements

1. **Top Utility Bar**:
   - Light gray top bar (`bg-[#F4F4F6]` or `bg-[#F8F8F6]`, border-b `#E5E7EB`).
   - Left side: "Browser Extension" text link, Theme selector ("Theme: Light | Dark | Auto" with active "Light" state).
   - Right side: Date string ("Monday, June 1, 2026"), "Set Location" pin button, "International Edition" dropdown with globe icon, "Subscribe" solid black button, and "Login" outline button.

2. **Main Navigation Header**:
   - Clean white background header with subtle bottom border.
   - Left: **Veritas News** logo with modern bold serif/sans typeface and red accent dot.
   - Center navigation menu:
     - `Home` (Active tab with bottom indicator / bold font)
     - `For You` (With a red asterisk `*` badge)
     - `Local`
     - `Blindspot`

3. **Topic / Category Filter Bar**:
   - Horizontal scrolling list of category pills with `+` action icons:
     - `World Cup +`, `IPL +`, `Social Media +`, `Business & Markets +`, `Health & Medicine +`, `Soccer +`, `Artificial Intelligence +`, `Arsenal FC +`, `Extreme Weather and Disasters +`.
   - Chevron scroll indicator `>` on the right end of the container.

4. **Top News Section**:
   - Section Title: **"Top News"** (Bold 28px/32px text, dark color `#0D0D0F`).
   - **Article Card Grid**:
     - 3 columns grid on desktop (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`).
     - 12 structured news cards matching the reference image articles:
       1. *Politics · United States*: "Trump Sends Iran Revised Peace Proposal With Tougher Terms: Report" (L 20% | Center 31% | Right 49%, 12 sources)
       2. *Health · United States*: "Researchers Make Case for Grapes as a 'Superfood' After Review of Health Evidence" (L 18% | Center 42% | Right 40%, 7 sources)
       3. *Science · Switzerland*: "CERN Finds High-Significance Hint of Physics Beyond Standard Model" (L 18% | Center 62% | Right 22%, 8 sources)
       4. *World · Nicaragua*: "Indigenous Leader Brooklyn Rivera Dies in Nicaragua After Nearly 3 Years of Detention" (L 54% | Center 28% | Right 18%, 63 sources)
       5. *World · Middle East*: "UN Security Council to Hold Emergency Meeting as Israel Pushes Deeper into Lebanon" (L 22% | Center 35% | Right 43%, 15 sources)
       6. *Business · Global*: "Oil Prices Dip as OPEC+ Considers Output Increase Amid Weak Demand" (L 25% | Center 50% | Right 25%, 11 sources)
       7. *Technology · United States*: "SpaceX Launches Starship Test Flight in Milestone for Mars Program" (L 12% | Center 45% | Right 49%, 9 sources)
       8. *Business · United States*: "Apple Unveils AI-Powered Features Across iPhone, iPad and Mac" (L 15% | Center 40% | Right 45%, 10 sources)
       9. *Climate · Global*: "2025 on Track to Be Among Top 3 Hottest Years, EU Climate Service Says" (L 33% | Center 34% | Right 33%, 14 sources)
       10. *Economy · United States*: "Fed Holds Rates Steady, Signals Caution on Inflation and Growth Outlook" (L 30% | Center 45% | Right 25%, 13 sources)
       11. *Soccer · Europe*: "Real Madrid Win Champions League After Comeback Victory in Final" (L 10% | Center 20% | Right 70%, 26 sources)
       12. *Environment · Canada*: "Wildfires Force Thousands to Evacuate Across Western Canada" (L 27% | Center 33% | Right 40%, 17 sources)

5. **News Card Component Specs**:
   - Aspect ratio thumbnail with rounded corners and top-right `(i)` info icon badge.
   - Category and Location meta line (e.g. `Politics · United States`).
   - Title: Bold, 16px/18px line height, truncated or clamped cleanly.
   - Segmented Bias Meter bar (`L %`, `Center %`, `Right %`) matching red `#B42318`, neutral `#E5E7EB`, and blue `#1D4ED8` styling.
   - Bottom footer showing `X sources` count in muted gray text.

6. **Footer Section**:
   - Full-width dark background `#0D0D0F` with white/gray typography.
   - Top layout:
     - **Veritas News** brand logo, slogan "Balanced news coverage powered by AI."
     - Navigation columns:
       - **Company**: About, Careers, Press, Contact
       - **Help**: Help Center, Guides, Privacy Policy, Terms of Service
       - **Connect**: X (Twitter), LinkedIn, YouTube, Play icons
   - Bottom layout:
     - Divider line and copyright notice: `© 2026 Veritas News. All rights reserved.`

---

## Files Likely to Change
- [NEW] `prompts/homepage-ui.md`
- [MODIFY] `app/page.tsx`
- [NEW] `components/layout/header.tsx`
- [NEW] `components/layout/footer.tsx`
- [MODIFY] `components/ui/news-card.tsx`
- [MODIFY] `components/ui/bias-meter.tsx`

---

## Implementation Requirements
1. Create header (`components/layout/header.tsx`) containing the top utility bar, main branding/navigation, and horizontal category pills slider.
2. Refine `components/ui/bias-meter.tsx` to precisely match the card bias spectrum bar style in the reference screenshot (proportional width segments with explicit `L XX%`, `Center XX%`, `Right XX%` text overlays).
3. Refine `components/ui/news-card.tsx` to handle article images with top-right info badge, category-location subtitle, bold headline, bias meter, and source count badge.
4. Create footer (`components/layout/footer.tsx`) with 3 link columns, brand slogan, social media icons, and bottom copyright line.
5. Assemble `app/page.tsx` with top news grid of 12 sample articles matching the visual specification.

---

## Security Requirements
- Client UI component rendering only. No API keys or secret tokens exposed in client code.

---

## Acceptance Criteria
- [ ] Header includes top bar (theme switcher, location, date, subscribe/login) and main navbar (`Home`, `For You*`, `Local`, `Blindspot`).
- [ ] Category pills bar renders horizontally with `+` icons and scroll arrow.
- [ ] 3-column responsive grid renders 12 news cards with imagery, titles, bias meters, and source counts.
- [ ] Bias meters display exact color coding (red left, light gray center, blue right) and percentage overlays.
- [ ] Footer renders with dark theme `#0D0D0F`, brand slogan, link columns, social icons, and copyright.
- [ ] Zero TypeScript or lint errors.

---

## Checks to Run
- `npm run typecheck`
- `npm run lint`

---

## Exact Manual Test Steps Expected After Implementation
1. Open `http://localhost:3000` in the browser.
2. Verify top utility bar elements (Theme switcher, Date, Location, Subscribe/Login buttons).
3. Verify main navigation items (`Home`, `For You*`, `Local`, `Blindspot`).
4. Verify category pill scroll bar with `+` buttons.
5. Verify "Top News" section heading and the 3x4 grid of 12 news cards.
6. Verify visual presentation of `BiasMeter` components inside each news card.
7. Verify dark footer with brand info, link columns, social media links, and copyright text.
