# Authentication Flow

> Mechanism (cookie session vs JWT Bearer) is TEAM DECISION / TO BE DECIDED. Either way:

1. Admin submits login form → POST /api/auth/login
2. Backend validates credentials → returns user + credential
3. Frontend stores credential per mechanism (httpOnly cookie preferred — TDD) and routes to /admin
4. Admin layout checks GET /api/auth/me → 401 → redirect /admin/login
5. Every admin API call includes the credential
6. Logout → POST /api/auth/logout → clear local state → redirect login

Security notes:
- Credentials must not be readable by arbitrary JS (prefer httpOnly cookie)
- No credentials in URL/logs
- Backend re-validates on every request; client hiding is not auth
