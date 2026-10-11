# PureBlend Food Chemicals — API Security Matrix

This document enumerates all backend endpoints, their security properties, and risk classifications.

Generated as part of Phase 9: Security Hardening audit.

| # | Method | Path | Public/Admin | Auth | Validation | Rate Limit | Data Sensitivity |
|---|--------|------|-------------|------|------------|------------|-----------------|
| 1 | GET | /api/products | ✅ public | none | Zod query filters | — | Product specs (published only) |
| 2 | GET | /api/categories | ✅ public | none | — | — | Category names/descriptions (published only) |
| 3 | GET | /api/banners | ✅ public | none | — | — | Banner metadata (active only) |
| 4 | GET | /api/offers | ✅ public | none | — | — | Offer status/terms (active only) |
| 5 | GET | /api/faqs | ✅ public | none | — | — | Published FAQs only |
| 6 | GET | /api/pages/{key} | ✅ public | none | — | — | CMS page content (published only) |
| 7 | POST | /api/contact | ✅ public | none | Zod body | 5/10min/IP | User-submitted inquiry (name, email, phone, company, subject, message) |
| 8 | POST | /api/chat | ✅ public | none | Zod body | 5/min/IP | AI query (free text, max 2000 chars) |
| 9 | GET | /api/auth | 🔒 private | token: Firebase ID | — | — | User auth state (role from custom claims) |
| 10 | GET | /api/admin/products/{id} | 🔒 admin | `checkAdminClaim()` | Zod body/query/params | — | Product CRUD (admin only) |
| 11 | POST | /api/admin/products/ | 🔒 admin | `checkAdminClaim()` | Zod body | — | Product create (admin only) |
| 12 | GET | /api/admin/products/{id} | 🔒 admin | `checkAdminClaim()` | — | — | Product detail (admin only) |
| 13 | PUT/PATCH | /api/admin/products/{id} | 🔒 admin | `checkAdminClaim()` | Zod body | — | Product update (admin only) |
| 14 | DELETE | /api/admin/products/{id} | 🔒 admin | `checkAdminClaim()` | — | — | Product delete (admin only) |
| 15 | GET | /api/admin/categories/{id} | 🔒 admin | `checkAdminClaim()` | — | — | Category detail (admin only) |
| 16 | POST | /api/admin/categories/ | 🔒 admin | `checkAdminClaim()` | Zod body | — | Category create (admin only) |
| 17 | GET | /api/admin/categories/{id} | 🔒 admin | `checkAdminClaim()` | — | — | Category detail (admin only) |
| 18 | PUT/PATCH | /api/admin/categories/{id} | 🔒 admin | `checkAdminClaim()` | Zod body | — | Category update (admin only) |
| 19 | DELETE | /api/admin/categories/{id} | 🔒 admin | `checkAdminClaim()` | — | — | Category delete (admin only) |
| 20 | GET | /api/admin/banners/{id} | 🔒 admin | `checkAdminClaim()` | — | — | Banner detail (admin only) |
| 21 | POST | /api/admin/banners/ | 🔒 admin | `checkAdminClaim()` | Zod body | — | Banner create (admin only) |
| 22 | POST | /api/admin/banners/reorder | 🔒 admin | `checkAdminClaim()` | — | — | Banner reorder (admin only) |
| 23 | DELETE | /api/admin/banners/{id} | 🔒 admin | `checkAdminClaim()` | — | — | Banner delete (admin only) |
| 24 | GET | /api/admin/offers/{id} | 🔒 admin | `checkAdminClaim()` | — | — | Offer detail (admin only) |
| 25 | POST | /api/admin/offers/ | 🔒 admin | `checkAdminClaim()` | Zod body | — | Offer create (admin only) |
| 26 | POST | /api/admin/offers/{id}/status | 🔒 admin | `checkAdminClaim()` | — | — | Offer status update (admin only) |
| 27 | DELETE | /api/admin/offers/{id} | 🔒 admin | `checkAdminClaim()` | — | — | Offer delete (admin only) |
| 28 | GET | /api/admin/faqs/{id} | 🔒 admin | `checkAdminClaim()` | — | — | FAQ detail (admin only) |
| 29 | POST | /api/admin/faqs/ | 🔒 admin | `checkAdminClaim()` | Zod body | — | FAQ create (admin only) |
| 30 | POST | /api/admin/faqs/reorder | 🔒 admin | `checkAdminClaim()` | — | — | FAQ reorder (admin only) |
| 31 | DELETE | /api/admin/faqs/{id} | 🔒 admin | `checkAdminClaim()` | — | — | FAQ delete (admin only) |
| 32 | GET | /api/admin/pages/{id} | 🔒 admin | `checkAdminClaim()` | — | — | Page detail (admin only) |
| 33 | POST | /api/admin/pages/ | 🔒 admin | `checkAdminClaim()` | Zod body | — | Page create (admin only) |
| 34 | POST | /api/admin/pages/reorder | 🔒 admin | `checkAdminClaim()` | — | — | Page reorder (admin only) |
| 35 | DELETE | /api/admin/pages/{id} | 🔒 admin | `checkAdminClaim()` | — | — | Page delete (admin only) |
| 36 | GET | /api/admin/media/{id} | 🔒 admin | `checkAdminClaim()` | — | — | Media detail (admin only) |
| 37 | POST | /api/admin/media/upload | 🔒 admin | `checkAdminClaim()` | Zod multipart | — | Image upload (admin only) |
| 38 | POST | /api/admin/media/delete | 🔒 admin | `checkAdminClaim()` | — | — | Image delete (admin only) |
| 39 | GET | /api/admin/media/in-use | 🔒 admin | `checkAdminClaim()` | — | — | Image usage check (admin only) |
| 40 | GET | /api/admin/me | 🔒 admin | `checkAdminClaim()` | — | — | Current admin user info |
| 41 | GET | /api/admin/users | 🔒 SUPERADMIN | `checkAdminClaim()` | — | — | List all admin users (SUPERADMIN only) |
| 42 | POST | /api/login | ✅ public | none | Zod body | — | User login (returns ID token, NO admin claim promotion) |
| 43 | GET | /api/logout | 🔒 private | token: Firebase ID | — | — | User logout |

### Legend:
- ✅ public = No authentication required
- 🔒 private = Firebase ID token required in `Authorization: Bearer <header>`
- 🔒 admin = Must have `role: "ADMIN"` or `role: "SUPERADMIN"` custom claim
- 🔒 SUPERADMIN = Must have `role: "SUPERADMIN"` custom claim (over and above ADMIN)
- `checkAdminClaim()` = Verifies Firebase ID token and checks `customClaims?.role`
- Zod body = Request body validated against Zod schema
- Rate limit format = `X/Ymin/IP` where X = requests, Y = minute window, IP = per client IP
- Data sensitivity = What kind of data the endpoint handles; `published only` means Firestore queries filter `published: true`

### Critical Security Notes:

1. **Login endpoint (POST /api/login)** — No longer promotes users to admin. Previously critical vulnerability where every login granted `{ role: "ADMIN" }` custom claim. Now simply returns the user's existing ID token and current custom claims.

2. **No admin claim promotion during login** — Admin claims (`role: "ADMIN"` / `role: "SUPERADMIN"`) must be granted separately via:
   - `scripts/set-admin.ts` CLI script
   - Firebase Console > Users > Set custom claims
   - Dedicated admin provisioning flow with proper verification

3. **Firestore Security Rules** — Not yet configured (see Finding #8 in the security audit report). Backend `checkAdminClaim()` guards all admin mutations, but Firestore rules should be added for defense-in-depth.

4. **Public read endpoints** — All public GET endpoints (`/api/products`, `/api/categories`, `/api/banners`, `/api/offers`, `/api/faqs`, `/api/pages/{key}`) explicitly or implicitly filter by `published: true` to prevent accessing draft/unpublished content.

5. **IDOR protection** — Public users cannot access admin resources by changing `:id` or other identifiers, because admin endpoints require `checkAdminClaim()` verification (403 Forbidden for non-admin). Public read endpoints filter by published status.

6. **Rate limiting** — Contact form (5/10min/IP) and chat (5/min/IP) are protected. Admin endpoints and other operations currently lack rate limiting (see Finding #12 in the security audit report).

7. **Error responses** — All endpoints use consistent error format `{ success: false, error: { code, message } }`. No raw stack traces or internal details returned to clients. Generic error messages used (`"Server error"`, `"Validation error"`, etc.).

8. **CORS** — Not yet configured in the backend. May need configuration for frontend integration (see Finding #14 in the security audit report).

9. **Formal validation** — Every endpoint validates its inputs with Zod. No arbitrary request bodies passed directly into Firestore.

10. **Environment separation** — All secrets sourced from `process.env.*`; `.env.example` contains placeholders only; `.gitignore` excludes `.env` files.

---

## Remediation Priority

| Priority | Item | Status |
|----------|------|--------|
| **CRITICAL** | Fix auth route admin claim promotion | ✅ Completed (POST /api/login no longer sets admin claims) |
| **HIGH** | Create Firestore security rules | ❌ Not yet created |
| **HIGH** | Configure CORS for frontend origins | ❌ Not yet configured |
| **MEDIUM** | Add rate limiting to admin endpoints | ❌ Not yet implemented |
| **MEDIUM** | Create API security matrix documentation | ✅ Completed (this file) |
| **MEDIUM** | Run npm audit and review vulnerabilities | ✅ Completed (15 transitive vulns noted) |
| **LOW** | Add audit logging for admin operations | ❌ Not yet implemented |
| **LOW** | Add structured request/response logging | ❌ Not yet implemented |