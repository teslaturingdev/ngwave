import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  NwInputNumberComponent,
  NwInputTextComponent,
  NwTextareaComponent,
} from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-input-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwInputTextComponent,
    NwInputNumberComponent,
    NwTextareaComponent,
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
          <h1 class="text-3xl font-bold text-surface-900">Form Inputs</h1>
          <p class="mt-2 text-surface-600">
            Text, number, and textarea controls — all form-integrated
            (ControlValueAccessor), with sizes, icons, validation styling, and a
            currency/decimal number field with steppers.
          </p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="text" title="Text input" [code]="textCode">
              <div class="w-72 space-y-3">
                <nw-input-text [(value)]="name" placeholder="Your name" [fluid]="true" />
                <nw-input-text
                  iconLeft="pi pi-search"
                  placeholder="Search"
                  [clearable]="true"
                  [fluid]="true"
                />
                <nw-input-text [invalid]="true" placeholder="Invalid" [fluid]="true" />
              </div>
              <span class="text-sm text-surface-600">name = {{ name() }}</span>
            </docs-demo>

            <docs-demo id="sizes" title="Sizes" [code]="sizesCode">
              <div class="flex flex-col gap-2 w-72">
                <nw-input-text size="small" placeholder="Small" [fluid]="true" />
                <nw-input-text size="normal" placeholder="Normal" [fluid]="true" />
                <nw-input-text size="large" placeholder="Large" [fluid]="true" />
              </div>
            </docs-demo>

            <docs-demo id="number" title="Number & currency" [code]="numberCode">
              <div class="flex flex-wrap items-start gap-4">
                <nw-input-number [(value)]="qty" [showButtons]="true" [min]="0" [max]="20" />
                <nw-input-number
                  [(value)]="price"
                  mode="currency"
                  currency="USD"
                  [showButtons]="true"
                  buttonLayout="horizontal"
                  [step]="0.5"
                />
              </div>
              <span class="text-sm text-surface-600"
                >qty = {{ qty() }}, price = {{ price() }}</span
              >
            </docs-demo>

            <docs-demo id="textarea" title="Textarea" [code]="textareaCode">
              <div class="w-96">
                <nw-textarea
                  [(value)]="bio"
                  placeholder="Tell us about yourself"
                  [rows]="3"
                  [maxlength]="120"
                  [autoResize]="true"
                  [fluid]="true"
                />
              </div>
            </docs-demo>

            <docs-demo id="forms" title="Reactive forms" [code]="formsCode">
              <div class="w-72">
                <nw-input-text [formControl]="email" placeholder="Email" [fluid]="true" />
              </div>
              <span class="text-sm text-surface-600">email = {{ email.value }}</span>
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
export class InputDocPageComponent {
  protected readonly name = signal('');
  protected readonly qty = signal<number | null>(1);
  protected readonly price = signal<number | null>(9.99);
  protected readonly bio = signal('');
  protected readonly email = new FormControl('');

  protected readonly sections: TocSection[] = [
    { id: 'text', label: 'Text input' },
    { id: 'sizes', label: 'Sizes' },
    { id: 'number', label: 'Number & currency' },
    { id: 'textarea', label: 'Textarea' },
    { id: 'forms', label: 'Reactive forms' },
  ];

  protected readonly textCode = `<nw-input-text [(value)]="name" placeholder="Your name" />
<nw-input-text iconLeft="pi pi-search" [clearable]="true" placeholder="Search" />
<nw-input-text [invalid]="true" placeholder="Invalid" />`;
  protected readonly sizesCode = `<nw-input-text size="small" />
<nw-input-text size="large" />`;
  protected readonly numberCode = `<nw-input-number [(value)]="qty" [showButtons]="true" [min]="0" [max]="20" />
<nw-input-number [(value)]="price" mode="currency" currency="USD"
  [showButtons]="true" buttonLayout="horizontal" [step]="0.5" />`;
  protected readonly textareaCode = `<nw-textarea [(value)]="bio" [rows]="3" [maxlength]="120" [autoResize]="true" />`;
  protected readonly formsCode = `<nw-input-text [formControl]="email" placeholder="Email" />`;

  protected readonly api: ApiRow[] = [
    { name: 'value', type: 'string | number | null', default: `'' / null`, description: 'Two-way bound value. All three inputs are ControlValueAccessors.' },
    { name: 'size', type: `'small' | 'normal' | 'large'`, default: `'normal'`, description: 'Control height (text & number).' },
    { name: 'invalid', type: 'boolean', default: 'false', description: 'Applies error styling.' },
    { name: 'clearable (nw-input-text)', type: 'boolean', default: 'false', description: 'Shows a clear button when non-empty.' },
    { name: 'iconLeft / iconRight (nw-input-text)', type: 'string', default: `''`, description: 'Icon class rendered inside the field.' },
    { name: 'mode (nw-input-number)', type: `'decimal' | 'currency'`, default: `'decimal'`, description: 'Formats the value; currency uses Intl.NumberFormat.' },
    { name: 'min / max / step (nw-input-number)', type: 'number', default: '— / — / 1', description: 'Bounds and stepper increment.' },
    { name: 'showButtons / buttonLayout (nw-input-number)', type: `boolean / 'stacked' | 'horizontal'`, default: `false / 'stacked'`, description: 'Increment/decrement steppers.' },
    { name: 'rows / autoResize / maxlength (nw-textarea)', type: 'number / boolean / number', default: '3 / false / —', description: 'Textarea sizing, grow-on-type, and char limit + counter.' },
    { name: 'fluid', type: 'boolean', default: 'false', description: 'Stretches the control to its container width.' },
  ];
}
