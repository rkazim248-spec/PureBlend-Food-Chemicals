# PureBlend Food Chemicals — Round 2 Hackathon Solution

Production-minded website for the fictional client **PureBlend Food Chemicals**: a public marketing site, an admin CMS, an AI RAG assistant restricted to approved PureBlend knowledge, and a secure contact workflow.

## 1. Problem Being Solved
PureBlend needs a modern, database-driven company website with a secure admin dashboard, SEO controls, working contact/SMTP, and an AI assistant grounded in approved knowledge — not a visual prototype.

## 2. Core Features
- Public website: home, about, products, product detail, offers, FAQs, contact, privacy, terms, custom 404
- Admin CMS: dashboard, products, banners, offers, FAQs, content, SEO controls
- AI RAG chatbot (backend-restricted to approved knowledge, refuses unsupported questions)
- Contact form with SMTP delivery, validation, sanitization, honeypot + rate limiting
- SEO foundation: titles, descriptions, canonicals, Open Graph, robots.txt, sitemap.xml
- Security: headers, no exposed secrets, admin auth boundary
- Responsive (320–1920px), accessible, performance-minded

## 3. Technology Stack
- Frontend: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
- API layer: typed services in `src/lib/api/` (Phase 3 architecture)
- Backend: Phase 11 target — documented in `/docs/05-backend-integration/`; contact SMTP endpoint implemented in this repo at `src/app/api/contact/route.ts` (nodemailer)
- Database / auth / RAG: documented contracts; implementation owned by the backend teammate

## 4. Architecture
See `/docs/02-product/` for the route map and `/docs/05-backend-integration/` for the API contract.

## 5. Setup
```bash
npm ci
cp .env.example .env.local   # fill in real values, never commit
npm run dev
```

## 6. Commands
- `npm run dev` — development server
- `npm run build` — production build
- `npm start` — production server
- `npm run lint` — ESLint
- `npx tsc --noEmit` — type check

## 7. Environment Variables
Public (safe): `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_USE_MOCK_DATA`
Server-only: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`, `CONTACT_RECIPIENT`, `DATABASE_URL`, `AUTH_SECRET`, `AI_API_KEY` (documented; backend-owned)
Never commit real values. Only placeholder env files are tracked.

## 8. Admin Access
`/admin/login` — credentials are provisioned by the backend teammate and shared via the official submission channel.

## 9. Testing Guides
- `/docs/admin-testing.md`
- `/docs/rag-testing.md`
- `/docs/smtp-testing.md`
- `/docs/10-testing/` (acceptance cases, matrices, E2E checklist)

## 10. Security Notes
See `/docs/08-security/`. Frontend boundaries: no secrets in client code, plain-text rendering of dynamic content, no `dangerouslySetInnerHTML`, security headers in `next.config.ts`.

## 11. Known Limitations
- Real data requires the backend API (mock mode is dev-only)
- Real email delivery requires real SMTP credentials
- RAG answers require the backend RAG service
- 5 dev-only ESLint-chain audit findings (see Phase 9 notes)

## 12. Deployment
See `/docs/12-deployment/`.
