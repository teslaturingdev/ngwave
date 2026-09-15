import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NwTieredMenuComponent, NwTieredMenuItem } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-tiered-menu-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwTieredMenuComponent,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Tiered Menu</h1>
          <p class="mt-2 text-surface-600">
            Vertical nested/cascading menu — submenus fly out to the side on hover.
          </p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="inline" title="Inline" [code]="inlineCode">
              <nw-tiered-menu [model]="items" />
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
export class TieredMenuDocPageComponent {
  protected readonly sections: TocSection[] = [{ id: 'inline', label: 'Inline' }];

  protected readonly items: NwTieredMenuItem[] = [
    { label: 'File', items: [{ label: 'New' }, { label: 'Open' }] },
    { label: 'Edit', items: [{ label: 'Cut' }, { label: 'Copy' }, { label: 'Paste' }] },
    { label: 'Help', command: () => {} },
  ];

  protected readonly inlineCode = `<nw-tiered-menu [model]="items" />`;

  protected readonly api: ApiRow[] = [
    { name: 'model', type: 'NwTieredMenuItem[]', default: '[]', description: 'Items — { label, icon, items?, command? }, nestable.' },
    { name: 'popup', type: 'boolean', default: 'false', description: 'Render as a popup (call toggle($event)) instead of inline.' },
    { name: 'toggle(event)', type: 'method', default: '—', description: 'Toggles popup visibility (popup mode only).' },
  ];
}
