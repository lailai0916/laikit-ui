# Repository instructions

Shared React UI for lailai's websites, published as `@lailai0916/ui`. This repository owns component
behavior, CSS Modules, `--lk-*` design tokens, declarations, and standalone examples. The website
owns its Docusaurus adapters, article widgets, page content, and translations of application text.

Before style-sensitive work, load the shared `lailai-skill`. Repository and README maintenance follows
[Repository standards](https://github.com/lailai0916/lailai-template/blob/main/SETUP.md).

## Commands

Use Node.js 24 and npm. `npm ci` installs development dependencies. `npm run dev` starts the bilingual
React demo. `npm run check` runs formatting, lint, types, build, SSR/package tests, and demo build.
`npm run format` applies formatting. `npm run build` emits `dist/`; `npm pack --dry-run` inspects the
published files. See `docs/releasing.md` for releases. Run checks before committing.

## Architecture

- `src/components/*/` contains each component's `index.tsx` and CSS Module.
- `src/provider.tsx` connects native defaults to host routing, headings, and localization.
- `src/theme.css` owns shared variables, light/dark palettes, and reduced motion.
- `src/hooks/` and `src/utils/` contain public, framework-neutral helpers.
- `demo/` exercises all public components without a framework adapter.
- `tests/` verifies server rendering, localization, semantics, and package boundaries.

## Conventions

- No imports from Docusaurus, `@site`, or `@theme`; no `--ifm-*` references. Integrations live in hosts.
- Preserve ESM module boundaries and the `use client` directive; keep React external as a peer.
- Export public prop types. Named root exports and existing component subpaths remain compatible.
- Import CSS separately; mark CSS as side effects. Avoid global resets and arbitrary page styling.
- Keep native defaults useful. Provider adapters add no DOM wrapper; labels remain configurable.
- Preserve typography, surfaces, keyboard semantics, focus rings, overflow behavior, and reduced motion.
- No whole-card hover lift. Press feedback is brief; cards do not clip focus rings by default.
- Charts keep loading, empty, failure, and retained-data notices distinct. Callers format date labels.
- Keep English/Chinese examples and documentation aligned; update the inventory for public API changes.
- Never add automated authorship or promotional signatures to commits, PRs, or files.

CI calls the external repository checker at reviewed revision
`44bf94b5718ba605cdd7e240ed2e47b4b53f7500`; update that pin deliberately.

The package name intentionally differs from the repository name at the user’s request.
`scripts/validate-standards.py` delegates to the external checker, permits only that exact naming
exception, and separately verifies `@lailai0916/ui`. It does not copy the upstream checker.
