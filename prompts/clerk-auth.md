# Implementation Prompt: Clerk Authentication with Protected News Details

## Goal
Implement Clerk authentication for **Veritas News** using `@clerk/nextjs`. Integrate auth state, root provider, middleware/proxy with protected route matching for `/news/[id]`, sign-in/sign-up pages, and user button into the sticky header navigation matching the app design system.

---

## Skills Read
- `.agents/skills/clerk/SKILL.md` (Clerk skills router & version detection)
- `.agents/skills/clerk-setup/SKILL.md` (Quickstart, provider placement inside `<body>`, env configuration)
- `.agents/skills/clerk-nextjs-patterns/SKILL.md` (Next.js 16 Server vs Client auth, `await auth()`, `auth.protect()`, `proxy.ts`, `clerkMiddleware`, `createRouteMatcher`)

---

## Existing Code Inspected
- `package.json`: Next.js `16.2.12`, React `19.2.4` (Clerk SDK `@clerk/nextjs` to be installed).
- `.env.local`: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are present.
- `app/layout.tsx`: Root layout with Poppins font and global styling.
- `components/layout/header.tsx`: Sticky Header component with static "Login" button.
- `app/news/[id]/page.tsx`: Detailed news article page displaying full analysis, sentiment, framing, and related stories.
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`: Next.js 16 file convention replacing `middleware.ts` with `proxy.ts`.

---

## Decisions & Assumptions
1. **Protected News Details Page**: As requested, clicking a news card to view the detailed page (`/news/[id]`) requires sign-in. Unauthenticated users attempting to access `/news/[id]` will be redirected to the sign-in flow (with redirect URL preserved).
2. **Public Home Page**: The home page (`/`) remains public so visitors can browse news cards, preview sentiment & framing indicators, and discover content.
3. **Next.js 16 File Convention**: Use `proxy.ts` (and `middleware.ts` compatibility wrapper) using `clerkMiddleware` and `createRouteMatcher(['/news/(.*)'])`.
4. **Provider Placement**: `<ClerkProvider>` wraps `{children}` inside `<body>` in `app/layout.tsx`.
5. **Header Integration**:
   - Unauthenticated state: Render "Login" button triggering Clerk sign-in.
   - Authenticated state: Render Clerk `<UserButton />` with user avatar, profile management, and logout options.
6. **Dedicated Sign-In / Sign-Up Pages**:
   - `app/sign-in/[[...sign-in]]/page.tsx`
   - `app/sign-up/[[...sign-up]]/page.tsx`
   - Configured via environment variables `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in` and `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`.

---

## Files Likely to Change / Be Created
- `package.json` [MODIFY] — add `@clerk/nextjs` dependency
- `.env.local` [MODIFY] — add sign-in and sign-up route URL variables
- `app/layout.tsx` [MODIFY] — wrap children with `<ClerkProvider>`
- `proxy.ts` [NEW] — export `clerkMiddleware()` with `createRouteMatcher(['/news/(.*)'])` route protection
- `middleware.ts` [NEW] — re-export proxy configuration for backward compatibility
- `components/layout/header.tsx` [MODIFY] — replace static login button with Clerk `<SignedIn>`, `<SignedOut>`, `<SignInButton>`, `<UserButton>`
- `app/news/[id]/page.tsx` [MODIFY] — add server-side `await auth.protect()` check as defense-in-depth
- `app/sign-in/[[...sign-in]]/page.tsx` [NEW] — render Clerk `<SignIn />` component centered with app layout
- `app/sign-up/[[...sign-up]]/page.tsx` [NEW] — render Clerk `<SignUp />` component centered with app layout

---

## Implementation Requirements

### 1. Package Installation
Install `@clerk/nextjs` via `npm install @clerk/nextjs`.

### 2. Environment Variables Configuration (`.env.local`)
Add:
```bash
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

### 3. Root Layout Integration (`app/layout.tsx`)
Import `ClerkProvider` from `@clerk/nextjs` and place it inside `<body>`, wrapping `{children}`:
```tsx
<body className="min-h-full flex flex-col bg-[#F8F8F6] text-[#0D0D0F]">
  <ClerkProvider>
    {children}
  </ClerkProvider>
</body>
```

### 4. Route Protection Middleware / Proxy (`proxy.ts` & `middleware.ts`)
Create `proxy.ts` in the root directory:
```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher(['/news/(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|json|webp|png|jpg|jpeg|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```
Also create `middleware.ts` re-exporting `proxy.ts` for tooling compatibility.

### 5. News Details Protection (`app/news/[id]/page.tsx`)
In `app/news/[id]/page.tsx`, invoke `await auth.protect()` at the top of the async component:
```typescript
import { auth } from '@clerk/nextjs/server';

export default async function NewsDetailsPage() {
  await auth.protect();
  // ... rest of detailed article rendering
}
```

### 6. Header Auth State (`components/layout/header.tsx`)
In the right action button container of `Header`:
- Wrap unauthenticated action in `<SignedOut>` with `<SignInButton mode="modal">`:
  ```tsx
  <SignedOut>
    <SignInButton mode="modal">
      <Button
        variant="outline"
        size="sm"
        className="h-8 md:h-9 text-[12px] md:text-[13px] px-3.5 md:px-4 rounded-md font-semibold border-[#E5E7EB] text-[#0D0D0F] hover:bg-slate-100 transition-colors"
      >
        Login
      </Button>
    </SignInButton>
  </SignedOut>
  ```
- Wrap authenticated action in `<SignedIn>`:
  ```tsx
  <SignedIn>
    <UserButton
      appearance={{
        elements: {
          avatarBox: "w-8 h-8 rounded-full ring-2 ring-[#0D0D0F]/10",
        },
      }}
    />
  </SignedIn>
  ```

### 7. Dedicated Auth Pages
- Create `app/sign-in/[[...sign-in]]/page.tsx`:
  Centrally aligned, styled card embedding `<SignIn />`.
- Create `app/sign-up/[[...sign-up]]/page.tsx`:
  Centrally aligned, styled card embedding `<SignUp />`.

---

## Visual & Design System Requirements
- Page containers for `/sign-in` and `/sign-up`:
  - Background: `#F8F8F6` matching root layout
  - Layout: Centered vertically and horizontally with full viewport height (`min-h-[calc(100vh-160px)]`)
  - Typography: Inter/Poppins, clean contrast `#0D0D0F`
  - Responsive: Full width on mobile (`px-4`), padded centered container on desktop

---

## Security Requirements
- Store publishable and secret keys in `.env.local`.
- Never expose `CLERK_SECRET_KEY` on client-side code.
- Ensure protected routes (`/news/[id]`) trigger authentication redirects before exposing article text or analysis.

---

## Acceptance Criteria
- [ ] `@clerk/nextjs` is installed and registered in `package.json`.
- [ ] `<ClerkProvider>` wraps application in `app/layout.tsx`.
- [ ] `proxy.ts` / `middleware.ts` protects `/news/[id]` routes and redirects unauthenticated users to sign in.
- [ ] `app/news/[id]/page.tsx` includes `await auth.protect()` for defense-in-depth server security.
- [ ] Sticky Header renders `<SignInButton>` when logged out and `<UserButton>` when logged in.
- [ ] Modal sign-in or `/sign-in` page opens properly.
- [ ] `npm run build` / `npm run typecheck` passes cleanly without TypeScript or lint errors.

---

## Checks to Run
- `npm run typecheck`
- `npm run build`

---

## Manual Test Steps Expected After Implementation
1. Run `npm run dev` and open `http://localhost:3000`.
2. As an unauthenticated visitor, navigate on the home page and click a news card (e.g. `/news/1`).
3. Verify that you are immediately redirected to the sign-in page / modal before seeing the article contents.
4. Complete sign-in: verify you are redirected back to the detailed article page `/news/1`.
5. Verify `<UserButton />` displays in the header when logged in.
6. Click `<UserButton />` and sign out: attempt to visit `/news/1` again, verifying access is blocked and prompts for sign-in.
