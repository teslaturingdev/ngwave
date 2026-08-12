# NgWave

Open-source Angular UI component library — the free alternative to PrimeNG
(which went closed-source/paid in June 2026). Two products, one repo, built in stages:

1. `@ngwave/ui` — component library (THIS is what we're building now).
2. NgWave Migrate — AI tool to convert PrimeNG code to NgWave (later).

Full vision: `../NgWave-Project-Brief.md` and `../ngwave-architecture.html`.

## Current focus

Component library + PrimeNG-style docs/showcase site. Migration tool, VS Code
extension, and self-hosted Docker are deferred (same repo, later).

## Structure (Angular CLI workspace)

- `projects/ngwave-ui/` — the library, npm package name `@ngwave/ui`
- `projects/docs/` — the showcase website (Angular app), dogfoods `@ngwave/ui`
- Path alias `@ngwave/ui` → `projects/ngwave-ui/src/public-api.ts` (dev imports source, no pre-build).

## Conventions

- Angular 22, standalone components, `OnPush`, Signals API:
  `input()` / `model()` / `output()` / `signal()` / `computed()`. New control flow (`@if`, `@for`).
- Selector prefix `nw-`, class prefix `Nw`, type prefix `Nw`.
- Each component lives in `projects/ngwave-ui/src/lib/<name>/` with its own `index.ts`
  barrel; add one `export * from './lib/<name>'` line to `public-api.ts`.
- Styling: Tailwind utilities + CSS-var tokens (`--nw-*` / `--surface-*`, RGB triplets).
  Dark mode via `[data-theme="dark"]` on `<html>`. Shared Tailwind preset at
  `projects/ngwave-ui/tailwind.config.js`; tokens at `projects/ngwave-ui/src/styles/tokens.css`.
- WCAG accessible; components theme entirely from tokens (no hardcoded colors).

## Component roadmap (10 core)

DataTable (flagship), Dropdown, Dialog, DatePicker, Form Inputs, Toast, Tabs,
Button, Checkbox/Radio, Spinner/Skeleton. Order: Button first (proves the docs
pipeline), then DataTable, then the rest.

## Commands

- `npm start` / `ng serve docs` — run the showcase site (imports library source, no pre-build)
- `ng build ngwave-ui` — package the library (ng-packagr)
- `ng test ngwave-ui` — unit tests
