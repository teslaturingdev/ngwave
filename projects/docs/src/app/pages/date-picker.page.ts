import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NwDatePickerComponent } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-date-picker-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwDatePickerComponent,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Date Picker</h1>
          <p class="mt-2 text-surface-600">
            A text field that opens a month calendar on click. Pick a date from the panel — the field itself is read-only.
          </p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="basic" title="Basic" [code]="basicCode">
              <div class="w-64">
                <nw-date-picker [(value)]="date" placeholder="Select a date" />
              </div>
            </docs-demo>

            <docs-demo id="inline" title="Inline" [code]="inlineCode">
              <nw-date-picker [(value)]="date" [inline]="true" />
            </docs-demo>

            <docs-demo id="constrained" title="Min/max date" [code]="constrainedCode">
              <div class="w-64">
                <nw-date-picker [(value)]="date" [minDate]="minDate" [maxDate]="maxDate" [showClear]="true" />
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
export class DatePickerDocPageComponent {
  protected date: Date | null = null;
  protected readonly minDate = new Date();
  protected readonly maxDate = new Date(new Date().getFullYear(), new Date().getMonth() + 2, 0);

  protected readonly sections: TocSection[] = [
    { id: 'basic', label: 'Basic' },
    { id: 'inline', label: 'Inline' },
    { id: 'constrained', label: 'Min/max date' },
  ];

  protected readonly basicCode = `<nw-date-picker [(value)]="date" placeholder="Select a date" />`;
  protected readonly inlineCode = `<nw-date-picker [(value)]="date" [inline]="true" />`;
  protected readonly constrainedCode = `<nw-date-picker [(value)]="date" [minDate]="minDate" [maxDate]="maxDate" [showClear]="true" />`;

  protected readonly api: ApiRow[] = [
    { name: 'value', type: 'Date | null', default: 'null', description: 'Bindable selected date (model).' },
    { name: 'placeholder', type: 'string', default: `''`, description: 'Input placeholder text.' },
    { name: 'dateFormat', type: 'string', default: `'mm/dd/yy'`, description: 'Display format; supports mm, dd, yy, yyyy tokens.' },
    { name: 'minDate', type: 'Date | null', default: 'null', description: 'Earliest selectable date.' },
    { name: 'maxDate', type: 'Date | null', default: 'null', description: 'Latest selectable date.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the field.' },
    { name: 'fluid', type: 'boolean', default: 'false', description: 'Stretches the field to full width.' },
    { name: 'showIcon', type: 'boolean', default: 'true', description: 'Shows a calendar icon in the field.' },
    { name: 'inline', type: 'boolean', default: 'false', description: 'Renders the calendar panel inline instead of as a popup.' },
    { name: 'showToday', type: 'boolean', default: 'true', description: 'Shows a Today button in the panel footer.' },
    { name: 'showClear', type: 'boolean', default: 'false', description: 'Shows a Clear button in the panel footer.' },
  ];
}
