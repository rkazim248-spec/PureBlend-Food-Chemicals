# 04 — Auth & Security Architecture: PureBlend Food Chemicals

## 1. Overview

This document defines the authentication and security model for PureBlend Food Chemicals. The system uses **Firebase Authentication** for admin identity verification, with **Firebase Custom Claims** for authorization role management.

**Critical Principle**: Firebase user authentication ≠ admin authorization. A Firebase user is NOT automatically an administrator. Admin role must be explicitly assigned via custom claims or Firestore admin record.

## 2. Authentication Flow

### 2.1 Admin Login (`POST /api/auth/login`)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Client sends: { email, password }                       │
│    to /api/auth/login (no auth header required)            │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Backend verifies credentials via Firebase Admin SDK:      │
│    • firebase.auth().getUserByEmail(email)                  │
│    • firebase.auth().signInWithEmailAndPassword()           │
│    • Custom validation: email must match admin pattern      │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Backend checks custom claims on the user record:          │
│    • decodedRole = user.customClaims?.role                   │
│    • if decodedRole !== "ADMIN" && decodedRole !== "SUPERADMIN" │
│      → return { success: false, error: { code: "FORBIDDEN", │
│            message: "Administrative privileges required" } } │
│      • status 403                                          │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. On success: return Firebase ID token (custom or default)  │
│    • idToken used by client for subsequent API calls       │
│    • Client stores token, sends Authorization: Bearer <token> │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Token Verification (`POST /api/auth/verify`)

```
┌─────────────────────────────────────────────────────────────┐
│ Client sends: { idToken } or Authorization: Bearer <token> │
│ to /api/auth/verify (may be public or require prior auth)   │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 1. Verify token via:                                      │
│    firebaseAdmin.auth().verifyIdToken(idToken)              │
│ 2. If expired/invalid → return { success: false, error:     │
│    { code: "UNAUTHENTICATED", message: "Session expired" } │
│    • status 401                                           │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Check admin claims on decoded token:                     │
│    const claims = decodedToken.customClaims;               │
│    if (!claims || !['ADMIN', 'SUPERADMIN'].includes(claims.role)) │
│      → return { success: false, error: { code: "FORBIDDEN", │
│        message: "Administrative privileges required" } }   │
│    • status 403                                           │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Return decoded user info:                              │
│    { success: true, data: { id, email, name, role } }      │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 Token Refresh

- Firebase ID tokens are typically valid for **1 hour**
- Client should refresh token silently using:
  ```javascript
  const refreshToken = await firebase.auth().currentUser.getIdToken(refreshInterval);
  ```
- If user's custom claims are revoked (e.g., demoted from ADMIN), all existing tokens become invalid
- Frontend should handle `auth/id-token-expiry` and `auth/id-token-revoked` events

## 3. Admin Authorization Model

### 3.1 Custom Claims Strategy (RECOMMENDED)

**How it works**:
1. On first admin login, backend creates Firebase user (or uses existing)
2. Backend sets custom claim: `admin.auth().setCustomUserClaims(uid, { role: "ADMIN" })`
3. Custom claims are propagated to ID tokens automatically
4. Every protected endpoint checks `decodedToken.customClaims.role`

**Advantages**:
- No separate admin database record needed
- Claims automatically included in ID tokens
- Works with Firebase Auth's native token verification
- Revocation is instant via `setCustomUserClaims(uid, { role: null })`

**Implementation**:
```typescript
// After verifying user exists in Firebase Auth
const user = await adminAuth.verifyIdToken(idToken);
await adminAuth.setCustomUserClaims(user.uid, { role: "ADMIN" });

// On subsequent requests, verify:
const verified = await adminAuth.verifyIdToken(idToken);
if (verified.customClaims?.role !== "ADMIN" && verified.customClaims?.role !== "SUPERADMIN") {
  throw new ForbiddenError("Administrative privileges required.");
}
```

### 3.2 Firestore Admin Record Strategy (ALTERNATIVE)

**How it works**:
1. Separate Firestore collection `adminUsers` tracks admin accounts
2. Each document: `{ id: uid, email, name, role, isActive, createdAt }`
3. On login, backend checks both Firebase Auth AND Firestore record
4. Role from Firestore custom claims takes precedence

**Advantages**:
- Admin records can have additional metadata (lastLoginAt, permissions, audit fields)
- Can manage admins independently of Firebase Auth password resets
- Flexible for future permission granularity (EDITOR, VIEWER, etc.)

**Disadvantages**:
- Requires dual verification (Auth + Firestore read)
- Slightly more complex architecture
- Risk of inconsistency if Auth and Firestore records drift

**Recommendation**: Use **Custom Claims strategy** for Phase 1. Firestore admin record can be added in Phase 2 if additional metadata is needed.

### 3.3 Role Hierarchy

| Role | Can Access | Can Modify | Can Promote/Demote |
|------|-----------|------------|-------------------|
| `SUPERADMIN` | All admin endpoints | All admin endpoints | Yes (other users) |
| `ADMIN` | All admin endpoints except user mgmt | Most admin endpoints | No |
| `EDITOR` | Read-only admin views | Limited CRUD (categories, FAQs) | No |
| (unauthenticated) | Public endpoints only | None | None |

### 3.4 Session Management

- **Cookie-free**: System uses Bearer tokens in `Authorization` header
- **Stateless**: Server verifies each request's ID token independently
- **Logout**: Client removes token; no server-side invalidation needed (token expires naturally)
- **Concurrent Sessions**: Multiple devices allowed; each has independent token

## 4. Security Boundaries

### 4.1 Public Operations (No Auth Required)

| Operation | Endpoint | Description |
|-----------|----------|-------------|
| Product browsing | GET /api/products, GET /api/products/:slug | Published products only |
| Category browsing | GET /api/categories, GET /api/categories/:slug | All categories |
| Banner viewing | GET /api/banners, GET /api/banners/active | Active banners only |
| Offer viewing | GET /api/offers, GET /api/offers/active | Active offers only |
| FAQ reading | GET /api/faqs, GET /api/faqs/published | Published FAQs only |
| Contact form | POST /api/contact | Rate-limited, honeypot-protected |
| Chatbot | POST /api/chat | Rate-limited, validated input |
| SEO data | GET /api/seo | No auth required |

### 4.2 Admin Operations (Firebase Auth + Role Check Required)

| Operation | Endpoint | Required Role |
|-----------|----------|---------------|
| Create product | POST /api/admin/products | ADMIN or SUPERADMIN |
| Update product | PATCH /api/admin/products/:id | ADMIN or SUPERADMIN |
| Delete product | DELETE /api/admin/products/:id | ADMIN or SUPERADMIN |
| Create category | POST /api/admin/categories | ADMIN or SUPERADMIN |
| Update category | PATCH /api/admin/categories/:id | ADMIN or SUPERADMIN |
| Delete category | DELETE /api/admin/categories/:id | ADMIN or SUPERADMIN |
| Create banner | POST /api/admin/banners | ADMIN or SUPERADMIN |
| Update banner | PATCH /api/admin/banners/:id | ADMIN or SUPERADMIN |
| Delete banner | DELETE /api/admin/banners/:id | ADMIN or SUPERADMIN |
| Create offer | POST /api/admin/offers | ADMIN or SUPERADMIN |
| Update offer | PATCH /api/admin/offers/:id | ADMIN or SUPERADMIN |
| Delete offer | DELETE /api/admin/offers/:id | ADMIN or SUPERADMIN |
| Create FAQ | POST /api/admin/faqs | ADMIN or SUPERADMIN |
| Update FAQ | PATCH /api/admin/faqs/:id | ADMIN or SUPERADMIN |
| Delete FAQ | DELETE /api/admin/faqs/:id | ADMIN or SUPERADMIN |
| Manage admin users | GET/POST/PATCH /api/admin/users | SUPERADMIN only |
| CMS modifications | Various /api/admin/pages, /api/admin/seo | ADMIN or SUPERADMIN |

### 4.3 Security Rules (Firestore)

**Important**: Sensitive mutations must happen through **server-side Admin SDK**, NOT direct client Firestore writes.

```javascript
// Firestore Security Rules — least privilege model

rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // --- Public read-only access ---
    
    match /categories/{categoryId} {
      allow read: if request.auth != null;  // authenticated visitors
    }
    
    match /products/{productId} {
      allow read: if request.auth != null && 
                    get(/databases/$(database)/documents/products/$(productId)).published == true;
      // Non-published products only visible to admins
    }
    
    match /banners/{bannerId} {
      allow read: if request.auth != null || 
                    (get(/databases/$(database)/documents/banners/$(bannerId)).active == true &&
                     get(/databases/$(database)/documents/banners/$(bannerId)).startDate <= request.time && 
                     get(/databases/$(database)/documents/banners/$(bannerId)).endDate >= request.time);
    }
    
    // --- Admin-only writes (NOT enforced at Firestore level alone) ---
    // All mutations MUST go through /api/admin/* routes which verify auth first
    
    match /{document=**} {
      allow write: if request.auth == false;  // deliberately restrictive
      // Admin writes happen via HTTP API with token verification, not direct Firestore writes
    }
    
  }
}
```

**Rationale**: Firestore security rules provide defense-in-depth, but ALL admin mutations MUST go through the Next.js API routes which verify Firebase ID tokens and custom claims first. Never rely on Firestore rules alone for admin authorization.

### 4.4 Secret Protection

| Secret | Exposure Risk | Mitigation |
|--------|--------------|------------|
| `FIREBASE_PRIVATE_KEY` | Critical — full admin access | Never commit to repo; only in `.env.local`; `NEXT_PUBLIC_` prefixed vars only |
| `CLOUDINARY_API_SECRET` | Critical — unauthorized uploads | Server-side only; never in `next-env.d.ts` or client bundles |
| `SMTP_PASSWORD` | Critical — email spam | Server-side only; used by nodemailer in API routes only |
| `OPENAI_API_KEY` | Critical — AI cost/unlimited access | Server-side only; never exposed to browser |
| `AUTH_SECRET` | High — session tampering | Server-side only; used for custom session tokens if needed |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Low — limited to client Firebase ops | Safe to expose; only enables auth, firestore reads, storage |

### 4.5 Input Sanitization & Validation

- **Zod schemas** validate ALL incoming request bodies at the API route level
- **Honeypot**: Contact form `honeypot` field must be empty; if populated, return success immediately (deceive bots)
- **Header injection prevention**: Strip `\r` and `\n` from email and subject before SMTP headers
- **HTML escaping**: Message body HTML-escaped before email templating
- **SQL/NoSQL injection**: Not applicable (Firestore uses document references, no raw SQL)
- **XSS**: React automatic escaping + explicit server sanitization where needed

### 4.6 Rate Limiting

In-memory sliding-window rate limiter (`src/lib/server/rate-limit.ts`) protects:

| Endpoint | Max Requests | Window |
|----------|-------------|--------|
| `/api/auth/login` | 3 | per 10 minutes per IP |
| `/api/contact` | 5 | per 10 minutes per IP |
| `/api/chat` | 10 | per 10 minutes per IP |
| `/api/admin/*` | 60 | per 1 minute per authenticated admin |

IP detection uses `x-forwarded-for` → `x-real-ip` → `127.0.0.1` (fallback).

### 4.7 Error Response Standard

All error responses follow the convention:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "User-friendly error message",
    "details": [{ "field": "fieldName", "message": "Field-specific message" }]
  }
}
```

**Never expose**:
- Stack traces (dev only, logged server-side)
- Firebase internal error details
- Cloudinary secret information
- SMTP password or database connection strings
- Complete authentication tokens

## 5. Session Revocation & Logout

### 5.1 Revoking All User Tokens

```typescript
// Admin can revoke all tokens for a user
await adminAuth.revokeRefreshTokens(uid);
// Or set custom claims to null
await adminAuth.setCustomUserClaims(uid, { role: null });
```

### 5.2 Handling Token Expiry on Frontend

```javascript
// Listen for token expiry
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    user.getIdTokenResult().then(idTokenResult => {
      if (idTokenResult.claims.role !== "ADMIN") {
        // User was demoted; force logout
        firebase.auth().signOut();
      }
    });
  }
});
```

### 5.3 Logout Flow

1. Client removes stored token from memory
2. Client calls `firebase.auth().signOut()` (optional, for UI cleanup)
3. Token expires naturally after ~1 hour
4. No server-side invalidation required (stateless design)

## 6. Migration from Previous Auth System

The previous system used:
- Custom password hashing with `crypto.scrypt()`
- Session cookies with HMAC signatures
- Database-stored admin users (Prisma `AdminUser` model)

The new system replaces with:
- **Firebase Auth**: Email/password (or OAuth) managed by Firebase
- **Custom Claims**: Role assignment (`ADMIN`, `SUPERADMIN`)
- **Firestore Admin SDK**: Server-side verification only
- **No password hashing** in backend code (handled by Firebase)

**Migration Steps**:
1. Create Firebase Admin users via `admin.auth().createUser()` or invite email links
2. Set custom claims: `setCustomUserClaims(uid, { role: "ADMIN" })`
3. Update API route middleware to verify Firebase tokens instead of custom session cookies
4. Deprecate/remove `hashPassword`, `verifyPassword`, `createSessionToken`, `verifySessionToken`
5. Update `.env.example` — remove `AUTH_SECRET`, `ADMIN_INITIAL_EMAIL`, `ADMIN_INITIAL_PASSWORD` (or keep for reference)
6. Update Firestore security rules from Prisma-based to Firebase-based

## 7. Audit Logging (Optional but Recommended)

Key admin actions should be logged for compliance:

| Action | Fields Logged |
|--------|--------------|
| Admin login | `uid`, `email`, `ipAddress`, `timestamp`, `success` |
| User creation | `creatorUid`, `createdUid`, `role assigned`, `timestamp` |
| Resource create/update/delete | `actorUid`, `targetCollection`, `targetId`, `oldValues`, `newValues`, `timestamp` |
| Permission change | `actorUid`, `targetUid`, `oldRole`, `newRole`, `timestamp` |

Log entries can be written to a dedicated `adminAuditLogs` collection in Firestore via the Admin SDK.

---

## Summary: Auth Flow Diagram

```
┌─────────────────┐       ┌────────────────────┐       ┌─────────────────┐
│   Admin Client  │       │   Next.js Backend  │       │   Firebase      │
│   (Browser)     │       │   (src/app/api/)   │       │   Admin SDK     │
├─────────────────┤       ├────────────────────┤       ├─────────────────┤
│ 1. login({email})│──────►│ Verify credentials  │──────►│ firebase.auth() │
│ 2. receive token │◄──────│ Set custom claims   │◄──────│ setCustomClaims │
│ 3. store token   │       │                    │       │                 │
│ 4. API call {    }│──────►│ Verify ID token     │──────►│ verifyIdToken() │
│    Authorization:│       │ Check custom claims │       │                 │
│    Bearer <token> │       │ Return 403 if not   │       │                 │
└─────────────────┘       └────────────────────┘       └─────────────────┘
```

---
**Key Takeaway**: Authentication (verify identity) and Authorization (check role) are separate steps. Both must happen on every protected endpoint. Never trust client-provided `isAdmin` values.