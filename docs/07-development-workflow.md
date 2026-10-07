# 07 — Shared Development & Git Workflow: PureBlend Food Chemicals

## 1. Principles of Collaboration

PureBlend Food Chemicals is developed concurrently by two specialized engineers working in the **same Git repository**:
1. **Frontend Lead Developer**: Owns public UI, responsive layout, CSS/Tailwind theming, accessible components, client form interactions, and UI mocks.
2. **Backend Lead Developer**: Owns data models, Prisma ORM, PostgreSQL database, Next.js route handlers, business services, authentication boundaries, rate limiting, and the RAG vector engine.

To ensure zero friction, zero accidental overwrites, and production reliability, all developers must strictly follow this workflow.

---

## 2. The Golden Git Cycle

```
[Start Work]
   │
   ▼
1. Inspect local status:
   `git status`
   │
   ▼
2. Synchronize remote changes:
   `git fetch --all`
   `git pull`
   │
   ▼
3. Develop features in assigned modules (Additive & Modular changes)
   │
   ▼
4. Pre-Commit Validation:
   `git status`
   `git diff`
   `npm run lint`
   `npm run build`
   │
   ▼
5. Targeted Staging & Semantic Commit:
   `git add <specific-files>`
   `git commit -m "<type>(<scope>): <clear description>"`
   │
   ▼
6. CRITICAL PRE-PUSH SYNC:
   `git fetch --all`
   `git pull`
   │
   ├─ Conflict Detected? ──► STOP IMMEDIATELY! Do NOT blindly overwrite.
   │                         Inspect diff. Preserve teammate's work.
   ▼
7. Clean Integration Verified:
   `npm run lint`
   `npm run build`
   │
   ▼
8. Final Push:
   `git push`
```

---

## 3. Step-by-Step Procedure

### Step 1: Pre-Work Inspection & Pull
Before modifying any line of code or creating a new branch:
```bash
git status
git fetch --all
git pull
```
- If uncommitted changes exist from your previous session: inspect them with `git diff`.
- Never use destructive commands (`git reset --hard`, `git clean -fd`, `git checkout -- .`) unless explicitly authorized.

### Step 2: Isolated & Modular Development
- Backend files belong in:
  - `src/lib/server/` (database client, services, auth guards, validators, rate limiters)
  - `src/app/api/` (Next.js App Router route handlers)
  - `prisma/` (schema and seed files)
  - `docs/` (architectural documentation)
- Do not touch frontend component layouts, styling classes, or mocks unless coordinating an API service hook.

### Step 3: Shared File Modification Protocol
When editing shared configuration files (`package.json`, `next.config.ts`, `tsconfig.json`, `.env.example`):
1. **Inspect First**: Check how the file is currently used by your teammate.
2. **Minimal Edit**: Add only the specific new dependency, path alias, or environment key. Never replace an entire configuration file.
3. **Compatibility Check**: Verify that both the frontend build and typechecker continue to pass cleanly.

### Step 4: Verification Before Committing
Every commit must be verified locally before entering the commit log:
```bash
npx tsc --noEmit
npm run lint
npm run build
```
Never commit code with broken builds or failing lint rules.

### Step 5: Explicit Staging & Meaningful Commits
Always add specific files rather than `git add .`:
```bash
git add docs/ src/lib/server/ prisma/
git commit -m "feat(backend): establish prisma schema and api response standard"
```

### Step 6: Mandatory Fetch & Pull Before Push
Never push immediately after committing! Another teammate may have pushed commits to the remote branch while you were building:
```bash
git fetch --all
git pull
```
- **If clean**: Proceed to step 7.
- **If merge conflicts occur**:
  1. **STOP immediately**.
  2. Do not blindly accept `--theirs` or `--ours`.
  3. Inspect the conflicting files line by line.
  4. Ensure all frontend components, types, and styles from your teammate are preserved.
  5. Resolve the conflict, run `npm run build`, and complete the merge.

### Step 7: Push
```bash
git push
```

---

## 4. Anti-Patterns & Prohibited Commands

| Prohibited Action | Reason |
|---|---|
| `git push --force` or `--force-with-lease` | Destroys teammate's commits on the shared branch. |
| `git reset --hard` | Destroys uncommitted or local working changes. |
| Blind `git add .` | Risks staging sensitive `.env` files or temporary scratch files. |
| Replacing `package.json` | Erases teammate's installed dependencies. |
| Deleting frontend directories | Breaks active frontend development. |
