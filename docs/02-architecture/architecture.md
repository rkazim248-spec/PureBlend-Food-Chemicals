# Architecture

## Data Flows

Visitor → Next.js frontend (public site) → service layer (`src/lib/api`) → backend API → database

Admin → `/admin` (authenticated UI) → protected API calls → backend authorization → database

RAG: chatbot UI → `POST /api/chat` → backend retrieval from approved PureBlend knowledge → grounded answer → UI (frontend never calls an AI provider directly)

Contact: form UI → `POST /api/contact` → server-side validation/sanitization/rate-limit → nodemailer SMTP → business mailbox

## System Boundaries
- Public website pages: SEO-friendly, database-driven via services, graceful empty/error states.
- Admin: UX guard redirects unauthenticated users; backend is the real authorization boundary.
- Contact: same-origin route handler, honeypot + per-IP rate limit, escaped HTML email.
- Security headers in `next.config.ts` (CSP, nosniff, DENY framing, Referrer-Policy, Permissions-Policy).
- Mock mode (`NEXT_PUBLIC_USE_MOCK_DATA=true`) is development-only; production config forces real APIs.

## Important Files
- `src/lib/api/` — Phase 3 API layer (client, endpoints, types, services, admin services)
- `src/app/api/contact/route.ts` — SMTP contact handler
- `src/components/` — ui / layout / marketing / chat / admin / forms
- `src/mocks/` — development fixtures (dev only)
- `next.config.ts` — security headers
