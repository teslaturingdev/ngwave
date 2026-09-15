import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NwOrderListComponent, NwOrderListItemDirective } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-order-list-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwOrderListComponent,
    NwOrderListItemDirective,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Order List</h1>
          <p class="mt-2 text-surface-600">Select an item, then reorder it with up/down/top/bottom buttons.</p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="basic" title="Basic" [code]="basicCode">
              <nw-order-list [(value)]="items" header="Playlist">
                <ng-template nwOrderListItem let-item>
                  <span>{{ item }}</span>
                </ng-template>
              </nw-order-list>
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
export class OrderListDocPageComponent {
  protected items = ['Intro', 'Verse 1', 'Chorus', 'Verse 2', 'Outro'];

  protected readonly sections: TocSection[] = [{ id: 'basic', label: 'Basic' }];

  protected readonly basicCode = `<nw-order-list [(value)]="items" header="Playlist">
  <ng-template nwOrderListItem let-item>
    <span>{{ item }}</span>
  </ng-template>
</nw-order-list>`;

  protected readonly api: ApiRow[] = [
    { name: 'value', type: 'T[]', default: '[]', description: 'Bindable list items (model).' },
    { name: 'header', type: 'string', default: `''`, description: 'List header text.' },
    { name: 'emptyMessage', type: 'string', default: `'No items'`, description: 'Shown when the list is empty.' },
  ];
}
