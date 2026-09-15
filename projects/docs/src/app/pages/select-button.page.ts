import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NwSelectButtonComponent } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-select-button-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwSelectButtonComponent,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Select Button</h1>
          <p class="mt-2 text-surface-600">
            Single- or multi-select segmented button group.
          </p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="single" title="Single select" [code]="singleCode">
              <nw-select-button [options]="sizes" [(value)]="size" />
            </docs-demo>

            <docs-demo id="multiple" title="Multiple select" [code]="multipleCode">
              <nw-select-button [options]="sizes" [multiple]="true" [(value)]="sizesSelected" />
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
export class SelectButtonDocPageComponent {
  protected readonly sections: TocSection[] = [
    { id: 'single', label: 'Single select' },
    { id: 'multiple', label: 'Multiple select' },
  ];

  protected readonly sizes = ['Small', 'Medium', 'Large'];
  protected readonly size = signal('Medium');
  protected readonly sizesSelected = signal<string[]>(['Medium']);

  protected readonly singleCode = `<nw-select-button [options]="['Small','Medium','Large']" [(value)]="size" />`;
  protected readonly multipleCode = `<nw-select-button [options]="['Small','Medium','Large']" [multiple]="true" [(value)]="sizes" />`;

  protected readonly api: ApiRow[] = [
    { name: 'options', type: 'unknown[]', default: '[]', description: 'Options — plain values or objects.' },
    { name: 'optionLabel', type: 'string', default: `'label'`, description: 'Object key to read the label from.' },
    { name: 'optionValue', type: 'string', default: `'value'`, description: 'Object key to read the value from.' },
    { name: 'multiple', type: 'boolean', default: 'false', description: 'Allow selecting more than one option.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the whole group.' },
    { name: 'value', type: 'model<unknown>', default: 'null', description: 'Selected value (or array of values when multiple).' },
  ];
}
