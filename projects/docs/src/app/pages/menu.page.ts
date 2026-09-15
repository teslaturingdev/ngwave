import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { NwButtonComponent, NwMenuComponent, NwMenuModelItem } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-menu-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwButtonComponent,
    NwMenuComponent,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Menu</h1>
          <p class="mt-2 text-surface-600">
            A popup or inline item menu driven by a [model] array. In popup mode, call
            menu.toggle($event) from a trigger element.
          </p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="popup" title="Popup" [code]="popupCode">
              <nw-button label="Show menu" (click)="menu().toggle($event)" />
              <nw-menu #menu [model]="items" [popup]="true" />
            </docs-demo>

            <docs-demo id="inline" title="Inline" [code]="inlineCode">
              <nw-menu [model]="items" />
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
export class MenuDocPageComponent {
  protected readonly menu = viewChild.required(NwMenuComponent);

  protected readonly sections: TocSection[] = [
    { id: 'popup', label: 'Popup' },
    { id: 'inline', label: 'Inline' },
  ];

  protected readonly items: NwMenuModelItem[] = [
    { label: 'Edit', icon: 'edit', command: () => {} },
    { label: 'Duplicate', icon: 'layers', command: () => {} },
    { separator: true },
    { label: 'Delete', icon: 'trash', command: () => {} },
  ];

  protected readonly popupCode = `<nw-button label="Show menu" (click)="menu.toggle($event)" />
<nw-menu #menu [model]="items" [popup]="true" />`;
  protected readonly inlineCode = `<nw-menu [model]="items" />`;

  protected readonly api: ApiRow[] = [
    { name: 'model', type: 'NwMenuModelItem[]', default: '[]', description: 'Menu items — { label, icon, disabled, separator, command }.' },
    { name: 'popup', type: 'boolean', default: 'false', description: 'Render as a popup (call toggle($event) to show) instead of inline.' },
    { name: 'toggle(event)', type: 'method', default: '—', description: 'Toggles popup visibility from a trigger event (popup mode only).' },
    { name: 'show(event) / hide()', type: 'method', default: '—', description: 'Explicit open/close (popup mode only).' },
  ];
}
