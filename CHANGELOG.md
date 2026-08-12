# Changelog

All notable changes to `@ngwave/ui` are documented here. This project follows
[Semantic Versioning](https://semver.org/).

## [0.6.0] — 2026-08-12

A premium visual pass: real depth and motion across the whole library.

### Added

- **Motion system** in the shipped Tailwind preset — entrance keyframes
  (`animate-nw-scale-in`, `-slide-down`, `-slide-up`, `-slide-in-*`, `-drawer-*`,
  `-pop`, `-check`, `-shimmer`), `ease-nw` / `ease-nw-bounce` easings, and a
  `prefers-reduced-motion` guard that neutralizes NgWave animations.
- **Layered elevation scale** — slate-tinted `shadow-nw-sm` → `shadow-nw-xl` plus a
  colored `shadow-nw-glow`, and a larger `rounded-nw-lg` radius token.

### Improved

- **Overlays animate in** — Dialog scales up over a blurred, dimmed backdrop;
  Dropdown & Autocomplete slide down; Toasts slide in from their edge. All now use
  deeper, ringed shadows.
- **Micro-interactions** — buttons press (`active:scale`) and lift with soft shadows;
  checkboxes/radios pop on select; skeletons use a shimmer sweep; tabs get smooth
  hover/active states.
- **Inputs** gain a refined 4px focus ring + hover border; **DataTable** gets
  uppercase tracked headers and a softer, elevated container.
- **Migrate tool** rebuilt with a gradient hero, sample chips, an automation-score
  bar, and a syntax-highlighted output pane.

## [0.5.1] — 2026-08-12

### Fixed

- **Dropdown** — the open panel no longer traps clicks. The full-screen backdrop that
  intercepted (and failed to close on) outside clicks was replaced with the same
  document-click dismissal the Autocomplete uses, so clicking outside now closes the menu
  and the click reaches the page.

## [0.5.0] — 2026-08-12

Full PrimeNG-parity pass across every existing component, plus four new form controls.

### Added

- **Autocomplete** (`nw-autocomplete`) — debounced async suggestions via a `(complete)`
  event, single & multiple selection (chips), object options (`optionLabel`), a dropdown
  trigger, `forceSelection`, keyboard navigation, a custom item template
  (`nwAutocompleteItem`), and `ControlValueAccessor`.
- **Form inputs** — `nw-input-text` (icons, clearable, sizes, invalid), `nw-input-number`
  (increment/decrement steppers, decimal & currency mode, `min`/`max`/`step`, prefix/suffix,
  grouping), and `nw-textarea` (rows, `autoResize`, `maxlength` + counter). All implement
  `ControlValueAccessor`.
- **`NwConfirmationService` + `<nw-confirm-dialog>`** — service-driven confirmation dialogs.
- **Dialog templates** — `nwDialogHeader` and `nwDialogFooter` for fully custom chrome.

### Improved

- **Dialog** — draggable, resizable, maximizable, focus trap, block-scroll, and
  `shown` / `hidden` events.
- **Button** — `help` / `contrast` / `link` variants, `iconOnly` square sizing with
  `ariaLabel`, and `fluid` full-width.
- **Checkbox & Radio** — full `ControlValueAccessor` support, sizes, invalid styling, and
  radio `name` grouping.
- **Spinner** — color variants, configurable `strokeWidth` and `animationDuration`.
- **Toast** — `secondary` & `contrast` severities, `sticky` / `closable` / keyed messages,
  and per-outlet `clear(key)`.
- **NgWave Migrate** — adapters updated to map every new prop and component
  (`pInputText`, `p-inputNumber`, `pInputTextarea`, `p-autoComplete`, and the Dialog/Radio/
  Spinner/Toast additions).

## [0.4.0] — 2026-08-11

### Added

- **Tabs** (`nw-tabs` / `nw-tab`) with lazy panels, closable tabs, orientation, and header
  templates.
- **Checkbox**, **Radio**, **Spinner**, and **Skeleton** components.

## [0.3.0] — 2026-08-11

### Added

- **Dropdown**, **Dialog**, and a signal-based **Toast** service.

## [0.2.0] — 2026-08-10

### Added

- Flagship **DataTable** — sorting, filtering, pagination, selection, expansion, lazy
  loading, and CSV export. API aligned to the migration tool's target output.

## [0.1.0] — 2026-08-10

### Added

- First release: **Button**, design tokens, and the shipped Tailwind preset.
