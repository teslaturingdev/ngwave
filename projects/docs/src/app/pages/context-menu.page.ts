import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { NwContextMenuComponent, NwContextMenuItem } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-context-menu-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwContextMenuComponent,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Context Menu</h1>
          <p class="mt-2 text-surface-600">
            Right-click-triggered popup menu — wire it to any target's (contextmenu) event.
          </p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="basic" title="Basic" [code]="basicCode">
              <div
                (contextmenu)="menu().show($event)"
                class="flex h-24 w-full items-center justify-center rounded-nw-lg border border-dashed border-surface-300 text-sm text-surface-500"
              >
                Right-click here
              </div>
              <nw-context-menu #menu [model]="items" />
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
export class ContextMenuDocPageComponent {
  protected readonly menu = viewChild.required(NwContextMenuComponent);
  protected readonly sections: TocSection[] = [{ id: 'basic', label: 'Basic' }];

  protected readonly items: NwContextMenuItem[] = [
    { label: 'Copy', icon: 'file-text', command: () => {} },
    { label: 'Rename', icon: 'edit', command: () => {} },
    { separator: true },
    { label: 'Delete', icon: 'trash', command: () => {} },
  ];

  protected readonly basicCode = `<div (contextmenu)="menu.show($event)">Right-click here</div>
<nw-context-menu #menu [model]="items" />`;

  protected readonly api: ApiRow[] = [
    { name: 'model', type: 'NwContextMenuItem[]', default: '[]', description: 'Items — { label, icon, disabled, separator, command }.' },
    { name: 'show(event)', type: 'method', default: '—', description: 'Opens the menu at the mouse event location. Call from (contextmenu).' },
    { name: 'hide()', type: 'method', default: '—', description: 'Closes the menu.' },
  ];
}
