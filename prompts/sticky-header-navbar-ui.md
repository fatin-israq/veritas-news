# Implementation Prompt: Sticky Header & Navbar UI Refinement

## Goal
Refine the **NewsLens Header** component to relocate the "Subscribe" and "Login" action buttons into the main navigation bar. Implement a smart sticky header that stays fixed at the top of the screen during scrolling on both mobile and desktop views: hiding the top utility bar (browser extension bar) when scrolling down, and revealing it again smoothly when scrolling up.

---

## Skills Read
- `AGENTS.md` (Project workflow, prompt creation, UI guidelines)
- `node_modules/next/dist/docs/` (Client component hooks, event listener best practices in Next.js)

---

## Existing Code Inspected
- `components/layout/header.tsx` — Current Header layout containing Top Utility Bar, Main Nav Bar, and Category Pills Slider.
- `app/page.tsx` — Main page component embedding `<Header />`.
- `components/ui/button.tsx` — Button component used for Subscribe and Login buttons.

---

## Decisions or Assumptions
1. **Scroll Direction State**: Add custom client-side scroll handling in `components/layout/header.tsx` using `window.scrollY`.
   - Track `scrollDirection` (`"up"` | `"down"`) and `isScrolled` boolean (`window.scrollY > 40`).
2. **Layout Adjustment**:
   - Move `Subscribe` (primary black button) and `Login` (outline button) from the Top Utility Bar into the right side of the Main Navigation Bar so they remain visible when stuck to top.
   - On mobile screens, render a responsive action area or mobile hamburger menu / action icons for Subscribe & Login.
3. **Sticky & Collapsible Top Utility Bar**:
   - The overall header container uses `sticky top-0 z-50 bg-white transition-all duration-300 shadow-sm`.
   - When `scrollDirection === "down"` and `isScrolled`:
     - Top Utility Bar collapses (`max-h-0 opacity-0 overflow-hidden py-0 border-b-0` or `translate-y-[-100%]`).
     - Main Nav Bar + Category Pills Slider stay attached to `top-0`.
   - When `scrollDirection === "up"` or near page top (`scrollY < 10`):
     - Top Utility Bar expands back smoothly (`max-h-16 opacity-100 py-2 border-b`).

---

## Files Likely to Change
- [NEW] `prompts/sticky-header-navbar-ui.md`
- [MODIFY] `components/layout/header.tsx`

---

## Implementation Requirements
1. Move `Subscribe` and `Login` buttons into the right side of the main navigation bar in `components/layout/header.tsx`.
2. Add a `useEffect` scroll event listener in `components/layout/header.tsx` with throttled/requestAnimationFrame scroll direction calculation to prevent layout thrashing.
3. Wrap the Top Utility Bar in a animated wrapper that collapses smoothly (`transition-all duration-300 ease-in-out`) when scrolling down, and expands when scrolling up or at top of page.
4. Set the entire `<header>` element to `sticky top-0 z-50 bg-white border-b border-[#E5E7EB] shadow-xs`.
5. Ensure mobile responsiveness on small screens (< 768px).

---

## Security Requirements
- Client-side scroll UI state only; no data mutations or auth secret disclosures.

---

## Acceptance Criteria
- [ ] Subscribe and Login buttons are placed inside the main navigation bar.
- [ ] Header sticks to the top of the viewport on both mobile and desktop screens.
- [ ] Scrolling DOWN hides the top utility bar (browser extension bar) while maintaining the sticky navbar.
- [ ] Scrolling UP reveals the top utility bar again.
- [ ] Zero TypeScript or lint errors.

---

## Checks to Run
- `npm run typecheck`
- `npm run lint`

---

## Exact Manual Test Steps Expected After Implementation
1. Open `http://localhost:3000` in browser.
2. Verify Subscribe and Login buttons are inside the main navbar on the right.
3. Scroll DOWN the page: observe top utility bar collapsing while main nav stays stuck at top.
4. Scroll UP the page: observe top utility bar expanding smoothly back into view.
5. Test behavior on both mobile screen sizes (<768px) and desktop (>1024px).
