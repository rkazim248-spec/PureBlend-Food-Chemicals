# Success Criteria

The project is successful when ALL of the following hold:

## Functional
- [ ] Every requirement in `organizer-requirements-matrix.md` has status Done/Verified
- [ ] Every user story has acceptance criteria and at least one passing test case
- [ ] Public pages render real database data (no hard-coded production content)
- [ ] Admin CRUD works end-to-end and changes reflect on the public site
- [ ] Chatbot answers supported questions and refuses unsupported ones
- [ ] Contact form delivers email via SMTP and blocks spam attempts

## Quality
- [ ] Responsive at all breakpoints in the responsive test matrix
- [ ] No console errors on any page
- [ ] Accessibility checklist passes
- [ ] Lighthouse/perf budgets met (see `09-seo-performance`)
- [ ] SEO checklist passes (titles, meta, headings, alt, canonical, sitemap/robots)

## Security
- [ ] Admin routes protected server-side
- [ ] No secrets in client code or repo
- [ ] Backend authorization enforced on every admin endpoint
- [ ] Contact endpoint rate-limited / anti-spam

## Hackathon
- [ ] Live URL works
- [ ] Admin credentials ready for judges
- [ ] Demo flow rehearsed (`13-hackathon/jury-demo-flow.md`)
- [ ] README with setup/run/test/deploy instructions
- [ ] Submission checklist complete

## Definition of "Done" for any feature
1. Acceptance criteria pass
2. Loading/empty/error states implemented
3. Backend dependency identified
4. Security boundary identified (if sensitive)
5. Documented/updated where architecture changed
6. Test case written with ID in `10-testing`
