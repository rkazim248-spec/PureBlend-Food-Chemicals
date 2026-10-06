# Admin Page Inventory

| ID | Page | Route | Purpose | API | States |
|---|---|---|---|---|---|
| A-01 | Login | /admin/login | Authenticate admin | POST /api/auth/login | loading, error |
| A-02 | Dashboard | /admin | Overview | GET summary (TDD) | loading, error |
| A-03 | Products list | /admin/products | Manage products | GET/POST/PUT/DELETE /api/products | loading, empty, error |
| A-04 | Product create/edit | /admin/products/new, /admin/products/[id]/edit | Forms | POST/PUT /api/products | submitting, error, success |
| A-05 | Banners | /admin/banners | Manage carousel | /api/banners CRUD | loading, empty, error |
| A-06 | Offers | /admin/offers | Manage offers | /api/offers CRUD | loading, empty, error |
| A-07 | FAQs | /admin/faqs | Manage FAQs | /api/faqs CRUD | loading, empty, error |
| A-08 | Content | /admin/content | Edit pages | GET/PUT /api/content | loading, error |
| A-09 | SEO | /admin/seo | Per-entity SEO | GET/PUT /api/seo | loading, error |

Each list page includes: search, filters (TDD which), pagination, delete confirmation modal, row actions (edit, publish toggle).

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

