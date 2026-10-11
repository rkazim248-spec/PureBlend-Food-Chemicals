# PureBlend Food Chemicals — Frontend Handoff

Generated as part of Phase 10: Final Integration & Deployment Preparation.

## 1. Authentication Flow

### Login

| Step | Action | Backend Endpoint | Expected Result |
|------|--------|------------------|-----------------|
| 1 | User enters email/password | `POST /api/login` | Returns `{ success: true, data: { idToken, adminUser: { id, email, role } } }` |
| 2 | Store `idToken` in frontend state | — | Token used for all subsequent admin API calls |
| 3 | Token included in `Authorization: Bearer <idToken>` header | — | Backend verifies via `checkAdminClaim()` |

> **Important:** Login does NOT promote users to admin. Admin claims (`role: "ADMIN"` / `role: "SUPERADMIN"`) must be granted separately via:
> - `scripts/set-admin.ts` CLI script
> - Firebase Console > Users > Custom claims
> - Never during the login flow

### Public Access (no token required)

| Endpoint | Purpose | Notes |
|----------|---------|-------|
| `GET /api/products` | List products with filters | No auth required; filters `published`, `feature`, `category`, `search` |
| `GET /api/categories` | List categories | No auth required |
| `GET /api/banners` | List active banners | No auth required; only `active: true` banners |
| `GET /api/offers` | List offers by status | No auth required; `?status=DRAFT|SCHEDULED|ACTIVE|EXPIRED` |
| `GET /api/faqs` | List published FAQs | No auth required |
| `GET /api/pages/{key}` | Access CMS page by key | No auth required; only `published: true` pages |
| `POST /api/contact` | Submit contact form | No auth required; Zod validated, rate limited (5/10min/IP) |
| `POST /api/chat` | AI assistant query | No auth required; rate limited (5/min/IP), grounded RAG |

### Admin Access (token required: `Authorization: Bearer <idToken>`)

| Endpoint | Purpose | Auth Guard |
|----------|---------|-----------|
| `GET /api/auth` | Verify admin status | `checkAdminClaim()` → 403 if not admin |
| `GET /api/admin/me` | Current admin user info | `checkAdminClaim()` → 403 if not admin |
| `POST /api/admin/products/*` | Product CRUD | `checkAdminClaim()` → 403 if not admin |
| `POST /api/admin/categories/*` | Category CRUD | `checkAdminClaim()` → 403 if not admin |
| `POST /api/admin/banners/*` | Banner CRUD | `checkAdminClaim()` → 403 if not admin |
| `POST /api/admin/offers/*` | Offer CRUD | `checkAdminClaim()` → 403 if not admin |
| `POST /api/admin/faqs/*` | FAQ CRUD | `checkAdminClaim()` → 403 if not admin |
| `POST /api/admin/pages/*` | CMS page CRUD | `checkAdminClaim()` → 403 if not admin |
| `POST /api/admin/media/*` | Media upload/delete | `checkAdminClaim()` → 403 if not admin |
| `POST /api/admin/contacts/*` | Contact message management | `checkAdminClaim()` → 403 if not admin |

### No Token / Invalid Token

| Scenario | Endpoint | Expected Response |
|----------|----------|-------------------|
| No token provided | `GET /api/auth` | `401 { code: "UNAUTHENTICATED", message: "No token provided." }` |
| Expired/invalid token | `GET /api/auth` | `401 { code: "INVALID_TOKEN", message: "Invalid or expired token." }` |
| Normal user (no admin claim) | `GET /api/admin/products/*` | `403 { code: "FORBIDDEN", message: "Administrative privileges required." }` |
| Admin user (has `role: "ADMIN"`)` | `GET /api/admin/products/*` | `200` — admin CRUD operations allowed |

## 2. API Base URL

| Environment | Base URL |
|-------------|----------|
| Development | `http://localhost:3000/api` (Next.js internal rewrites) |
| Production | Configured via `NEXT_PUBLIC_API_BASE_URL` environment variable or hosting domain |

**Frontend should use relative paths** (`/api/...`) since Next.js handles API routing. If using a separate backend host, set `NEXT_PUBLIC_API_BASE_URL` to the full URL (e.g., `https://api.pureblend.example.com`).

## 3. Public APIs (no authentication required)

### Product Listing & Detail

```javascript
// List products with filters
fetch('/api/products?published=true&feature=true&category=Acidulants&search=citric')
  .then(r => r.json())
  .then(data => { /* ... */ })

// Product detail by ID
fetch('/api/products/[id]')
  .then(r => r.json())
  .then(data => { /* ... */ })

// Product detail by slug
fetch('/api/products/slug/[slug]')
  .then(r => r.json())
  .then(data => { /* ... */ })
```

### Category Listing & Detail

```javascript
// List categories
fetch('/api/categories')
  .then(r => r.json())
  .then(data => { /* ... */ })

// Category detail by ID
fetch('/api/categories/[id]')
  .then(r => r.json())
  .then(data => { /* ... */ })

// Category detail by slug
fetch('/api/categories/slug/[slug]')
  .then(r => r.json())
  .then(data => { /* ... */ })
```

### Banners

```javascript
// List active banners
fetch('/api/banners')
  .then(r => r.json())
  .then(data => { /* ... */ })
```

### Offers

```javascript
// List offers (filter by status)
fetch('/api/offers?status=ACTIVE')
  .then(r => r.json())
  .then(data => { /* ... */ })
```

### FAQs

```javascript
// List published FAQs
fetch('/api/faqs')
  .then(r => r.json())
  .then(data => { /* ... */ })
```

### CMS Pages

```javascript
// Access published page by key
fetch('/api/pages/knowledge-base')
  .then(r => r.json())
  .then(data => { /* ... */ })
```

### Contact Form

```javascript
// Submit contact form
fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Acme Corp',
    subject: 'Inquiry',
    message: 'Hello, I have questions about your products.'
  })
})
  .then(r => r.json())
  .then(data => {
    // 200: { ok: true }
    // 422: validation errors
    // 429: rate limited
    // 502: SMTP failed, inquiry still saved
    // 503: SMTP not configured
  })
```

### Chat / AI Assistant

```javascript
// Send message to AI assistant
fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'What products do you offer?' })
})
  .then(r => r.json())
  .then(data => {
    // { success: true, data: { answer, sources } }
    // Or: { success: false, error: { code, message } }
  })
```

## 4. Admin APIs

### Admin Login

```javascript
// Authenticate and get ID token
fetch('/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin@pureblend.com', password: 'password123' })
})
  .then(r => r.json())
  .then(data => {
    // { success: true, data: { idToken, adminUser: { id, email, role } } }
    // Store idToken; use for all subsequent admin API calls
  }
)
```

### Admin Product CRUD

```javascript
// Create product
fetch('/api/admin/products', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${idToken}` },
  body: JSON.stringify({ /* product data Zod-validated */ })
})
  .then(r => r.json())
  .then(data => { /* ... */ })

// Update product
fetch('/api/admin/products/[id]', {
  method: 'PUT',
  headers: { 'Authorization': `Bearer ${idToken}` },
  body: JSON.stringify({ /* updated data */ })
})
  .then(r => r.json())
  .then(data => { /* ... */ })

// Delete product
fetch('/api/admin/products/[id]', {
  method: 'DELETE',
  headers: { 'Authorization': `Bearer ${idToken}` }
})
  .then(r => r.json())
  .then(data => { /* ... */ })
```

### Admin Category CRUD

```javascript
// Create category
fetch('/api/admin/categories', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${idToken}` },
  body: JSON.stringify({ /* category data */ })
})
  .then(r => r.json())
  .then(data => { /* ... */ })

// Delete category (409 if products reference it)
fetch('/api/admin/categories/[id]', {
  method: 'DELETE',
  headers: { 'Authorization': `Bearer ${idToken}` }
})
  .then(r => r.json())
  .then(data => { /* ... */ })
```

### Admin Banner CRUD

```javascript
// Upload banner image (multipart)
const formData = new FormData()
formData.append('image', file)
formData.append('publicId', 'banner-slug')

fetch('/api/admin/media/upload', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${idToken}` },
  body: formData
})
  .then(r => r.json())
  .then(data => { /* publicId, secureUrl returned */ })

// Reorder banners
fetch('/api/admin/banners/reorder', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${idToken}` },
  body: JSON.stringify({ ids: ['banner-id-1', 'banner-id-2'] })
})
  .then(r => r.json())
  .then(data => { /* ... */ })
```

### Admin Offer CRUD

```javascript
// Create offer
fetch('/api/admin/offers', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${idToken}` },
  body: JSON.stringify({ /* offer data with validFrom/validTo dates */ })
})
  .then(r => r.json())
  .then(data => { /* ... */ })
```

### Admin FAQ CRUD

```javascript
// Create FAQ
fetch('/api/admin/faqs', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${idToken}` },
  body: JSON.stringify({ /* FAQ data */ })
})
  .then(r => r.json())
  .then(data => { /* ... */ })
```

### Admin CMS Page CRUD

```javascript
// Create CMS page
fetch('/api/admin/pages', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${idToken}` },
  body: JSON.stringify({ /* page data with pageKey */ })
})
  .then(r => r.json())
  .then(data => { /* ... */ })
```

### Admin Contact Message Management

```javascript
// List all contact messages
fetch('/api/admin/contacts', {
  method: 'GET',
  headers: { 'Authorization': `Bearer ${idToken}` }
})
  .then(r => r.json())
  .then(data => { /* ... */ })

// Update message status
fetch('/api/admin/contacts/[id]/status', {
  method: 'PATCH',
  headers: { 'Authorization': `Bearer ${idToken}` },
  body: JSON.stringify({ status: 'READ' })
})
  .then(r => r.json())
  .then(data => { /* ... */ })
```

### Admin Knowledge Reindex

```javascript
// Reindex AI knowledge base
fetch('/api/admin/knowledge/reindex', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${idToken}` }
})
  .then(r => r.json())
  .then(data => { /* ... */ })
```

## 5. Upload Flow (Images/Product Images, Banners)

### Step 1: Select image file in frontend

### Step 2: Upload via Cloudinary

```javascript
// Using Cloudinary SDK or direct multipart upload
const formData = new FormData()
formData.append('image', file)
formData.append('publicId', 'unique-id-descriptor') // e.g., product-slug or banner-slug

fetch('/api/admin/media/upload', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${idToken}` },
  body: formData
})
  .then(r => r.json())
  .then(data => {
    // { success: true, data: { publicId, secureUrl, width, height, format, bytes } }
    // Store publicId and secureUrl in Firestore/product data
  })
  .catch(error => {
    // { success: false, error: { code: "UNSUPPORTED_FILE_TYPE", message } }
    // Or: { success: false, error: { code: "FILE_TOO_LARGE", message } }
  )
```

### Allowed MIME Types

- `image/jpeg`
- `image/png`
- `image/webp`
- `image/gif`

Any other type returns: `UNSUPPORTED_FILE_TYPE`

### File Size Limit

- Maximum: 5MB (`FILE_TOO_LARGE` error if exceeded)

### Cloudinary Folders

- `pureblend/products` — product images
- `pureblend/banners` — banner images
- `pureblend/general` — general/other images

### Image Deletion (with safety check)

```javascript
// Delete image by publicId
fetch('/api/admin/media/delete', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${idToken}` },
  body: JSON.stringify({ publicId: 'pureblend/products/xyz123' })
})
  .then(r => r.json())
  .then(data => {
    // { success: true, data: { result } }
    // Or: { success: false, error: { code: "IMAGE_IN_USE", message } }
    // IMAGE_IN_USE means the image is referenced by active products
  )
}
```

## 6. Contact Form Flow

### Step 1: User fills form

Fields: `name`, `email`, `phone`, `company`, `subject`, `message`

### Step 2: Submit

```javascript
fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, phone, company, subject, message })
})
  .then(r => r.json())
  .then(data => {
    // 200: { ok: true } — inquiry saved, email sent
    // 422: { error: { code: "VALIDATION_ERROR", message: "..." } } — validation failed
    // 429: { error: { code: "RATE_LIMITED", message: "Too many submissions. Please try again later." } } — rate limited
    // 502: { error: { code: "DELIVERY_FAILED", message: "Your inquiry has been saved, but we were unable to send the email notification. An administrator will follow up shortly." } } — SMTP failed, but inquiry saved to Firestore
    // 503: { error: { code: "UNAVAILABLE", message: "Unable to send your message right now. Please try again later." } } — SMTP not configured
  )
```

### Step 3: Admin notification

- Inquiries stored in Firestore `contactMessages` collection with status `UNREAD`
- Admin can view via `GET /api/admin/contacts` (requires admin auth)
- Status can be updated via `PATCH /api/admin/contacts/[id]/status`

### Step 4: SMTP failure behavior

- **Success**: Client gets `200 { ok: true }`, email sent, inquiry saved
- **Failure**: Client gets `502 { error: { code: "DELIVERY_FAILED", message: "Your inquiry has been saved, but we were unable to send the email notification. An administrator will follow up shortly." } }`, inquiry STILL saved to Firestore

This ensures no data loss even if the email gateway is temporarily unavailable.

## 7. Chat / AI Assistant Flow

### Step 1: User sends message

```javascript
fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'What products do you offer?' })
})
```

### Step 2: Backend processing

1. Validate message with Zod (required, max 2000 chars)
2. Rate limit: 5 requests per minute per IP
3. Retrieve relevant knowledge from Firestore (products, categories, FAQs, solutions, RFQs, quality batches)
4. Build grounded prompt from retrieved chunks ONLY
5. Generate answer using ONLY the provided context
6. If no relevant knowledge: return `"I don't have that information available. Please contact PureBlend directly for detailed specifications."`

### Step 3: Response

```javascript
// Success
{ success: true, data: { answer: 'Based on our knowledge...', sources: [...] } }

// No knowledge found
{ success: true, data: { answer: "I don't have that information available. Please contact PureBlend directly for detailed specifications.", sources: [] } }

// Error
{ success: false, error: { code: "VALIDATION_ERROR", message: "Message is required" } }
{ success: false, error: { code: "RATE_LIMITED", message: "Too many requests. Please try again later." } }
```

> **AI Behavior Rules:**
> - Uses ONLY the retrieved knowledge context
> - Never invents product specifications, prices, certifications, or company claims
> - If information not available: says "I don't have that information available"
> - No client-side `isAdmin` flags; all knowledge is public-facing

## 8. Error Handling

### Consistent Error Format

All APIs return:

```json
{
  "success": false,
  "error": {
    "code": "...",
    "message": "..."
  }
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Validation error (Zod, bad request) |
| 401 | Unauthenticated (missing/invalid/expired token) |
| 403 | Forbidden (non-admin trying admin endpoint) |
| 404 | Not found |
| 409 | Conflict (slug/product in use, duplicate key) |
| 422 | Unprocessable entity (Zod validation) |
| 429 | Too many requests (rate limited) |
| 500 | Server error |
| 502 | SMTP delivery failed (inquiry still saved) |
| 503 | Service unavailable (SMTP not configured) |

### Development vs Production

- **Development** (`NODE_ENV !== "production"`): Full error details in logs
- **Production**: Generic client-facing messages only; internal logs contain more detail but never secrets

## 9. Environment Variables for Frontend

| Variable | Required? | Description |
|----------|-----------|-------------|
| `NEXT_PUBLIC_API_BASE_URL` | Yes (prod) | Base URL for API calls |
| `NEXT_PUBLIC_SITE_URL` | Yes | Site URL for meta/sitemap |
| `NEXT_PUBLIC_USE_MOCK_DATA` | No | Set `false` for production with real backend |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Yes (if using auth) | Firebase config (safe for browser) |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Yes (if using auth) | Firebase config (safe for browser) |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Yes (if using auth) | Firebase config (safe for browser) |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Yes (if using auth) | Firebase config (safe for browser) |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Yes (if using auth) | Firebase config (safe for browser) |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Yes (if using auth) | Firebase config (safe for browser) |

## 10. Known Issues & Workarounds

| Issue | Workaround |
|-------|-----------|
| 71 lint errors (mostly unused variables in frontend) | Ignore for now; focus on backend API integration |
| 23 TypeScript pre-existing errors | 4 Zod `.errors` type inference + 2 `count` type issues; not blocking |
| Next.js validator type mismatch | Affects `next/types/validator.ts`; not a runtime issue |
| SMTP must be configured for production email | Contact form still saves to Firestore even if SMTP fails (502 behavior) |
| Cloudinary 5MB limit | Enforce MIME type + size validation; oversized uploads rejected |

## 11. Development Workflow

```bash
# Install
npm install

# Development mode
npm run dev

# Production build
npm run build

# Production start
npm start

# Lint check
npm run lint

# Type check
npm run typecheck

# Run tests (if available)
npm run test
```

## 12. Contact for Integration Questions

- **Backend API:** Refer to `docs/api.md` for complete endpoint documentation
- **Authentication:** Token-based via Firebase ID; `checkAdminClaim()` verification
- **Uploads:** Cloudinary-mediated; MIME + 5MB size validated backend
- **Contact:** `POST /api/contact`; Zod validated; rate limited; Firestore + SMTP
- **AI Assistant:** `POST /api/chat`; grounded RAG; refuses to invent specs/prices
- **Admin:** `checkAdminClaim()`; 403 for non-admin; login does NOT promote admin claims

---
**Document Revision:** Phase 10 — Frontend Handoff  
**Generated:** `docs/frontend-handoff.md`  
**For:** Frontend developer integration with PureBlend Food Chemicals backend