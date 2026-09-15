import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NwMenuBarComponent, NwMenuBarItem } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-menubar-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwMenuBarComponent,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Menubar</h1>
          <p class="mt-2 text-surface-600">Horizontal top-nav menu with a flat or nested [model].</p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="basic" title="Basic" [code]="basicCode">
              <nw-menubar [model]="items" />
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
export class MenubarDocPageComponent {
  protected readonly sections: TocSection[] = [{ id: 'basic', label: 'Basic' }];

  protected readonly items: NwMenuBarItem[] = [
    { label: 'Home', command: () => {} },
    { label: 'Projects', items: [{ label: 'Active' }, { label: 'Archived' }] },
    { label: 'Settings', command: () => {} },
  ];

  protected readonly basicCode = `<nw-menubar [model]="items" />`;

  protected readonly api: ApiRow[] = [
    { name: 'model', type: 'NwMenuBarItem[]', default: '[]', description: 'Top-level nav items — { label, icon, items?, command? }.' },
  ];
}
