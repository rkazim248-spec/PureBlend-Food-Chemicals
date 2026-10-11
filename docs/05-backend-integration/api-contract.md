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
- `/api/banners/*` — public list+detail, admin CRUD + image management
- `/api/offers/*` — public status filtering, admin CRUD
- `/api/faqs/*` — public published list, admin CRUD
- `/api/content/*`
- `/api/seo/*`
- `/api/contact/*`
- `/api/chat/*`
- `/api/media/*` — Cloudinary image upload/manage (admin)
- `/api/pages/*` — CMS pages

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

---

## Implementation Notes — Phase 5 (Banners + Offers + FAQs + CMS)

- Public banner listing returns only active banners, sorted by sortOrder
- Public offer filtering by active status and valid date range
- Public FAQ listing returns only published FAQs, sorted by sortOrder
- CMS pages public access only for published pages
- Admin authorization verified via Firebase admin custom claim `role: "ADMIN"`/`"SUPERADMIN"`
- Slug/category uniqueness validation returning 409 Conflict
- Category deletion blocked if products reference the category — returns 409 Conflict
- FAQ reordering via Firestore batch writes
- Page key uniqueness validation — duplicate keys return 409 Conflict

---

## Implementation Notes — Phase 6 (Cloudinary Media Management)

### Cloud Architecture
- Cloudinary → image/media storage (server-only)
- Firestore → application data + Cloudinary references
- **Never** store image binary data in Firestore
- Cloudinary credentials (`CLOUDINARY_API_SECRET`) are server-only — never exposed to browser

### API Endpoints

#### Upload: `POST /api/admin/media/upload`
- **Auth**: Firebase ID token + admin claim `role: "ADMIN"`/`"SUPERADMIN"` (401/403)
- **Request**: `multipart/form-data`
  - `file` — the image file (JPEG, PNG, WebP, GIF)
  - `folder` — optional: "products", "banners", "general" (default: "general")
  - `publicId` — optional: custom public ID for the Cloudinary asset
  - `altText` — optional: alternative text for accessibility
- **Validation**:
  - MIME type must be one of: JPEG, PNG, WebP, GIF (400 `UNSUPPORTED_FILE_TYPE`)
  - File size must not exceed 5MB (400 `FILE_TOO_LARGE`)
- **Response**: `200` with metadata
  ```json
  {
    "success": true,
    "data": {
      "publicId": "...",
      "secureUrl": "...",
      "width": 1200,
      "height": 630,
      "format": "webp",
      "altText": "...",
      "bytes": 45000
    }
  }
  ```
- **Errors**:
  - `401` — unauthenticated
  - `403` — non-admin user
  - `400` — `UNSUPPORTED_FILE_TYPE`, `FILE_TOO_LARGE`, `INVALID_DATA`
  - `500` — `UPLOAD_FAILED`

#### Delete: `POST /api/admin/media/delete` or `DELETE /api/admin/media`
- **Auth**: Firebase ID token + admin claim (401/403)
- **Request**: JSON body or form data
  - `publicId` — Cloudinary public ID of the image to delete (required)
- **Reference Safety**: Before deleting, check if image is referenced by products (409 `IMAGE_IN_USE`)
- **Response**: `200` with deletion confirmation
- **Errors**:
  - `401` — unauthenticated
  - `403` — non-admin user
  - `400` — `INVALID_DATA` (no publicId provided)
  - `409` — `IMAGE_IN_USE` (image referenced by products)
  - `500` — `DELETE_FAILED`

#### Replace: `POST /api/admin/media/replace`
- **Auth**: Firebase ID token + admin claim (401/403)
- **Request**: JSON body or form data
  - `oldPublicId` — Cloudinary public ID of the existing image
  - `file` — new image file
  - `folder` — optional folder override
  - `altText` — optional new alt text
- **Flow**:
  1. Delete old Cloudinary asset
  2. Upload new image to Cloudinary
  3. Return new metadata
- **Response**: `200` with old/new metadata
- **Errors**:
  - `401` — unauthenticated
  - `403` — non-admin user
  - `400` — `INVALID_DATA`
  - `409` — `IMAGE_IN_USE` (safety check)
  - `500` — `REPLACE_FAILED`, `UPLOAD_FAILED`

### Cloudinary Folder Structure
- `pureblend/products/{productId}` — product-specific images
- `pureblend/banners/{bannerId}` — banner-specific images
- `pureblend/general` — general/shared images (logos, icons, etc.)

### Image Metadata Schema (Zod)
- `publicId`: string (min 1, max 500)
- `secureUrl`: validated URL
- `altText`: string (max 200), strongly encouraged for accessibility
- `width`: number (positive, optional)
- `height`: number (positive, optional)
- `format`: string (max 50, optional)
- `bytes`: number (positive, optional)

### File Validation
- **MIME types**: JPEG, PNG, WebP, GIF
- **Max file size**: 5MB
- **Do not trust filename extensions** — validate MIME type from the uploaded file
- **Do not accept arbitrary remote URLs** — SSRF prevention

### Error Codes (Phase 6)
- `UNSUPPORTED_FILE_TYPE` — 400
- `FILE_TOO_LARGE` — 400
- `IMAGE_IN_USE` — 409
- `INVALID_DATA` — 400
- `UPLOAD_FAILED` — 500
- `DELETE_FAILED` — 500
- `REPLACE_FAILED` — 500
- `INVALID_CLOUDINARY_CONFIGURATION` — 500 (cloud config missing/malformed)
- `UNAUTHORIZED` — 401
- `FORBIDDEN` — 403

---

## Error Codes Summary (All Phases)
- `UNAUTHORIZED` — 401
- `FORBIDDEN` — 403
- `VALIDATION_ERROR` — 400
- `NOT_FOUND` — 404
- `DUPLICATE` — 409
- `CONFLICT` — 409
- `SERVER_ERROR` — 500

---

## Backend Dependencies
- Cloudinary SDK configured with server-only credentials
- Firebase Admin SDK for admin authorization
- Firestore for reference checking (image-in-use)
- Standard error shape compliance per `error-response-standard.md`

---

## Frontend Contract

### Upload UI Integration
The frontend should:
1. Present a file input accepting: JPEG, PNG, WebP, GIF
2. Limit selection to 5MB maximum
3. Call `POST /api/admin/media/upload` with `multipart/form-data`
4. On success, store the returned `secureUrl` and `publicId`
5. Associate the image with a product/banner via the admin forms
6. Display `altText` for accessibility when available

### Admin Forms
- Product creation/update: include image upload section
- Banner creation/update: include image upload section
- Image replacement: provide "replace image" functionality
- Image deletion: provide "remove image" with reference warning

The frontend developer should be able to connect their pages without guessing, using the exact endpoint, method, request, query, response, and error specifications above.

---

## Security Review (Pre-Finish Checklist)

### Before completing Phase 6, verify:

- [ ] `CLOUDINARY_API_SECRET` is server-only (never in `.env.example` committed to Git)
- [ ] `CLOUDINARY_CLOUD_NAME` and `CLOUDINARY_API_KEY` can be public or server-only
- [ ] Firebase Admin SDK is server-only
- [ ] Admin authorization enforced on all media endpoints (`401`/`403`)
- [ ] File size limited to 5MB maximum
- [ ] File type validated (JPEG, PNG, WebP, GIF only)
- [ ] No arbitrary remote URL ingestion (no SSRF)
- [ ] No unrestricted upload endpoint (admin auth required)
- [ ] No unrestricted delete endpoint (reference safety check)
- [ ] `altText` encouraged but not strictly required (per project requirements)
- [ ] Cloudinary folders organized (`pureblend/products`, `pureblend/banners`, `pureblend/general`)
- [ ] Cleanup on failed database operation considered
- [ ] No secrets exposed in logs or error responses
- [ ] Rate limiting considered for upload endpoints
- [ ] Frontend work preserved (no UI redesign required)
- [ ] Latest remote changes pulled before push
- [ ] Validation rerun after integration
- [ ] Changes pushed successfully

---

## Definition of Done

- [ ] Cloudinary service implemented (`src/lib/cloudinary/service.ts`)
- [ ] Cloudinary schemas implemented (`src/lib/cloudinary/schemas/`)
- [ ] Admin upload endpoint implemented (`src/app/api/admin/media/route.ts`)
- [ ] Admin delete endpoint implemented (`src/app/api/admin/media/route.ts`)
- [ ] Admin replace endpoint considered in cloudinary service
- [ ] MIME validation implemented
- [ ] File-size validation implemented (5MB max)
- [ ] Image metadata Zod schema implemented
- [ ] Product image workflow supported (integrated with existing `ProductImage` interface)
- [ ] Banner image workflow supported (similar pattern to products)
- [ ] Image reference safety considered (check before delete)
- [ ] Cloudinary folders organized (`pureblend/products`, `pureblend/banners`, `pureblend/general`)
- [ ] Error handling implemented (all error codes documented)
- [ ] Cleanup on failed database operation considered
- [ ] No secrets exposed
- [ ] Frontend contract updated (`docs/05-backend-integration/api-contract.md`)
- [ ] Frontend work preserved
- [ ] Latest remote changes pulled before push
- [ ] Validation rerun after integration
- [ ] Changes pushed successfully# #   I m p l e m e n t a t i o n   N o t e s      P h a s e   7   ( C o n t a c t   F o r m   +   S M T P )  
  
 # #   I m p l e m e n t a t i o n   N o t e s      P h a s e   7   ( C o n t a c t   F o r m   +   S M T P )  
 # # #   C o n t a c t   A P I  
 -   ` P O S T   / a p i / c o n t a c t `      P u b l i c   e n d p o i n t   f o r   c o n t a c t   f o r m   s u b m i s s i o n s  
 -   N o   a u t h e n t i c a t i o n   r e q u i r e d      v i s i t o r s   d o   n o t   n e e d   a n   a c c o u n t  
 # # #   C o n t a c t   R e q u e s t  
 