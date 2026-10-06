# Frontend Folder Structure (Proposed â€” TDD)

```
src/
  app/ or pages/            # routing (per framework choice)
    (public)/               # public routes
    admin/                  # admin routes
  components/
    ui/                     # design-system primitives
    shared/
    marketing/
    product/
    forms/
    feedback/
    chat/
    admin/
  features/
    products/
    offers/
    faqs/
    banners/
    contact/
    chat/
    admin/
  lib/
    api/                    # typed API client
    utils/
    hooks/
  styles/
  public/                   # static assets
docs/                       # this documentation
```

Rules:
- Feature components live with their feature
- No API calls outside `lib/api` client helpers
- Keep components small and typed
- Co-locate tests where the team decides (TDD)

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
