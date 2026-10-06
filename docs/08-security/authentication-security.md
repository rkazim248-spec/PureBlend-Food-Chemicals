# Authentication Security

- Strong password hashing is backend responsibility (bcrypt/argon2 TDD)
- Rate limit login attempts (backend)
- Session/token expiry and refresh strategy TDD
- Logout invalidates server-side session/token where applicable
- Protect admin routes in UI and enforce 401/403 from API
- Never expose password or token in URLs, logs, or error messages

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

