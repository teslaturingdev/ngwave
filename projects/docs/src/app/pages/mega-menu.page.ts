import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NwMegaMenuComponent, NwMegaMenuItem } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-mega-menu-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwMegaMenuComponent,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Mega Menu</h1>
          <p class="mt-2 text-surface-600">
            Horizontal nav bar with multi-column dropdown panels.
          </p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="basic" title="Basic" [code]="basicCode">
              <nw-mega-menu [model]="items" />
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
export class MegaMenuDocPageComponent {
  protected readonly sections: TocSection[] = [{ id: 'basic', label: 'Basic' }];

  protected readonly items: NwMegaMenuItem[] = [
    { label: 'Home', command: () => {} },
    {
      label: 'Products',
      items: [
        { headerLabel: 'Software', items: [{ label: 'IDE' }, { label: 'Cloud' }] },
        { headerLabel: 'Hardware', items: [{ label: 'Laptops' }, { label: 'Monitors' }] },
      ],
    },
    { label: 'About', command: () => {} },
  ];

  protected readonly basicCode = `<nw-mega-menu [model]="items" />`;

  protected readonly api: ApiRow[] = [
    { name: 'model', type: 'NwMegaMenuItem[]', default: '[]', description: 'Top-level nav items — { label, icon, items?: NwMegaMenuColumn[], command? }.' },
  ];
}
