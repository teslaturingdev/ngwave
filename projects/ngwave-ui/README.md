# @ngwave/ui

Open-source **Angular 22** UI component library — a free, Signals-first alternative to PrimeNG.

> **v0.6.0** ships twelve fully-featured components: **Button**, a flagship **DataTable**
> (sorting, filtering, pagination, selection, expansion, lazy loading, column resize/reorder,
> frozen columns, inline editing, grouping, virtual scroll, context menu, CSV export),
> **Dropdown**, **Autocomplete**, **InputText / InputNumber / Textarea**, **Dialog**
> (draggable, resizable, maximizable, plus a `ConfirmationService`), **Toast**, **Tabs**,
> **Checkbox / Radio**, and **Spinner / Skeleton**. All form controls implement
> `ControlValueAccessor`. See the [changelog](https://www.npmjs.com/package/@ngwave/ui) for details.

## Install

```bash
npm install @ngwave/ui@0.6.0
```

## Setup

NgWave styles with Tailwind CSS + CSS-variable design tokens. In your consuming app:

1. Extend the shipped Tailwind preset and scan the library in `tailwind.config.js`:

   ```js
   module.exports = {
     presets: [require('@ngwave/ui/tailwind.config.js')],
     content: [
       './src/**/*.{html,ts}',
       './node_modules/@ngwave/ui/**/*.mjs',
     ],
   };
   ```

2. Import the design tokens once (e.g. in `styles.css`), then Tailwind's layers:

   ```css
   @import '@ngwave/ui/styles/tokens.css';
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

   Dark mode is enabled by setting `data-theme="dark"` on `<html>`.

## Usage

Components are standalone — import them directly:

```ts
import { Component } from '@angular/core';
import { NwButtonComponent, NwDataTableComponent, NwColumn } from '@ngwave/ui';

@Component({
  selector: 'app-root',
  imports: [NwButtonComponent, NwDataTableComponent],
  template: `
    <nw-button (click)="reload()">Reload</nw-button>
    <nw-data-table [data]="rows" [columns]="cols" [paginator]="true" />
  `,
})
export class App {
  rows = [{ id: 1, name: 'Ada' }];
  cols: NwColumn<{ id: number; name: string }>[] = [
    { field: 'id', header: 'ID', sortable: true },
    { field: 'name', header: 'Name', sortable: true, filter: true },
  ];
  reload() {}
}
```

## License

MIT
