# 01 — System Architecture: PureBlend Food Chemicals

## 1. Overview & Context

PureBlend Food Chemicals is a production-grade enterprise web platform designed for the food chemical manufacturing and distribution industry. The platform serves two distinct user classes:
1. **Public B2B Visitors**: Food and beverage manufacturers, procurement managers, and food scientists discovering certified food chemicals (preservatives, acidulants, antioxidants, emulsifiers, sweeteners, flavoring agents), requesting quotes, checking active promotions, reading technical FAQs, and consulting an AI technical assistant.
2. **Internal Enterprise Administrators**: Business managers controlling product catalogs, technical specifications, dynamic homepage banners, commercial offers, FAQ articles, SEO metadata, contact submissions, and the grounded AI knowledge base.

To ensure rapid delivery, type safety, seamless deployment, and zero impedance between frontend and backend developers in a shared Git repository, PureBlend adopts a unified **Next.js Full-Stack Architecture** powered by **TypeScript**, **PostgreSQL**, **Prisma ORM**, **Zod**, and **pgvector**.

---

## 2. Tiered System Architecture

```
+-----------------------------------------------------------------------------------+
|                              Client Layer (Browser)                                |
|  Public Web Pages (SSR/SSG/ISR)  |  Admin Dashboard CMS  |  RAG Chat Widget (React)|
+-----------------------------------------+-----------------------------------------+
                                          | HTTPS JSON API / Server Actions
                                          v
+-----------------------------------------------------------------------------------+
|                        Next.js Server / Edge Gateway                              |
|  - Security Headers (CSP, HSTS, X-Frame-Options, Permissions-Policy)               |
|  - Global Routing & Static Asset Optimization                                     |
|  - Edge Middleware (Admin Session Validation Guard)                               |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                           API / Server Boundary Layer                             |
|  - Route Handlers (`src/app/api/...`)                                             |
|  - Authentication & RBAC (`src/lib/server/auth.ts`)                              |
|  - Rate Limiting & Anti-Spam Gatekeeper (`src/lib/server/rate-limit.ts`)          |
|  - Input Validation & Sanitization with Zod (`src/lib/server/validators/...`)     |
|  - Unified Error Response Normalization (`src/lib/server/api-response.ts`)       |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                         Business Logic & Service Layer                            |
|                     (`src/lib/server/services/...`)                               |
|  +---------------------+  +--------------------+  +----------------------------+  |
|  | ProductService      |  | CategoryService    |  | Banner & OfferService      |  |
|  +---------------------+  +--------------------+  +----------------------------+  |
|  | FaqService          |  | ContactService     |  | SeoService                 |  |
|  +---------------------+  +--------------------+  +----------------------------+  |
|  | StorageService      |  | EmailService(SMTP) |  | RagService (Vector Search) |  |
|  +---------------------+  +--------------------+  +----------------------------+  |
+-----------------------------------------+-----------------------------------------+
                                          |
                     +--------------------+--------------------+
                     |                                         |
                     v                                         v
+-----------------------------------------+   +-------------------------------------+
|         Prisma ORM Data Layer           |   |       External Cloud Services       |
|    (`src/lib/server/prisma.ts`)         |   |                                     |
|  - Type-Safe Query Construction         |   |  1. SMTP Server (Nodemailer)        |
|  - Connection Pooling & Lifecycle       |   |  2. Object Storage (Cloudinary/S3)  |
|  - Schema Migrations & Seeding          |   |  3. OpenAI API (Embeddings + LLM)   |
+--------------------+--------------------+   +-------------------------------------+
                     |
                     v
+-----------------------------------------------------------------------------------+
|                        PostgreSQL Relational & Vector DB                          |
|  - Relational Schema (Products, Categories, Offers, Banners, SEO, AdminUsers)     |
|  - pgvector Extension (Vector Cosine Index on KnowledgeChunk embeddings)          |
|  - ACID Transactions, Referential Integrity, Composite Indexes                     |
+-----------------------------------------------------------------------------------+
```

---

## 3. Layer Responsibilities & Boundaries

### 3.1. Client Layer (Frontend)
- **Role**: Presentation, accessible user experience, interactive forms, responsive layouts, client-side optimistic feedback.
- **Contract**: Communicates strictly via `src/lib/api/` services with JSON payloads.
- **Boundary**: Never imports server-only modules (`@prisma/client`, `nodemailer`, secret environment variables). Contains no database credentials or API keys.

### 3.2. Server Boundary & API Layer (`src/app/api/...`)
- **Role**: HTTP termination, protocol enforcement, security validation, and response formatting.
- **Responsibilities**:
  1. **Authentication Verification**: Verify admin session cookies on every protected route.
  2. **Rate Limiting**: Block abuse on sensitive endpoints (`/api/auth/login`, `/api/contact`, `/api/chat`).
  3. **Input Validation**: Parse request bodies using strict Zod schemas; reject invalid payloads before executing business logic.
  4. **Error Normalization**: Intercept all internal exceptions and map them to the standard error contract:
     ```json
     { "error": { "code": "STRING", "message": "STRING", "details": [] } }
     ```

### 3.3. Business Logic & Service Layer (`src/lib/server/services/`)
- **Role**: Core application domain logic, business invariants, cross-table workflows, and external integrations.
- **Separation of Concerns**: Route handlers remain thin controllers; all logic resides in reusable, unit-testable service modules.
- **Services Inventory**:
  - `ProductService`: Product creation, slug generation, category assignment, specifications handling, search, and publishing toggle.
  - `CategoryService`: Hierarchy, slug generation, cascade integrity.
  - `BannerService` & `OfferService`: Active schedule evaluation, priority sorting.
  - `FaqService`: Category grouping, display order sorting.
  - `ContactService`: Message persistence, honeypot verification, SMTP dispatch trigger.
  - `StorageService`: Upload validation (MIME/size/extension) and CDN synchronization.
  - `RagService`: Text chunking, embedding generation, vector similarity querying, knowledge grounding, and LLM orchestration.
  - `EmailService`: Nodemailer transport pool management, email templating, and header injection prevention.

### 3.4. Data Access Layer (Prisma ORM)
- **Role**: Object-relational mapping, database connection pooling, schema synchronization, and query optimization.
- **Single Source of Truth**: `prisma/schema.prisma`.
- **Database Client**: Singleton pattern in `src/lib/server/prisma.ts` to prevent connection exhaustion during development hot-reloads and serverless cold starts.

### 3.5. Database Layer (PostgreSQL + pgvector)
- **Role**: Persistent transactional storage and high-dimensional vector search.
- **Relational Tables**: Enforce foreign keys, unique constraints, and B-tree indexes.
- **Vector Operations**: Native `vector(1536)` columns with HNSW/IVFFlat cosine distance indexing (`<=>`) for instantaneous semantic retrieval.

---

## 4. Key Subsystem Workflows

### 4.1. AI RAG (Retrieval-Augmented Generation) Subsystem
The AI chatbot assists users with technical queries about PureBlend's certified chemical catalog, quality compliance (ISO, Halal, Kosher, FSSC 22000), and storage specifications. It is strictly constrained to approved knowledge.

```
+----------------------------------------------------------------------------------+
|                             RAG INGESTION PIPELINE                               |
|                                                                                  |
| Admin updates Product / FAQ / Document                                            |
|   --> Extract textual representation (Name, CAS#, Specs, Quality, Usage)         |
|   --> Text Chunking (Chunk size: 500-800 tokens, 100-token overlap)               |
|   --> OpenAI text-embedding-3-small (1536 dimensions)                            |
|   --> Upsert `KnowledgeChunk` records in PostgreSQL (pgvector column)            |
+----------------------------------------------------------------------------------+

+----------------------------------------------------------------------------------+
|                              RAG QUERY PIPELINE                                  |
|                                                                                  |
| 1. User submits question via `POST /api/chat`                                    |
| 2. Rate limiter verifies user quota (e.g., 10 req/min per IP/session)             |
| 3. Input validation (Zod: 1-500 characters, whitespace normalized)               |
| 4. Generate query embedding via OpenAI text-embedding-3-small                     |
| 5. Vector Similarity Search in PostgreSQL:                                        |
|    SELECT chunk_id, content, 1 - (embedding <=> query_vec) AS similarity          |
|    FROM "KnowledgeChunk" WHERE similarity >= 0.70                                |
|    ORDER BY similarity DESC LIMIT 4;                                             |
| 6. Grounding Evaluation:                                                         |
|    - If no chunks meet similarity threshold (0.70):                               |
|        RETURN: "I do not have verified information in the PureBlend catalog to   |
|                 answer that question. Please contact our technical team."        |
|    - If relevant chunks retrieved:                                               |
|        Construct strict system prompt with retrieved context                     |
|        --> LLM generates grounded answer citing sources                          |
| 7. Return `{ reply, conversationId, sources: [{ title, url }] }`                 |
| 8. Persist conversation turn in `ChatLog` for compliance audit                   |
+----------------------------------------------------------------------------------+
```

### 4.2. Image & Asset Storage Subsystem
Handles product spec sheets, certificate logos, banner artwork, and product packaging imagery.

```
Admin selects file in CMS modal
  --> `POST /api/admin/upload` (multipart/form-data)
  --> Server-side validation:
      - Max file size: 5 MB
      - Allowed MIME types: image/jpeg, image/png, image/webp
      - Magic-number binary header validation
  --> Dispatch buffer to Cloudinary or Supabase Storage (via private server API keys)
  --> Provider returns secure CDN URL (`https://res.cloudinary.com/.../img.webp`)
  --> Return `{ url, width, height, format }` to admin client
  --> Admin submits Product/Banner form with the returned CDN URL
  --> URL persisted in `ProductImage` or `Banner` table
```

### 4.3. Contact & SMTP Notification Subsystem
Ensures reliable delivery of B2B procurement inquiries while eliminating spam and email injection attacks.

```
Public visitor submits Contact Form
  --> `POST /api/contact`
  --> Rate limit check: Max 5 submissions per 10 minutes per IP
  --> Zod Schema Validation:
      - `name`: 2-120 chars
      - `email`: RFC 5322 compliant, max 200 chars
      - `subject`: 3-200 chars
      - `message`: 10-5000 chars
      - `honeypot`: Must be empty
  --> Honeypot Check: If populated, immediately return `{ ok: true }` without action
  --> Persist submission in `ContactMessage` table (status: UNREAD)
  --> Sanitize headers: Strip CR/LF (`\r`, `\n`) from email and subject to prevent header injection
  --> HTML escape message body to prevent HTML email injection
  --> Nodemailer sends transactional email via authenticated SMTP
  --> Return `{ ok: true }`
```

---

## 5. Security & Isolation Model

1. **Zero Secret Leakage**:
   - Client bundles are analyzed to guarantee no server environment variables (`DATABASE_URL`, `AUTH_SECRET`, `OPENAI_API_KEY`, `SMTP_*`) are included.
   - All server operations reside in `src/lib/server/` or `src/app/api/`.
2. **Authoritative Server Verification**:
   - The frontend AdminGuard is merely an ergonomic UX redirect.
   - Every single `/api/admin/*` endpoint strictly validates the server session token before reading or modifying data.
3. **Defense in Depth**:
   - SQL Injection: Fully mitigated via Prisma parameterized queries.
   - XSS: React automatic escaping + explicit server sanitization.
   - CSRF & Session Hijacking: `HttpOnly`, `SameSite=Lax`, `Secure` cookies.
   - Resource Exhaustion: In-memory/Redis rate limiting on all public write endpoints.

---

## 6. Deployment Architecture

- **Application Hosting**: Vercel Serverless / Node.js 20+ Runtime.
- **Database**: Managed PostgreSQL (Supabase, Neon, or AWS RDS PostgreSQL 16) with `pgvector` extension enabled.
- **Object Storage**: Cloudinary or Supabase Storage bucket with public CDN delivery.
- **Email Delivery**: Standard SMTP gateway (SendGrid, Resend, Amazon SES, or corporate SMTP server).
- **AI Engine**: OpenAI API (`text-embedding-3-small` and `gpt-4o-mini`).
