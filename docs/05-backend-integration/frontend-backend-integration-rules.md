# Frontend ↔ Backend Integration Rules

1. The API contract doc is the interface — no side-channel agreements in chat without updating the doc.
2. Frontend never invents endpoints or fields; unknowns are raised with backend and marked TDD.
3. Backend never changes a response shape without updating the contract and notifying frontend.
4. Integration happens against a staging/dev backend, not mocked forever. Mocks allowed only for early frontend development.
5. Breaking changes: bump contract version note, announce, update docs, migrate.
6. Both teams write integration tests for their endpoints and shared flows.
