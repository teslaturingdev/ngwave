import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NwChipComponent } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-chip-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwChipComponent,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Chip</h1>
          <p class="mt-2 text-surface-600">
            A compact, pill-shaped element for tags, filters, or selections.
          </p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="basic" title="Basic" [code]="basicCode">
              <nw-chip label="Angular" />
              <nw-chip label="Verified" icon="pi pi-check" />
              <nw-chip label="Saravanan" image="https://i.pravatar.cc/64" />
            </docs-demo>

            <docs-demo id="removable" title="Removable" [code]="removableCode">
              @if (visible()) {
                <nw-chip label="Dismiss me" [removable]="true" (removed)="visible.set(false)" />
              } @else {
                <span class="text-sm text-surface-500">Removed — reload the page to reset.</span>
              }
            </docs-demo>

            <docs-demo id="remove-icon" title="Custom remove icon" [code]="removeIconCode">
              <nw-chip label="Custom ✕" [removable]="true" removeIcon="pi pi-trash" />
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
export class ChipDocPageComponent {
  protected readonly visible = signal(true);

  protected readonly sections: TocSection[] = [
    { id: 'basic', label: 'Basic' },
    { id: 'removable', label: 'Removable' },
    { id: 'remove-icon', label: 'Custom remove icon' },
  ];

  protected readonly basicCode = `<nw-chip label="Angular" />
<nw-chip label="Verified" icon="pi pi-check" />`;
  protected readonly removableCode = `<nw-chip label="Dismiss me" [removable]="true" (removed)="onRemove()" />`;
  protected readonly removeIconCode = `<nw-chip label="Custom" [removable]="true" removeIcon="pi pi-trash" />`;

  protected readonly api: ApiRow[] = [
    { name: 'label', type: 'string', default: `''`, description: 'Chip text. Falls back to projected content when empty.' },
    { name: 'icon', type: 'string', default: `''`, description: 'Icon class shown at the start.' },
    { name: 'image', type: 'string', default: `''`, description: 'Image URL shown at the start, instead of an icon.' },
    { name: 'removable', type: 'boolean', default: 'false', description: 'Shows a remove button.' },
    { name: 'removeIcon', type: 'string', default: `''`, description: 'Icon class for the remove button. Falls back to a ✕ glyph.' },
    { name: 'removed', type: 'output<void>', default: '—', description: 'Fires when the remove button is clicked.' },
  ];
}
