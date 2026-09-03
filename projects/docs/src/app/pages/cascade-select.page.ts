import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NwCascadeOption, NwCascadeSelectComponent } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-cascade-select-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwCascadeSelectComponent,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Cascade Select</h1>
          <p class="mt-2 text-surface-600">
            A multi-level flyout for selecting from nested options — hover to
            reveal the next column, like a native OS menu.
          </p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="basic" title="Basic" [code]="basicCode">
              <nw-cascade-select [options]="options" placeholder="Select a city" />
            </docs-demo>

            <docs-demo id="clear" title="Clearable" [code]="clearCode">
              <nw-cascade-select [options]="options" placeholder="Select a city" [showClear]="true" />
            </docs-demo>

            <docs-demo id="disabled-option" title="Disabled option" [code]="disabledCode">
              <nw-cascade-select [options]="withDisabled" placeholder="Select a city" />
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
export class CascadeSelectDocPageComponent {
  protected readonly options: NwCascadeOption[] = [
    {
      label: 'India',
      children: [
        {
          label: 'Tamil Nadu',
          children: [
            { label: 'Chennai', value: 'chennai' },
            { label: 'Coimbatore', value: 'coimbatore' },
          ],
        },
        { label: 'Karnataka', children: [{ label: 'Bengaluru', value: 'bengaluru' }] },
      ],
    },
    {
      label: 'USA',
      children: [{ label: 'California', children: [{ label: 'San Francisco', value: 'sf' }] }],
    },
  ];

  protected readonly withDisabled: NwCascadeOption[] = [
    {
      label: 'India',
      children: [
        { label: 'Tamil Nadu', children: [{ label: 'Chennai', value: 'chennai' }] },
        { label: 'Karnataka', disabled: true, children: [{ label: 'Bengaluru', value: 'bengaluru' }] },
      ],
    },
  ];

  protected readonly sections: TocSection[] = [
    { id: 'basic', label: 'Basic' },
    { id: 'clear', label: 'Clearable' },
    { id: 'disabled-option', label: 'Disabled option' },
  ];

  protected readonly basicCode = `<nw-cascade-select [options]="options" placeholder="Select a city" [(value)]="value" />`;
  protected readonly clearCode = `<nw-cascade-select [options]="options" [showClear]="true" />`;
  protected readonly disabledCode = `<nw-cascade-select [options]="[{ label: 'Karnataka', disabled: true, children: [...] }]" />`;

  protected readonly api: ApiRow[] = [
    { name: 'options', type: 'NwCascadeOption[]', default: '[]', description: '{ label, value?, disabled?, children? }[], nested.' },
    { name: 'value', type: 'unknown', default: 'undefined', description: 'Two-way bound value of the selected leaf option.' },
    { name: 'placeholder', type: 'string', default: `'Select'`, description: 'Text shown when nothing is selected.' },
    { name: 'showClear', type: 'boolean', default: 'false', description: 'Shows a clear (✕) button once a value is selected.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the control.' },
    { name: 'Interaction', type: '—', default: '—', description: 'Hover to cascade into a submenu; click a leaf to select. Keyboard: ↑/↓ move, → enters a submenu, ← exits, Enter selects, Esc closes.' },
  ];
}
