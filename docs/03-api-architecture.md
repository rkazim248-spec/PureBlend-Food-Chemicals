# 03 — API Architecture & Contracts: PureBlend Food Chemicals

## 1. Overview & Architectural Conventions

This document establishes the official API contract between the Next.js server runtime and the frontend application for **PureBlend Food Chemicals**. It defines all public endpoints consumed by the storefront and protected endpoints consumed by the admin CMS.

### Core Conventions
- **Base Path**: `/api`
- **Transport**: HTTPS, JSON request/response bodies (`Content-Type: application/json`).
- **Multipart Uploads**: `multipart/form-data` for file uploads (`/api/admin/upload`).
- **Authentication**:
  - Public endpoints: Open access with IP-based rate limiting.
  - Admin endpoints: Server-verified session cookie or Bearer token (`auth-token`).
- **Error Standard**: All errors strictly follow the unified schema defined in `/docs/05-backend-integration/error-response-standard.md`:
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR | UNAUTHORIZED | FORBIDDEN | NOT_FOUND | RATE_LIMITED | SERVER_ERROR | UNAVAILABLE",
      "message": "Human-readable description",
      "details": [
        { "field": "email", "message": "Must be a valid email address" }
      ]
    }
  }
  ```
- **HTTP Status Codes**:
  - `200 OK`: Successful read or update.
  - `201 Created`: Successful creation.
  - `400 Bad Request`: Malformed JSON or syntax failure.
  - `401 Unauthorized`: Missing or invalid authentication token.
  - `403 Forbidden`: Authenticated user lacks administrative privileges.
  - `404 Not Found`: Resource does not exist.
  - `409 Conflict`: Unique constraint violation (e.g., duplicate slug or email).
  - `422 Unprocessable Entity`: Zod validation failures on input fields.
  - `429 Too Many Requests`: Rate limit threshold exceeded.
  - `500 Internal Server Error`: Unhandled server exception.
  - `503 Service Unavailable`: External dependency unavailable (e.g., SMTP down).

---

## 2. Public API Endpoints

### 2.1. Products Catalog
#### `GET /api/products`
- **Purpose**: Retrieve published chemical products for catalog listing and search.
- **Authentication**: None (Public).
- **Query Parameters**:
  - `category` (optional, string): Filter by category slug or ID.
  - `search` (optional, string): Case-insensitive keyword search on name and description.
  - `featured` (optional, boolean): Filter only featured chemicals (`true`).
  - `page` (optional, number, default: `1`): Pagination page number.
  - `limit` (optional, number, default: `20`): Page size limit (max 100).
- **Response**: `200 OK`
  ```json
  [
    {
      "id": "cld1234567890",
      "name": "Sodium Benzoate (NF/FCC Grade)",
      "slug": "sodium-benzoate-nf-fcc",
      "description": "High-purity antimicrobial preservative used in acidic foods and beverages.",
      "category": { "id": "cat_01", "name": "Preservatives", "slug": "preservatives" },
      "images": [{ "url": "https://res.cloudinary.com/.../sb.webp", "alt": "Sodium Benzoate 25kg Drum" }],
      "specifications": [
        { "label": "CAS Number", "value": "532-32-1" },
        { "label": "Purity Assay", "value": "≥ 99.5%" },
        { "label": "Standard", "value": "USP / FCC / E211" }
      ],
      "published": true
    }
  ]
  ```
- **Error Responses**: `500 SERVER_ERROR`.

---

#### `GET /api/products/[slug]`
- **Purpose**: Retrieve detailed specifications, regulatory data, and gallery for a single chemical by slug.
- **Authentication**: None (Public).
- **Query Parameters**: None.
- **Response**: `200 OK`
  ```json
  {
    "id": "cld1234567890",
    "name": "Sodium Benzoate (NF/FCC Grade)",
    "slug": "sodium-benzoate-nf-fcc",
    "description": "Full technical description, solubility parameters, pH efficacy window...",
    "category": { "id": "cat_01", "name": "Preservatives", "slug": "preservatives" },
    "images": [
      { "url": "https://res.cloudinary.com/.../sb1.webp", "alt": "Sodium Benzoate Packaging" },
      { "url": "https://res.cloudinary.com/.../sb2.webp", "alt": "Certificate of Analysis Emblem" }
    ],
    "specifications": [
      { "label": "Chemical Formula", "value": "C7H5NaO2" },
      { "label": "CAS Number", "value": "532-32-1" },
      { "label": "Molecular Weight", "value": "144.11 g/mol" },
      { "label": "Solubility", "value": "660 g/L in water at 20°C" }
    ],
    "published": true,
    "seo": {
      "metaTitle": "Sodium Benzoate NF/FCC Grade | PureBlend Food Chemicals",
      "metaDescription": "Order high-purity Sodium Benzoate preservative with full COA and ISO certifications.",
      "ogImage": "https://res.cloudinary.com/.../sb-og.webp"
    }
  }
  ```
- **Error Responses**: `404 NOT_FOUND` (if product does not exist or is unpublished for public requests).

---

### 2.2. Categories
#### `GET /api/categories`
- **Purpose**: List chemical categories for storefront navigation, filtering pills, and breadcrumbs.
- **Authentication**: None (Public).
- **Response**: `200 OK`
  ```json
  [
    { "id": "cat_01", "name": "Preservatives & Shelf-Life Extenders", "slug": "preservatives" },
    { "id": "cat_02", "name": "Acidulants & pH Regulators", "slug": "acidulants" },
    { "id": "cat_03", "name": "Antioxidants", "slug": "antioxidants" }
  ]
  ```
- **Error Responses**: `500 SERVER_ERROR`.

---

### 2.3. Banners & Homepage Content
#### `GET /api/banners`
- **Purpose**: Retrieve active hero carousel and promotional banners sorted by display order.
- **Authentication**: None (Public).
- **Response**: `200 OK`
  ```json
  [
    {
      "id": "ban_01",
      "title": "Certified High-Purity Food Chemicals",
      "description": "ISO 9001, FSSC 22000, Halal & Kosher certified chemical ingredients for industrial formulation.",
      "imageUrl": "https://res.cloudinary.com/.../hero-banner.webp",
      "imageAlt": "Laboratory food science research",
      "linkUrl": "/products",
      "linkLabel": "View Catalog",
      "order": 1,
      "active": true
    }
  ]
  ```
- **Error Responses**: `500 SERVER_ERROR`.

---

### 2.4. Offers & Commercial Deals
#### `GET /api/offers` (and `GET /api/offers/active`)
- **Purpose**: Retrieve active commercial volume discounts and seasonal supply contracts.
- **Authentication**: None (Public).
- **Response**: `200 OK`
  ```json
  [
    {
      "id": "off_01",
      "title": "Annual Ascorbic Acid Volume Contract",
      "description": "Tier 1 pricing on full container load (FCL) orders of USP grade Ascorbic Acid.",
      "discountText": "12% Off Volume Tiers",
      "validFrom": "2026-01-01T00:00:00Z",
      "validTo": "2026-12-31T23:59:59Z",
      "active": true,
      "imageUrl": "https://res.cloudinary.com/.../offer-ascorbic.webp"
    }
  ]
  ```
- **Error Responses**: `500 SERVER_ERROR`.

---

### 2.5. FAQs
#### `GET /api/faqs`
- **Purpose**: Retrieve published technical and procurement FAQs.
- **Authentication**: None (Public).
- **Response**: `200 OK`
  ```json
  [
    {
      "id": "faq_01",
      "question": "What documentation accompanies each chemical shipment?",
      "answer": "Every shipment includes a batch-specific Certificate of Analysis (COA), Safety Data Sheet (SDS), Technical Data Sheet (TDS), and Kosher/Halal compliance statements.",
      "order": 1,
      "published": true
    }
  ]
  ```
- **Error Responses**: `500 SERVER_ERROR`.

---

### 2.6. Contact Form & Procurement Inquiry
#### `POST /api/contact`
- **Purpose**: Submit technical inquiry or sample quote request; triggers server validation, anti-spam honeypot, DB persistence, and SMTP notification.
- **Authentication**: None (Public with Rate Limiting: 5 submissions per 10 mins per IP).
- **Request Body**:
  ```json
  {
    "name": "David Miller",
    "email": "d.miller@beveragemanufacturing.com",
    "subject": "Quote Request: Citric Acid Anhydrous 500kg",
    "message": "We require pricing and delivery timeframe for 500kg of USP Citric Acid delivered to Chicago.",
    "honeypot": ""
  }
  ```
- **Validation Rules**:
  - `name`: String, 2 to 120 characters.
  - `email`: Valid RFC 5322 email string, max 200 characters.
  - `subject`: String, 3 to 200 characters.
  - `message`: String, 10 to 5000 characters.
  - `honeypot`: Must be empty (if populated, bot trap triggers fake `200 OK` without email dispatch).
- **Response**: `200 OK`
  ```json
  { "ok": true }
  ```
- **Error Responses**:
  - `400 VALIDATION_ERROR`: Malformed request syntax.
  - `422 VALIDATION_ERROR`: Field validation failure with `details` array.
  - `429 RATE_LIMITED`: Submission frequency exceeded.
  - `502 DELIVERY_FAILED`: SMTP dispatch failure.
  - `503 UNAVAILABLE`: Mail server unconfigured.

---

### 2.7. AI RAG Chatbot
#### `POST /api/chat`
- **Purpose**: Query the PureBlend grounded AI assistant. Generates answers strictly derived from approved chemical specs and compliance documents.
- **Authentication**: None (Public with Rate Limiting: 10 requests per minute per IP).
- **Request Body**:
  ```json
  {
    "message": "What is the recommended storage temperature and pH range for Potassium Sorbate?",
    "conversationId": "sess_89a3f2b1"
  }
  ```
- **Validation Rules**:
  - `message`: String, 1 to 500 characters, non-whitespace.
  - `conversationId`: Optional string, max 100 characters.
- **Response**: `200 OK`
  ```json
  {
    "reply": "Potassium Sorbate should be stored in a cool, dry, well-ventilated area below 25°C in tightly sealed original packaging. It is most effective as an antimicrobial agent at pH levels below 6.5, with optimal efficacy in acidic environments below pH 5.5.",
    "conversationId": "sess_89a3f2b1",
    "sources": [
      {
        "title": "Potassium Sorbate Technical Data Sheet (PureBlend QC-104)",
        "url": "/products/potassium-sorbate-fcc"
      }
    ]
  }
  ```
- **Grounding Refusal Behavior (When context is missing)**:
  ```json
  {
    "reply": "I do not have verified technical data in the approved PureBlend catalog regarding that topic. Please contact our regulatory and technical team via the contact form or email technical@pureblend.com.",
    "conversationId": "sess_89a3f2b1",
    "sources": []
  }
  ```
- **Error Responses**:
  - `400 VALIDATION_ERROR`: Empty or oversized message.
  - `429 RATE_LIMITED`: Exceeded chat rate quota.
  - `500 SERVER_ERROR`: Vector search or inference error.

---

## 3. Admin Authentication & Session API

### 3.1. `POST /api/auth/login`
- **Purpose**: Authenticate administrative credentials and issue secure session.
- **Authentication**: Public (Rate Limiting: 5 attempts per 15 mins per IP).
- **Request Body**:
  ```json
  {
    "email": "admin@pureblend.com",
    "password": "StrongPassword!2026"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "user": {
      "id": "adm_01",
      "email": "admin@pureblend.com",
      "name": "Dr. Elena Vance",
      "role": "ADMIN"
    }
  }
  ```
  *(Sets `HttpOnly`, `SameSite=Lax`, `Secure` session cookie `pb_session`)*.
- **Error Responses**:
  - `401 UNAUTHORIZED`: Invalid credentials.
  - `422 VALIDATION_ERROR`: Email/password formatting error.
  - `429 RATE_LIMITED`: Too many login failures.

---

### 3.2. `POST /api/auth/logout`
- **Purpose**: Invalidate current administrative session and clear session cookie.
- **Authentication**: Admin Required.
- **Response**: `200 OK`
  ```json
  { "ok": true }
  ```

---

### 3.3. `GET /api/auth/me`
- **Purpose**: Return current authenticated administrative user profile for UI guard.
- **Authentication**: Admin Required.
- **Response**: `200 OK`
  ```json
  {
    "id": "adm_01",
    "email": "admin@pureblend.com",
    "name": "Dr. Elena Vance",
    "role": "ADMIN"
  }
  ```
- **Error Responses**: `401 UNAUTHORIZED`.

---

## 4. Admin Management CRUD Endpoints

All endpoints in this section strictly require active administrative session authentication (`AdminGuard` + server-side session token verification).

### 4.1. Product Management
| Method | Route | Description | Request Body | Response |
|---|---|---|---|---|
| `GET` | `/api/admin/products` | Full product inventory including drafts | Query: `page`, `limit`, `status` | `Product[]` + metadata |
| `POST` | `/api/admin/products` *(or `/api/products`)* | Create new product | `ProductInput` | `201 Created` (`Product`) |
| `PUT` / `PATCH` | `/api/admin/products/[id]` *(or `/api/products/[id]`)* | Update existing product | `Partial<ProductInput>` | `200 OK` (`Product`) |
| `DELETE` | `/api/admin/products/[id]` *(or `/api/products/[id]`)* | Delete product | None | `200 OK` (`{ ok: true }`) |
| `PATCH` | `/api/admin/products/[id]/publish` *(or `/api/products/[id]/publish`)* | Toggle publish status | `{ published: boolean }` | `200 OK` (`Product`) |

#### `ProductInput` Schema
```typescript
{
  name: string;             // 2-150 chars
  slug: string;             // lowercase alphanumeric with hyphens, unique
  categoryId?: string;      // valid Category.id
  shortDescription?: string;// max 300 chars
  description: string;      // 10-10,000 chars
  specifications: Array<{ label: string; value: string }>;
  images: Array<{ url: string; alt: string; isPrimary?: boolean }>;
  published: boolean;
  featured?: boolean;
}
```

---

### 4.2. Category Management
| Method | Route | Description | Request Body | Response |
|---|---|---|---|---|
| `GET` | `/api/admin/categories` | List all categories with product counts | None | `Category[]` |
| `POST` | `/api/admin/categories` | Create chemical category | `{ name, slug, description?, displayOrder? }` | `201 Created` |
| `PATCH` / `PUT` | `/api/admin/categories/[id]` | Update category | `Partial<CategoryInput>` | `200 OK` |
| `DELETE` | `/api/admin/categories/[id]` | Delete category (blocked if products linked) | None | `200 OK` |

---

### 4.3. Banner Management
| Method | Route | Description | Request Body | Response |
|---|---|---|---|---|
| `POST` | `/api/admin/banners` *(or `/api/banners`)* | Create banner | `BannerInput` | `201 Created` |
| `PUT` / `PATCH` | `/api/admin/banners/[id]` *(or `/api/banners/[id]`)* | Update banner | `Partial<BannerInput>` | `200 OK` |
| `DELETE` | `/api/admin/banners/[id]` *(or `/api/banners/[id]`)* | Delete banner | None | `200 OK` |

---

### 4.4. Offer Management
| Method | Route | Description | Request Body | Response |
|---|---|---|---|---|
| `POST` | `/api/admin/offers` *(or `/api/offers`)* | Create offer | `OfferInput` | `201 Created` |
| `PUT` / `PATCH` | `/api/admin/offers/[id]` *(or `/api/offers/[id]`)* | Update offer | `Partial<OfferInput>` | `200 OK` |
| `DELETE` | `/api/admin/offers/[id]` *(or `/api/offers/[id]`)* | Delete offer | None | `200 OK` |

---

### 4.5. FAQ Management
| Method | Route | Description | Request Body | Response |
|---|---|---|---|---|
| `POST` | `/api/admin/faqs` *(or `/api/faqs`)* | Create technical FAQ | `FaqInput` | `201 Created` |
| `PUT` / `PATCH` | `/api/admin/faqs/[id]` *(or `/api/faqs/[id]`)* | Update FAQ | `Partial<FaqInput>` | `200 OK` |
| `DELETE` | `/api/admin/faqs/[id]` *(or `/api/faqs/[id]`)* | Delete FAQ | None | `200 OK` |

---

### 4.6. CMS Page Content & SEO
| Method | Route | Description | Request Body | Response |
|---|---|---|---|---|
| `GET` | `/api/content/[pageKey]` | Get CMS blocks for page (About, Terms, etc.) | None | `ContentPage` |
| `PUT` | `/api/content/[pageKey]` | Save CMS blocks for page | `{ title, blocks: [{ heading?, body }] }` | `200 OK` |
| `GET` | `/api/seo` | Query SEO tags | Query: `?entityType=PRODUCT&entityId=...` | `SeoRecord[]` |
| `PUT` | `/api/seo` | Upsert SEO tags | `{ entityType, entityId, metaTitle?, metaDescription?, ogImage? }` | `200 OK` |

---

### 4.7. File & Image Upload
#### `POST /api/upload` (and `POST /api/admin/upload`)
- **Purpose**: Secure server-side image upload to object storage (Cloudinary / Supabase Storage).
- **Authentication**: Admin Required.
- **Request**: `multipart/form-data` with `file` field.
- **Validation**:
  - Allowed types: `image/jpeg`, `image/png`, `image/webp`.
  - Max file size: 5,242,880 bytes (5 MB).
- **Response**: `200 OK`
  ```json
  {
    "url": "https://res.cloudinary.com/pureblend/image/upload/v12345/products/citric-acid.webp",
    "width": 1200,
    "height": 800,
    "format": "webp"
  }
  ```
- **Error Responses**: `400 VALIDATION_ERROR`, `401 UNAUTHORIZED`, `413 PAYLOAD_TOO_LARGE`.

---

## 5. Route Compatibility Strategy

To ensure seamless integration between the frontend's existing client calls in `src/lib/api/admin.ts` and the backend route structure:
1. Both `/api/products` (admin method checks) and `/api/admin/products` route styles are accommodated or re-routed cleanly.
2. The exact method signatures and data models documented in `src/lib/api/types.ts` are respected 100% without breaking changes.
