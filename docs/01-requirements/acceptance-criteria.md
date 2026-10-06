# Acceptance Criteria — Global Rules

Every feature must satisfy:

1. Functional requirement ID exists in the requirements matrix.
2. Loading state implemented.
3. Empty state implemented.
4. Error state implemented with retry where sensible.
5. Responsive at all breakpoints.
6. Accessible (keyboard, focus, labels, alt).
7. SEO considerations handled where public-facing.
8. Backend dependency identified and mocked only during early frontend dev (real integration before submission).
9. Security boundary noted for sensitive features.
10. Test case written in `10-testing/acceptance-test-cases.md`.

Feature-specific acceptance criteria live alongside their user stories (`user-stories.md`) and test cases (`10-testing/acceptance-test-cases.md`).
