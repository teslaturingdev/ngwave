import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NwTreeComponent, NwTreeNode } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-tree-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwTreeComponent,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Tree</h1>
          <p class="mt-2 text-surface-600">
            Hierarchical data with expand/collapse, single/multiple/checkbox
            selection, filtering, and keyboard navigation.
          </p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="basic" title="Basic" [code]="basicCode">
              <nw-tree [nodes]="nodes" class="w-64" />
            </docs-demo>

            <docs-demo id="single" title="Single selection" [code]="singleCode">
              <nw-tree [nodes]="nodes" selectionMode="single" [(selection)]="single" class="w-64" />
            </docs-demo>

            <docs-demo id="multiple" title="Multiple selection" [code]="multipleCode">
              <nw-tree [nodes]="nodes" selectionMode="multiple" [(selection)]="multi" class="w-64" />
              <p class="text-xs text-surface-500 mt-2">
                Plain click selects one; Ctrl/Cmd/Shift-click adds to the selection
                (metaKeySelection).
              </p>
            </docs-demo>

            <docs-demo id="checkbox" title="Checkbox selection" [code]="checkboxCode">
              <nw-tree [nodes]="checkboxNodes" selectionMode="checkbox" [(selection)]="checked" class="w-64" />
              <p class="text-xs text-surface-500 mt-2">
                Checking a parent checks all children; a partially-checked parent
                shows a dash.
              </p>
            </docs-demo>

            <docs-demo id="filter" title="Filter" [code]="filterCode">
              <nw-tree [nodes]="nodes" [filter]="true" class="w-64" />
            </docs-demo>

            <docs-demo id="disabled-node" title="Non-selectable node" [code]="disabledCode">
              <nw-tree [nodes]="withUnselectable" selectionMode="single" class="w-64" />
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
export class TreeDocPageComponent {
  protected readonly single = signal<NwTreeNode | null>(null);
  protected readonly multi = signal<NwTreeNode[]>([]);
  protected readonly checked = signal<NwTreeNode[]>([]);

  protected readonly nodes: NwTreeNode[] = [
    {
      label: 'projects',
      expanded: true,
      children: [
        {
          label: 'ngwave-ui',
          children: [{ label: 'button.component.ts' }, { label: 'card.component.ts' }],
        },
        { label: 'docs' },
      ],
    },
    { label: 'lib' },
  ];

  protected readonly checkboxNodes: NwTreeNode[] = [
    {
      label: 'src',
      expanded: true,
      children: [
        { label: 'app.component.ts' },
        { label: 'app.routes.ts' },
        { label: 'pages', children: [{ label: 'home.page.ts' }, { label: 'card.page.ts' }] },
      ],
    },
  ];

  protected readonly withUnselectable: NwTreeNode[] = [
    { label: 'Editable' },
    { label: 'Locked', selectable: false },
  ];

  protected readonly sections: TocSection[] = [
    { id: 'basic', label: 'Basic' },
    { id: 'single', label: 'Single selection' },
    { id: 'multiple', label: 'Multiple selection' },
    { id: 'checkbox', label: 'Checkbox selection' },
    { id: 'filter', label: 'Filter' },
    { id: 'disabled-node', label: 'Non-selectable node' },
  ];

  protected readonly basicCode = `<nw-tree [nodes]="nodes" />`;
  protected readonly singleCode = `<nw-tree [nodes]="nodes" selectionMode="single" [(selection)]="selected" />`;
  protected readonly multipleCode = `<nw-tree [nodes]="nodes" selectionMode="multiple" [(selection)]="selected" />`;
  protected readonly checkboxCode = `<nw-tree [nodes]="nodes" selectionMode="checkbox" [(selection)]="checked" />`;
  protected readonly filterCode = `<nw-tree [nodes]="nodes" [filter]="true" />`;
  protected readonly disabledCode = `<nw-tree [nodes]="[{ label: 'Locked', selectable: false }]" selectionMode="single" />`;

  protected readonly api: ApiRow[] = [
    { name: 'nodes', type: 'NwTreeNode[]', default: '[]', description: '{ label, data?, icon?, expandedIcon?, collapsedIcon?, children?, leaf?, expanded?, key?, selectable? }[], nested.' },
    { name: 'selectionMode', type: `'single' | 'multiple' | 'checkbox' | null`, default: 'null', description: 'Enables node selection.' },
    { name: 'selection', type: 'NwTreeNode | NwTreeNode[] | null', default: 'null', description: 'Two-way bound selected/checked node(s). Always an array in multiple/checkbox mode.' },
    { name: 'metaKeySelection', type: 'boolean', default: 'true', description: 'In multiple mode, requires Ctrl/Cmd/Shift to add to selection; plain click replaces it.' },
    { name: 'filter', type: 'boolean', default: 'false', description: 'Shows a search box that filters nodes by label, auto-expanding matches.' },
    { name: 'filterPlaceholder', type: 'string', default: `'Search'`, description: 'Placeholder for the filter input.' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Shows a loading indicator instead of the tree.' },
    { name: 'emptyMessage', type: 'string', default: `'No records found'`, description: 'Shown when nodes is empty.' },
    { name: 'nodeSelect / nodeUnselect', type: 'output<NwTreeNode>', default: '—', description: 'Fires on select/deselect (and check/uncheck in checkbox mode).' },
    { name: 'nodeExpand / nodeCollapse', type: 'output<NwTreeNode>', default: '—', description: 'Fires when a node is expanded/collapsed.' },
    { name: 'filtered', type: 'output<NwTreeNode[]>', default: '—', description: 'Fires with the matched nodes while filtering.' },
    { name: 'Keyboard', type: '—', default: '—', description: '↑/↓ move focus, →/← expand/collapse or move to child/parent, Enter/Space select.' },
  ];
}
