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
- `/api/products/*` — public list/detail+slug, admin CRUD
- `/api/categories/*` — public list+slug, admin CRUD
- `/api/banners/*`
- `/api/offers/*`
- `/api/faqs/*`
- `/api/content/*`
- `/api/seo/*`
- `/api/contact/*`
- `/api/chat/*`
- `/api/upload/*` — TDD (image upload for admin)

See `api-endpoints.md` for the full table, `request-response-models.md` for models.

## Implementation Notes — Phase 4 (Products & Categories CRUD)

- Public product listing returns only `published == true` products
- Public product detail by ID or slug returns 404 for unpublished products
- Admin product/create/update/delete require Firebase Admin custom claim `role: "ADMIN"` 
- Admin authorization verified via `Authorization: Bearer <idToken>` header
- Category slugs must be unique — duplicate slugs return 409 Conflict
- Category deletion blocked if products reference the category — returns 409 Conflict
- Pagination uses `?page=&limit=` query params with max limit of 50
- Product search is a simple prefix match on name (not full-text search)
- Images reference Cloudinary metadata (publicId, secureUrl, altText) — no binary upload in this phase

## Backend Dependencies
- Products list & detail, category list & detail endpoints
- Admin product CRUD endpoints with Firebase auth + admin claim verification
- Admin category CRUD endpoints with Firestore dependency checking
- Standard error shape compliance per `error-response-standard.md`

---

## Implementation Notes — Phase 4

### Public Product API
- `GET /api/products?page=1&limit=12&category=x&search=term&featured=true`
- Returns paginated list of published products
- Filter by category ID, search term, featured status
- Simple prefix match search on product name

### Public Product Detail
- `GET /api/products/[id]` — by ID, returns 404 for unpublished
- `GET /api/products/slug/[slug]` — by slug, returns 404 for unpublished

### Admin Product CRUD
- `POST /api/admin/products` — create product (requires admin auth)
- `PATCH /api/admin/products/[id]` — update product (requires admin auth)
  - Validates slug uniqueness on change
  - Validates category exists
- `DELETE /api/admin/products/[id]` — hard delete (requires admin auth)

### Public Category API
- `GET /api/categories?page=1&limit=20&published=true`
- Returns paginated list of categories

### Public Category Detail
- `GET /api/categories/[id]` — by ID
- `GET /api/categories/slug/[slug]` — by slug

### Admin Category CRUD
- `POST /api/admin/categories` — create category (requires admin auth)
  - Validates slug uniqueness
- `PATCH /api/admin/categories/[id]` — update category (requires admin auth)
  - Validates slug uniqueness on change
- `DELETE /api/admin/categories/[id]` — blocked if products reference category (returns 409)

### Slug Uniqueness
- Duplicate product slugs → 409 Conflict
- Duplicate category slugs → 409 Conflict

### Error Codes
- `PRODUCT_NOT_FOUND` / `CATEGORY_NOT_FOUND` — 404
- `DUPLICATE_PRODUCT_SLUG` / `DUPLICATE_CATEGORY_SLUG` — 409
- `CATEGORY_IN_USE` — 409 (cannot delete category with products)
- `UNAUTHORIZED` — 401
- `FORBIDDEN` — 403
- `VALIDATION_ERROR` — 400
- `SERVER_ERROR` — 500