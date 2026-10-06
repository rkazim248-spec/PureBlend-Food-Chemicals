# Admin Dashboard Specification

## Purpose
A secure, authenticated area where PureBlend staff manage all public-facing content without developer involvement. The organizer requires real functionality — no fake hard-coded controls.

## Modules & Requirements
For every module: page purpose, navigation, table columns, search, filters, create form, edit form, delete confirmation, publish/unpublish, empty state, loading state, error state, success feedback, API requirements, permissions.

### 1. Dashboard
- Purpose: overview of content status
- Columns/widgets: product count, active banners, active offers, FAQ count, recent submissions (if stored)
- States: loading skeleton, error
- API: summary endpoint (TDD)

### 2. Content Management
- Purpose: edit about/privacy/terms blocks
- Columns: page, section, updatedAt, status
- Create/edit: title + rich text or markdown (TDD)
- API: GET/PUT /api/content

### 3. Banners
- Purpose: manage homepage carousel
- Columns: title, image, order, active, start/end dates (TDD)
- Create/edit: title, image upload, link, order, active toggle
- API: /api/banners CRUD

### 4. Products
- Purpose: product catalog management
- Columns: name, category, price (TDD), status(published), updatedAt, actions
- Search: name; Filters: category, status
- Create/edit: name, slug (auto from name, editable), description, specs, images, category, SEO fields, published
- Delete: confirmation modal
- API: /api/products CRUD

### 5. Offers
- Purpose: manage discounts
- Columns: title, discount, validFrom/To, active
- API: /api/offers CRUD

### 6. FAQs
- Purpose: manage FAQs
- Columns: question, category (TDD), order, published
- API: /api/faqs CRUD

### 7. SEO
- Purpose: per-entity SEO fields
- Columns: entity type, entity, metaTitle, metaDescription, updatedAt
- API: /api/seo GET/PUT

## Global Admin UX Rules
- Every mutation: success toast, error toast, loading state on submit
- Deletes always confirm
- Tables: loading skeleton, empty row message, error banner
- Forms: client validation + server error display
- Unauthorized API responses (401/403): redirect to login / show forbidden

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

