# Team Explanation Guide

Simple, honest explanations for the jury Q&A. No claim here that isn't backed by the code.

1. **Why this architecture?** Next.js App Router gives us SEO-friendly server rendering for the public site, client components only where interaction is needed (forms, chat, admin tables), and one deployable unit (UI + `/api/contact`).

2. **How does the frontend communicate with the backend?** Every call goes through `src/lib/api/client.ts` → typed services in `src/lib/api/services.ts` / `admin.ts` → documented endpoints. Components never call `fetch` directly.

3. **How does the database work?** The backend teammate owns the schema; the frontend only consumes the documented API contracts (types in `src/lib/api/types.ts`). Mock mode exists only for local development.

4. **How does admin authentication work?** The admin layout renders `AdminGuard`, which calls `GET /api/auth/me`; failure redirects to `/admin/login`. This is a UX guard, not the security boundary.

5. **How does authorization work?** The frontend never trusts its own UI state. Every admin API call is authenticated and authorized by the backend; 401/403 responses drive the UX (redirect/forbidden).

6. **How does product CRUD work?** `/admin/products` uses the shared `EntityManager` component → `adminCreateProduct / adminUpdateProduct / adminDeleteProduct / adminSetProductPublished` services → documented REST endpoints → database. Public pages read the same products via `getProducts()`.

7. **How does RAG work?** Chat UI → `POST /api/chat` → the backend retrieves from approved PureBlend knowledge and returns a grounded answer. The frontend never calls an AI provider and holds no AI keys.

8. **How does grounding prevent hallucinations?** It doesn't come from the frontend — the backend restricts retrieval to approved content and the UI renders exactly what the backend returns, including explicit "insufficient information" responses. The contract has no free-form AI generation on the client.

9. **How are unsupported questions handled?** The backend returns a clear refusal; the chat window renders it as a normal assistant message and keeps the conversation open. Mock mode shows an explicit "backend not connected" notice rather than fabricating an answer.

10. **How does SMTP work?** The form posts to the same-origin `/api/contact` route → server-side validation/sanitization → honeypot + per-IP rate limit → nodemailer sends an escaped HTML/plain-text email to the business inbox. Secrets live only in server env vars.

11. **How are secrets protected?** Only `NEXT_PUBLIC_*` values reach the browser; SMTP/DB/AI/auth secrets exist only in server env and hosting config; the repo contains placeholders only; `.gitignore` blocks real `.env` files.

12. **How does SEO work?** Every public page exports `pageMetadata()` (title, description, canonical, Open Graph); `/products/[slug]` uses `generateMetadata` with product SEO fields; `/robots.txt` and `/sitemap.xml` are generated; headings are semantic; images carry alt text.

13. **How does responsive design work?** Tailwind breakpoints model the documented strategy (mobile <640, tablet 640–1023, laptop 1024–1279, desktop 1280–1535, large ≥1536). Mobile nav drawer, stacked-to-grid layouts, full-screen chat on mobile, horizontally scrollable admin tables.

14. **How was performance optimized?** `next/image` with explicit sizes (no CLS), lazy-loaded chat window, parallel homepage data fetches, request dedupe in services, font `display: swap`, and no third-party scripts.

15. **What AI coding tools were used?** AI coding agents were used for scaffolding, components, and documentation; see `/docs/11-development/ai-coding-rules.md` for the enforced rules.

16. **What was manually reviewed/tested?** Build, typecheck, ESLint, route smoke tests, contact endpoint test matrix, secret scan, and a manual requirements audit — all recorded in the phase notes under `/docs`.
