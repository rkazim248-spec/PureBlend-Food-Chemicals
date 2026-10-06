# Design System Specification for PureBlend

> IMPORTANT: No brand colors were officially provided with the organizer statement (to be verified). Below is split into **organizer-provided** (to be confirmed) and **team-proposed** direction. The team-proposed palette must be approved before implementation.

## Organizer-Provided Brand Info
- Company name: PureBlend Food Chemicals
- Domain: food chemicals / food ingredients (as implied by client name)
- Official logo/colors: **NOT PROVIDED — TEAM DECISION / TO BE DECIDED**

## Team-Proposed Visual Direction
- Feel: professional, trustworthy, modern, premium, food-science appropriate, not generic AI template
- Mood: clean, precise, fresh, technical-yet-approachable

### Color System (proposal — TDD)
- Primary: deep green/teal (trust, freshness) — e.g. `#0F6B4F` (proposal only)
- Secondary/accent: warm amber (CTA highlight) — e.g. `#E8A33D`
- Neutrals: slate-tinted grays for text/backgrounds
- Semantic: success green, warning amber, error red, info blue
- Rule: all text/background pairs must meet WCAG AA contrast (4.5:1 body, 3:1 large text)

### Typography
- Headings: a geometric/humanist sans (e.g. Inter, Manrope — TDD)
- Body: highly legible sans
- Hierarchy: H1 → H4 scales defined per breakpoint; base 16px body

### Spacing Scale
4, 8, 12, 16, 24, 32, 48, 64px

### Border Radius
Small 6px, medium 10px, large 16px, pill 999px

### Shadows
Subtle elevation for cards/modals; no heavy shadows

### Buttons
Variants: primary, secondary, ghost, danger. States: default, hover, focus-visible, active, disabled, loading

### Inputs
Labeled, visible focus ring, error border + message, disabled style

### Cards / Tables / Badges / Modals / Toasts / Navigation
Cards: white surface, border or soft shadow, padding 16–24. Tables: striped or bordered rows, sticky header optional. Badges: semantic colors. Modals: overlay + focus trap. Toasts: top-right, auto-dismiss. Navigation: active state, hover, focus.

### Breakpoints
- Mobile: < 640px
- Tablet: 640–1023px
- Laptop: 1024–1279px
- Desktop: 1280–1535px
- Large: ≥ 1536px

### Icon Rules
Consistent stroke icon set (TDD); icons accompany text or have aria-labels

### Image Rules
Optimized, lazy-loaded below the fold, width/height set, meaningful alt

### Motion
Subtle transitions (150–250ms); respect prefers-reduced-motion; carousel autoplay pauses/disables for reduced motion

## Implementation Notes � Phase 1 (actual decisions)

- Framework: **Next.js 16 (App Router) + TypeScript + Tailwind CSS v4** � this resolves the technology "TEAM DECISION / TO BE DECIDED" in this document. Package manager: npm. App lives in `pureblend-web/`.
- Tailwind v4 CSS-first tokens in `src/app/globals.css` (`@theme`): brand, accent, neutral, semantic colors, radius (sm/md/lg/pill), shadows (card/raised/modal), motion tokens, breakpoints mapped to strategy (sm=640, md=1024, lg=1280, xl=1536).
- Implemented all public routes + 404 + admin shell routes (see `src/app`); all admin module pages are `AdminModuleShell` placeholders with honest empty states (no fake CRUD).
- API boundary: `src/lib/api/client.ts` (`apiRequest`), `types.ts`, `endpoints.ts`. No components call fetch directly. Endpoints beyond the contract are not invented; services are TODO until backend finalizes.
- State: local component state only (chat messages, form, mobile nav). No global store introduced � matches strategy doc.
- Chat is UI-only calling `POST /api/chat`; no keys in client.
- Fixtures in `src/data/dev-fixtures.ts` are clearly marked dev-only; production pages will consume services later.
- SEO: `src/lib/metadata.ts` `pageMetadata()` helper per page; dynamic product metadata via `generateMetadata` (now from fixtures; TODO switch to API).
- A11y: skip link, semantic landmarks, modal focus handling, accordion aria, focus-visible styles, reduced-motion CSS, honeypot input.
- Build/typecheck/eslint pass; routes smoke-tested (all 200 except unknown product slug and unknown URL ? 404).
- Sensitive items never client-side: `NEXT_PUBLIC_API_BASE_URL` + `NEXT_PUBLIC_SITE_URL` only.

Why the folder structure is slightly simpler than the original proposal: Next.js App Router colocates routes under `src/app`, and components/types/lib follow the documented separation (`components/ui|layout|marketing|chat|admin|forms`, `lib/api`, `data`) without an additional `features/` layer � to be reintroduced if feature complexity warrants it.

## Implementation Notes — Phase 2 (actual decisions)

- Project migrated from `pureblend-web/` into the repository root — the repo root is now the active project.
- Homepage assembled from documented sections only: Hero, About intro, Why PureBlend, Product showcase, Offers, AI assistant CTA, Contact CTA. No invented certifications/partners/statistics.
- Products listing: `ProductsBrowser` client component adds search + category filter over props-injected data (fixtures now; API later). Empty/no-match/error states implemented.
- Product detail: breadcrumb, gallery slot (aspect-ratio, lazy/eager image component), specifications `<dl>`, "Request specifications" CTA, related products by category, `generateMetadata` uses product SEO fields when present.
- Offers page: `OfferSection`/`OfferCard` with validity date display and empty state. No fake discount math.
- FAQs: accessible accordion (aria-expanded/controls/region, keyboard operable) with loading/empty/error patterns ready at the page level.
- Contact: validated form (name/email/subject/message + hidden honeypot), per-field errors, submit-disable, success/error feedback; posts to `POST /api/contact` — SMTP wiring deferred to backend phase.
- Privacy/Terms: readable long-form layout with clear placeholder copy marked for CMS replacement.
- Footer: config-driven social links (`config.socials`) — rendered only when real URLs are provided, per organizer rule about working social links.
- 404 page implemented and verified for unknown routes and unknown product slugs.
- SEO applied to every public page via `pageMetadata()` (title, description, canonical, Open Graph).
- Image strategy: `next/image`, aspect-ratio containers, object-cover, explicit sizes, priority only for hero, dev SVG placeholder asset.
- Responsive QA performed by code review + build; visual device testing still needs a human pass at 320px–1920px.
- All Phase 2 routes verified on the production server: pages return 200, unknown product and unknown URL return the custom 404.
- `tsc --noEmit` = 0, eslint clean, `next build` succeeds from the repository root.


### Phase 7 Refinement Notes
- Typography: Manrope app-wide, balanced heading wrapping, tighter tracking, 1.2 heading / 1.6 body line-height.
- Hero: subtle left-to-right brand-950 overlay for readable text over imagery (no flashy effects).
- Cards: consistent padding + subtle hover elevation via --shadow-raised.
- Admin: active nav item highlighted with aria-current; table rows get neutral-50 hover.
- Selection color set to brand tint. No gradients/glassmorphism/neon added.

