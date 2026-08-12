import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NwCheckboxComponent, NwRadioComponent } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-checkbox-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwCheckboxComponent,
    NwRadioComponent,
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
          <h1 class="text-3xl font-bold text-surface-900">Checkbox &amp; Radio</h1>
          <p class="mt-2 text-surface-600">
            Accessible selection controls with two-way binding.
          </p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="checkbox" title="Checkbox" [code]="checkboxCode">
              <nw-checkbox [(checked)]="agree" label="I agree" />
              <span class="text-sm text-surface-600">agree = {{ agree() }}</span>
            </docs-demo>

            <docs-demo id="states" title="Indeterminate & disabled" [code]="statesCode">
              <nw-checkbox [indeterminate]="true" label="Some selected" />
              <nw-checkbox [checked]="true" [disabled]="true" label="Disabled" />
            </docs-demo>

            <docs-demo id="sizes" title="Sizes & invalid" [code]="sizesCode">
              <div class="flex items-center gap-6">
                <nw-checkbox [checked]="true" size="small" label="Small" />
                <nw-checkbox [checked]="true" size="normal" label="Normal" />
                <nw-checkbox [checked]="true" size="large" label="Large" />
                <nw-checkbox [invalid]="true" label="Invalid" />
              </div>
            </docs-demo>

            <docs-demo id="radio" title="Radio group" [code]="radioCode">
              <div class="flex flex-col gap-2">
                <nw-radio [(selected)]="plan" value="free" label="Free" />
                <nw-radio [(selected)]="plan" value="pro" label="Pro" />
                <nw-radio [(selected)]="plan" value="team" label="Team" />
              </div>
              <span class="text-sm text-surface-600">plan = {{ plan() }}</span>
            </docs-demo>

            <docs-demo id="forms" title="Reactive forms" [code]="formsCode">
              <div class="flex flex-col gap-3">
                <nw-checkbox [formControl]="terms" label="Accept terms" />
                <div class="flex flex-col gap-2">
                  <nw-radio [formControl]="tier" [value]="'a'" name="tier" label="Tier A" />
                  <nw-radio [formControl]="tier" [value]="'b'" name="tier" label="Tier B" />
                </div>
              </div>
              <span class="text-sm text-surface-600"
                >terms = {{ terms.value }}, tier = {{ tier.value }}</span
              >
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
export class CheckboxDocPageComponent {
  protected readonly agree = signal(false);
  protected readonly plan = signal<unknown>('free');
  protected readonly terms = new FormControl(false);
  protected readonly tier = new FormControl<string>('a');

  protected readonly sections: TocSection[] = [
    { id: 'checkbox', label: 'Checkbox' },
    { id: 'states', label: 'Indeterminate & disabled' },
    { id: 'sizes', label: 'Sizes & invalid' },
    { id: 'radio', label: 'Radio group' },
    { id: 'forms', label: 'Reactive forms' },
  ];

  protected readonly checkboxCode = `<nw-checkbox [(checked)]="agree" label="I agree" />`;
  protected readonly statesCode = `<nw-checkbox [indeterminate]="true" label="Some selected" />
<nw-checkbox [checked]="true" [disabled]="true" label="Disabled" />`;
  protected readonly sizesCode = `<nw-checkbox size="small" label="Small" />
<nw-checkbox size="large" label="Large" />
<nw-checkbox [invalid]="true" label="Invalid" />`;
  protected readonly radioCode = `<nw-radio [(selected)]="plan" value="free" label="Free" />
<nw-radio [(selected)]="plan" value="pro" label="Pro" />`;
  protected readonly formsCode = `<nw-checkbox [formControl]="terms" label="Accept terms" />
<nw-radio [formControl]="tier" [value]="'a'" name="tier" label="Tier A" />
<nw-radio [formControl]="tier" [value]="'b'" name="tier" label="Tier B" />`;

  protected readonly api: ApiRow[] = [
    { name: 'checked (nw-checkbox)', type: 'boolean', default: 'false', description: 'Two-way bound checked state. Also a ControlValueAccessor.' },
    { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Renders the mixed/indeterminate state.' },
    { name: 'size', type: `'small' | 'normal' | 'large'`, default: `'normal'`, description: 'Control size.' },
    { name: 'invalid', type: 'boolean', default: 'false', description: 'Applies the invalid (error) styling.' },
    { name: 'readonly', type: 'boolean', default: 'false', description: 'Prevents user changes without dimming the control.' },
    { name: 'value (nw-radio)', type: 'unknown', default: 'null', description: `This radio's option value.` },
    { name: 'selected (nw-radio)', type: 'unknown', default: 'null', description: 'Two-way bound group selection. Also a ControlValueAccessor.' },
    { name: 'name (nw-radio)', type: 'string', default: `''`, description: 'Native group name shared across a radio set.' },
    { name: 'label', type: 'string', default: `''`, description: 'Text shown next to the control.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the control.' },
  ];
}
