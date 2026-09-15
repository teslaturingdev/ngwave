import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NwColorPickerComponent } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-color-picker-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwColorPickerComponent,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Color Picker</h1>
          <p class="mt-2 text-surface-600">A hex color swatch that opens the browser's native color picker on click.</p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="basic" title="Basic" [code]="basicCode">
              <nw-color-picker [(value)]="color" />
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
export class ColorPickerDocPageComponent {
  protected color = '#6366f1';

  protected readonly sections: TocSection[] = [{ id: 'basic', label: 'Basic' }];
  protected readonly basicCode = `<nw-color-picker [(value)]="color" />`;

  protected readonly api: ApiRow[] = [
    { name: 'value', type: 'string', default: `'#ffffff'`, description: 'Bindable hex color (model).' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the swatch.' },
  ];
}
