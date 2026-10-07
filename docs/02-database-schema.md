# 02 — Database Schema Architecture: PureBlend Food Chemicals

## 1. Overview & Database Technology Selection

The PureBlend Food Chemicals data tier is built on **PostgreSQL 16+** accessed through **Prisma ORM**. PostgreSQL provides the required enterprise transactional consistency (ACID), strong relational integrity, robust indexing, and native high-dimensional vector search via the `pgvector` extension.

### Core Architecture Highlights
- **Primary Keys**: CUID (`cuid()`) strings across all application tables for distributed generation, URL safety, and resistance to sequential enumeration attacks.
- **Auditing & Timestamps**: Standard `createdAt` (`DateTime @default(now())`) and `updatedAt` (`DateTime @updatedAt`) across all mutable entities.
- **Relational Integrity**: Strict foreign key relationships with explicit cascade policies (`Cascade`, `SetNull`, `Restrict`).
- **Vector Extension**: Native `vector(1536)` support in the `KnowledgeChunk` table for OpenAI embedding similarity.
- **Multi-Tenant / Subsystem Harmony**: Single unified schema supporting Public Catalog, Admin CMS, Contact Submissions, SEO Management, and AI RAG knowledge.

---

## 2. Entity-Relationship Overview

```
+---------------+           +---------------+
|   AdminUser   |           |    Category   |
+---------------+           +-------+-------+
                                    | 1
                                    |
                                    | 0..*
+---------------+           +-------v-------+           +---------------+
|     Banner    |           |    Product    +---------->+      SEO      |
+---------------+           +-------+-------+ 1       1 +---------------+
                                    | 1
+---------------+                   |
|     Offer     |                   | 0..*
+---------------+           +-------v-------+
                            |  ProductImage |
+---------------+           +---------------+
|      FAQ      |
+---------------+

+---------------+           +---------------+           +---------------+
|      Page     +---------->+  PageSection  |           | ContactMessage|
+---------------+ 1       * +---------------+           +---------------+

+-------------------+       +-------------------+       +---------------+
| KnowledgeDocument +------>+  KnowledgeChunk   |       |    ChatLog    |
+-------------------+ 1   * +-------------------+       +---------------+
```

---

## 3. Comprehensive Table Specifications

### 3.1. `AdminUser`
- **Purpose**: Authenticated internal administrative accounts with role-based access control (RBAC) for CMS operations.
- **Fields**:
  | Field | Type | Modifiers | Constraints & Notes |
  |---|---|---|---|
  | `id` | `String` | `@id @default(cuid())` | Primary Key |
  | `email` | `String` | `@unique` | Unique, lowercase, indexed |
  | `passwordHash` | `String` | Not Null | Argon2id / bcrypt hashed credential (never plain) |
  | `name` | `String` | Not Null | Display name (e.g., "Dr. Elena Vance") |
  | `role` | `String` | `@default("ADMIN")` | Enum-like string (`SUPERADMIN`, `ADMIN`, `EDITOR`) |
  | `isActive` | `Boolean` | `@default(true)` | Instant revocation flag |
  | `lastLoginAt` | `DateTime` | Nullable | Audit timestamp |
  | `createdAt` | `DateTime` | `@default(now())` | Creation audit |
  | `updatedAt` | `DateTime` | `@updatedAt` | Update audit |
- **Indexes**: `@@index([email])`, `@@index([role, isActive])`
- **Relationships**: Audit relationships to CMS changes where applicable.

---

### 3.2. `Category`
- **Purpose**: Chemical classification hierarchy (e.g., "Preservatives & Shelf-Life Extenders", "Acidulants & pH Regulators", "Antioxidants", "Emulsifiers & Stabilizers", "Sweeteners").
- **Fields**:
  | Field | Type | Modifiers | Constraints & Notes |
  |---|---|---|---|
  | `id` | `String` | `@id @default(cuid())` | Primary Key |
  | `name` | `String` | Not Null | Commercial classification name |
  | `slug` | `String` | `@unique` | URL slug (e.g., `acidulants-ph-regulators`) |
  | `description` | `String` | Nullable | Text summary for category headers |
  | `displayOrder` | `Int` | `@default(0)` | Sorting sequence in navigation and filter pills |
  | `createdAt` | `DateTime` | `@default(now())` | Creation audit |
  | `updatedAt` | `DateTime` | `@updatedAt` | Update audit |
- **Indexes**: `@@unique([slug])`, `@@index([displayOrder])`
- **Relationships**:
  - `products`: `Product[]` (One-to-many relationship; `onDelete: Restrict` to avoid accidental orphan chemical deletions).

---

### 3.3. `Product`
- **Purpose**: Master entity for food chemical items including trade names, CAS numbers, technical grades, regulatory specifications, and publishing state.
- **Fields**:
  | Field | Type | Modifiers | Constraints & Notes |
  |---|---|---|---|
  | `id` | `String` | `@id @default(cuid())` | Primary Key |
  | `name` | `String` | Not Null | Official chemical name (e.g., "Sodium Benzoate Premium Grade") |
  | `slug` | `String` | `@unique` | URL-safe slug (e.g., `sodium-benzoate-premium`) |
  | `categoryId` | `String` | Nullable | Foreign Key referencing `Category.id` |
  | `shortDescription` | `String` | Nullable | 1-2 sentence catalog summary |
  | `description` | `String` | Not Null | Full chemical and application description (Text) |
  | `specifications` | `Json` | `@default("[]")` | Key-value technical specs: purity, CAS#, E-number, packaging |
  | `published` | `Boolean` | `@default(false)` | Public visibility toggle |
  | `featured` | `Boolean` | `@default(false)` | Promoted flag for homepage highlight |
  | `createdAt` | `DateTime` | `@default(now())` | Creation audit |
  | `updatedAt` | `DateTime` | `@updatedAt` | Update audit |
- **Indexes**:
  - `@@unique([slug])`
  - `@@index([categoryId])`
  - `@@index([published, featured])`
  - `@@index([createdAt(sort: Desc)])`
- **Relationships**:
  - `category`: `Category? @relation(fields: [categoryId], references: [id], onDelete: SetNull)`
  - `images`: `ProductImage[]` (One-to-many; `onDelete: Cascade`)
  - `seo`: `SEO?` (One-to-one polymorphism or dedicated relation; `onDelete: Cascade`)

---

### 3.4. `ProductImage`
- **Purpose**: High-resolution photography, packaging diagrams, and certificate emblems associated with a product.
- **Fields**:
  | Field | Type | Modifiers | Constraints & Notes |
  |---|---|---|---|
  | `id` | `String` | `@id @default(cuid())` | Primary Key |
  | `productId` | `String` | Not Null | Foreign Key referencing `Product.id` |
  | `url` | `String` | Not Null | Fully qualified CDN URL (Cloudinary / Supabase Storage) |
  | `alt` | `String` | Not Null | Accessible descriptive alt text |
  | `isPrimary` | `Boolean` | `@default(false)` | Thumbnail/Hero image indicator |
  | `displayOrder` | `Int` | `@default(0)` | Sequence in image gallery |
  | `createdAt` | `DateTime` | `@default(now())` | Creation audit |
- **Indexes**: `@@index([productId, displayOrder])`
- **Relationships**:
  - `product`: `Product @relation(fields: [productId], references: [id], onDelete: Cascade)`

---

### 3.5. `Banner`
- **Purpose**: Dynamic hero banners and marketing ribbons rendered across the public storefront.
- **Fields**:
  | Field | Type | Modifiers | Constraints & Notes |
  |---|---|---|---|
  | `id` | `String` | `@id @default(cuid())` | Primary Key |
  | `title` | `String` | Not Null | Primary banner headline |
  | `subtitle` | `String` | Nullable | Secondary subhead |
  | `imageUrl` | `String` | Not Null | CDN artwork asset URL |
  | `imageAlt` | `String` | Not Null | Screen-reader accessible label |
  | `linkUrl` | `String` | Nullable | Target internal route or external CTA |
  | `linkLabel` | `String` | Nullable | Button text (e.g., "Explore Acidulants") |
  | `displayOrder` | `Int` | `@default(0)` | Carousel display priority |
  | `active` | `Boolean` | `@default(true)` | Immediate activation toggle |
  | `startDate` | `DateTime` | Nullable | Scheduled publishing start (optional) |
  | `endDate` | `DateTime` | Nullable | Scheduled publishing expiry (optional) |
  | `createdAt` | `DateTime` | `@default(now())` | Creation audit |
  | `updatedAt` | `DateTime` | `@updatedAt` | Update audit |
- **Indexes**: `@@index([active, displayOrder])`

---

### 3.6. `Offer`
- **Purpose**: Commercial volume discounts, seasonal contracts, and bulk chemical sample promotions.
- **Fields**:
  | Field | Type | Modifiers | Constraints & Notes |
  |---|---|---|---|
  | `id` | `String` | `@id @default(cuid())` | Primary Key |
  | `title` | `String` | Not Null | Promotion title (e.g., "Q4 Bulk Ascorbic Acid Contract") |
  | `description` | `String` | Nullable | Terms and qualifying minimums |
  | `discountText` | `String` | Not Null | Highlight badge (e.g., "15% Off FCL Orders", "Free Lab Sample") |
  | `imageUrl` | `String` | Nullable | Promotional graphic asset |
  | `validFrom` | `DateTime` | Nullable | Validity window start |
  | `validTo` | `DateTime` | Nullable | Validity window end |
  | `active` | `Boolean` | `@default(true)` | Active status toggle |
  | `createdAt` | `DateTime` | `@default(now())` | Creation audit |
  | `updatedAt` | `DateTime` | `@updatedAt` | Update audit |
- **Indexes**: `@@index([active, validTo])`

---

### 3.7. `FAQ`
- **Purpose**: Technical questions and answers regarding regulatory compliance, solubility, shelf-life, handling, and ordering minimums.
- **Fields**:
  | Field | Type | Modifiers | Constraints & Notes |
  |---|---|---|---|
  | `id` | `String` | `@id @default(cuid())` | Primary Key |
  | `question` | `String` | Not Null | Technical inquiry title |
  | `answer` | `String` | Not Null | Detailed verified answer (Text) |
  | `category` | `String` | Nullable | Logical grouping (e.g., "Compliance", "Logistics", "Formulation") |
  | `displayOrder` | `Int` | `@default(0)` | Accordion sequence |
  | `published` | `Boolean` | `@default(true)` | Public visibility toggle |
  | `createdAt` | `DateTime` | `@default(now())` | Creation audit |
  | `updatedAt` | `DateTime` | `@updatedAt` | Update audit |
- **Indexes**: `@@index([published, displayOrder])`

---

### 3.8. `Page` & `PageSection`
- **Purpose**: Dynamic CMS-driven marketing content for pages such as About Us, Quality & Compliance, Sustainability, and Terms of Supply.
- **`Page` Fields**:
  | Field | Type | Modifiers | Constraints & Notes |
  |---|---|---|---|
  | `id` | `String` | `@id @default(cuid())` | Primary Key |
  | `pageKey` | `String` | `@unique` | Identifier (e.g., `about`, `quality`, `privacy`, `terms`) |
  | `title` | `String` | Not Null | Page title |
  | `createdAt` | `DateTime` | `@default(now())` | Creation audit |
  | `updatedAt` | `DateTime` | `@updatedAt` | Update audit |
- **`PageSection` Fields**:
  | Field | Type | Modifiers | Constraints & Notes |
  |---|---|---|---|
  | `id` | `String` | `@id @default(cuid())` | Primary Key |
  | `pageId` | `String` | Not Null | Foreign Key referencing `Page.id` |
  | `heading` | `String` | Nullable | Section heading |
  | `body` | `String` | Not Null | Body content (safe markdown/text) |
  | `displayOrder` | `Int` | `@default(0)` | Sequence order on page |
- **Relationships**:
  - `page`: `Page @relation(fields: [pageId], references: [id], onDelete: Cascade)`
  - `sections`: `PageSection[]`

---

### 3.9. `SEO`
- **Purpose**: Search engine optimization tags (meta title, description, canonical link, Open Graph image) associated with public entities or standalone pages.
- **Fields**:
  | Field | Type | Modifiers | Constraints & Notes |
  |---|---|---|---|
  | `id` | `String` | `@id @default(cuid())` | Primary Key |
  | `entityType` | `String` | Not Null | Entity type (`PRODUCT`, `PAGE`, `GLOBAL`) |
  | `entityId` | `String` | Not Null | ID of the target product or pageKey |
  | `metaTitle` | `String` | Nullable | Tag `<title>` override (max 70 chars) |
  | `metaDescription`| `String` | Nullable | Meta description (max 160 chars) |
  | `canonicalUrl` | `String` | Nullable | Canonical URL override |
  | `ogImage` | `String` | Nullable | Open Graph preview image URL |
  | `createdAt` | `DateTime` | `@default(now())` | Creation audit |
  | `updatedAt` | `DateTime` | `@updatedAt` | Update audit |
- **Indexes**:
  - `@@unique([entityType, entityId])`
  - `@@index([entityType, entityId])`

---

### 3.10. `ContactMessage`
- **Purpose**: Stores inbound B2B contact requests, technical sample inquiries, and quotation requests submitted through the public website.
- **Fields**:
  | Field | Type | Modifiers | Constraints & Notes |
  |---|---|---|---|
  | `id` | `String` | `@id @default(cuid())` | Primary Key |
  | `name` | `String` | Not Null | Submitter full name |
  | `email` | `String` | Not Null | Business email address |
  | `subject` | `String` | Not Null | Message topic or product of interest |
  | `message` | `String` | Not Null | Body text (10 to 5000 chars) |
  | `ipAddress` | `String` | Nullable | Client IP for abuse prevention audits |
  | `status` | `String` | `@default("UNREAD")`| Workflow status (`UNREAD`, `READ`, `ARCHIVED`) |
  | `createdAt` | `DateTime` | `@default(now())` | Submission timestamp |
- **Indexes**: `@@index([status, createdAt(sort: Desc)])`

---

### 3.11. `KnowledgeDocument` & `KnowledgeChunk` (RAG Architecture)
- **Purpose**: The authoritative corpus of approved PureBlend technical specifications, ISO certifications, handling guidelines, and company credentials used exclusively to ground AI chatbot answers.
- **`KnowledgeDocument` Fields**:
  | Field | Type | Modifiers | Constraints & Notes |
  |---|---|---|---|
  | `id` | `String` | `@id @default(cuid())` | Primary Key |
  | `title` | `String` | Not Null | Document title (e.g., "Citric Acid Anhydrous Technical Data Sheet") |
  | `sourceType` | `String` | Not Null | Origin type (`PRODUCT_SPEC`, `FAQ`, `CERTIFICATE`, `POLICY`) |
  | `sourceId` | `String` | Nullable | Linked Product or FAQ ID (for automated sync) |
  | `rawContent` | `String` | Not Null | Full extracted text |
  | `checksum` | `String` | Not Null | MD5/SHA256 hash to detect changes and avoid redundant re-embedding |
  | `createdAt` | `DateTime` | `@default(now())` | Ingestion timestamp |
  | `updatedAt` | `DateTime` | `@updatedAt` | Modification timestamp |
- **`KnowledgeChunk` Fields**:
  | Field | Type | Modifiers | Constraints & Notes |
  |---|---|---|---|
  | `id` | `String` | `@id @default(cuid())` | Primary Key |
  | `documentId` | `String` | Not Null | Foreign Key referencing `KnowledgeDocument.id` |
  | `chunkIndex` | `Int` | Not Null | Position index of chunk within source doc |
  | `content` | `String` | Not Null | Chunk text content (500-800 tokens) |
  | `tokenCount` | `Int` | Not Null | Exact token length |
  | `embedding` | `Unsupported("vector(1536)")` | Nullable in Prisma schema | pgvector embedding vector (OpenAI text-embedding-3-small) |
  | `metadata` | `Json` | `@default("{}")` | Structured tags (product name, grade, CAS, compliance) |
  | `createdAt` | `DateTime` | `@default(now())` | Generation timestamp |
- **Indexes & Relationships**:
  - `KnowledgeChunk`: `@@index([documentId])`
  - Raw SQL index on pgvector:
    ```sql
    CREATE INDEX idx_knowledge_chunk_embedding ON "KnowledgeChunk"
    USING hnsw (embedding vector_cosine_ops);
    ```
  - `document`: `KnowledgeDocument @relation(fields: [documentId], references: [id], onDelete: Cascade)`

---

### 3.12. `ChatLog`
- **Purpose**: Complete audit trail of user queries, retrieved context chunks, AI generated responses, and refusal triggers for safety, grounding verification, and compliance review.
- **Fields**:
  | Field | Type | Modifiers | Constraints & Notes |
  |---|---|---|---|
  | `id` | `String` | `@id @default(cuid())` | Primary Key |
  | `conversationId` | `String` | Not Null | Client conversation session token |
  | `userMessage` | `String` | Not Null | User inquiry text |
  | `botResponse` | `String` | Not Null | Grounded response generated by LLM |
  | `retrievedChunks`| `Json` | `@default("[]")` | Array of chunk IDs and similarity scores |
  | `wasRefusal` | `Boolean` | `@default(false)`| Flag indicating if question was outside approved scope |
  | `latencyMs` | `Int` | Nullable | End-to-end inference and retrieval latency |
  | `createdAt` | `DateTime` | `@default(now())` | Turn timestamp |
- **Indexes**:
  - `@@index([conversationId, createdAt])`
  - `@@index([wasRefusal])`

---

## 4. Key Relational Integrity Policies

| Relationship | Parent Table | Child Table | Foreign Key | Cascade Rule | Business Justification |
|---|---|---|---|---|---|
| Product &rarr; Category | `Category` | `Product` | `categoryId` | `ON DELETE SetNull` | Deleting a category must never accidentally delete expensive chemical product records. |
| Product &rarr; Images | `Product` | `ProductImage` | `productId` | `ON DELETE Cascade` | When a product is removed, its associated image metadata records must be purged. |
| Product &rarr; SEO | `Product` | `SEO` | `entityId` | Handled via service / `Cascade` | Deleting a product removes its custom SEO metadata. |
| Document &rarr; Chunks | `KnowledgeDocument` | `KnowledgeChunk`| `documentId` | `ON DELETE Cascade` | When a source document is updated/deleted, stale vector chunks are automatically dropped. |
| Page &rarr; Sections | `Page` | `PageSection` | `pageId` | `ON DELETE Cascade` | Sections belong exclusively to their parent CMS page. |

---

## 5. Migration & Seeding Strategy

1. **Development & CI**: `prisma migrate dev --name <migration_name>` applies structured DDL migrations.
2. **Production Deployment**: `prisma migrate deploy` executes committed migration steps without schema drift.
3. **Seed Script (`prisma/seed.ts`)**:
   - Provisions default Superadmin account with secure password hashing.
   - Populates approved food chemical categories (Preservatives, Acidulants, Antioxidants, Emulsifiers, Sweeteners).
   - Seeds realistic food chemical products (Sodium Benzoate, Potassium Sorbate, Citric Acid Anhydrous, Ascorbic Acid, Xanthan Gum, Sucralose).
   - Ingests official PureBlend compliance data into `KnowledgeDocument` and triggers embedding generation.
