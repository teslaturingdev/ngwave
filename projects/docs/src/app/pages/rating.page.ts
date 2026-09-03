import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NwRatingComponent } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-rating-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwRatingComponent,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Rating</h1>
          <p class="mt-2 text-surface-600">A star-based rating input.</p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="basic" title="Basic" [code]="basicCode">
              <nw-rating [(value)]="value" />
              <span class="text-sm text-surface-600">value = {{ value() }}</span>
            </docs-demo>

            <docs-demo id="count" title="Star count" [code]="countCode">
              <nw-rating [count]="10" [value]="6" />
            </docs-demo>

            <docs-demo id="icons" title="Custom icons" [code]="iconsCode">
              <nw-rating [value]="3" onIcon="pi pi-heart-fill" offIcon="pi pi-heart" />
              <p class="text-xs text-surface-500 mt-2">
                Falls back to a filled/outline star glyph when no icon classes are set.
              </p>
            </docs-demo>

            <docs-demo id="readonly" title="Readonly & disabled" [code]="readonlyCode">
              <nw-rating [value]="4" [readonly]="true" />
              <nw-rating [value]="2" [disabled]="true" />
            </docs-demo>
          </div>

          <div api>
            <docs-api-table [rows]="api" />
          </div>
        </docs-tabs>
      </article>

      <docs-toc [sections]="sections" />
    </div>
  `,
})
export class RatingDocPageComponent {
  protected readonly value = signal(3);

  protected readonly sections: TocSection[] = [
    { id: 'basic', label: 'Basic' },
    { id: 'count', label: 'Star count' },
    { id: 'icons', label: 'Custom icons' },
    { id: 'readonly', label: 'Readonly & disabled' },
  ];

  protected readonly basicCode = `<nw-rating [(value)]="value" />`;
  protected readonly countCode = `<nw-rating [count]="10" [value]="6" />`;
  protected readonly iconsCode = `<nw-rating onIcon="pi pi-heart-fill" offIcon="pi pi-heart" [(value)]="value" />`;
  protected readonly readonlyCode = `<nw-rating [value]="4" [readonly]="true" />`;

  protected readonly api: ApiRow[] = [
    { name: 'value', type: 'number', default: '0', description: 'Two-way bound rating. Also a ControlValueAccessor.' },
    { name: 'count', type: 'number', default: '5', description: 'Number of stars.' },
    { name: 'onIcon / offIcon', type: 'string', default: `''`, description: 'Icon classes for filled/empty stars. Falls back to a ★/☆ glyph when unset.' },
    { name: 'readonly', type: 'boolean', default: 'false', description: 'Display-only, no interaction.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the control.' },
    { name: 'cancel', type: 'boolean', default: 'true', description: 'Clicking the current value clears it back to 0.' },
  ];
}
