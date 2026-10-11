# 01 — Backend Architecture: PureBlend Food Chemicals

## 1. Overview

This document describes the backend architecture for PureBlend Food Chemicals, built on **Next.js 16** with **Firebase Firestore** as the primary database and **Firebase Authentication** for admin identity. The architecture follows a clean separation between client-side Firebase SDK usage and server-side Firebase Admin SDK operations.

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER (Browser)                          │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────────┐  │
│  │  Public Pages    │  │  Admin Dashboard │  │  AI Chat Widget          │  │
│  │  (SSR/SSG/ISR)   │  │  (React + Guards)│  │  (React)                 │  │
│  └────────┬─────────┘  └────────┬─────────┘  └────────────┬─────────────┘  │
└───────────┼─────────────────────┼─────────────────────────┼────────────────┘
            │ HTTPS / JSON        │                         │
            ▼                     ▼                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        NEXT.JS SERVER / EDGE GATEWAY                         │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  Security Headers (CSP, HSTS, X-Frame-Options, Permissions-Policy)   │   │
│  │  Global Routing & Static Asset Optimization                           │   │
│  │  Edge Middleware (Admin Session Validation Guard)                     │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         API / SERVER BOUNDARY LAYER                          │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐  │
│  │ Route        │ │ Auth &       │ │ Rate         │ │ Input Validation │  │
│  │ Handlers     │ │ Authorization│ │ Limiting     │ │ & Sanitization   │  │
│  │ (src/app/    │ │ (Firebase    │ │ (In-memory   │ │ (Zod Schemas)    │  │
│  │  api/...)    │ │  Admin SDK)  │ │  sliding     │ │                  │  │
│  └──────────────┘ └──────────────┘ │  window)     │ └──────────────────┘  │
│                                     └──────────────┘                      │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       BUSINESS LOGIC & SERVICE LAYER                         │
│  ┌────────────────┐ ┌───────────────┐ ┌─────────────┐ ┌────────────────┐  │
│  │ ProductService │ │ CategoryService│ │ BannerService│ │ OfferService   │  │
│  └────────────────┘ └───────────────┘ └─────────────┘ └────────────────┘  │
│  ┌────────────────┐ ┌───────────────┐ ┌─────────────┐ ┌────────────────┐  │
│  │ FAQService     │ │ ContactService│ │ SEOService  │ │ StorageService │  │
│  └────────────────┘ └───────────────┘ └─────────────┘ └────────────────┘  │
│  ┌────────────────┐ ┌───────────────┐ ┌─────────────┐ ┌────────────────┐  │
│  │ EmailService   │ │ RagService    │ │ AdminService│ │                │  │
│  └────────────────┘ └───────────────┘ └─────────────┘ └────────────────┘  │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
         ┌────────────────┐ ┌──────────────┐ ┌──────────────┐
         │ Firebase       │ │ Cloudinary   │ │ SMTP /       │
         │ Firestore      │ │ Media Storage│ │ Email        │
         │ (Admin SDK)    │ │ (Server SDK) │ │ (Nodemailer) │
         └────────────────┘ └──────────────┘ └──────────────┘
```

## 3. Layer Responsibilities

### 3.1 Client Layer (Frontend)
- **Role**: Presentation, user experience, interactive forms, responsive layouts
- **Firebase Usage**: `firebase/app`, `firebase/auth`, `firebase/firestore` (read-only public data)
- **Boundary**: Never imports server-only modules or accesses secret environment variables

### 3.2 Server Boundary & API Layer (`src/app/api/...`)
- **Role**: HTTP termination, protocol enforcement, security validation, response formatting
- **Responsibilities**:
  1. **Authentication Verification**: Verify Firebase ID tokens on every protected route
  2. **Authorization**: Check admin role via custom claims or Firestore admin record
  3. **Rate Limiting**: Protect sensitive endpoints (`/api/auth/*`, `/api/contact`, `/api/chat`, `/api/admin/*`)
  4. **Input Validation**: Parse request bodies using strict Zod schemas
  5. **Error Normalization**: Map all exceptions to standard error contract

### 3.3 Business Logic & Service Layer (`src/lib/firestore/`, `src/lib/server/services/`)
- **Role**: Core domain logic, business invariants, cross-collection workflows, external integrations
- **Services**:
  - `ProductService` / `productService`: CRUD, slug generation, search, publishing
  - `CategoryService` / `categoryService`: Hierarchy, slug uniqueness, cascade integrity
  - `BannerService` / `bannerService`: Active schedule evaluation, priority sorting, reordering
  - `OfferService` / `offerService`: Status computation (DRAFT/SCHEDULED/ACTIVE/EXPIRED)
  - `FAQService` / `faqService`: Category grouping, display order, reordering
  - `ContactService` / `contactService`: Message persistence, honeypot, SMTP dispatch
  - `StorageService`: Upload validation, Cloudinary synchronization
  - `RagService`: Text chunking, embedding generation, vector search, LLM orchestration
  - `EmailService`: Nodemailer transport, templating, header injection prevention
  - `AdminService`: User management, role assignment, audit logging

### 3.4 Data Access Layer (Firestore via Admin SDK)
- **Role**: Type-safe query construction, connection lifecycle, transaction support
- **Singleton Pattern**: `getFirestoreAdmin()` prevents multiple initializations during hot reload
- **Collections**: Defined in `src/lib/firestore/types.ts` with `COLLECTIONS` constant

### 3.5 Database Layer (Firebase Firestore)
- **Role**: NoSQL document database with real-time capabilities
- **Structure**: Collections mirror Prisma relational schema (see `docs/02-firestore-schema.md`)
- **Indexes**: Composite indexes defined in `firestore.indexes.json` (deployed via Firebase CLI)
- **Security Rules**: Least-privilege rules; sensitive mutations via Admin SDK only

## 4. Firebase Dual-Context Architecture

### 4.1 Client Firebase (`src/lib/firebase/client.ts`)
```typescript
// Used ONLY where client-side Firebase is legitimately required:
// - Firebase Authentication sign-in/sign-up flows
// - Real-time listeners for public data (optional)
// - Client-side uploads to Cloudinary (signed URLs from backend)
```
- Initialized once via `getFirebaseApp()` singleton
- Configuration from `NEXT_PUBLIC_FIREBASE_*` environment variables
- Safe for browser bundles

### 4.2 Server Firebase Admin (`src/lib/firebase/admin.ts`)
```typescript
// Used for ALL privileged backend operations:
// - Verifying ID tokens from client
// - Creating/managing admin users
// - Setting custom claims (roles)
// - Firestore reads/writes with elevated privileges
// - Cloudinary signed upload URL generation
```
- Initialized once via `getFirebaseAdminApp()` singleton
- Credentials from `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`
- **NEVER** exposed to client bundles (tree-shaken by Next.js server-only boundary)

### 4.3 Initialization Guards
Both client and admin initialization use singleton patterns to prevent duplicate initialization during Next.js development hot-reloading.

## 5. External Service Integration

### 5.1 Cloudinary (`src/lib/cloudinary/`)
- **Server-only**: `CLOUDINARY_API_SECRET` never leaves server
- **Upload Flow**: Admin → Backend validation → Cloudinary → Firestore metadata storage
- **Metadata Stored**: `publicId`, `secureUrl`, `width`, `height`, `format`, `altText`

### 5.2 SMTP Email (`src/lib/server/email.ts`)
- **Server-only**: `SMTP_PASSWORD` never leaves server
- **Contact Form**: Rate-limited, honeypot-protected, header-sanitized
- **Transactional**: Order confirmations, admin notifications

### 5.3 AI/RAG (`src/lib/rag/`)
- **Server-only**: `OPENAI_API_KEY` never leaves server
- **Pipeline**: Ingestion → Chunking → Embeddings → Vector Search → Grounded Generation
- **Refusal Logic**: Returns standardized message when confidence < threshold

## 6. Security Boundaries

| Boundary | Protection |
|----------|------------|
| Client ↔ Server | HTTPS, CSP, HSTS, CSRF-safe cookies |
| Public ↔ Admin APIs | Firebase ID token verification + role check |
| Server ↔ Firestore | Admin SDK with service account (least privilege) |
| Server ↔ Cloudinary | Server-only API secret, signed upload URLs |
| Server ↔ SMTP | Server-only credentials, header sanitization |
| Server ↔ OpenAI | Server-only API key, request validation |

## 7. Environment Variable Strategy

| Prefix | Scope | Examples |
|--------|-------|----------|
| `NEXT_PUBLIC_*` | Client + Server | `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_SITE_URL` |
| (no prefix) | Server Only | `FIREBASE_PRIVATE_KEY`, `CLOUDINARY_API_SECRET`, `SMTP_PASSWORD`, `OPENAI_API_KEY` |

See `docs/06-environment-variables.md` for complete list.

## 8. API Response Convention

### Success
```json
{
  "success": true,
  "data": {}
}
```

### Error
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [{ "field": "email", "message": "Invalid email format" }]
  }
}
```

**Never expose**: Stack traces, credentials, Firebase internals, Cloudinary secrets, infrastructure details.

## 9. Error Handling Categories

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 422 | Zod schema validation failed |
| `UNAUTHENTICATED` | 401 | Missing or invalid Firebase ID token |
| `FORBIDDEN` | 403 | Authenticated but insufficient privileges |
| `NOT_FOUND` | 404 | Resource does not exist |
| `CONFLICT` | 409 | Duplicate slug, unique constraint violation |
| `RATE_LIMITED` | 429 | Too many requests |
| `UNAVAILABLE` | 503 | External service down (SMTP, Cloudinary, OpenAI) |
| `SERVER_ERROR` | 500 | Unexpected internal error |

## 10. Date Convention

- **API Responses**: ISO 8601 UTC (`2026-10-11T17:30:00.000Z`)
- **Firestore Storage**: `Timestamp` objects (converted at service layer)
- **Client Display**: Localized via `Intl.DateTimeFormat`

## 11. Logging Strategy

- **Structured Logging**: JSON format for production log aggregation
- **Levels**: `error`, `warn`, `info`, `debug` (dev only)
- **Redacted**: Passwords, private keys, API secrets, full auth tokens
- **Context**: Request ID, user ID (admin), endpoint, latency

## 12. Migration from Prisma/PostgreSQL

This architecture replaces the previous Prisma + PostgreSQL stack:
- **Prisma Schema** → Firestore Collections (`docs/02-firestore-schema.md`)
- **Prisma Client** → Firestore Admin SDK Service Layer (`src/lib/firestore/`)
- **Custom Auth** → Firebase Auth + Custom Claims (`docs/04-auth-security.md`)
- **pgvector** → Vertex AI Vector Search / Pinecone (documented in `docs/05-rag-architecture.md`)

The Prisma schema and related files remain in the repository for reference during transition but are no longer the source of truth.