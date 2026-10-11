# 03 — API Contract: PureBlend Food Chemicals

## 1. Overview

This document defines the API contract between the frontend and backend developers. All public and admin endpoints follow consistent patterns for request/response shapes, authentication, and error handling.

## 2. Base URL & Conventions

| Item | Value |
|------|-------|
| **Base URL** | `/api/` (relative to Next.js app root) |
| **API Prefix** | All backend routes under `src/app/api/...` |
| **HTTP Methods** | GET, POST, PATCH, DELETE as specified |
| **Content-Type** | `application/json` for request/response bodies |
| **Date Format** | ISO 8601 UTC: `2026-10-11T17:30:00.000Z` |
| **ID Format** | CUID strings (`cuid()`) |
| **Slug Format** | lowercase, hyphenated: `sodium-benzoate-premium` |
| **Pagination** | `page` (default 1) × `limit` (default 20, max 100) |

## 3. Standard API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}
```

### HTTP Status Codes
| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET, PATCH with data |
| 201 | Created | Successful POST with resource creation |
| 400 | Bad Request | Invalid request format/body |
| 401 | Unauthenticated | Missing/invalid Firebase ID token |
| 403 | Forbidden | Authenticated but not admin |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Duplicate slug, unique constraint |
| 422 | Validation Error | Zod schema validation failed |
| 429 | Rate Limited | Too many requests per IP |
| 500 | Internal Error | Unexpected server failure |
| 503 | Unavailable | External service (SMTP, Cloudinary, OpenAI) down |

## 4. Public Endpoints (No Auth Required)

### 4.1 Products

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/products` | List published products with pagination and optional filters | No |
| `GET` | `/api/products?featured=true` | List featured published products | No |
| `GET` | `/api/products/:slug` | Get product by slug | No |
| `GET` | `/api/products/category/:categorySlug` | Get products in a category | No |

**Query Parameters (all optional)**:
- `page`: number (default: 1)
- `limit`: number (default: 20, max: 100)
- `search`: string — fuzzy match on name/description
- `category`: string — filter by category slug
- `published`: boolean (default: true)
- `featured`: boolean

**Success Response (GET /api/products)**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "cuid-value",
        "name": "Sodium Benzoate Premium Grade",
        "slug": "sodium-benzoate-premium",
        "shortDescription": "Preservative for acidic beverages",
        "featured": false,
        "published": true,
        "images": [
          { "url": "https://res.cloudinary.com/...", "alt": "Sodium benzoate product" }
        ],
        "createdAt": "2026-10-01T10:00:00.000Z"
      }
    ],
    "total": 47,
    "page": 1,
    "totalPages": 3
  }
}
```

**Success Response (GET /api/products/:slug)**:
```json
{
  "success": true,
  "data": { ...product fields... }
}
```

### 4.2 Categories

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/categories` | List all categories | No |
| `GET` | `/api/categories/:slug` | Get category by slug | No |

### 4.3 Banners

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/banners` | List active banners (scheduled validation) | No |
| `GET` | `/api/banners/active` | Get only active banners | No |

### 4.4 Offers

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/offers` | List offers with status filtering | No |
| `GET` | `/api/offers/active` | Get only ACTIVE offers (DRAFT/SCHEDULED/EXPIRED filtered) | No |

### 4.5 FAQs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/faqs` | List published FAQs | No |
| `GET` | `/api/faqs/published` | Get only published FAQs | No |

### 4.6 Contact Form

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/contact` | Submit contact form (rate-limited, honeypot) | No |

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Technical Inquiry",
  "message": "What is the CAS number for...",
  "honeypot": ""
}
```

**Success Response**:
```json
{ "success": true, "data": { "ok": true } }
```

### 4.7 SEO Data

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/seo?entityType=PRODUCT&entityId=:id` | Get SEO data for entity | No |

### 4.7 Chatbot

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/chat` | Send message to AI chatbot (rate-limited, validated) | No |

**Request Body**:
```json
{
  "message": "What is the shelf life of citric acid?",
  "conversationId": "optional-session-token"
}
```

**Success Response**:
```json
{
  "success": true,
  "data": {
    "reply": "Based on our technical specifications...",
    "conversationId": "generated-or-provided",
    "sources": [
      { "title": "Citric Acid Technical Data Sheet", "url": "..." }
    ]
  }
}
```

## 5. Admin Endpoints (Firebase Auth Required)

### 5.1 Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/login` | Admin login → verify Firebase token → return custom session | No (public, but validates credentials) |
| `POST` | `/api/auth/verify` | Verify Firebase ID token and check admin claims | Bearer token |

**Login Request**:
```json
{
  "email": "admin@pureblend.com",
  "password": "..." // Firebase Auth password
}
```

**Login Response (success)**:
```json
{
  "success": true,
  "data": {
    "idToken": "firebase-custom-or-id-token",
    "adminUser": {
      "id": "admin-uid",
      "email": "admin@pureblend.com",
      "name": "Admin Name",
      "role": "ADMIN"
    }
  }
}
```

### 5.2 Products (Admin)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/admin/products` | Create new product | Admin |
| `PATCH` | `/api/admin/products/:id` | Update product | Admin |
| `DELETE` | `/api/admin/products/:id` | Delete product | Admin |

**POST /api/admin/products Request Body**:
```json
{
  "name": "Sodium Benzoate Premium Grade",
  "slug": "sodium-benzoate-premium",
  "description": "Preservative for acidic beverages",
  "categoryId": "category-uid",
  "specifications": [{ "label": "CAS", "value": "532-32-1" }],
  "images": [
    { "url": "https://res.cloudinary.com/...", "alt": "Product photo", "isPrimary": true }
  ],
  "published": true,
  "featured": true,
  "seo": {
    "metaTitle": "Sodium Benzoate Premium Grade",
    "metaDescription": "Premium grade sodium benzoate preservative"
  }
}
```

**Success Response (POST)**:
```json
{ "success": true, "data": { "id": "new-product-cuid" } }
```

**PATCH /api/admin/products/:id Response**: Updated product summary

### 5.3 Categories (Admin)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/admin/categories` | Create category | Admin |
| `PATCH` | `/api/admin/categories/:id` | Update category | Admin |
| `DELETE` | `/api/admin/categories/:id` | Delete category | Admin |

**POST /api/admin/categories Request**:
```json
{
  "name": "Preservatives",
  "slug": "preservatives",
  "description": "Chemical preservatives and shelf-life extenders",
  "displayOrder": 0
}
```

### 5.4 Banners (Admin)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/admin/banners` | Create banner | Admin |
| `PATCH` | `/api/admin/banners/:id` | Update banner | Admin |
| `DELETE` | `/api/admin/banners/:id` | Delete banner | Admin |
| `POST` | `/api/admin/banners/reorder` | Reorder banners | Admin |

### 5.5 Offers (Admin)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/admin/offers` | Create offer | Admin |
| `PATCH` | `/api/admin/offers/:id` | Update offer | Admin |
| `DELETE` | `/api/admin/offers/:id` | Delete offer | Admin |

### 5.6 FAQs (Admin)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/admin/faqs` | Create FAQ | Admin |
| `PATCH` | `/api/admin/faqs/:id` | Update FAQ | Admin |
| `DELETE` | `/api/admin/faqs/:id` | Delete FAQ | Admin |

### 5.7 Pages (Admin)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/admin/pages` | Create CMS page | Admin |
| `PATCH` | `/api/admin/pages/:id` | Update CMS page | Admin |
| `DELETE` | `/api/admin/pages/:id` | Delete CMS page | Admin |

### 5.8 SEO (Admin)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/admin/seo` | Upsert SEO data | Admin |
| `DELETE` | `/api/admin/seo?entityType=PRODUCT&entityId=:id` | Delete SEO data | Admin |

### 5.9 Admin Users

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/admin/users` | List all admin users (SUPERADMIN+ only) | Superadmin |
| `POST` | `/api/admin/users` | Create admin user | SUPERADMIN |
| `PATCH` | `/api/admin/users/:id` | Update admin role/status | SUPERADMIN |

## 6. Authentication Flow

### 6.1 Admin Login
1. Admin provides email/password to `/api/auth/login`
2. Backend verifies credentials via Firebase Admin SDK
3. Backend verifies user has `role: "ADMIN"` or `role: "SUPERADMIN"` custom claim
4. Backend returns Firebase ID token (or custom session cookie)
5. Client stores token; includes in `Authorization: Bearer <token>` header

### 6.2 Protected Endpoint Middleware
Every `/api/admin/*` endpoint must:
1. Extract Bearer token from `Authorization` header
2. Verify token via `firebase-admin/auth().verifyIdToken(token)`
3. Check decoded claims: `decoded.role === "ADMIN" || decoded.role === "SUPERADMIN"`
4. If check fails → return `{ success: false, error: { code: "FORBIDDEN", message: "Administrative privileges required" } }`, status 403

### 6.3 Token Revocation
- Custom claims can be revoked: `admin.auth().setCustomUserClaims(uid, { role: null })`
- Admin session invalidated on password change or account deletion
- Frontend should refresh auth state on `auth/id-token-revoked` event

## 7. Image Upload Flow (Admin)

### 7.1 Cloudinary Upload
1. Admin selects file in CMS → `POST /api/admin/upload/init` (returns signed URL)
2. Frontend uploads file directly to Cloudinary via signed URL
3. Cloudinary returns: `{ secureUrl, publicId, width, height, format, bytes }`
4. Backend creates Firestore document with Cloudinary metadata
5. Response includes: `{ url: secureUrl, publicId, alt, isPrimary }`

**Never**: Expose `CLOUDINARY_API_SECRET` to browser. All uploads go through server-controlled signed URLs.

### 7.2 Upload Init Endpoint
```http
POST /api/admin/upload/init
```
**Request Body**:
```json
{
  "folder": "products",  // optional: "banners", "cms", etc.
  "uploadType": "image", // "image" or "document"
  "altText": "Product photo alt text"
}
```

**Success Response**:
```json
{
  "success": true,
  "data": {
    "cloudinaryUploadUrl": "https://api.cloudinary.com/v1_1/cloudname/image/upload",
    "cloudinaryCloudName": "pureblend-media",
    "cloudinaryPreset": "preset-name-or-empty",
    "expiresAt": "2026-10-11T18:00:00.000Z",
    "hint": { "maxSize": 5242880, "allowedTypes": ["image/jpeg", "image/png", "image/webp"] }
  }
}
```

## 8. Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/contact` | 5 submissions | per 10 minutes per IP |
| `/api/chat` | 10 messages | per 10 minutes per IP |
| `/api/auth/login` | 3 attempts | per 10 minutes per IP |
| `/api/admin/*` | 60 requests | per 1 minute per admin user |

Rate limit middleware is applied in the route handler before business logic.

## 9. Error Code Reference

| Code | Meaning | HTTP Status |
|------|---------|-------------|
| `VALIDATION_ERROR` | Zod schema failed | 422 |
| `UNAUTHENTICATED` | Missing/invalid token | 401 |
| `FORBIDDEN` | No admin privileges | 403 |
| `NOT_FOUND` | Resource doesn't exist | 404 |
| `CONFLICT` | Duplicate slug/unique violation | 409 |
| `RATE_LIMITED` | Too many requests | 429 |
| `CONFLICT_SLUG` | Slug already exists | 409 |
| `UNAVAILABLE` | External service down | 503 |
| `SERVER_ERROR` | Unexpected internal error | 500 |

## 10. Pagination Contract

```typescript
interface PaginationMeta {
  page: number;      // current page (1-indexed)
  limit: number;     // items per page (max 100)
  total: number;     // total items across all pages
  totalPages: number; // ceil(total / limit)
}
```

**Query Parameters**:
- `page`: default 1
- `limit`: default 20, max 100

**Link Headers** (optional, for client-side pagination):
```
Link: /api/products?page=2&limit=20; rel="next"
Link: /api/products?page=5&limit=20; rel="prev"
```

## 11. SEO Response Shape

```json
{
  "metaTitle": "Optional page title (max 70 chars)",
  "metaDescription": "Optional meta description (max 160 chars)",
  "canonicalUrl": "Optional canonical URL override",
  "ogImage": "Optional Open Graph image URL"
}
```

## 12. Product Image Object Shape (across all APIs)

```json
{
  "url": "https://res.cloudinary.com/pureblend-media/...",  // secure CDN URL
  "alt": "Accessible descriptive alt text",
  "isPrimary": true/false,
  "width": 1200,  // optional, from Cloudinary
  "height": 800,  // optional, from Cloudinary
  "publicId": "pureblend/products/sodium-benzoate-main"  // optional, for delete/replace
}
```

## 13. Admin User Object Shape (returned in auth responses)

```json
{
  "id": "FIRestore-uid-or-cuid",
  "email": "admin@pureblend.com",
  "name": "Admin Name",
  "role": "SUPERADMIN" | "ADMIN" | "EDITOR",
  "isActive": true
}
```

## 14. Offer Status Object (in offer response)

```json
{
  "status": "DRAFT" | "SCHEDULED" | "ACTIVE" | "EXPIRED"
}
```

This is computed at read time based on `active`, `validFrom`, `validTo`, and current server time.

## 15. FAQ Response Shape

```json
{
  "id": "faq-cuid",
  "question": "Technical question text",
  "answer": "Verified answer text",
  "published": true,
  "sortOrder": 0,
  "createdAt": "2026-10-01T10:00:00.000Z"
}
```

## 16. Page Response Shape (with sections)

```json
{
  "id": "page-cuid",
  "pageKey": "about",
  "title": "About PureBlend",
  "sections": [
    {
      "id": "section-cuid",
      "heading": "Company Overview",
      "body": "...markdown or html..."
    }
  ]
}
```

---

## 17. API Contract Summary Table

| Category | Public Endpoints | Admin Endpoints | Auth Required |
|----------|-----------------|-----------------|---------------|
| Products | GET /api/products, GET /api/products/:slug | POST/PATCH/DELETE /api/admin/products | Firebase ID token |
| Categories | GET /api/categories, GET /api/categories/:slug | POST/PATCH/DELETE /api/admin/categories | Firebase ID token |
| Banners | GET /api/banners, GET /api/banners/active | POST/PATCH/DELETE /api/admin/banners | Firebase ID token |
| Offers | GET /api/offers, GET /api/offers/active | POST/PATCH/DELETE /api/admin/offers | Firebase ID token |
| FAQs | GET /api/faqs, GET /api/faqs/published | POST/PATCH/DELETE /api/admin/faqs | Firebase ID token |
| Contact | POST /api/contact | — | None (rate-limited) |
| SEO | GET /api/seo | POST/DELETE /api/admin/seo | Firebase ID token |
| Chat | POST /api/chat | — | None (rate-limited) |
| Auth | POST /api/auth/login | — | None (validates credentials) |
| Admin Users | — | GET/POST/PATCH /api/admin/users | SUPERADMIN only |

## 18. Breaking Change Policy

Any breaking API change must:
1. Be documented in this file with a version marker
2. Maintain backward compatibility where possible (additive changes only)
3. Notify the frontend developer at least 1 week before deployment
4. Update `docs/frontend-backend-contract.md` simultaneously

If a breaking change is unavoidable:
1. Deprecate the old endpoint alongside the new one
2. Keep the old endpoint functional for 30 days minimum
3. Return `301 Moved Permanently` with new URL in response headers for one cycle