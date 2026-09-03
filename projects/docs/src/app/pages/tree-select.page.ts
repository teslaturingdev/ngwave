import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NwTreeNode, NwTreeSelectComponent } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-tree-select-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwTreeSelectComponent,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Tree Select</h1>
          <p class="mt-2 text-surface-600">
            A dropdown for picking one or more nodes from a tree, with optional
            checkbox selection and filtering.
          </p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="basic" title="Single" [code]="basicCode">
              <nw-tree-select [nodes]="nodes" placeholder="Select a folder" [(selection)]="single" />
            </docs-demo>

            <docs-demo id="checkbox" title="Checkbox, chip display & clear" [code]="checkboxCode">
              <nw-tree-select
                [nodes]="nodes"
                selectionMode="checkbox"
                display="chip"
                [showClear]="true"
                placeholder="Select folders"
                [(selection)]="multi"
              />
            </docs-demo>

            <docs-demo id="filter" title="Filterable" [code]="filterCode">
              <nw-tree-select [nodes]="nodes" [filter]="true" placeholder="Search & select" />
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
export class TreeSelectDocPageComponent {
  protected readonly single = signal<NwTreeNode | null>(null);
  protected readonly multi = signal<NwTreeNode[]>([]);

  protected readonly nodes: NwTreeNode[] = [
    {
      label: 'projects',
      children: [
        { label: 'ngwave-ui', children: [{ label: 'src' }] },
        { label: 'docs' },
      ],
    },
    { label: 'lib' },
  ];

  protected readonly sections: TocSection[] = [
    { id: 'basic', label: 'Single' },
    { id: 'checkbox', label: 'Checkbox, chip display & clear' },
    { id: 'filter', label: 'Filterable' },
  ];

  protected readonly basicCode = `<nw-tree-select [nodes]="nodes" placeholder="Select a folder" [(selection)]="selected" />`;
  protected readonly checkboxCode = `<nw-tree-select [nodes]="nodes" selectionMode="checkbox" display="chip" [showClear]="true" [(selection)]="selected" />`;
  protected readonly filterCode = `<nw-tree-select [nodes]="nodes" [filter]="true" />`;

  protected readonly api: ApiRow[] = [
    { name: 'nodes', type: 'NwTreeNode[]', default: '[]', description: '{ label, key?, icon?, children?, expanded?, selectable? }[], nested.' },
    { name: 'selectionMode', type: `'single' | 'multiple' | 'checkbox'`, default: `'single'`, description: 'Selection behavior of the internal tree.' },
    { name: 'selection', type: 'NwTreeNode | NwTreeNode[] | null', default: 'null', description: 'Two-way bound selection.' },
    { name: 'display', type: `'comma' | 'chip'`, default: `'comma'`, description: 'How multiple selections render in the trigger.' },
    { name: 'showClear', type: 'boolean', default: 'false', description: 'Shows a clear (✕) button when there is a selection.' },
    { name: 'filter', type: 'boolean', default: 'false', description: 'Shows a search box inside the panel.' },
    { name: 'placeholder', type: 'string', default: `'Select'`, description: 'Text shown when nothing is selected.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the control.' },
    { name: 'onShow / onHide', type: 'output<void>', default: '—', description: 'Fires when the panel opens/closes.' },
    { name: 'onClear', type: 'output<void>', default: '—', description: 'Fires when the clear button is used.' },
  ];
}
