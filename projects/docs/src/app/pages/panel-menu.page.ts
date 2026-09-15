import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NwPanelMenuComponent, NwPanelMenuItem } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-panel-menu-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwPanelMenuComponent,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Panel Menu</h1>
          <p class="mt-2 text-surface-600">
            Collapsible nested nav tree — click an item with children to expand/collapse it in place.
          </p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="basic" title="Basic" [code]="basicCode">
              <div class="w-full max-w-xs">
                <nw-panel-menu [model]="items" />
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
export class PanelMenuDocPageComponent {
  protected readonly sections: TocSection[] = [{ id: 'basic', label: 'Basic' }];

  protected readonly items: NwPanelMenuItem[] = [
    {
      label: 'Documents',
      icon: 'folder',
      items: [{ label: 'Invoices' }, { label: 'Contracts' }],
    },
    { label: 'Settings', icon: 'settings', command: () => {} },
  ];

  protected readonly basicCode = `<nw-panel-menu [model]="items" />`;

  protected readonly api: ApiRow[] = [
    { name: 'model', type: 'NwPanelMenuItem[]', default: '[]', description: 'Items — { label, icon, items?, command? }, nestable.' },
  ];
}
