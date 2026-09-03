import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NwSplitButtonComponent, NwSplitButtonItem } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-split-button-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwSplitButtonComponent,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Split Button</h1>
          <p class="mt-2 text-surface-600">
            A primary action button paired with a dropdown of secondary actions.
          </p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="basic" title="Basic" [code]="basicCode">
              <nw-split-button label="Save" [model]="items" (clicked)="onSave()" />
            </docs-demo>

            <docs-demo id="severity" title="Variant & size" [code]="severityCode">
              <nw-split-button label="Danger" variant="danger" size="small" [model]="items" />
              <nw-split-button label="Outlined" variant="outlined" [model]="items" />
              <nw-split-button label="Large" size="large" [model]="items" />
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
export class SplitButtonDocPageComponent {
  protected readonly items: NwSplitButtonItem[] = [
    { label: 'Save as draft' },
    { label: 'Save & publish' },
    { label: 'Delete', disabled: true },
  ];

  protected readonly sections: TocSection[] = [
    { id: 'basic', label: 'Basic' },
    { id: 'severity', label: 'Variant & size' },
  ];

  protected readonly basicCode = `<nw-split-button label="Save" [model]="items" (clicked)="onSave()" />`;
  protected readonly severityCode = `<nw-split-button label="Danger" variant="danger" size="small" [model]="items" />`;

  protected readonly api: ApiRow[] = [
    { name: 'label', type: 'string', default: `''`, description: 'Primary button text.' },
    { name: 'icon', type: 'string', default: `''`, description: 'Icon class for the primary button.' },
    { name: 'iconPosition', type: `'left' | 'right'`, default: `'left'`, description: 'Icon placement on the primary button.' },
    { name: 'variant', type: 'NwButtonVariant', default: `'primary'`, description: 'Same variants as nw-button (secondary, success, danger, outlined, ...).' },
    { name: 'size', type: `'small' | 'normal' | 'large'`, default: `'normal'`, description: 'Button size.' },
    { name: 'model', type: 'NwSplitButtonItem[]', default: '[]', description: '{ label, icon?, disabled?, command? }[] for the dropdown menu.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables both buttons.' },
    { name: 'clicked', type: 'output<void>', default: '—', description: 'Fires when the primary button is clicked.' },
  ];

  protected onSave(): void {}
}
