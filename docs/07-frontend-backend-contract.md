# 07 — Frontend/Backend Contract: PureBlend Food Chemicals

## 1. Purpose

This document becomes the **contract between the frontend and backend developers**. It documents all endpoints, request/response shapes, authentication expectations, error formats, and data conventions. Neither developer should modify this document casually without coordinating with the other.

## 2. Project Context

- **Framework**: Next.js 16 (app router)
- **Backend**: Firebase Firestore + Firebase Admin SDK + Next.js API routes
- **Database**: Firestore (NoSQL, document-based)
- **Image Storage**: Cloudinary (CDN URLs stored in Firestore)
- **Authentication**: Firebase Auth + Custom Claims (admin role)
- **Validation**: Zod schemas (backend mandatory)
- **Language**: TypeScript (strict mode)

## 3. Data Conventions

### 3.1 ID Format
- **All IDs**: CUID strings (`cuid()` generated)
- **Pattern**: `cij01ab23e00001` (21 characters, URL-safe)
- **Usage**: Document IDs, document reference IDs, custom claim UIDs

### 3.2 Slug Format
- **Pattern**: lowercase, hyphenated: `sodium-benzoate-premium`
- **Characters**: `[a-z0-9]+(?:-[a-z0-9]+)*`
- **Enforcement**: Application-layer check + Firestore security rule

### 3.3 Date Format
- **API Responses**: ISO 8601 UTC: `2026-10-11T17:30:00.000Z`
- **Firestore Storage**: `Timestamp` objects (converted at service layer)
- **Client Display**: Localized via `Intl.DateTimeFormat` or frontend library

### 3.4 Image Object Format (shared across all APIs)
```json
{
  "url": "https://res.cloudinary.com/pureblend-media/...",  // secure CDN URL
  "alt": "Accessible descriptive alt text",
  "isPrimary": true|false,
  "width": 1200,  // optional, from Cloudinary
  "height": 800,  // optional, from Cloudinary
  "publicId": "pureblend/products/sodium-benzoate-main"  // optional, for delete/replace
}
```

### 3.5 Offer Status (computed at read time)
```json
{
  "status": "DRAFT" | "SCHEDULED" | "ACTIVE" | "EXPIRED"
}
```
- `DRAFT`: `!active`
- `SCHEDULED`: `active ∧ validFrom > now`
- `EXPIRED`: `active ∧ validTo < now`
- `ACTIVE`: `active ∧ validFrom ≤ now ∧ validTo ≥ now`

### 3.6 FAQ Published Filter
- `published=true` → visible in public queries
- `published=false` → hidden from public, accessible to admins only

### 3.7 Banner Active Status
- `active=true ∧ now >= startDate ∧ now <= endDate` → ACTIVE
- Otherwise → not rendered (inactive)

---

## 4. Endpoint Catalog

### 4.1 Public Endpoints (No Auth Required)

| Method | Endpoint | Description | Response Shape |
|--------|----------|-------------|----------------|
| `GET` | `/api/products` | List published products with pagination | `{ success: true, data: { items: Product[], total: number, page: number, totalPages: number } }` |
| `GET` | `/api/products/:slug` | Get product by slug | `{ success: true, data: Product }` |
| `GET` | `/api/categories` | List all categories | `{ success: true, data: Category[] }` |
| `GET` | `/api/categories/:slug` | Get category by slug | `{ success: true, data: Category }` |
| `GET` | `/api/banners` | List all banners | `{ success: true, data: Banner[] }` |
| `GET` | `/api/banners/active` | List active banners only | `{ success: true, data: Banner[] }` |
| `GET` | `/api/offers` | List offers | `{ success: true, data: Offer[] }` |
| `GET` | `/api/offers/active` | List ACTIVE offers only | `{ success: true, data: Offer[] }` |
| `GET` | `/api/faqs` | List published FAQs | `{ success: true, data: Faq[] }` |
| `GET` | `/api/seo` | Get SEO data | `{ success: true, data: SEO | null }` |
| `POST` | `/api/contact` | Submit contact form | `{ success: true, data: { ok: true } }` |
| `POST` | `/api/chat` | Send message to AI chatbot | `{ success: true, data: { reply, conversationId, sources } }` |

### 4.2 Admin Endpoints (Firebase Auth + Role Check Required)

| Method | Endpoint | Required Role | Description |
|--------|----------|---------------|-------------|
| `POST` | `/api/auth/login` | Any (validates credentials) | Admin login → returns Firebase ID token |
| `POST` | `/api/auth/verify` | Bearer token | Verify token + check admin claims |
| `POST` | `/api/admin/products` | ADMIN or SUPERADMIN | Create product |
| `PATCH` | `/api/admin/products/:id` | ADMIN or SUPERADMIN | Update product |
| `DELETE` | `/api/admin/products/:id` | ADMIN or SUPERADMIN | Delete product |
| `POST` | `/api/admin/categories` | ADMIN or SUPERADMIN | Create category |
| `PATCH` | `/api/admin/categories/:id` | ADMIN or SUPERADMIN | Update category |
| `DELETE` | `/api/admin/categories/:id` | ADMIN or SUPERADMIN | Delete category |
| `POST` | `/api/admin/banners` | ADMIN or SUPERADMIN | Create banner |
| `PATCH` | `/api/admin/banners/:id` | ADMIN or SUPERADMIN | Update banner |
| `DELETE` | `/api/admin/banners/:id` | ADMIN or SUPERADMIN | Delete banner |
| `POST` | `/api/admin/offers` | ADMIN or SUPERADMIN | Create offer |
| `PATCH` | `/api/admin/offers/:id` | ADMIN or SUPERADMIN | Update offer |
| `DELETE` | `/api/admin/offers/:id` | ADMIN or SUPERADMIN | Delete offer |
| `POST` | `/api/admin/faqs` | ADMIN or SUPERADMIN | Create FAQ |
| `PATCH` | `/api/admin/faqs/:id` | ADMIN or SUPERADMIN | Update FAQ |
| `DELETE` | `/api/admin/faqs/:id` | ADMIN or SUPERADMIN | Delete FAQ |
| `POST` | `/api/admin/pages` | ADMIN or SUPERADMIN | Create CMS page |
| `PATCH` | `/api/admin/pages/:id` | ADMIN or SUPERADMIN | Update CMS page |
| `DELETE` | `/api/admin/pages/:id` | ADMIN or SUPERADMIN | Delete CMS page |
| `POST` | `/api/admin/seo` | ADMIN or SUPERADMIN | Upsert SEO data |
| `DELETE` | `/api/admin/seo` | ADMIN or SUPERADMIN | Delete SEO data by entity |
| `GET` | `/api/admin/users` | SUPERADMIN only | List all admin users |
| `POST` | `/api/admin/users` | SUPERADMIN only | Create admin user |
| `PATCH` | `/api/admin/users/:id` | SUPERADMIN only | Update admin role/status |

### 4.3 Upload Endpoint

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/admin/upload/init` | Bearer token (admin) | Get signed Cloudinary upload URL |
| (frontend upload) | Direct to Cloudinary | N/A | Frontend uploads file to signed URL |

---

## 5. Request/Response Shapes

### 5.1 Success Response (all endpoints)
```json
{
  "success": true,
  "data": { ... }
}
```

### 5.2 Error Response (all endpoints)
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "User-friendly error message",
    "details": [
      { "field": "fieldName", "message": "Field-specific message" }
    ]
  }
}
```

### 5.3 Standard Error Codes

| Code | Meaning | HTTP Status | When Used |
|------|---------|-------------|-----------|
| `VALIDATION_ERROR` | Zod schema failed | 422 | Request body doesn't match expected shape |
| `UNAUTHENTICATED` | Missing/invalid token | 401 | No `Authorization` header or invalid Firebase token |
| `FORBIDDEN` | No admin privileges | 403 | Token verified but role !== ADMIN/SUPERADMIN |
| `NOT_FOUND` | Resource doesn't exist | 404 | Product/category/offer/FAQ ID not found |
| `CONFLICT` | Duplicate/unique violation | 409 | Slug already exists, unique constraint |
| `RATE_LIMITED` | Too many requests | 429 | IP or user exceeded rate limit |
| `UNAVAILABLE` | External service down | 503 | SMTP, Cloudinary, OpenAI not responding |
| `SERVER_ERROR` | Unexpected internal error | 500 | Bug or unexpected failure |
| `KNOWLEDGE_NOT_AVAILABLE` | RAG can't answer | 400 (or 200 with error field) | Chatbot question outside approved knowledge |

### 5.4 Validation Error Details Format
```json
{
  "details": [
    { "field": "name", "message": "Name must be at least 2 characters" },
    { "field": "email", "message": "A valid email is required" },
    { "field": "subject", "message": "Subject must be at least 3 characters" },
    { "field": "message", "message": "Message must be at least 10 characters" }
  ]
}
```

### 5.5 Product Response Shape (public & admin)
```json
{
  "id": "cuid-value",
  "name": "Sodium Benzoate Premium Grade",
  "slug": "sodium-benzoate-premium",
  "shortDescription": "Preservative for acidic beverages",
  "description": "Full chemical and application description",
  "specifications": [
    { "label": "CAS", "value": "532-32-1" }
  ],
  "images": [
    {
      "url": "https://res.cloudinary.com/pureblend-media/image/upload/...",
      "alt": "Sodium benzoate product photo",
      "isPrimary": true
    }
  ],
  "featured": false,
  "published": true,
  "seoTitle": "Optional SEO title",
  "metaDescription": "Optional meta description",
  "ogImage": "Optional Open Graph image",
  "createdAt": "2026-10-01T10:00:00.000Z",
  "updatedAt": "2026-10-15T14:30:00.000Z"
}
```

### 5.6 Category Response Shape
```json
{
  "id": "cuid-value",
  "name": "Preservatives",
  "slug": "preservatives",
  "description": "Chemical preservatives and shelf-life extenders",
  "displayOrder": 0,
  "createdAt": "2026-09-28T08:00:00.000Z",
  "updatedAt": "2026-10-02T12:00:00.000Z"
}
```

### 5.7 Banner Response Shape
```json
{
  "id": "cuid-value",
  "title": "Summer Savings",
  "description": "15% off all preservatives",
  "imageUrl": "https://res.cloudinary.com/pureblend-media/...",
  "imageAlt": "Banner advertising preservatives",
  "linkUrl": "/acidulants",
  "linkLabel": "Explore Acidulants",
  "displayOrder": 1,
  "active": true,
  "createdAt": "2026-09-30T11:00:00.000Z",
  "updatedAt": "2026-10-03T09:00:00.000Z"
}
```

### 5.8 Offer Response Shape (with computed status)
```json
{
  "id": "cuid-value",
  "title": "Q4 Bulk Discount",
  "description": "15% off orders over 100kg",
  "discountText": "15% Off",
  "imageUrl": "https://res.cloudinary.com/...",
  "active": true,
  "status": "ACTIVE",  // computed: DRAFT/SCHEDULED/ACTIVE/EXPIRED
  "createdAt": "2026-10-01T10:00:00.000Z",
  "updatedAt": "2026-10-05T14:00:00.000Z"
}
```

### 5.9 FAQ Response Shape
```json
{
  "id": "cuid-value",
  "question": "What is the CAS number for sodium benzoate?",
  "answer": "The CAS number for sodium benzoate is 532-32-1.",
  "published": true,
  "displayOrder": 0,
  "createdAt": "2026-09-29T08:00:00.000Z",
  "updatedAt": "2026-10-04T10:00:00.000Z"
}
```

### 5.10 Chat Response Shape
```json
{
  "success": true,
  "data": {
    "reply": "Based on our technical specifications for sodium benzoate, the CAS number is 532-32-1.",
    "conversationId": "session-12345-xyz",
    "sources": [
      { "title": "Sodium Benzoate Technical Data Sheet", "referenceType": "PRODUCT_SPEC" }
    ]
  }
}
```

**Refusal format** (when knowledge not available):
```json
{
  "success": false,
  "error": {
    "code": "KNOWLEDGE_NOT_AVAILABLE",
    "message": "I do not have verified information in the PureBlend catalog to answer that question. Please contact our technical team."
  }
}
```

### 5.11 Contact Form Response Shape
```json
{
  "success": true,
  "data": { "ok": true }
}
```

### 5.12 Admin User Response Shape
```json
{
  "id": "admin-uid",
  "email": "admin@pureblend.com",
  "name": "Admin Name",
  "role": "SUPERADMIN",  // or "ADMIN", "EDITOR"
  "isActive": true
}
```

### 5.13 SEO Response Shape
```json
{
  "metaTitle": "Optional page title (max 70 chars)",
  "metaDescription": "Optional meta description (max 160 chars)",
  "canonicalUrl": "Optional canonical URL override",
  "ogImage": "Optional Open Graph preview image URL"
}
```

---

## 6. Authentication Contract

### 6.1 Login Request
```json
{
  "email": "admin@pureblend.com",
  "password": "admin-password"
}
```

### 6.2 Login Success Response
```json
{
  "success": true,
  "data": {
    "idToken": "firebase-custom-token-or-id-token",
    "adminUser": {
      "id": "admin-uid",
      "email": "admin@pureblend.com",
      "name": "Admin Name",
      "role": "ADMIN"
    }
  }
}
```

### 6.3 Protected Endpoint Request
```
Authorization: Bearer <firebase-id-token>
```

### 6.4 Protected Endpoint Verification (backend)
1. Extract Bearer token from `Authorization` header
2. Verify via `firebaseAdmin.auth().verifyIdToken(token)`
3. Check `decoded.customClaims?.role`
4. If `!== "ADMIN" && !== "SUPERADMIN"` → return `403 Forbidden`
5. Otherwise → proceed with business logic

### 6.5 Token Refresh
- Firebase ID tokens valid for ~1 hour
- Client: `user.getIdTokenRefreshToken()` 
- On 401, client should refresh token and retry request

### 6.6 Logout
- Client removes token from memory/storage
- No server-side invalidation required (stateless)
- Token expires naturally after TTL

---

## 7. Error Handling Contract

### 7.1 Never Expose to Clients
- Stack traces (dev only, logged server-side)
- Firebase Admin private keys
- Cloudinary API secret
- SMTP passwords or connection strings
- Complete authentication tokens
- Database connection strings
- Internal implementation details

### 7.2 Always Return Standard Format
```json
{ "success": false, "error": { "code": "CODE", "message": "User-friendly message" } }
```

### 7.3 Logging (Server-Side Only)
- Structured JSON logs with request ID, latency, user ID (redacted)
- Log: passwords, private keys, API secrets, full auth tokens
- Log: enough to debug failures (endpoint, error code, latency, outcome)

### 7.4 Error Priority
1. Validation errors (422) — Zod schema failures
2. Auth errors (401/403) — missing/invalid token, insufficient role
3. Not found (404) — resource doesn't exist
4. Conflict (409) — duplicate slug, unique constraint
5. Rate limited (429) — too many requests
6. Service unavailable (503) — external service down
7. Server error (500) — unexpected internal failure

---

## 8. Rate Limiting Contract

| Endpoint | Limit | Window | Key |
|----------|-------|--------|-----|
| `/api/auth/login` | 3 attempts | 10 minutes | Client IP |
| `/api/contact` | 5 submissions | 10 minutes | Client IP |
| `/api/chat` | 10 messages | 10 minutes | Client IP |
| `/api/admin/products` | 60 requests | 1 minute | Authenticated admin user |
| `/api/admin/categories` | 60 requests | 1 minute | Authenticated admin user |
| All other `/api/admin/*` | 60 requests | 1 minute | Authenticated admin user |

Rate limit middleware returns:
```json
{ "success": false, "error": { "code": "RATE_LIMITED", "message": "Too many requests. Please try again later." } }
```
HTTP 429.

---

## 9. Image Upload Contract

### 9.1 Init Request (admin)
```json
{
  "folder": "products",     // optional: "banners", "cms"
  "uploadType": "image",  // "image" or "document"
  "altText": "Product photo alt text"
}
```

### 9.2 Init Success Response
```json
{
  "success": true,
  "data": {
    "cloudinaryUploadUrl": "https://api.cloudinary.com/v1_1/pureblend-media/image/upload",
    "cloudinaryCloudName": "pureblend-media",
    "cloudinaryPreset": "optional-preset-name",
    "expiresAt": "2026-10-11T18:00:00.000Z",
    "hint": {
      "maxSize": 5242880,     // 5 MB in bytes
      "allowedTypes": ["image/jpeg", "image/png", "image/webp"]
    }
  }
}
```

### 9.3 Frontend Upload Flow
1. Receive signed URL from `/api/admin/upload/init`
2. Upload file directly to Cloudinary via signed URL (browser `POST` or `PUT`)
3. Cloudinary returns `{ secureUrl, publicId, width, height, format, bytes }` to frontend
4. Frontend passes `{ url: secureUrl, publicId, alt, isPrimary }` to admin form submit
5. Backend persists Cloudinary metadata to Firestore alongside the resource

### 9.4 Never Expose
- `CLOUDINARY_API_SECRET` to browser
- Direct upload endpoint without signature verification

---

## 10. Pagination Contract

### 9.1 Query Parameters (all optional)
- `page`: number (default: 1, 1-indexed)
- `limit`: number (default: 20, max: 100)

### 9.2 Success Response Pagination Meta
```json
{
  "data": {
    "items": [...],
    "total": 47,
    "page": 1,
    "totalPages": 3
  }
}
```

### 9.3 Optional Link Headers (HTTP Link header, RFC 8288)
```
Link: /api/products?page=2&limit=20; rel="next"
Link: /api/products?page=5&limit=20; rel="prev"
```

### 9.4 Client-Side Pagination Logic
```typescript
interface PaginationState {
  page: number;        // current page
  limit: number;       // items per page
  setPage: (p: number) => void;
  totalPages: number;  // ceil(total / limit)
}
```

---

## 11. Breaking Change Policy

**Any breaking API change must**:

1. Be documented in this file with a version marker (e.g., `## Version 2.0 — 2026-10-11`)
2. Maintain backward compatibility where possible (additive changes only)
3. Notify the other developer at least 1 week before deployment
4. Update this `docs/07-frontend-backend-contract.md` file simultaneously

**If a breaking change is unavoidable**:

1. Deprecate the old endpoint alongside the new one (keep both functional for 30 days minimum)
2. Return `301 Moved Permanently` with new URL in response headers for one cycle
3. Update frontend types/interfaces to match new shape
4. Coordinate a deployment window where both old and new are supported

**Examples of non-breaking changes** (acceptable without wide notification):
- Adding optional fields to response shapes
- Adding new query parameters (with defaults)
- Adding new endpoints
- Changing error messages (as long as error CODE remains the same)

**Examples of breaking changes** (require coordination):
- Renaming a field in response JSON
- Removing an endpoint
- Changing HTTP method for an endpoint
- Removing a query parameter that frontend relies on
- Changing response shape significantly

---

## 12. Version History

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | 2026-10-11 | Backend Engineer | Initial contract — Firebase Firestore architecture |
| 1.1 | | | |

*This document is a living contract. Neither developer should modify it without the other's awareness.*