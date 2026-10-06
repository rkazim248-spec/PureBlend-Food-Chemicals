# Frontend Architecture

> Technology is TEAM DECISION / TO BE DECIDED. This document defines structure and strategy independent of framework; once a stack is approved, record it here.

## Application Structure
- Public site (visitors)
- Admin dashboard (authenticated admins)
- Shared design system + UI primitives
- Chatbot widget (public)

## Routing Strategy
- Public routes: `/`, `/about`, `/products`, `/products/[slug]`, `/offers`, `/faqs`, `/contact`, `/privacy-policy`, `/terms-and-conditions`, `/404`
- Admin routes: `/admin/login`, `/admin`, `/admin/products`, `/admin/banners`, `/admin/offers`, `/admin/faqs`, `/admin/content`, `/admin/seo`, `/admin/settings` (TDD)
- Admin guard: client-side route protection plus backend enforcement (backend is the real boundary)

## Shared Layouts
- PublicLayout: Header, nav, footer, chatbot launcher
- AdminLayout: Sidebar, topbar, content area
- AuthLayout: minimal layout for login

## Component Architecture
- `ui/` primitives (Button, Input, etc.) from design system
- `shared/` cross-feature components
- `features/<domain>/` feature components (products, offers, faqs, chat, contact, admin-*)
- Pages compose features; pages own data-fetching state

## Data-Fetching Strategy
- Server-rendered where SEO matters (public pages) â€” TDD based on stack
- Client-side fetch for admin tables and chat
- All requests through a single API client module with typed contracts

## Loading / Empty / Error States
- Loading: skeletons (content pages), spinners (actions)
- Empty: friendly illustration/message + next action
- Error: message + retry; never leak internals

## Form Handling & Validation
- Client-side validation for UX; backend validation is authoritative
- Disable submit while pending; show field-level errors from server

## API Integration Strategy
- One typed client; base URL from env; no hard-coded endpoints in components
- Standard error shape from `05-backend-integration/error-response-standard.md`

## Responsive Strategy
- Mobile-first; breakpoints defined in design-system
- Test matrix in `10-testing/responsive-test-matrix.md`

## Accessibility Strategy
- Semantic HTML, labels, focus management, contrast, reduced motion
- Checklist in `09-seo-performance/accessibility-checklist.md`

## SEO Strategy
- Titles/meta per page, slugs, OG tags, heading order, alt text
- Managed per-entity via admin SEO controls

## Implementation Notes — Phase 1 (actual decisions)

- Framework: **Next.js 16 (App Router) + TypeScript + Tailwind CSS v4** — this resolves the technology "TEAM DECISION / TO BE DECIDED" in this document. Package manager: npm. App lives in `pureblend-web/`.
- Tailwind v4 CSS-first tokens in `src/app/globals.css` (`@theme`): brand, accent, neutral, semantic colors, radius (sm/md/lg/pill), shadows (card/raised/modal), motion tokens, breakpoints mapped to strategy (sm=640, md=1024, lg=1280, xl=1536).
- Implemented all public routes + 404 + admin shell routes (see `src/app`); all admin module pages are `AdminModuleShell` placeholders with honest empty states (no fake CRUD).
- API boundary: `src/lib/api/client.ts` (`apiRequest`), `types.ts`, `endpoints.ts`. No components call fetch directly. Endpoints beyond the contract are not invented; services are TODO until backend finalizes.
- State: local component state only (chat messages, form, mobile nav). No global store introduced — matches strategy doc.
- Chat is UI-only calling `POST /api/chat`; no keys in client.
- Fixtures in `src/data/dev-fixtures.ts` are clearly marked dev-only; production pages will consume services later.
- SEO: `src/lib/metadata.ts` `pageMetadata()` helper per page; dynamic product metadata via `generateMetadata` (now from fixtures; TODO switch to API).
- A11y: skip link, semantic landmarks, modal focus handling, accordion aria, focus-visible styles, reduced-motion CSS, honeypot input.
- Build/typecheck/eslint pass; routes smoke-tested (all 200 except unknown product slug and unknown URL ? 404).
- Sensitive items never client-side: `NEXT_PUBLIC_API_BASE_URL` + `NEXT_PUBLIC_SITE_URL` only.

Why the folder structure is slightly simpler than the original proposal: Next.js App Router colocates routes under `src/app`, and components/types/lib follow the documented separation (`components/ui|layout|marketing|chat|admin|forms`, `lib/api`, `data`) without an additional `features/` layer — to be reintroduced if feature complexity warrants it.

## Implementation Notes â€” Phase 2 (actual decisions)

- Project migrated from `pureblend-web/` into the repository root â€” the repo root is now the active project.
- Homepage assembled from documented sections only: Hero, About intro, Why PureBlend, Product showcase, Offers, AI assistant CTA, Contact CTA. No invented certifications/partners/statistics.
- Products listing: `ProductsBrowser` client component adds search + category filter over props-injected data (fixtures now; API later). Empty/no-match/error states implemented.
- Product detail: breadcrumb, gallery slot (aspect-ratio, lazy/eager image component), specifications `<dl>`, "Request specifications" CTA, related products by category, `generateMetadata` uses product SEO fields when present.
- Offers page: `OfferSection`/`OfferCard` with validity date display and empty state. No fake discount math.
- FAQs: accessible accordion (aria-expanded/controls/region, keyboard operable) with loading/empty/error patterns ready at the page level.
- Contact: validated form (name/email/subject/message + hidden honeypot), per-field errors, submit-disable, success/error feedback; posts to `POST /api/contact` â€” SMTP wiring deferred to backend phase.
- Privacy/Terms: readable long-form layout with clear placeholder copy marked for CMS replacement.
- Footer: config-driven social links (`config.socials`) â€” rendered only when real URLs are provided, per organizer rule about working social links.
- 404 page implemented and verified for unknown routes and unknown product slugs.
- SEO applied to every public page via `pageMetadata()` (title, description, canonical, Open Graph).
- Image strategy: `next/image`, aspect-ratio containers, object-cover, explicit sizes, priority only for hero, dev SVG placeholder asset.
- Responsive QA performed by code review + build; visual device testing still needs a human pass at 320pxâ€“1920px.
- All Phase 2 routes verified on the production server: pages return 200, unknown product and unknown URL return the custom 404.
- `tsc --noEmit` = 0, eslint clean, `next build` succeeds from the repository root.

