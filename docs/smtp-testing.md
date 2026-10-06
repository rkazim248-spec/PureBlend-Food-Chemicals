# SMTP Testing Guide

## Required environment variables (server-only)
```
SMTP_HOST=<smtp.provider>
SMTP_PORT=587
SMTP_USER=<user>
SMTP_PASSWORD=<SECRET>
SMTP_FROM=<no-reply@example.com>
CONTACT_RECIPIENT=<business-inbox>
```
Never commit real values. Place them in `.env.local` (gitignored) or your hosting provider.

## Test procedure
1. Open `/contact`.
2. Fill name, email, subject, message (≥ 10 characters).
3. Submit.
4. Expected: "Thank you — your message has been sent." and the business inbox receives an email with the name, email, subject, and message.

## Validation tests
- Empty name / invalid email / empty subject / short message → inline errors, nothing sent.
- Honeypot filled (automated bots) → fake success, nothing sent.
- 6 rapid submissions → 429 "Too many submissions."

## Failure behavior
- Missing SMTP config → 503 "Unable to send your message right now."
- SMTP provider down → 502 with safe message; internal detail only in server logs.

## Security considerations
- CR/LF stripped from header-bound fields (header-injection protection).
- Message body HTML-escaped in the email template.
- No credentials ever appear in the client bundle or repository.
