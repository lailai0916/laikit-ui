# Contributing

Open an issue describing the use case before proposing a new public component. Reuse existing
primitives and tokens, preserve keyboard access, and keep framework-specific behavior in host adapters.

Use Node.js 24, run `npm ci`, then `npm run dev` for the standalone examples. Add examples and
meaningful regression coverage for behavior changes. Run `npm run format` and `npm run check`
before submitting a pull request. Include any public API or theme-token changes in `CHANGELOG.md`.

Use Conventional Commits. Keep documentation and both READMEs aligned when behavior changes.
