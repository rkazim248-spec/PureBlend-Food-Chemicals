# Error Response Standard

All API errors use a consistent shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human readable message",
    "details": [{ "field": "email", "message": "Invalid email" }]
  }
}
```

Codes: VALIDATION_ERROR (422/400), UNAUTHORIZED (401), FORBIDDEN (403), NOT_FOUND (404), RATE_LIMITED (429), SERVER_ERROR (500), UNAVAILABLE (503).

Frontend rules:
- Show `message` to users; never show raw stack traces or internal error details
- Map field `details` to form fields
- Retry only for safe/idempotent operations or user-initiated retry
