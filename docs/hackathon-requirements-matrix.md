# Hackathon Requirements Matrix

> Marked "Verified" only where locally tested. Backend-dependent items are "Frontend ready — pending backend".

| Organizer Requirement | Implementation | Tested | Evidence | Status |
| --------------------- | -------------- | ------ | -------- | ------ |
| Modern responsive public website | Next.js App Router public pages | Yes (build + smoke) | `/` … `/contact` 200s | Verified w/ mock data |
| Database-driven products | Service layer + types | Partial | products page renders via services in mock mode | Frontend ready — pending backend |
| Secure admin dashboard | `/admin` with guard, CRUD UI | Partial | admin routes 200 | Frontend ready — pending backend |
| Dynamic content management | `/admin/content` page | Partial | UI ready | Frontend ready — pending backend |
| Banner/carousel management | `/admin/banners` + Hero consumes banners | Partial | banner CRUD UI + Hero renders dev fixture | Frontend ready — pending backend |
| Product CRUD | `/admin/products` EntityManager | Partial | UI flows + mock echo | Frontend ready — pending backend |
| Offers/discount management | `/admin/offers` | Partial | UI ready | Frontend ready — pending backend |
| FAQ management | `/admin/faqs` | Partial | UI ready | Frontend ready — pending backend |
| SEO controls | `/admin/seo` + pageMetadata + robots/sitemap | Yes (frontend) | meta tags + /robots.txt + /sitemap.xml | Verified (frontend meta) |
| AI RAG chatbot restricted to approved knowledge | Chat UI → POST /api/chat contract | Partial | mock returns "backend not connected" notice | Frontend ready — pending backend |
| SMTP contact workflow | `/api/contact` route handler (nodemailer, honeypot, rate limit) | Partial | 503/422/200/429 test matrix passed locally | Verified logic; delivery pending real creds |
| Authentication & authorization | Login UI + AdminGuard + services | Partial | invalid-login path wired; guard redirect + logout | Frontend ready — pending backend |
| Security controls | Headers, no secrets, no dangerous HTML, validation | Yes | Phase 9 audit + dependency audit | Verified (frontend) |
| Performance | next/image, lazy chat, parallel fetches, sitemap | Yes | build output reviewed | Verified |
| Accessibility | labels, focus, aria-live, modal focus, accordion | Yes (code review) | Phase 6 checklist | Verified |
| SEO | titles/descriptions/canonical/OG, robots, sitemap | Yes | page source | Verified (frontend) |
| Deployment | documented, env-gated config | Partial | Phase 10 notes | Documented; live deploy pending |
| Documentation | /docs system, README, guides | Yes | repo | Verified |
