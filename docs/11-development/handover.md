# Team Handover

## Ownership
- **Frontend**: public site, admin UI, API service layer, chat UI, contact UI, SEO/perf/a11y hardening, security headers.
- **Backend**: auth endpoints, admin CRUD endpoints, content/SEO endpoints, RAG endpoint, database, SMTP alternative if separate, uploads, CORS, rate limiting, seed data.
- **Deployment**: whoever has hosting/provider credentials executes `/docs/12-deployment/`.

## How Frontend ↔ Backend Communicate
All calls through `src/lib/api/` (client → services → endpoints). Same-origin route handler exists only for `/api/contact`; everything else expects the backend at `NEXT_PUBLIC_API_BASE_URL`. Mock mode (`NEXT_PUBLIC_USE_MOCK_DATA=true`) is local-dev only; production forces real APIs.

## Important Files
- `src/lib/api/` — client, endpoints, types, services, admin services
- `src/app/api/contact/route.ts` — SMTP handler
- `src/app/(public)/` — public routes; `src/app/admin/` — admin routes
- `src/components/` — ui/layout/marketing/chat/admin/forms
- `src/mocks/` — dev fixtures only
- `next.config.ts` — security headers
- `.env.example` / `.env.development` / `.env.production` — placeholder env config

## Important Commands
`npm ci` · `npm run dev` · `npm run build` · `npm start` · `npm run lint` · `npx tsc --noEmit`

## Known Issues / Dependencies
- Real data, auth, RAG, and contact delivery require the backend and real credentials.
- 5 dev-only audit findings in the ESLint toolchain (documented Phase 9).
- Jury admin credentials must be shared via the official submission channel.

No personal credentials are stored in this repository.
