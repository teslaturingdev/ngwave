import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  NwDropdownComponent,
  NwDropdownOptionDirective,
  NwDropdownOption,
  NwOption,
} from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

interface User {
  id: number;
  name: string;
  role: string;
}

@Component({
  selector: 'docs-dropdown-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwDropdownComponent,
    NwDropdownOptionDirective,
    ReactiveFormsModule,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Dropdown</h1>
          <p class="mt-2 text-surface-600">
            A powerful select: single &amp; multi-selection, raw-object options,
            searchable filtering, grouped options, custom templates, chips,
            keyboard navigation, and reactive-forms support.
          </p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="basic" title="Single select" [code]="basicCode">
              <div class="w-64">
                <nw-dropdown [options]="cities" [(value)]="city" placeholder="Select a city" />
              </div>
              <span class="text-sm text-surface-600">Selected: {{ city() ?? '—' }}</span>
            </docs-demo>

            <docs-demo id="objects" title="Objects (optionLabel / optionValue)" [code]="objectsCode">
              <div class="w-64">
                <nw-dropdown
                  [options]="users"
                  optionLabel="name"
                  optionValue="id"
                  [(value)]="userId"
                  placeholder="Assign to"
                />
              </div>
              <span class="text-sm text-surface-600">userId = {{ userId() ?? '—' }}</span>
            </docs-demo>

            <docs-demo id="multi" title="Multi-select with chips" [code]="multiCode">
              <div class="w-72">
                <nw-dropdown
                  [options]="cities"
                  [(value)]="picked"
                  [multiple]="true"
                  display="chip"
                  [clearable]="true"
                  placeholder="Select cities"
                />
              </div>
            </docs-demo>

            <docs-demo id="template" title="Option template" [code]="templateCode">
              <div class="w-72">
                <nw-dropdown [options]="users" optionLabel="name" optionValue="id" [filter]="true">
                  <ng-template nwDropdownOption let-user>
                    <span class="flex-1">{{ $any(user).name }}</span>
                    <span class="text-xs text-surface-400">{{ $any(user).role }}</span>
                  </ng-template>
                </nw-dropdown>
              </div>
            </docs-demo>

            <docs-demo id="grouped" title="Grouped & searchable" [code]="groupedCode">
              <div class="w-64">
                <nw-dropdown [options]="grouped" [group]="true" [filter]="true" placeholder="Pick a tech" />
              </div>
            </docs-demo>

            <docs-demo id="forms" title="Reactive forms" [code]="formsCode">
              <div class="w-64">
                <nw-dropdown [options]="cities" [formControl]="cityCtrl" placeholder="Form control" />
              </div>
              <span class="text-sm text-surface-600">value = {{ cityCtrl.value ?? '—' }}</span>
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
export class DropdownPageComponent {
  protected readonly city = signal<unknown>(null);
  protected readonly userId = signal<unknown>(null);
  protected readonly picked = signal<unknown>([]);
  protected readonly cityCtrl = new FormControl<unknown>('ldn');

  protected readonly cities: NwOption[] = [
    { label: 'New York', value: 'ny' },
    { label: 'London', value: 'ldn' },
    { label: 'Tokyo', value: 'tky' },
    { label: 'Paris', value: 'par' },
    { label: 'Sydney', value: 'syd' },
  ];

  protected readonly users: User[] = [
    { id: 1, name: 'Ada Lovelace', role: 'Admin' },
    { id: 2, name: 'Alan Turing', role: 'Editor' },
    { id: 3, name: 'Grace Hopper', role: 'Viewer' },
  ];

  protected readonly grouped: NwDropdownOption[] = [
    { label: 'Frontend', items: [{ label: 'Angular', value: 'ng' }, { label: 'React', value: 'react' }] },
    { label: 'Backend', items: [{ label: 'Node', value: 'node' }, { label: 'Go', value: 'go' }] },
  ];

  protected readonly sections: TocSection[] = [
    { id: 'basic', label: 'Single select' },
    { id: 'objects', label: 'Object options' },
    { id: 'multi', label: 'Multi-select chips' },
    { id: 'template', label: 'Option template' },
    { id: 'grouped', label: 'Grouped & searchable' },
    { id: 'forms', label: 'Reactive forms' },
  ];

  protected readonly basicCode = `<nw-dropdown [options]="cities" [(value)]="city" placeholder="Select a city" />`;
  protected readonly objectsCode = `<nw-dropdown [options]="users" optionLabel="name" optionValue="id" [(value)]="userId" />`;
  protected readonly multiCode = `<nw-dropdown [options]="cities" [(value)]="picked" [multiple]="true" display="chip" [clearable]="true" />`;
  protected readonly templateCode = `<nw-dropdown [options]="users" optionLabel="name" optionValue="id">
  <ng-template nwDropdownOption let-user>
    {{ '{{' }} user.name {{ '}}' }} <span class="role">{{ '{{' }} user.role {{ '}}' }}</span>
  </ng-template>
</nw-dropdown>`;
  protected readonly groupedCode = `<nw-dropdown [options]="grouped" [group]="true" [filter]="true" />`;
  protected readonly formsCode = `<nw-dropdown [options]="cities" [formControl]="cityCtrl" />`;

  protected readonly api: ApiRow[] = [
    { name: 'options', type: 'unknown[]', default: '[]', description: 'Array of primitives, {label,value}, raw objects, or groups.' },
    { name: 'optionLabel / optionValue', type: 'string', default: `'label' / 'value'`, description: 'Keys used to read the label/value from raw objects.' },
    { name: 'optionDisabled', type: 'string', default: `'disabled'`, description: 'Key marking an option disabled.' },
    { name: 'group', type: 'boolean', default: 'false', description: 'Treat options as groups (optionGroupLabel/optionGroupChildren).' },
    { name: 'value', type: 'unknown', default: 'null', description: 'Two-way bound selection (array when multiple). Also a ControlValueAccessor.' },
    { name: 'multiple', type: 'boolean', default: 'false', description: 'Multi-selection with checkboxes.' },
    { name: 'display', type: `'comma' | 'chip'`, default: `'comma'`, description: 'How multi-selection renders in the trigger.' },
    { name: 'filter', type: 'boolean', default: 'false', description: 'Searchable options.' },
    { name: 'clearable', type: 'boolean', default: 'false', description: 'Shows a clear control.' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Shows a spinner in the panel.' },
    { name: 'nwDropdownOption', type: 'directive', default: '—', description: 'Custom option template: <ng-template nwDropdownOption let-option>.' },
    { name: 'nwDropdownSelected', type: 'directive', default: '—', description: 'Custom selected-value template.' },
  ];
}
