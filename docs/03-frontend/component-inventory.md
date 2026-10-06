# Component Inventory

For each: Purpose / Props-data / States / Responsive / Accessibility / Backend dependency.

## Layout
- **Header**: Purpose: site header. Props: nav links, CTA. States: mobile menu open/close. Responsive: collapses to hamburger. A11y: `<header>`, nav landmark, aria-expanded. Backend: content/SEO settings (TDD).
- **Footer**: links, social links, copyright. A11y: contentinfo. Backend: content.
- **Navigation**: public links. States: active link, mobile drawer. A11y: nav landmark, aria-current.
- **Container**: max-width wrapper. Pure presentational.

## Marketing
- **Hero**: homepage banner. Props: banner items. States: loading skeleton, empty fallback. Responsive: fluid. A11y: heading structure, alt text, pause control for carousel. Backend: banners API.
- **Banner Carousel**: auto/manual sliding. States: empty, loading. A11y: aria-live polite, keyboard controls, reduced motion disables autoplay.
- **CTA**: button section. Props: heading, link.
- **Offer Card**: offer summary. States: expired/inactive hidden. A11y: semantics, contrast. Backend: offers API.
- **Product Card**: product summary + image. A11y: meaningful alt, link text. Backend: products API.
- **Category Card**: category summary. Backend: categories API.

## Product
- **Product Grid**: grid of Product Cards. States: loading/empty/error.
- **Product Filters**: filter controls (TDD). A11y: labels, fieldset/legend.
- **Product Gallery**: images. A11y: alt text, keyboard.
- **Product Information**: title, description. SEO heading.
- **Specification Table**: rows of specs. A11y: proper table markup.

## Forms
- **Input / Select / Textarea**: labeled fields; states: default, focus, error, disabled. A11y: associated label, aria-invalid, aria-describedby.
- **Upload**: image upload for admin. States: progress, error, validation fail. A11y: label, error messages. Backend: upload endpoint (TDD).
- **Submit Button**: states: idle, loading, disabled, success.
- **Validation Message**: inline error text, role=alert.

## Feedback
- **Toast**: success/error notifications. A11y: role=status/alert.
- **Modal**: confirmations. A11y: focus trap, Escape closes, aria-modal.
- **Skeleton**: loading placeholder. A11y: aria-hidden + aria-busy on container.
- **Spinner**: action loading. A11y: aria-live or sr-only text.
- **Empty State**: friendly message + CTA.
- **Error State**: message + retry button.

## AI
- **Chat Launcher**: floating button. A11y: aria-label, visible focus.
- **Chat Window**: conversation area. Responsive: full-screen on small mobile.
- **Message Bubble**: user/assistant styling. A11y: readable contrast.
- **Source/grounding indicator**: if the RAG response includes sources (TDD).
- **Typing Indicator**: loading state. aria-live.

## Admin
- **Sidebar**: module navigation. States: active item, collapsed (TDD).
- **Topbar**: page title, user menu/logout.
- **Data Table**: rows, sortable (TDD). States: loading, empty, error. A11y: table headers.
- **CRUD Form**: create/edit forms. States: submitting, error, success.
- **Confirmation Modal**: delete confirm.
- **Status Badge**: published/draft/active.
- **Pagination**: page controls. A11y: nav, aria-current.
- **Search**: table search. Debounced. A11y: label.
- **Filters**: table filters.

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


## Implementation Notes — Phase 4 (Admin Dashboard frontend)

- Admin routes: `/admin` (overview), `/admin/login`, `/admin/products`, `/admin/banners`, `/admin/offers`, `/admin/faqs`, `/admin/content`, `/admin/seo`. Admin detail/edit-as-page routes were not needed because create/edit happens in accessible modals via the shared `EntityManager`.
- New components: `AdminGuard` (UX session check via `GET /api/auth/me`, redirect to login on failure — not the security boundary), `EntityManager` (generic CRUD: search, table, create/edit modal, delete confirmation modal, status toggle, loading/error/empty, skeletons), `TableSkeleton`.
- Admin CRUD flows: create/edit modal → validation → loading button → service → list refresh; delete → confirmation → processing state → error/success via list refresh; publish/activate toggle with busy state and label from the entity's real flag.
- Auth boundary: `admin.login/logout/getMe` services call `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me` through the Phase 3 API layer. In mock mode (`NEXT_PUBLIC_USE_MOCK_DATA=true`) they return a dev user so the dashboard is demoable locally; production mode enforces real session flow.
- Mock mode admin CRUD echoes inputs (development only) — no fake persistence, no fake production success. Production uses the documented endpoints only.
- Loading/empty/error states present on every admin module; no fake sample records in empty states.
- No raw fetch in components — all via `admin` services namespace under `src/lib/api/admin.ts`.
- Responsive: sidebar becomes a horizontally scrollable nav on mobile, content stacks, modals are centered/full-width on small screens, tables scroll horizontally.
- A11y: labels on all fields, role=alert on errors, modal Escape/backdrop close and initial focus, buttons have accessible names.
- Verification: `tsc --noEmit` = 0, eslint clean, `next build` succeeds, all admin routes + `/` smoke-tested 200 on the dev server.

