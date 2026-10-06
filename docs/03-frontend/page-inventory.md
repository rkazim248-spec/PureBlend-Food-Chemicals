# Page Inventory

## Public Pages

| Page ID | Name | Route | Purpose | Audience | Required Sections | Dynamic/Static | API Dependencies | SEO | Responsive | Loading | Empty | Error | Priority | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| P-01 | Home | `/` | Brand + featured content | Visitor | Hero carousel, featured products, offers teaser, CTA | Dynamic | banners, products, offers | Title/meta via SEO API | Full | Skeleton | Per-section fallback | Section error | P0 | Planned |
| P-02 | About | `/about` | Company info | Visitor | Content blocks | Dynamic | content | Yes | Full | Skeleton | Block fallback | Error | P1 | Planned |
| P-03 | Products | `/products` | Catalog | Visitor | Grid, filters/pagination TDD | Dynamic | products, categories | Yes | Full | Skeleton grid | Empty list | Error+retry | P0 | Planned |
| P-04 | Product Detail | `/products/[slug]` | Product info | Visitor | Gallery, info, spec table, related | Dynamic | product by slug | Yes + OG | Full | Skeleton | n/a (404) | Error / 404 | P0 | Planned |
| P-05 | Offers | `/offers` | Discounts | Visitor | Offer cards | Dynamic | offers | Yes | Full | Skeleton | Empty | Error | P1 | Planned |
| P-06 | FAQs | `/faqs` | Answers | Visitor | Accordion/list | Dynamic | faqs | Yes | Full | Skeleton | Empty | Error | P1 | Planned |
| P-07 | Contact | `/contact` | Inquiry | Visitor | Form, contact info | Form dynamic | content, POST contact | Yes | Full | Submit spinner | n/a | Form error | P0 | Planned |
| P-08 | Privacy Policy | `/privacy-policy` | Legal | Visitor | Content | Dynamic | content | Yes | Full | Skeleton | Fallback | Error | P2 | Planned |
| P-09 | Terms | `/terms-and-conditions` | Legal | Visitor | Content | Dynamic | content | Yes | Full | Skeleton | Fallback | Error | P2 | Planned |
| P-10 | 404 | any | Not found | Visitor | Message + links | Static | — | noindex | Full | — | — | — | P1 | Planned |

## Admin Pages (separate inventory — see `04-admin/admin-page-inventory.md`)
| Page ID | Name | Route |
|---|---|---|
| A-01 | Login | `/admin/login` |
| A-02 | Dashboard | `/admin` |
| A-03 | Products | `/admin/products` |
| A-04 | Banners | `/admin/banners` |
| A-05 | Offers | `/admin/offers` |
| A-06 | FAQs | `/admin/faqs` |
| A-07 | Content | `/admin/content` |
| A-08 | SEO | `/admin/seo` |

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

