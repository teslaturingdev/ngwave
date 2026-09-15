import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NwToggleButtonComponent } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-toggle-button-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwToggleButtonComponent,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Toggle Button</h1>
          <p class="mt-2 text-surface-600">A button that toggles a pressed/active boolean state.</p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="basic" title="Basic" [code]="basicCode">
              <nw-toggle-button [(value)]="checked" onLabel="On" offLabel="Off" />
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
export class ToggleButtonDocPageComponent {
  protected readonly sections: TocSection[] = [{ id: 'basic', label: 'Basic' }];
  protected readonly checked = signal(false);

  protected readonly basicCode = `<nw-toggle-button [(value)]="checked" onLabel="On" offLabel="Off" />`;

  protected readonly api: ApiRow[] = [
    { name: 'onLabel', type: 'string', default: `'Yes'`, description: 'Label shown when active.' },
    { name: 'offLabel', type: 'string', default: `'No'`, description: 'Label shown when inactive.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the button.' },
    { name: 'value', type: 'model<boolean>', default: 'false', description: 'Pressed state.' },
  ];
}
