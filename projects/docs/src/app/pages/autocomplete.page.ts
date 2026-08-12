import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  NwAutocompleteComponent,
  NwAutocompleteItemDirective,
} from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

interface Country {
  name: string;
  code: string;
}

@Component({
  selector: 'docs-autocomplete-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwAutocompleteComponent,
    NwAutocompleteItemDirective,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Autocomplete</h1>
          <p class="mt-2 text-surface-600">
            A typeahead input with debounced async suggestions, single &amp;
            multiple selection with chips, object options, a dropdown trigger,
            custom item templates, and reactive-forms support.
          </p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="basic" title="Basic" [code]="basicCode">
              <div class="w-72">
                <nw-autocomplete
                  [suggestions]="results()"
                  (complete)="search($event)"
                  [(value)]="picked"
                  placeholder="Search a country"
                  [fluid]="true"
                />
              </div>
              <span class="text-sm text-surface-600">picked = {{ picked() }}</span>
            </docs-demo>

            <docs-demo id="dropdown" title="With dropdown & clear" [code]="dropdownCode">
              <div class="w-72">
                <nw-autocomplete
                  [suggestions]="results()"
                  (complete)="search($event)"
                  [dropdown]="true"
                  [clearable]="true"
                  [minLength]="0"
                  placeholder="Pick or type"
                  [fluid]="true"
                />
              </div>
            </docs-demo>

            <docs-demo id="objects" title="Objects (optionLabel)" [code]="objectsCode">
              <div class="w-72">
                <nw-autocomplete
                  [suggestions]="countryResults()"
                  (complete)="searchCountries($event)"
                  optionLabel="name"
                  [(value)]="country"
                  placeholder="Country"
                  [fluid]="true"
                />
              </div>
              <span class="text-sm text-surface-600"
                >code = {{ country()?.code ?? '—' }}</span
              >
            </docs-demo>

            <docs-demo id="multiple" title="Multiple with chips" [code]="multipleCode">
              <div class="w-96">
                <nw-autocomplete
                  [suggestions]="results()"
                  (complete)="search($event)"
                  [multiple]="true"
                  placeholder="Add countries"
                  [fluid]="true"
                />
              </div>
            </docs-demo>

            <docs-demo id="template" title="Custom item template" [code]="templateCode">
              <div class="w-72">
                <nw-autocomplete
                  [suggestions]="countryResults()"
                  (complete)="searchCountries($event)"
                  optionLabel="name"
                  placeholder="Country"
                  [fluid]="true"
                >
                  <ng-template nwAutocompleteItem let-c>
                    <span class="flex-1">{{ $any(c).name }}</span>
                    <span class="text-xs text-surface-400">{{ $any(c).code }}</span>
                  </ng-template>
                </nw-autocomplete>
              </div>
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
export class AutocompleteDocPageComponent {
  private readonly countries: Country[] = [
    { name: 'Australia', code: 'AU' },
    { name: 'Brazil', code: 'BR' },
    { name: 'Canada', code: 'CA' },
    { name: 'Denmark', code: 'DK' },
    { name: 'France', code: 'FR' },
    { name: 'Germany', code: 'DE' },
    { name: 'India', code: 'IN' },
    { name: 'Japan', code: 'JP' },
    { name: 'Spain', code: 'ES' },
    { name: 'United Kingdom', code: 'GB' },
    { name: 'United States', code: 'US' },
  ];

  protected readonly picked = signal<unknown>(null);
  protected readonly country = signal<Country | null>(null);
  protected readonly results = signal<string[]>([]);
  protected readonly countryResults = signal<Country[]>([]);

  protected search(query: string): void {
    const q = query.toLowerCase();
    this.results.set(
      this.countries.filter((c) => c.name.toLowerCase().includes(q)).map((c) => c.name),
    );
  }

  protected searchCountries(query: string): void {
    const q = query.toLowerCase();
    this.countryResults.set(
      this.countries.filter((c) => c.name.toLowerCase().includes(q)),
    );
  }

  protected readonly sections: TocSection[] = [
    { id: 'basic', label: 'Basic' },
    { id: 'dropdown', label: 'Dropdown & clear' },
    { id: 'objects', label: 'Object options' },
    { id: 'multiple', label: 'Multiple chips' },
    { id: 'template', label: 'Item template' },
  ];

  protected readonly basicCode = `<nw-autocomplete
  [suggestions]="results()"
  (complete)="search($event)"
  [(value)]="picked"
  placeholder="Search a country" />

// component
search(query: string) {
  this.results.set(all.filter(c => c.includes(query)));
}`;
  protected readonly dropdownCode = `<nw-autocomplete
  [suggestions]="results()" (complete)="search($event)"
  [dropdown]="true" [clearable]="true" [minLength]="0" />`;
  protected readonly objectsCode = `<nw-autocomplete
  [suggestions]="countryResults()" (complete)="searchCountries($event)"
  optionLabel="name" [(value)]="country" />`;
  protected readonly multipleCode = `<nw-autocomplete
  [suggestions]="results()" (complete)="search($event)"
  [multiple]="true" placeholder="Add countries" />`;
  protected readonly templateCode = `<nw-autocomplete [suggestions]="countryResults()"
  (complete)="searchCountries($event)" optionLabel="name">
  <ng-template nwAutocompleteItem let-c>
    {{ '{{' }} c.name {{ '}}' }} <span class="code">{{ '{{' }} c.code {{ '}}' }}</span>
  </ng-template>
</nw-autocomplete>`;

  protected readonly api: ApiRow[] = [
    { name: 'suggestions', type: 'unknown[]', default: '[]', description: 'Current suggestion list — set it in the (complete) handler.' },
    { name: 'complete', type: 'output<string>', default: '—', description: 'Debounced query emitted so you can filter/fetch.' },
    { name: 'value', type: 'unknown', default: 'null', description: 'Selected value (array in multiple mode). ControlValueAccessor.' },
    { name: 'optionLabel', type: 'string', default: `''`, description: 'Key used to read the label from object suggestions.' },
    { name: 'multiple', type: 'boolean', default: 'false', description: 'Multi-selection rendered as chips.' },
    { name: 'dropdown', type: 'boolean', default: 'false', description: 'Adds a trigger button that lists suggestions.' },
    { name: 'minLength', type: 'number', default: '1', description: 'Minimum characters before (complete) fires.' },
    { name: 'delay', type: 'number', default: '300', description: 'Debounce in ms before (complete) fires.' },
    { name: 'forceSelection', type: 'boolean', default: 'false', description: 'Clears free text that does not match a suggestion on blur.' },
    { name: 'clearable', type: 'boolean', default: 'false', description: 'Shows a clear control.' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Shows a loading state in the panel.' },
    { name: 'nwAutocompleteItem', type: 'directive', default: '—', description: 'Custom suggestion template: <ng-template nwAutocompleteItem let-item>.' },
  ];
}
