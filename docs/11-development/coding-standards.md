# Coding Standards

- Follow the framework's official style guide; one formatter/linter (TDD)
- TypeScript (or typed approach) preferred; no implicit any
- Component files: PascalCase; hooks: useX; utilities: camelCase
- Keep components under ~150 lines; extract helpers
- Early returns; avoid deep nesting
- Meaningful names; comment only non-obvious "why"
- No hard-coded content that belongs in the database
- No direct fetch outside the API client
- Accessibility and responsive requirements are Definition-of-Done gates
