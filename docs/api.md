# PureBlend Food Chemicals — Backend API Documentation

Generated as part of Phase 10: Final Integration & Deployment Preparation.

---

## Table of Contents

1. [Authentication](#authentication)
2. [Public APIs](#public-apis)
3. [Admin APIs](#admin-apis)
4. [Error Response Format](#error-response-format)
5. [Environment Variables](#environment-variables)

---

## 1. Authentication

All admin endpoints require a valid Firebase ID token in the `Authorization: Bearer <token>` header. The backend verifies the token via `checkAdminClaim()` and requires `role: "ADMIN"` or `role: "SUPERADMIN"` in custom claims.

### Login

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/login` | public | Authenticate user via email; return ID token. Admin claims must be granted separately (not during login). |

### Logout

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/logout` | private | Requires valid Firebase ID token |

### Verified Admin Status Check

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/auth` | private | Verify token and check admin claim; returns `isAdmin`, `role`, `uid` |

---

## 2. Public APIs

All endpoints in this section do NOT require authentication. Rate limits apply where noted.

### Products

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/products` | public | List products with filters: `?published=true&feature=true&category=&search=` |
| GET | /api/products/[id] | public | Product detail by ID (published only) |
| GET | /api/products/slug/[slug] | public | Product detail by slug (published only) |

**Query Parameters:**
- `published` (boolean) — filter by published status
- `feature` (boolean) — filter by featured status
- `category` (string) — filter by category name/ID
- `search` (string) — search in name/description

### Categories

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/categories` | public | List categories |
| GET | /api/categories/[id] | public | Category detail by ID (published only) |
| GET | /api/categories/slug/[slug] | public | Category detail by slug (published only) |

### Banners

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/banners` | public | List active banners only (active=true AND startDate<=now AND endDate>=now) |

### Offers

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/offers` | public | List offers filtered by status: `?status=DRAFT|SCHEDULED|ACTIVE|EXPIRED` |
| GET | /api/offers/status/[status] | public | Offer status filtering |

**Status Values:** DRAFT, SCHEDULED, ACTIVE, EXPIRED

### FAQs

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/faqs` | public | List published FAQs only |

### CMS Pages

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/pages/{key}` | public | Access published CMS page by key |

**The `{key}` is the `pageKey` field. Only pages with `published: true` are accessible.**

---

## 3. Admin APIs

All endpoints in this section require admin authorization (`checkAdminClaim()` → 403 Forbidden if missing/invalid).

### Products CRUD

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/admin/products/ | admin | (Not separately listed; use list via products service) |
| POST | /api/admin/products/ | admin | Create product (Zod validation) |
| GET | /api/admin/products/{id} | admin | Product detail by ID |
| PUT/PATCH | /api/admin/products/{id} | admin | Update product by ID |
| DELETE | /api/admin/products/{id} | admin | Delete product by ID |

### Categories CRUD

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/admin/categories/ | admin | Create category (Zod validation; slug uniqueness 409) |
| GET | /api/admin/categories/{id} | admin | Category detail by ID |
| PUT/PATCH | /api/admin/categories/{id} | admin | Update category by ID |
| DELETE | /api/admin/categories/{id} | admin | Delete category (409 if in use) |

**Protection:** Category cannot be deleted if products reference it (409 Conflict).

### Banners CRUD

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/admin/banners/ | admin | Create banner (Zod validation; image upload) |
| POST | /api/admin/banners/reorder | admin | Reorder banners (displayOrder update) |
| DELETE | /api/admin/banners/{id} | admin | Delete banner by publicId |

### Offers CRUD

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/admin/offers/ | admin | Create offer (Zod validation; date validation: validFrom/validTo) |
| POST | /api/admin/offers/{id}/status | admin | Update offer status |
| DELETE | /api/admin/offers/{id} | admin | Delete offer |

### FAQs CRUD

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/admin/faqs/ | admin | Create FAQ (Zod validation) |
| POST | /api/admin/faqs/reorder | admin | Reorder FAQs (displayOrder update) |
| DELETE | /api/admin/faqs/{id} | admin | Delete FAQ by ID |

### CMS Pages CRUD

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/admin/pages/ | admin | Create CMS page (Zod validation; key uniqueness 409) |
| PUT/PATCH | /api/admin/pages/{id} | admin | Update CMS page by ID |
| DELETE | /api/admin/pages/{id} | admin | Delete CMS page by ID |

**Protection:** Page key must be unique (409 Conflict if duplicate).

### Media Management

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/admin/media/upload | admin | Upload image (multipart/form-data; MIME validation JPEG/PNG/WebP/GIF; 5MB limit) |
| POST | /api/admin/media/delete | admin | Delete image by publicId (safety check: IMAGE_IN_USE if referenced) |

### Contact Messages (Admin)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/admin/contacts | admin | List all contact messages |
| GET | /api/admin/contacts/{id} | admin | Get contact message by ID |
| PATCH | /api/admin/contacts/{id}/status | admin | Update message status (UNREAD→READ/ARCHIVED) |

### Knowledge / AI Reindex

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/admin/knowledge/reindex | admin | Reindex knowledge base from Firestore data |

---

## 4. Error Response Format

All APIs follow a consistent error format:

```json
{
  "success": false,
  "error": {
    "code": "...",
    "message": "..."
  }
}
```

**HTTP Status Codes:**
- `400` — Validation error (Zod, rate limited, bad request)
- `401` — Unauthenticated (missing/invalid/expired token)
- `403` — Forbidden (non-admin trying to access admin endpoint)
- `404` — Not found (product/category/banner/offer/FAQ/page)
- `409` — Conflict (slug already in use, category/product in use, duplicate key)
- `422` — Unprocessable entity (Zod validation failures)
- `429` — Too many requests (rate limited)
- `500` — Server error
- `502` — Bad gateway (SMTP delivery failed, inquiry still saved to Firestore)
- `503` — Service unavailable (SMTP not configured)
- `502` — SMTP delivery failed (inquiry saved to Firestore, email could not be sent)

**Success Format:**
```json
{
  "success": true,
  "data": { ... }
}
```

---

## 5. Environment Variables

All secrets are sourced from `process.env.*` in server-side files only. Never commit real values.

### Required Environment Variables (from `.env.example`):

**Firebase Admin SDK (server-only):**
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY` (must have `\\n` escaped newlines)

**Cloudinary (server-only):**
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

**SMTP Email (server-only):**
- `SMTP_HOST`
- `SMTP_PORT` (default: 587)
- `SMTP_USER`
- `SMTP_PASSWORD`
- `SMTP_FROM` (e.g., `PureBlend Inquiries <no-reply@pureblend.example.com>`)
- `CONTACT_RECIPIENT` (e.g., `inquiries@pureblend.example.com`)

**AI & RAG (server-only):**
- `OPENAI_API_KEY`
- `RAG_SIMILARITY_THRESHOLD` (default: 0.70)

**Authentication & Security (server-only):**
- `AUTH_SECRET` (64-character hex string recommended)
- `ADMIN_INITIAL_EMAIL` (set privately for the one-time `npm run admin:bootstrap` command)
- `ADMIN_INITIAL_PASSWORD` (unique password of at least 12 characters; never commit or reuse)

**Public/Browser (safe for client bundle, prefixed with `NEXT_PUBLIC_`):**
- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_SITE_URL` (default: `http://localhost:3000`)
- `NEXT_PUBLIC_USE_MOCK_DATA` (default: `true`)
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

---

## 6. Phase Verification Summary

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Backend architecture, Firestore structure, Firebase Auth setup | ✅ Complete |
| 2 | Firestore data layer + model types | ✅ Complete |
| 3 | Firebase Auth (login/logout/me) + admin claims | ✅ Complete (login no longer promotes admin claims) |
| 4 | Products + Categories CRUD — public listing/filtering/detail, admin CRUD with auth guard, slug uniqueness (409), category-in-use protection (409), pagination, Zod validation | ✅ Complete |
| 5 | Banners (active-only + admin CRUD + reorder), Offers (status filtering DRAFT/SCHEDULED/ACTIVE/EXPIRED using `active`+`startDate`+`endDate`), FAQs (published + admin CRUD + reorder), CMS Pages (key-based published-only, admin CRUD + key uniqueness 409) | ✅ Complete |
| 6 | Cloudinary Media Management — upload/delete/replace service, MIME validation (JPEG/PNG/WebP/GIF), 5MB limit, folder structure (`pureblend/products`, `pureblend/banners`, `pureblend/general`), metadata Zod schemas, reference safety checks before deletion, error codes | ✅ Complete |
| 7 | Contact Form + SMTP — public POST with Zod validation (name, email, phone, company, subject, message), rate limiting (5/10min per IP), honeypot field, Firestore storage in `contactMessages`, SMTP via nodemailer (server-only credentials), on SMTP failure inquiry still saved, admin contact management (list/get/update status with 403 for non-admin), added `phone` and `company` to ContactMessage type | ✅ Complete |
| 8 | Chat/Assistant AI endpoint — public POST with rate limiting (5/min/IP), Zod validation, honeypot, retrieval-augmented generation using PureBlend knowledge base (products/categories/FAQs/solutions/RFQs/batches), grounded answers only (refuses to invent specs/prices), 2000-char message max | ✅ Complete |
| 9 | Security Hardening — critical auth route fix (removed admin claim promotion), security audit report (`docs/security-audit.md`), API security matrix (`docs/api-security-matrix.md` with 43 endpoints), firestore.rules recommended, CORS documented, error leakage fixed, dependency audit (15 transitive vulns), error consistency, logging audit | ✅ Complete |

---

## 7. End-to-End Flow Verification

### Product Flow (Admin → Public → AI)

1. Admin logs in via `POST /api/login` (returns ID token, does NOT promote admin claims)
2. Admin creates category via `POST /api/admin/categories/`
3. Admin uploads product image via `POST /api/admin/media/upload` (multipart, MIME validated, 5MB max)
4. Admin creates product via `POST /api/admin/products/`
5. Product is published ( `published: true` )
6. Public retrieves product via `GET /api/products` or `GET /api/products/[id]`
7. AI retrieves product knowledge via chat endpoint (grounded in knowledge base)

### CMS Flow (Admin → Public → AI)

1. Admin logs in
2. Admin creates/updates CMS page via `POST /api/admin/pages/`
3. Page is published (`published: true`)
4. Public retrieves page via `GET /api/pages/{key}`
5. AI knowledge base reindexes; AI can answer about CMS content

### Banner Flow (Admin → Public)

1. Admin logs in
2. Admin uploads banner image via `POST /api/admin/media/upload`
3. Admin creates banner via `POST /api/admin/banners/`
4. Admin activates banner ( `active: true` with `startDate`/`endDate` )
5. Public retrieves active banners via `GET /api/banners`

### Contact Flow (Visitor → System)

1. Visitor fills contact form
2. Backend validates with Zod (`POST /api/contact`)
3. Rate limited: 5 submissions per 10 minutes per IP
4. Inquiry saved to Firestore `contactMessages` collection with status `UNREAD`
5. SMTP email sent via nodemailer (server-only credentials)
6. On SMTP failure: inquiry still saved; client gets 502 with notice
7. Admin can view messages via `GET /api/admin/contacts` (403 for non-admin)

### Contact Flow (SMTP Failure Behavior)

- **Success**: Client gets `200 { ok: true }`, inquiry saved to Firestore, email sent
- **Failure**: Client gets `502 { error: { code: "DELIVERY_FAILED", message: "Your inquiry has been saved, but we were unable to send the email notification..." } }`, inquiry still saved to Firestore

### Authentication Flow

1. **No token** → `POST /api/auth` → 401 `"No token provided."`
2. **Normal user** (no admin claim) → `GET /api/auth` → 403 `"Administrative privileges required."`
3. **Admin user** (has `role: "ADMIN"` claim) → `GET /api/auth` → 200 with user info and role
4. **Login** → `POST /api/login` → 200 with `idToken` and `adminUser` (role from custom claims, NOT promoted during login)

### RAG / AI Knowledge Flow

1. User sends message to `POST /api/chat`
2. Backend retrieves relevant knowledge via `retrieveKnowledge()` (products, categories, FAQs, solutions, RFQs, quality batches)
2. Grounded prompt built from retrieved chunks only
3. AI generates answer using ONLY the provided context
4. If no relevant knowledge: `"I don't have that information available. Please contact PureBlend directly for detailed specifications."`
5. AI refuses to invent product specifications, prices, certifications, or company claims

---

## 8. Security Recommendations

### Firestore Security Rules (recommended)

Create `firestore.rules` with role-based access control (see `docs/security-audit.md` for full recommended rules). Key rules:

- Public reads: filter by `published: true` where applicable
- Admin mutations: require `checkAdminClaim()` equivalent in rules
- Contact messages: public can create, admin can read/update/delete
- Admin users: SUPERADMIN-only access

### CORS Configuration

Configure specific allowed origins instead of `Access-Control-Allow-Origin: *`. If using credentialed requests, restrict to frontend domain(s).

### Rate Limiting

- `POST /api/contact`: 5 per 10 minutes per IP
- `POST /api/chat`: 5 per 1 minute per IP
- Admin endpoints: Consider adding rate limiting (5-10 per minute per IP)

### Error Handling

- Never return raw `err.message` or stack traces to clients
- Use consistent error format across all endpoints
- Log full errors server-side; return generic messages to clients
- Development mode may include more detail (controlled via `NODE_ENV`)

---

## 9. Deployment Checklist

### Prerequisites

1. Firebase project configured with Admin SDK credentials
2. Cloudinary account with API credentials
3. SMTP email service account (SendGrid, Mailgun, etc. or on-premise)
3. OpenAI API key for RAG subsystem
4. NEXT_PUBLIC_* variables for frontend configuration

### Environment Variables

See section 5 of this document (`docs/api.md`) for the complete list.

### Build & Start Commands

- `npm run dev` — Development mode (Turbopack/next dev)
- `npm run build` — Production build
- `npm start` — Production server start

### CORS

Configure in `next.config.ts` or via hosting platform (Vercel/Netlify):
- Allowed origins: frontend domain(s)
- Credentials: include if using cookie-based auth
- Methods: GET, POST, PUT, DELETE, OPTIONS

### Health Check

`GET /api/health` — returns `{ success: true, data: { status: "ok" } }`

### Production Verification

1. All environment variables configured (no placeholder values)
2. Firebase Auth working (login, logout, token verification)
3. Firestore data accessible (products, categories, etc.)
4. Cloudinary upload/delete working with proper MIME validation
5. SMTP contact form working (test with safe recipient)
6. AI chat endpoint working (grounded responses, no fabrication)
7. Admin endpoints protected (403 for non-admin)
8. Public endpoints accessible without auth
9. Rate limiting active (contact + chat)
10. Security headers configured (next.config.ts already has CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy)

---

## 10. Frontend Integration Notes

### Authentication

- Frontend should store the ID token from `POST /api/login`
- Token sent in `Authorization: Bearer <token>` header for admin routes
- Token verification handled backend via `checkAdminClaim()`
- No client-side `isAdmin` flags; always verify backend

### API Base URL

- Development: `http://localhost:3000/api` (Next.js rewrites)
- Production: configured via `NEXT_PUBLIC_API_BASE_URL` or hosting domain

### Upload Flow

1. FormData with `image` file and `publicId` (product ID, category name, etc.)
2. `POST /api/admin/media/upload` (multipart/form-data)
3. Backend validates MIME type and file size
4. Uploads to Cloudinary with folder: `pureblend/products`, `pureblend/banners`, or `pureblend/general`
5. Returns `publicId` and `secureUrl` for storage in Firestore/product data

### Contact Flow

1. Form fields: name, email, phone, company, subject, message
2. `POST /api/contact` with Zod-validated JSON body
3. Rate limited (5/10min per IP)
4. Inquiry saved to Firestore
5. SMTP email sent (or 502 if failure, inquiry still saved)

### Chat Flow

1. User message (max 2000 chars)
2. `POST /api/chat` with Zod-validated JSON body
3. Rate limited (5/min per IP)
4. Knowledge retrieved from Firestore knowledge base
5. Grounded AI response using only retrieved knowledge
6. If no knowledge: `"I don't have that information available. Please contact PureBlend directly for detailed specifications."`

---

**Document Revision:** Phase 10 — Final Integration & Deployment Preparation
**Generated:** `docs/api.md`