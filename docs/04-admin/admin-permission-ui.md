# Admin Permission UI

- Admin routes must check auth state in the UI (redirect to /admin/login when unauthenticated)
- Hiding a menu item is NOT a security control — backend must enforce 401/403 on every admin endpoint
- On 401: clear session, redirect to login
- On 403: show "not authorized" message
- Role-based UI variation (multiple roles): TEAM DECISION / TO BE DECIDED
