<picture>
  <source media="(prefers-color-scheme: dark)" srcset="projects/docs/public/logo-dark.svg">
  <img src="projects/docs/public/logo.svg" alt="NgWave" height="56">
</picture>

**The open-source, Signals-first alternative to PrimeNG for Angular 22.**

NgWave is a modern Angular UI component library plus an AI-assisted migration
tool for moving PrimeNG apps over. Free forever, built entirely on the Angular
Signals API, and themeable from a single set of design tokens.

- 📦 **`@ngwave/ui`** — 12 fully-featured components with a shipped Tailwind
  preset, design tokens, and a motion/elevation system.
- 🔀 **`@ngwave/migrate`** — a deterministic PrimeNG → NgWave codemod that
  rewrites your templates and reports exactly what mapped, what needs a look,
  and what isn't supported yet.
- 📚 **docs** — a dogfooding showcase site (built with `@ngwave/ui` itself)
  with live demos, an API reference, a changelog, and an in-browser Migrate tool.

## Install

```bash
npm install @ngwave/ui
```

Then extend the shipped Tailwind preset and import the design tokens — see
[`projects/ngwave-ui/README.md`](projects/ngwave-ui/README.md) for setup.

## Components

Button · DataTable · Dropdown · Autocomplete · InputText / InputNumber /
Textarea · Dialog (+ `ConfirmationService`) · Toast · Tabs · Checkbox / Radio ·
Spinner / Skeleton. All form controls implement `ControlValueAccessor`.

## Repository layout

This is an Angular CLI multi-project workspace:

| Path | What it is |
| --- | --- |
| `projects/ngwave-ui/` | The component library — npm package `@ngwave/ui`. |
| `projects/ngwave-migrate/` | The PrimeNG → NgWave migration codemod. |
| `projects/docs/` | The showcase / documentation site. |

Path aliases resolve `@ngwave/ui` and `@ngwave/migrate` to their source, so the
docs app builds straight from source with no pre-build step.

## Develop

```bash
npm install
npm start            # run the docs site (ng serve docs)
npm run build:lib    # package @ngwave/ui via ng-packagr
npm test             # unit tests
```

The migration tool has its own vitest suite:

```bash
npx vitest run --root projects/ngwave-migrate
```

## License

[MIT](LICENSE)
