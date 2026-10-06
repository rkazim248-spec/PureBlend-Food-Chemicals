# Organizer Requirements Matrix (Traceability)

> Every organizer requirement gets an ID. Frontend/Backend/Integration columns assign ownership. Status: Planned / In Progress / Done / Verified.
> NOTE: Verify against the official PDF; add rows for any missing small requirements.

| ID | Organizer Requirement | Category | Frontend Responsibility | Backend Responsibility | Integration Required | Priority | Acceptance Criteria (summary) | Status |
|---|---|---|---|---|---|---|---|---|
| REQ-001 | Modern responsive public website | UX | Responsive layouts, breakpoints | Serve assets/API | API data feeds | P0 | Verified on matrix devices | Planned |
| REQ-002 | Database-driven products | Functional | Render product data | Products API + DB | GET products/detail | P0 | No hard-coded products | Planned |
| REQ-003 | Secure admin dashboard | Security/Admin | Protected UI, guarded routes | Auth + authorization | Login/session | P0 | Unauth users cannot access | Planned |
| REQ-004 | Dynamic content management | Admin | Content editor UI | Content API + DB | CRUD content | P0 | Edits appear publicly | Planned |
| REQ-005 | Banner/carousel management | Admin | Carousel + banner CRUD UI | Banners API + DB | CRUD banners | P0 | Carousel reflects edits | Planned |
| REQ-006 | Product CRUD | Admin | Product forms/table | Products CRUD API | Full CRUD | P0 | Create/edit/delete works | Planned |
| REQ-007 | Offers/discount management | Admin | Offers CRUD UI | Offers API + DB | CRUD offers | P0 | Offers listed publicly | Planned |
| REQ-008 | FAQ management | Admin | FAQ CRUD UI | FAQs API + DB | CRUD FAQs | P0 | FAQs listed publicly | Planned |
| REQ-009 | SEO controls | Admin/SEO | SEO fields UI, meta rendering | SEO API + DB, slug uniqueness | SEO CRUD | P0 | Meta output reflects controls | Planned |
| REQ-010 | AI RAG chatbot restricted to approved knowledge | AI | Chat UI, states | RAG retrieval + grounding | POST /api/chat | P0 | Refuses unsupported questions | Planned |
| REQ-011 | SMTP contact workflow | Contact | Form UI + validation | SMTP send + storage | POST /api/contact | P0 | Email received | Planned |
| REQ-012 | Authentication & authorization | Security | Login UI, token/session storage per architecture | Hashing, sessions/JWT, role checks | Auth endpoints | P0 | Forbidden without role | Planned |
| REQ-013 | Security controls | Security | No secrets client-side, input validation | Rate limits, secure headers, authz | Security middleware | P0 | Security review passes | Planned |
| REQ-014 | Performance | NFR | Optimization, lazy loading | Caching, compression, efficient queries | CDN/caching headers | P1 | Budgets met | Planned |
| REQ-015 | Accessibility | NFR | Semantic HTML, focus, alt, contrast | Proper API error messages structure | None | P1 | Checklist passes | Planned |
| REQ-016 | SEO | NFR | Titles/meta/headings/alt/OG | Sitemap/robots endpoints | SEO API | P1 | Technical SEO doc passes | Planned |
| REQ-017 | Deployment | Ops | Build, env config | Hosting, env secrets, HTTPS | CI/CD optional TDD | P0 | Live URL works | Planned |
| REQ-018 | Documentation | Docs | This docs system updated | API docs updated | README | P0 | Complete before demo | Planned |
| REQ-019 | Loading states | UX | Skeletons/spinners everywhere | Fast endpoints | All GET endpoints | P0 | Visible during fetch | Planned |
| REQ-020 | Error states | UX | Error UI with retry | Standard error shape | All endpoints | P0 | Graceful on failure | Planned |
| REQ-021 | Empty states | UX | Empty UI for lists | Empty result sets | All list endpoints | P0 | No blank pages | Planned |
| REQ-022 | 404 handling | UX | Custom 404 page | — | — | P1 | Friendly page | Planned |
| REQ-023 | Social links | Content | Footer/contact links | Configurable content | Content API | P2 | Links render | Planned |
| REQ-024 | Anti-spam on contact | Security | Honeypot field | Rate limit/validation/captcha | POST /api/contact | P0 | Bots blocked in testing | Planned |
| REQ-025 | Image optimization | Performance | next/image or equivalent, alt text | Upload handling, resizing | Upload endpoint | P1 | Optimized assets | Planned |
| REQ-026 | Mobile compatibility | NFR | Responsive UI | Responsive assets | — | P0 | Mobile pass on matrix | Planned |
| REQ-027 | Publish/unpublish content | Admin | Toggle UI | isPublished flag | PATCH endpoints | P0 | Unpublished hidden publicly | Planned |
| REQ-028 | No fake/hard-coded admin controls | Admin | Real forms wired to API | Real CRUD | All admin APIs | P0 | No mock-only features | Planned |

Add rows as the team verifies the PDF. Keep IDs stable once assigned.
