# Branch Strategy

- `main` — production-ready
- `develop` (optional TDD) — integration branch if team prefers
- `feature/*` — new work
- `fix/*` — bug fixes
- `hotfix/*` — urgent production fixes

Rules:
- One feature per branch
- Rebase or merge main before PR to avoid conflicts
- Delete merged branches
- Never commit secrets, `.env`, or node_modules
