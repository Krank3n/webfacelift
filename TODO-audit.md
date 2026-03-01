# WebFacelift Audit TODO

## Critical (High Impact, Do First)

- [x] **1. Add Google Analytics (GA4)**
  - Add gtag.js with ID `G-9CDYBR0C1C`
  - Track key conversion events: `url_submitted`, `generation_completed`, `payment_initiated`, `project_saved`

- [x] **2. Add Privacy Policy & Terms of Service**
  - Create `/privacy` route
  - Create `/terms` route
  - Disclose third-party data processing (Claude, Gemini, Firecrawl, Stripe, Supabase)
  - Add footer links to both pages

- [x] **3. Add Social Proof to Landing Page**
  - Testimonials section with real/placeholder quotes
  - "Trusted by" logo bar
  - Usage stats counter ("X sites redesigned")
  - Before/after showcase gallery

- [x] **4. SEO Foundation**
  - Create `sitemap.ts`
  - Create `robots.ts`
  - Add OG/Twitter meta tags to layout
  - Add per-page metadata
  - Add `SoftwareApplication` JSON-LD schema

## High Priority (Strong ROI)

- [x] **5. Onboarding Flow**
  - First-run experience / feature tour
  - Sample project or "try this demo URL" prompt
  - Empty state improvements on dashboard

- [x] **6. Toast Notification System**
  - Install `sonner`
  - Add toasts for: saves, uploads, errors, copy-to-clipboard, chat responses

- [x] **7. Fix ContactCTA Form**
  - Wire to API endpoint or mailto fallback
  - Add form validation and error messages

- [x] **8. Undo/Redo System**
  - Blueprint history stack in Zustand
  - "Revert to last version" button
  - Cmd+Z / Cmd+Y shortcuts

- [x] **9. Error Recovery**
  - Retry button on generation failure
  - Human-friendly error messages
  - Custom 404/500 pages

## Medium Priority (Polish & Conversion)

- [x] **10. Improve Pricing Page**
  - Add FAQ section
  - Add social proof / testimonials
  - Add money-back guarantee messaging
  - Value comparison ("what can $25 get me?")

- [x] **11. Email Lead Capture**
  - Newsletter signup on homepage
  - Welcome email sequence
  - Abandoned cart recovery emails

- [x] **12. Fix Image Optimization**
  - Remove `unoptimized` flag from `<Image>` components
  - Add `priority` to hero images
  - Use `loading="lazy"` for below-fold images

- [x] **13. Add `prefers-reduced-motion` Support**
  - Wrap animations in media query in `globals.css`
  - Disable ScrollReveal for users who prefer reduced motion

- [x] **14. Modal Accessibility**
  - Add `role="dialog"`, `aria-modal="true"`
  - Add focus trap
  - Focus restoration on close
  - Scroll lock on background

- [x] **15. Keyboard Shortcuts**
  - Cmd+S to save
  - Cmd+Z / Cmd+Y undo/redo
  - Cmd+K command palette
  - `?` for shortcut help modal

## Lower Priority (Nice-to-Have)

- [ ] **16. Skeleton loaders** — Replace spinners with content-shaped placeholders
- [ ] **17. Block drag-to-reorder** — Visual section reordering
- [ ] **18. Confirmation dialogs** — "Are you sure?" for destructive actions
- [ ] **19. Dashboard search/filter** — Search projects as list grows
- [ ] **20. Error boundaries** — Prevent single component crash from taking down page
- [ ] **21. Email/password auth** — Don't limit to Google-only
- [ ] **22. Referral program** — "Invite a friend" mechanism
- [ ] **23. Blog/content marketing** — Organic search content
