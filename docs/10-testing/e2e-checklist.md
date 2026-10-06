# End-to-End Test Checklist

> Manual checklist for final hackathon verification. Every item should be executed and marked Pass/Fail/Blocked before submission. "Blocked (backend)" means the frontend contract is ready but the backend was not available in this workspace.

## AUTH
- [ ] Admin login — Blocked (backend)
- [ ] Invalid login shows friendly error — frontend wired, Blocked (backend)
- [ ] Logout clears session — frontend wired, Blocked (backend)
- [ ] Session expiration redirects to login — frontend wired, Blocked (backend)
- [ ] Unauthorized access to /admin redirects — Verified (mock mode returns dev user; real path Blocked)

## PRODUCTS
- [ ] Create — frontend ready, Blocked (backend)
- [ ] Read/list — Verified with mock fixtures; Blocked (backend)
- [ ] Update — frontend ready, Blocked (backend)
- [ ] Delete — frontend ready, Blocked (backend)
- [ ] Publish/unpublish toggle — frontend ready, Blocked (backend)
- [ ] Public listing — Verified (mock mode); Blocked (backend)
- [ ] Product detail — Verified (mock mode); Blocked (backend)

## BANNERS
- [ ] Create/Update/Delete/Activate — frontend ready, Blocked (backend)
- [ ] Public display — Verified fallback (dev fixture); Blocked (backend)

## OFFERS
- [ ] Create/Update/Delete/Activate — frontend ready, Blocked (backend)
- [ ] Public display — Verified fallback; Blocked (backend)

## FAQ
- [ ] Create/Update/Delete — frontend ready, Blocked (backend)
- [ ] Public display — Verified fallback; Blocked (backend)

## CONTACT
- [ ] Valid submission — Blocked (backend, SMTP)
- [ ] Invalid submission validation — Verified (client-side)
- [ ] Error handling — Verified (failed request shows safe error)

## RAG
- [ ] Supported question — Blocked (backend)
- [ ] Unsupported question — Blocked (backend)
- [ ] Product question — Blocked (backend)
- [ ] Specification question — Blocked (backend)
- [ ] Unrelated question — Blocked (backend)
- [ ] Error handling — Verified (mock mode returns explicit "backend not connected" notice)

## TECHNICAL
- [x] Responsive — code-reviewed at all breakpoints; device pass recommended
- [x] Accessibility — implemented (focus, labels, aria-live, modal, accordion)
- [x] SEO — metadata on all pages, robots.txt, sitemap.xml
- [x] Performance — lazy chat window, next/image, parallel fetches
- [x] Security — no secrets in repo; frontend boundaries documented
- [x] Build — `next build` succeeds
- [ ] Deployment — not performed in this workspace
- [x] Environment variables — `.env.example`, `.env.development`, `.env.production` reviewed
