# 02 — Firestore Schema Architecture: PureBlend Food Chemicals

## 1. Overview

Firestore replaces the previous PostgreSQL + Prisma data layer. This document describes the collection/document structure, field definitions, relationships, indexes, and access patterns for all Firestore collections.

Firestore is a NoSQL document database. Data model decisions prioritize:
- **Denormalization**: Key fields duplicated where query patterns require it
- **Collection Groups**: Used for cross-collection queries where appropriate
- **Timestamps**: Server-generated `FieldValue.serverTimestamp()` for createdAt/updatedAt
- **No SQL Constraints**: Uniqueness enforced via application logic + security rules

## 2. Collection Definitions

### 2.1 `categories`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | CUID-generated primary key |
| `name` | string | Yes | Category name (e.g., "Preservatives") |
| `slug` | string | Yes | URL-safe slug (lowercase, hyphenated) |
| `description` | string | No | Category description |
| `displayOrder` | number | Yes | Sort order in navigation |
| `createdAt` | Timestamp | Yes | Server-generated |
| `updatedAt` | Timestamp | Yes | Server-generated |

**Indexes**:
- Single field: `[slug]`
- Composite: `[displayOrder, active]`
- **Unique constraint enforced by**: Firestore security rules + application logic (see §3.2)

**Relationships**:
- One-to-many: `products` collection via `categoryId`

---

### 2.2 `products`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | CUID-generated primary key |
| `name` | string | Yes | Product name |
| `slug` | string | Yes | URL-safe slug |
| `categoryId` | string | No | Reference to `categories/{id}` |
| `shortDescription` | string | No | 1-2 sentence summary |
| `description` | string | Yes | Full product description |
| `specifications` | array | Yes (default: []) | `[{ label, value }]` |
| `images` | array | Yes (default: []) | See `ProductImage` below |
| `featured` | boolean | Yes (default: false) | Homepage highlight flag |
| `published` | boolean | Yes (default: false) | Public visibility toggle |
| `seoTitle` | string | No | Override meta title |
| `metaDescription` | string | No | Override meta description |
| `ogImage` | string | No | Open Graph image URL |
| `createdAt` | Timestamp | Yes | Server-generated |
| `updatedAt` | Timestamp | Yes | Server-generated |

**Indexes**:
- Single field: `[slug]`
- Composite: `[categoryId, published, featured]`
- Composite: `[published, featured, createdAt]` (descending)
- **Unique constraint enforced by**: Application logic + security rules

**Relationships**:
- Many-to-one: `category` via `categoryId → categories/{id}`
- One-to-many: `images` (embedded objects, not separate collection)
- One-to-one (optional): `seo` via separate document in `seo` collection

**Uniqueness Enforcement**:
Since Firestore does not have SQL UNIQUE constraints:
1. Application checks `slugExists()` before create/update
2. Firestore security rule: `onlyOnePerCollection([slug])`
3. Global slug index document pattern (alternative: separate `slugIndex` collection)

---

### 2.3 `banners`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | CUID-generated primary key |
| `title` | string | Yes | Banner headline |
| `description` | string | No | Secondary subhead |
| `imageUrl` | string | Yes | Cloudinary CDN URL |
| `imageAlt` | string | Yes | Screen-reader label |
| `linkUrl` | string | No | CTA target |
| `linkLabel` | string | No | Button text |
| `displayOrder` | number | Yes | Carousel priority |
| `active` | boolean | Yes (default: true) | Activation toggle |
| `startDate` | Timestamp | No | Scheduled start |
| `endDate` | Timestamp | No | Scheduled expiry |
| `createdAt` | Timestamp | Yes | Server-generated |
| `updatedAt` | Timestamp | Yes | Server-generated |

**Indexes**:
- Composite: `[active, displayOrder]`
- Composite: `[startDate, endDate]` (for schedule validation)

**Status Logic**:
- `active=true ∧ now >= startDate ∧ now <= endDate` → ACTIVE
- Otherwise → INACTIVE (not rendered)

---

### 2.4 `offers`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | CUID-generated primary key |
| `title` | string | Yes | Promotion title |
| `description` | string | No | Terms and qualifying minimums |
| `discountText` | string | Yes | Badge text (e.g., "15% Off") |
| `imageUrl` | string | No | Promotional graphic URL |
| `validFrom` | Timestamp | No | Validity window start |
| `validTo` | Timestamp | No | Validity window end |
| `active` | boolean | Yes (default: true) | Active status |
| `createdAt` | Timestamp | Yes | Server-generated |
| `updatedAt` | Timestamp | Yes | Server-generated |

**Indexes**:
- Composite: `[active, validTo]`
- **Status determination**: Computed at read time per §4.3

**Status Logic** (`OfferStatus`):
| Condition | Status |
|-----------|--------|
| `!active` | `DRAFT` |
| `active ∧ validFrom > now` | `SCHEDULED` |
| `active ∧ validTo < now` | `EXPIRED` |
| `active ∧ validFrom ≤ now ∧ validTo ≥ now` | `ACTIVE` |

---

### 2.5 `faqs`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | CUID-generated primary key |
| `question` | string | Yes | Technical inquiry |
| `answer` | string | Yes | Verified answer |
| `category` | string | No | Logical grouping |
| `displayOrder` | number | Yes (default: 0) | Accordion sequence |
| `published` | boolean | Yes (default: true) | Public visibility |
| `createdAt` | Timestamp | Yes | Server-generated |
| `updatedAt` | Timestamp | Yes | Server-generated |

**Indexes**:
- Composite: `[published, displayOrder]`
- **Unique constraint**: `question` within `published === true` (enforced by application logic)

**Relationships**:
- Many-to-one: `category` (free-text reference, not a document reference to conserve reads)

---

### 2.6 `pages`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | CUID-generated primary key |
| `pageKey` | string | Yes | Unique identifier ("about", "quality", "privacy", "terms") |
| `title` | string | Yes | Page title |
| `sections` | array | Yes (default: []) | See `PageSection` below |
| `createdAt` | Timestamp | Yes | Server-generated |
| `updatedAt` | Timestamp | Yes | Server-generated |

**Indexes**:
- Single field: `[pageKey]` (unique)

---

### 2.7 `seo`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | CUID-generated primary key |
| `entityType` | string | Yes | `"PRODUCT"` \| `"PAGE"` \| `"GLOBAL"` |
| `entityId` | string | Yes | Product ID or pageKey |
| `metaTitle` | string | No | Override `<title>` (max 70 chars) |
| `metaDescription` | string | No | Meta description (max 160 chars) |
| `canonicalUrl` | string | No | Canonical URL override |
| `ogImage` | string | No | Open Graph preview image URL |
| `createdAt` | Timestamp | Yes | Server-generated |
| `updatedAt` | Timestamp | Yes | Server-generated |

**Indexes**:
- Composite: `[entityType, entityId]` (unique)

**Uniqueness**: One SEO document per `(entityType, entityId)` pair — enforced by application logic + Firestore constraint pattern.

---

### 2.8 `contactMessages`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | CUID-generated primary key |
| `name` | string | Yes | Submitter full name |
| `email` | string | Yes | Business email |
| `subject` | string | Yes | Message topic |
| `message` | string | Yes | Body text |
| `ipAddress` | string | No | Client IP for abuse audits |
| `status` | string | Yes (default: `"UNREAD"`) | `"UNREAD"` \| `"READ"` \| `"ARCHIVED"` |
| `createdAt` | Timestamp | Yes | Server-generated |

**Indexes**:
- Composite: `[status, createdAt]` (descending — for read queues)

---

### 2.9 `knowledgeDocuments`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | CUID-generated primary key |
| `title` | string | Yes | Document title |
| `sourceType` | string | Yes | `"PRODUCT_SPEC"` \| `"FAQ"` \| `"CERTIFICATE"` \| `"POLICY"` |
| `sourceId` | string | No | Linked Product or FAQ ID |
| `rawContent` | string | Yes | Full extracted text |
| `checksum` | string | Yes | MD5/SHA256 hash for change detection |
| `createdAt` | Timestamp | Yes | Server-generated |
| `updatedAt` | Timestamp | Yes | Server-generated |

**Indexes**:
- Single field: `[sourceType, sourceId]`
- Composite: `[sourceType]` (for source-based queries)

---

### 2.10 `knowledgeChunks`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | CUID-generated primary key |
| `documentId` | string | Yes | Reference to `knowledgeDocuments/{id}` |
| `chunkIndex` | number | Yes | Position within source document |
| `content` | string | Yes | Chunk text (500-800 tokens) |
| `tokenCount` | number | Yes | Exact token count |
| `embedding` | number[] | Yes (1536-dim float) | Vector for similarity search |
| `metadata` | object | Yes (default: {}) | `{ productName, grade, CAS, compliance }` |
| `createdAt` | Timestamp | Yes | Server-generated |

**Indexes**:
- Single field: `[documentId]`
- **Vector Index**: NOT stored in Firestore (see §5 RAG Architecture)

---

### 2.11 `chatLogs`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | CUID-generated primary key |
| `conversationId` | string | Yes | Client session token |
| `userMessage` | string | Yes | User inquiry text |
| `botResponse` | string | Yes | Grounded response |
| `retrievedChunks` | array | Yes (default: []) | `[{ chunkId, similarity }]` |
| `wasRefusal` | boolean | Yes (default: false) | Outside approved scope |
| `latencyMs` | number | No | End-to-end latency |
| `createdAt` | Timestamp | Yes | Server-generated |

**Indexes**:
- Composite: `[conversationId, createdAt]` (descending)
- Single: `[wasRefusal]`

---

### 2.12 `adminUsers`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | CUID-generated primary key |
| `email` | string | Yes | Firebase Auth email (unique) |
| `name` | string | Yes | Display name |
| `role` | string | Yes | `"SUPERADMIN"` \| `"ADMIN"` \| `"EDITOR"` |
| `isActive` | boolean | Yes (default: true) | Instant revocation |
| `lastLoginAt` | Timestamp | No | Last successful login |
| `createdAt` | Timestamp | Yes | Server-generated |
| `updatedAt` | Timestamp | Yes | Server-generated |

**Indexes**:
- Single field: `[email]` (unique)
- Composite: `[role, isActive]`

**Purpose**: Tracks admin users with Firebase custom claims for authorization.

---

## 3. Uniqueness Enforcement in Firestore

Since Firestore does not support SQL-style UNIQUE constraints, uniqueness is enforced through:

### 3.1 Application-Layer Checks
```typescript
// Example: before creating a product with a slug
const exists = await firestoreService.categoryService.slugExists(slug, excludeId);
if (exists) throw new ConflictError("Slug already exists");
```

### 3.2 Firestore Security Rules
```javascript
// Example: only one document can have a given slug in a collection
service flaggable = {
  /autosuggest/: allow read;
  /categories/:docId: {
    allow write: if request.auth != null
      && !existing.data().slug == request.resource.data.slug; // simplified
  }
};
```

### 3.3 Global Index Document Pattern (Alternative)
Maintain a separate `slugIndex` collection:
```typescript
// Document: slugIndex/{slug}
// Fields: { entityType: "product", entityId: "the-product-id" }
// This allows efficient lookups and prevents duplicates across collections
```

### 3.4 Composite Unique Keys
For small sets, embed uniqueness check in the document ID:
```typescript
// Document ID = "slug-{slug}" — ensures at most one per slug
```

---

## 4. Status Computation Logic

### 4.1 Offer Status (DRAFT/SCHEDULED/ACTIVE/EXPIRED)

Computed at read time based on `active`, `validFrom`, `validTo`, and current time:

```typescript
function getOfferStatus(offer: Offer, now: Date = new Date()): OfferStatus {
  if (!offer.active) return "DRAFT";
  if (offer.validFrom && new Date(offer.validFrom.seconds * 1000) > now) return "SCHEDULED";
  if (offer.validTo && new Date(offer.validTo.seconds * 1000) < now) return "EXPIRED";
  return "ACTIVE";
}
```

### 4.2 Banner Status

- `active=true ∧ now >= startDate ∧ now <= endDate` → ACTIVE
- If `active=false` → INACTIVE
- If outside `[startDate, endDate]` → EXPIRED

### 4.3 FAQ/Published Filtering

- `published=true` → visible in public queries
- `published=false` → hidden from public, accessible to admins only

---

## 5. RAG Architecture — Vector Search Notes

### 5.1 Important: Vector Search NOT in Firestore

Firestore does NOT natively support vector similarity search. The RAG architecture uses one of these approaches:

**Option A: Dedicated Vector Database (Recommended)**
- Pinecone, Weaviate, Milvus, or Qdrant
- Store only metadata references in Firestore
- Vector embeddings in external DB
- Sync: Firestore change → trigger → update vector DB

**Option B: Firebase Extensions with Vertex AI Vector Search**
- Uses Google Cloud infrastructure
- Vector search as a Firebase Extension
- Higher cost, tighter Firebase integration

**Option C: Hybrid Approach**
- Firestore stores chunk metadata + small embeddings (1536 floats ≈ 6KB)
- For production similarity search, supplement with lightweight approximation
- Accept reduced accuracy for simplicity

### 5.2 Current Implementation (Phase 1)

The `knowledgeChunks` collection stores the `embedding` field (1536-dim array) for future compatibility. In Phase 1, a **linear scan filter** is used for demo purposes:

```typescript
// Simplified Phase 1 search (not production-quality)
async function searchChunks(queryEmbedding: number[], limit = 4) {
  const snapshot = await db.collection("knowledgeChunks").get();
  const chunks = snapshot.docs.map(doc => ({
    ...doc.data(),
    id: doc.id,
  }));
  
  // Simple cosine similarity (client-side, O(n))
  const similarities = chunks.map(chunk => {
    const chunkEmbedding = chunk.embedding;
    if (!chunkEmbedding) return 0;
    const dot = queryEmbedding.reduce((sum, q, i) => sum + q * chunkEmbedding[i], 0);
    const qMag = Math.sqrt(queryEmbedding.reduce((sum, q) => sum + q * q, 0));
    const cMag = Math.sqrt(chunkEmbedding.reduce((sum, c) => sum + c * c, 0));
    return dot / (qMag * cMag);
  });
  
  // Sort by similarity descending, filter by threshold, return top N
  return similarities
    .map((score, i) => ({ score, chunk: chunks[i] }))
    .filter(c => c.score >= 0.7)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(c => c.chunk);
}
```

### 5.3 Recommended Production Path

1. Phase 1: Use linear scan with chunk metadata retrieval
2. Phase 2: Migrate to Pinecone/Weaviate for HNSW/IVFFlat vector search
3. Phase 3: Evaluate Firebase Vertex AI Vector Search extension
4. Document refusal/fallback when similarity < threshold (see `docs/05-rag-architecture.md`)

---

## 6. Collection Group Queries

For cross-collection operations, use **collection groups**:

```typescript
// Example: get all SEO documents across all entity types
const seoSnap = await fb firestore()
  .collectionGroup("seo")
  .where("entityType", "==", "PRODUCT")
  .get();

// Or: get all products with their SEO data
const products = await fb.firestore()
  .collection("products")
  .get();
const productIds = products.docs.map(d => d.id);
const seoPromises = productIds.map(id =>
  fb.firestore().collectionGroup("seo").where("entityId", "==").where("entityType", "==", "PRODUCT").doc(id).get()
);
```

**Note**: Collection group queries require composite index creation via Firebase CLI.

---

## 7. Index Deployment Checklist

Before production deployment, create these Firebase composite indexes via the Firebase Console or CLI:

1. `categories`: `[slug]`, `[displayOrder, active]`
2. `products`: `[slug]`, `[categoryId, published, featured]`, `[published, featured, createdAt desc]`
3. `banners`: `[active, displayOrder]`, `[startDate, endDate]`
4. `offers`: `[active, validTo]`
5. `faqs`: `[published, displayOrder]`
6. `pages`: `[pageKey]`
7. `seo`: `[entityType, entityId]`
8. `contactMessages`: `[status, createdAt desc]`
9. `chatLogs`: `[conversationId, createdAt desc]`, `[wasRefusal]`
10. `adminUsers`: `[email]`, `[role, isActive]`

Run: `firebase firestore:indexes:generate --only target=i18n.en`