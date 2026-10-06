# API Endpoints

F = frontend usage, A = admin usage, P = public.

## Auth
| Method | Endpoint | Purpose | Auth | Request | Query | Response | Errors | Used by |
|---|---|---|---|---|---|---|---|---|
| POST | /api/auth/login | Login | Public | {email, password} | — | user + token/session | 401 invalid creds, 422 validation | F Login |
| POST | /api/auth/logout | Logout | Auth | — | — | 200 | 401 | F/A |
| GET | /api/auth/me | Current user | Auth | — | — | user | 401 | F/A guard |

## Products
| Method | Endpoint | Purpose | Auth | Request | Query | Response | Errors | Used by |
|---|---|---|---|---|---|---|---|---|
| GET | /api/products | List products | Public | — | page, limit, category, search TDD | Product[] + pagination | 500 | F Products |
| GET | /api/products/[slug] | Detail | Public | — | — | Product | 404 | F Detail |
| POST | /api/products | Create | Admin | Product payload | — | Product | 400,401,403,422 | A |
| PUT | /api/products/[id] | Update | Admin | Product payload | — | Product | 400,401,403,404,422 | A |
| DELETE | /api/products/[id] | Delete | Admin | — | — | 200 | 401,403,404 | A |
| PATCH | /api/products/[id]/publish | Publish toggle | Admin | {published} | — | Product | 401,403,404 | A |

## Categories (TDD whether needed)
GET /api/categories → Category[]

## Banners
GET /api/banners (public: active only) ; admin CRUD at /api/banners + /[id]; publish toggle same pattern.

## Offers
GET /api/offers ; admin CRUD /api/offers + /[id]

## FAQs
GET /api/faqs ; admin CRUD /api/faqs + /[id]

## Content
GET /api/content/[page]; PUT /api/content/[page] (admin)

## SEO
GET /api/seo?entityType=&entityId=; PUT /api/seo (admin)

## Contact
POST /api/contact {name, email, subject, message, honeypot} → 200; errors 422, 429 (rate limit), 500

## Chat
POST /api/chat {message, conversationId?} → {reply, sources? TDD}; errors 400, 429, 500, 503

## Upload (TDD)
POST /api/upload (multipart image) → {url}; validate type/size; auth required

Each endpoint: frontend handles loading; list endpoints may return empty arrays → empty state.
