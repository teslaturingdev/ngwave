import { ChangeDetectionStrategy, Component } from '@angular/core';

interface Release {
  version: string;
  date: string;
  headline: string;
  added?: string[];
  improved?: string[];
  fixed?: string[];
}

@Component({
  selector: 'docs-changelog-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="max-w-3xl">
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-surface-900">Changelog</h1>
        <p class="mt-2 text-surface-600">
          Notable changes to <code class="text-nw-600">&#64;ngwave/ui</code>.
        </p>
      </header>

      <div class="space-y-10">
        @for (r of releases; track r.version) {
          <section>
            <div class="flex items-baseline gap-3">
              <h2 class="text-xl font-bold text-surface-900">{{ r.version }}</h2>
              <span class="text-sm text-surface-500">{{ r.date }}</span>
            </div>
            <p class="mt-1 text-surface-600">{{ r.headline }}</p>

            @if (r.added?.length) {
              <h3 class="mt-4 text-sm font-semibold text-green-600 uppercase tracking-wide">
                Added
              </h3>
              <ul class="mt-2 space-y-1 list-disc pl-5 text-surface-700">
                @for (item of r.added; track item) {
                  <li>{{ item }}</li>
                }
              </ul>
            }

            @if (r.improved?.length) {
              <h3 class="mt-4 text-sm font-semibold text-nw-600 uppercase tracking-wide">
                Improved
              </h3>
              <ul class="mt-2 space-y-1 list-disc pl-5 text-surface-700">
                @for (item of r.improved; track item) {
                  <li>{{ item }}</li>
                }
              </ul>
            }

            @if (r.fixed?.length) {
              <h3 class="mt-4 text-sm font-semibold text-amber-600 uppercase tracking-wide">
                Fixed
              </h3>
              <ul class="mt-2 space-y-1 list-disc pl-5 text-surface-700">
                @for (item of r.fixed; track item) {
                  <li>{{ item }}</li>
                }
              </ul>
            }
          </section>
        }
      </div>
    </article>
  `,
})
export class ChangelogPageComponent {
  protected readonly releases: Release[] = [
    {
      version: '0.6.0',
      date: '2026-08-12',
      headline: 'A premium visual pass — real depth and motion across the library.',
      added: [
        'Motion system in the Tailwind preset: entrance keyframes (scale-in, slide, drawer), easings, and a prefers-reduced-motion guard.',
        'Layered slate-tinted elevation scale (shadow-nw-sm → xl) plus a colored glow token.',
      ],
      improved: [
        'Overlays animate in: Dialog scales up over a blurred backdrop; Dropdown & Autocomplete slide down; Toasts slide in from their edge — all with deeper, ringed shadows.',
        'Micro-interactions: buttons press and lift with soft shadows; checkboxes/radios pop on select; skeletons use a shimmer sweep; tabs get smooth hover/active states.',
        'Inputs gain a refined 4px focus ring and hover border; DataTable gets uppercase tracked headers and a softer elevated container.',
        'The Migrate tool is rebuilt: gradient hero, sample chips, an automation-score bar, and a syntax-highlighted output pane.',
      ],
    },
    {
      version: '0.5.1',
      date: '2026-08-12',
      headline: 'Bug fix.',
      fixed: [
        'Dropdown: the open panel no longer traps clicks — clicking outside now closes the menu (replaced the full-screen backdrop with document-click dismissal).',
      ],
    },
    {
      version: '0.5.0',
      date: '2026-08-12',
      headline:
        'Full PrimeNG-parity pass across every component, plus four new form controls.',
      added: [
        'Autocomplete — debounced async suggestions, single & multiple (chips), object options, dropdown trigger, forceSelection, custom item template, ControlValueAccessor.',
        'Form inputs: InputText (icons, clearable, sizes, invalid), InputNumber (steppers, decimal & currency mode, min/max/step), and Textarea (rows, autoResize, maxlength counter) — all ControlValueAccessors.',
        'NwConfirmationService + <nw-confirm-dialog> for service-driven confirmations.',
        'Dialog header/footer templates (nwDialogHeader / nwDialogFooter).',
      ],
      improved: [
        'Dialog: draggable, resizable, maximizable, focus trap, block-scroll, and shown/hidden events.',
        'Button: help / contrast / link variants, icon-only square sizing with ariaLabel, and fluid full-width.',
        'Checkbox & Radio: full ControlValueAccessor support, sizes, invalid styling, and radio name grouping.',
        'Spinner: color variants, configurable strokeWidth and animationDuration.',
        'Toast: secondary & contrast severities, sticky / closable / keyed messages, and per-outlet clear().',
        'Migration tool updated to map every new prop and component.',
      ],
    },
    {
      version: '0.4.0',
      date: '2026-08-11',
      headline: 'Tabs, Checkbox/Radio, and Spinner/Skeleton.',
      added: [
        'Tabs with lazy panels, closable tabs, orientation, and header templates.',
        'Checkbox, Radio, Spinner, and Skeleton components.',
      ],
    },
    {
      version: '0.3.0',
      date: '2026-08-11',
      headline: 'Overlays and notifications.',
      added: ['Dropdown, Dialog, and a signal-based Toast service.'],
    },
    {
      version: '0.2.0',
      date: '2026-08-10',
      headline: 'The flagship DataTable, aligned to the migration spec.',
      added: [
        'DataTable: sorting, filtering, pagination, selection, expansion, lazy loading, and CSV export.',
      ],
    },
    {
      version: '0.1.0',
      date: '2026-08-10',
      headline: 'First release.',
      added: ['Button component, design tokens, and the shipped Tailwind preset.'],
    },
  ];
}
