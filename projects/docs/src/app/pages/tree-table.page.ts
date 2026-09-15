import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NwTreeTableColumn, NwTreeTableComponent, NwTreeTableNode } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-tree-table-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwTreeTableComponent,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Tree Table</h1>
          <p class="mt-2 text-surface-600">
            Hybrid of nw-tree and nw-data-table — hierarchical rows rendered as a table.
          </p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="basic" title="Basic" [code]="basicCode">
              <nw-tree-table [value]="nodes" [columns]="columns" />
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
export class TreeTableDocPageComponent {
  protected readonly sections: TocSection[] = [{ id: 'basic', label: 'Basic' }];

  protected readonly columns: NwTreeTableColumn[] = [
    { field: 'name', header: 'Name' },
    { field: 'size', header: 'Size' },
  ];

  protected readonly nodes: NwTreeTableNode[] = [
    {
      data: { name: 'Documents', size: '75kb' },
      children: [
        { data: { name: 'Invoice.pdf', size: '12kb' } },
        { data: { name: 'Contract.pdf', size: '63kb' } },
      ],
    },
    { data: { name: 'Photo.png', size: '2.1mb' } },
  ];

  protected readonly basicCode = `<nw-tree-table [value]="nodes" [columns]="columns" />`;

  protected readonly api: ApiRow[] = [
    { name: 'value', type: 'NwTreeTableNode[]', default: '[]', description: '{ data, children?, key? } — data keys match column fields.' },
    { name: 'columns', type: 'NwTreeTableColumn[]', default: '[]', description: '{ field, header, width? }.' },
    { name: 'selectionMode', type: `'checkbox' | null`, default: 'null', description: 'Enables row checkboxes when set to \'checkbox\'.' },
    { name: 'selection', type: 'model<NwTreeTableNode[]>', default: '[]', description: 'Selected nodes (checkbox mode).' },
  ];
}
