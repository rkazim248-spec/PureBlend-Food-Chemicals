# Submission Checklist

- [ ] Live URL working
- [ ] Admin credentials documented and ready to share securely
- [ ] Repository accessible to judges
- [ ] README with setup/run/build/test/deploy instructions
- [ ] Architecture documentation (`docs/`) complete and current
- [ ] Database documentation present
- [ ] Environment variable documentation (placeholders only)
- [ ] RAG testing instructions (scenarios A–F)
- [ ] SMTP testing instructions
- [ ] Admin testing instructions
- [ ] Responsive testing evidence
- [ ] Browser testing evidence
- [ ] Security review done (no secrets, protected admin)
- [ ] Performance review done
- [ ] SEO review done
- [ ] Accessibility review done
- [ ] No exposed secrets anywhere
- [ ] No broken links
- [ ] No console errors
- [ ] No fake/demo-only functionality

## Implementation Notes — Phase 10 (Deployment readiness reality check)

- Verified locally: production build succeeds (`next build`), typecheck = 0, eslint clean, dev smoke tests previously passed.
- NOT done in this workspace and marked BLOCKED: live deployment, real SMTP delivery, RAG in production, database provisioning, admin-account provisioning, custom domain/HTTPS, responsive pass on a deployed URL. These require hosting/provider credentials and the backend teammate's API.
- Reproducibility documented below in `/docs/12-deployment/deployment-checklist.md` (existing) — install `npm ci`, configure `.env` from `.env.example`, `npm run build`, `npm start` behind HTTPS.
- Credential handoff: jury admin credentials and real SMTP/RAG/DB secrets must be delivered through the official submission channel, never committed.

