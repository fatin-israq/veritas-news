# Implementation Prompt: App Design System (NewsLens)

## Goal
Implement the core design system for **NewsLens** based on the provided UI reference sheet. This includes setting up design tokens (colors, typography, spacing scale, border radii, shadows), integration of the `Poppins` Google font via `next/font/google`, creation of core UI components (`Button`, `Chip`, `BiasMeter`, `NewsCard`), and presenting a design system spec showcase on the home page (`app/page.tsx`).

---

## Skills Read
- `AGENTS.md` (Project instructions, design system requirements, prompt creation rules)
- `node_modules/next/dist/docs/` (Next.js font optimization with `next/font/google`, layout guidelines, CSS module / Tailwind CSS v4 patterns)

---

## Existing Code Inspected
- `app/globals.css` — `@import "tailwindcss";` base setup and CSS variables.
- `app/layout.tsx` — Root layout font imports (`Geist`) and html/body wrapper.
- `app/page.tsx` — Basic placeholder page.
- `package.json` — Next.js 16.2, React 19, Tailwind CSS v4 setup.

---

## Decisions or Assumptions
- **Font**: Use Google Font `Poppins` (weights 400, 500, 600, 700) set as `--font-poppins` in `app/layout.tsx` to match the exact typeface in the reference image.
- **Tailwind CSS v4 Integration**: Extend `@theme inline` in `app/globals.css` with exact color hexes, typography sizes, spacing, shadows, and radii tokens:
  - **Colors**:
    - Primary Text: `#0D0D0F`
    - Secondary Text: `#6E7280`
    - Surface: `#F8F8F6`
    - Semantic Left Bias: `#B42318`
    - Semantic Center: `#E5E7EB`
    - Semantic Right Bias: `#1D4ED8`
    - Neutral BG Primary: `#FFFFFF`
    - Neutral BG Secondary: `#F0F0FD` / `#F4F4F6`
    - Border / Divider: `#E5E7EB`
  - **Border Radius**: Small (`4px`), Medium (`8px`), Large (`12px`), Full (`9999px`).
  - **Shadows**:
    - Small: `0px 1px 2px rgba(0, 0, 0, 0.05)`
    - Medium: `0px 4px 12px rgba(0, 0, 0, 0.08)`
    - Large: `0px 12px 24px rgba(0, 0, 0, 0.12)`
  - **Spacing**: 4px base scale (4px, 8px, 16px, 24px, 32px, 40px, 64px).
- **Component Architecture**:
  - `components/ui/button.tsx`: Reusable button supporting Primary, Secondary, Outline, Text variants and Default, Hover, Disabled states.
  - `components/ui/chip.tsx`: Pill category chip (`rounded-full`) supporting label and active/plus icon states.
  - `components/ui/bias-meter.tsx`: Multi-segment horizontal bar depicting Left %, Center %, Right % with styled labels.
  - `components/ui/news-card.tsx`: News card component rendering image, category/tag meta, news title, excerpt body, bias meter, and footer meta (time ago, read duration).

---

## Visual Interpretation & Design System Spec
- **Brand & Theme**: Clean, high-contrast, modern media aesthetic with dark headers (`#0D0D0F`), light background surfaces (`#F8F8F6`), and high-clarity sans-serif typography (`Poppins`).
- **Typography Scale**:
  - **H1** (Page Title): 32px / Bold (700) / line-height 1.2
  - **H2** (Section Title): 24px / SemiBold (600) / line-height 1.3
  - **H3** (Card Title): 20px / SemiBold (600) / line-height 1.3
  - **H4** (Subheading): 16px / Medium (500) / line-height 1.4
  - **Body Large**: 16px / Regular (400) / line-height 1.6
  - **Body Medium**: 14px / Regular (400) / line-height 1.6
  - **Body Small**: 13px / Regular (400) / line-height 1.6
  - **Caption**: 11px / Regular (400) / line-height 1.4
- **Layout & Responsiveness**: 12-column grid container (max-width 1280px) with 24px gutters/margins. Responsive display across mobile and desktop.

---

## Files Likely to Change
- [NEW] `prompts/app-design-system.md`
- [MODIFY] `app/globals.css`
- [MODIFY] `app/layout.tsx`
- [MODIFY] `app/page.tsx`
- [NEW] `components/ui/button.tsx`
- [NEW] `components/ui/chip.tsx`
- [NEW] `components/ui/bias-meter.tsx`
- [NEW] `components/ui/news-card.tsx`

---

## Implementation Requirements
1. **Globals & Theme**: Update `app/globals.css` with `@theme inline` custom properties matching color tokens, shadow utilities, font variables, and border radii.
2. **Font Config**: Update `app/layout.tsx` to import `Poppins` from `next/font/google` and attach variable `--font-poppins` to the `<html>` root.
3. **UI Components**:
   - Implement `Button` with variant & size props.
   - Implement `Chip` for news categories.
   - Implement `BiasMeter` with dynamic `leftPercentage`, `centerPercentage`, `rightPercentage` calculations.
   - Implement `NewsCard` accepting news item props (title, source, image, publishedAt, readTime, leftPercentage, centerPercentage, rightPercentage).
4. **Showcase Page**: Implement a design system dashboard layout on `app/page.tsx` showing the Brand block, Typography scale, Color palettes, Spacing & Grid system, Shadows, Radius options, Buttons matrix, Category chips, Bias meter, and News Card preview matching the reference UI.

---

## Security Requirements
- Client-side design system assets only; no API secret exposures or mutations.

---

## Acceptance Criteria
- [ ] `Poppins` font loaded properly and active across text elements.
- [ ] Color swatches in design system match `#0D0D0F`, `#6E7280`, `#F8F8F6`, `#B42318`, `#E5E7EB`, `#1D4ED8`.
- [ ] Reusable UI components (`Button`, `Chip`, `BiasMeter`, `NewsCard`) render properly without TypeScript or runtime errors.
- [ ] `app/page.tsx` visually mirrors the Skew News reference design system specification sheet.

---

## Checks to Run
- `npm run typecheck`
- `npm run lint`

---

## Exact Manual Test Steps Expected After Implementation
1. Ensure Next.js dev server is running (`npm run dev`).
2. Open `http://localhost:3000` in the browser.
3. Verify typography rendering in Poppins font.
4. Verify Button variants, hover states, disabled states, and category chips.
5. Verify Bias Meter rendering Left 25%, Center 50%, Right 25% bars accurately.
6. Verify News Card preview card rendering article image, tags, headline, summary, bias meter, and meta badges.
