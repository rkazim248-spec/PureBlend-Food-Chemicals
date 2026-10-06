# API Contract Overview

> This is the single approved contract between frontend and backend. Changes require updating this doc + notifying both teams. Endpoints without a final decision are marked **TDD**.

## Conventions
- Base path: `/api`
- JSON request/response
- Auth: per `authentication-flow.md` (cookie session vs Bearer token — TDD)
- Success: 2xx with resource or `{ data: ... }`
- Error: standard shape per `error-response-standard.md`
- Pagination: `?page=&limit=` — TDD exact params
- Slugs for public product routes; IDs for admin CRUD

## Endpoint Groups
- `/api/auth/*` — login, logout, me
- `/api/products/*` — public list/detail + admin CRUD
- `/api/categories/*` — TDD
- `/api/banners/*`
- `/api/offers/*`
- `/api/faqs/*`
- `/api/content/*`
- `/api/seo/*`
- `/api/contact/*`
- `/api/chat/*`
- `/api/upload/*` — TDD (image upload for admin)

See `api-endpoints.md` for the full table, `request-response-models.md` for models.
