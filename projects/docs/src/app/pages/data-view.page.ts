import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NwDataViewComponent, NwDataViewItemDirective } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

interface Product {
  name: string;
  price: number;
}

@Component({
  selector: 'docs-data-view-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwDataViewComponent,
    NwDataViewItemDirective,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Data View</h1>
          <p class="mt-2 text-surface-600">
            Renders a collection with a caller-supplied item template, as a list or a grid, with optional paging.
          </p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="list" title="List layout" [code]="listCode">
              <nw-data-view [value]="products" layout="list">
                <ng-template nwDataViewItem let-item>
                  <div class="flex items-center justify-between py-3">
                    <span class="text-surface-900">{{ item.name }}</span>
                    <span class="text-surface-500">\${{ item.price }}</span>
                  </div>
                </ng-template>
              </nw-data-view>
            </docs-demo>

            <docs-demo id="grid" title="Grid layout" [code]="gridCode">
              <nw-data-view [value]="products" layout="grid">
                <ng-template nwDataViewItem let-item>
                  <div class="rounded-nw border border-surface-200 p-4">
                    <div class="text-surface-900">{{ item.name }}</div>
                    <div class="text-surface-500">\${{ item.price }}</div>
                  </div>
                </ng-template>
              </nw-data-view>
            </docs-demo>

            <docs-demo id="paginated" title="Paginated" [code]="paginatedCode">
              <nw-data-view [value]="products" [paginator]="true" [rows]="2">
                <ng-template nwDataViewItem let-item>
                  <div class="flex items-center justify-between py-3">
                    <span class="text-surface-900">{{ item.name }}</span>
                    <span class="text-surface-500">\${{ item.price }}</span>
                  </div>
                </ng-template>
              </nw-data-view>
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
export class DataViewDocPageComponent {
  protected readonly products: Product[] = [
    { name: 'Desk', price: 210 },
    { name: 'Chair', price: 90 },
    { name: 'Lamp', price: 35 },
    { name: 'Monitor', price: 260 },
  ];

  protected readonly sections: TocSection[] = [
    { id: 'list', label: 'List layout' },
    { id: 'grid', label: 'Grid layout' },
    { id: 'paginated', label: 'Paginated' },
  ];

  protected readonly listCode = `<nw-data-view [value]="products" layout="list">
  <ng-template nwDataViewItem let-item>
    <div>{{ item.name }} - \${{ item.price }}</div>
  </ng-template>
</nw-data-view>`;
  protected readonly gridCode = `<nw-data-view [value]="products" layout="grid">
  <ng-template nwDataViewItem let-item>
    <div class="card">{{ item.name }} - \${{ item.price }}</div>
  </ng-template>
</nw-data-view>`;
  protected readonly paginatedCode = `<nw-data-view [value]="products" [paginator]="true" [rows]="2">
  <ng-template nwDataViewItem let-item>
    <div>{{ item.name }}</div>
  </ng-template>
</nw-data-view>`;

  protected readonly api: ApiRow[] = [
    { name: 'value', type: 'readonly T[]', default: '[]', description: 'Items to render.' },
    { name: 'layout', type: `'list' | 'grid'`, default: `'list'`, description: 'Rendering layout.' },
    { name: 'rows', type: 'number', default: '0', description: 'Items per page; 0 disables paging even when paginator is true.' },
    { name: 'paginator', type: 'boolean', default: 'false', description: 'Shows prev/next paging controls.' },
    { name: 'emptyMessage', type: 'string', default: `'No records found.'`, description: 'Shown when value is empty.' },
    { name: 'gridClass', type: 'string', default: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4', description: 'Container classes used in grid layout.' },
    { name: 'listClass', type: 'string', default: 'flex flex-col divide-y divide-surface-200', description: 'Container classes used in list layout.' },
  ];
}
