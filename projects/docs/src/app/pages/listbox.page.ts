import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NwListboxComponent, NwListboxEntry } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-listbox-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwListboxComponent,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Listbox</h1>
          <p class="mt-2 text-surface-600">
            A scrollable list of selectable options — single or multiple,
            grouped, filterable, with checkbox + select-all.
          </p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="basic" title="Single select" [code]="basicCode">
              <nw-listbox [options]="options" [(selection)]="single" class="w-56" />
            </docs-demo>

            <docs-demo id="multiple" title="Multiple select" [code]="multipleCode">
              <nw-listbox [options]="options" [multiple]="true" [(selection)]="multi" class="w-56" />
              <p class="text-xs text-surface-500 mt-2">
                Plain click selects one; Ctrl/Cmd/Shift-click adds to the selection.
              </p>
            </docs-demo>

            <docs-demo id="checkbox" title="Checkbox + select all" [code]="checkboxCode">
              <nw-listbox
                [options]="options"
                [multiple]="true"
                [checkbox]="true"
                [(selection)]="checked"
                class="w-56"
              />
            </docs-demo>

            <docs-demo id="grouped" title="Grouped options" [code]="groupedCode">
              <nw-listbox [options]="grouped" class="w-56" />
            </docs-demo>

            <docs-demo id="filter" title="Filterable" [code]="filterCode">
              <nw-listbox [options]="options" [filter]="true" class="w-56" />
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
export class ListboxDocPageComponent {
  protected readonly options: NwListboxEntry[] = [
    { label: 'Button', value: 'button' },
    { label: 'DataTable', value: 'data-table' },
    { label: 'Dropdown', value: 'dropdown' },
    { label: 'Dialog', value: 'dialog' },
  ];

  protected readonly grouped: NwListboxEntry[] = [
    {
      label: 'Form',
      items: [
        { label: 'Checkbox', value: 'checkbox' },
        { label: 'Slider', value: 'slider' },
      ],
    },
    {
      label: 'Overlay',
      items: [
        { label: 'Dialog', value: 'dialog' },
        { label: 'OverlayPanel', value: 'overlay-panel' },
      ],
    },
  ];

  protected readonly single = signal<unknown>('button');
  protected readonly multi = signal<unknown>([]);
  protected readonly checked = signal<unknown>([]);

  protected readonly sections: TocSection[] = [
    { id: 'basic', label: 'Single select' },
    { id: 'multiple', label: 'Multiple select' },
    { id: 'checkbox', label: 'Checkbox + select all' },
    { id: 'grouped', label: 'Grouped options' },
    { id: 'filter', label: 'Filterable' },
  ];

  protected readonly basicCode = `<nw-listbox [options]="options" [(selection)]="selected" />`;
  protected readonly multipleCode = `<nw-listbox [options]="options" [multiple]="true" [(selection)]="selected" />`;
  protected readonly checkboxCode = `<nw-listbox [options]="options" [multiple]="true" [checkbox]="true" [(selection)]="selected" />`;
  protected readonly groupedCode = `<nw-listbox [options]="[{ label: 'Form', items: [...] }, { label: 'Overlay', items: [...] }]" />`;
  protected readonly filterCode = `<nw-listbox [options]="options" [filter]="true" />`;

  protected readonly api: ApiRow[] = [
    { name: 'options', type: 'NwListboxEntry[]', default: '[]', description: '{ label, value, disabled? }[] or { label, items: NwListboxOption[] }[] for groups.' },
    { name: 'multiple', type: 'boolean', default: 'false', description: 'Allow selecting more than one option.' },
    { name: 'checkbox', type: 'boolean', default: 'false', description: 'Shows checkboxes in multiple mode (instead of row highlighting).' },
    { name: 'showToggleAll', type: 'boolean', default: 'true', description: 'Shows a "Select all" header when multiple + checkbox are enabled.' },
    { name: 'metaKeySelection', type: 'boolean', default: 'true', description: 'In multiple (non-checkbox) mode, requires Ctrl/Cmd/Shift to add to selection.' },
    { name: 'filter', type: 'boolean', default: 'false', description: 'Shows a search box that filters options by label.' },
    { name: 'selection', type: 'unknown | unknown[] | null', default: 'null', description: 'Two-way bound selection. Also a ControlValueAccessor.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the whole list.' },
    { name: 'emptyMessage / emptyFilterMessage', type: 'string', default: `'No options' / 'No results found'`, description: 'Shown when there are no options, or none match the filter.' },
  ];
}
