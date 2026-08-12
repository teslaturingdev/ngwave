import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  NwButtonComponent,
  NwColumn,
  NwColumnTemplateDirective,
  NwContextMenuSelectEvent,
  NwDataTableComponent,
  NwMenuItem,
  NwRowExpansionDirective,
  NwTableLazyLoadEvent,
  NwTableRow,
} from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

interface Product extends NwTableRow {
  code: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  sku: string;
}

@Component({
  selector: 'docs-data-table-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwDataTableComponent,
    NwColumnTemplateDirective,
    NwRowExpansionDirective,
    NwButtonComponent,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
      <header class="mb-6">
        <h1 class="text-3xl font-bold text-surface-900">DataTable</h1>
        <p class="mt-2 text-surface-600">
          A full-featured, signals-powered table: single &amp; multi-column
          sorting, global and per-column filtering with match modes, a rich
          paginator, row selection, expandable rows, custom cell templates, CSV
          export, and server-side lazy loading.
        </p>
      </header>

      <docs-tabs>
        <div doc class="space-y-8">
          <docs-demo id="sorting" title="Sorting (shift-click for multi-sort)" [code]="sortCode">
            <nw-data-table
              [data]="products"
              [columns]="columns"
              [multiSort]="true"
            />
          </docs-demo>

          <docs-demo id="templates" title="Custom cell templates" [code]="templateCode">
            <nw-data-table [data]="products" [columns]="columns">
              <ng-template nwColumn="price" let-row>
                <span class="font-medium text-surface-900"
                  >\${{ $any(row).price }}</span
                >
              </ng-template>
              <ng-template nwColumn="category" let-row>
                <span
                  class="text-xs px-2 py-0.5 rounded-full bg-nw-100 text-nw-700"
                  >{{ $any(row).category }}</span
                >
              </ng-template>
              <ng-template nwColumn="stock" let-row>
                <span
                  [class]="
                    $any(row).stock > 20 ? 'text-green-600' : 'text-amber-600'
                  "
                  >{{ $any(row).stock }} in stock</span
                >
              </ng-template>
            </nw-data-table>
          </docs-demo>

          <docs-demo
            id="filtering"
            title="Filtering — global + per-column match modes"
            [code]="filterCode"
          >
            <nw-data-table
              [data]="products"
              [columns]="filterColumns"
              [searchFields]="searchAll"
            />
          </docs-demo>

          <docs-demo id="paginator" title="Rich paginator" [code]="pagedCode">
            <nw-data-table
              [data]="products"
              [columns]="columns"
              [paginator]="true"
              [pageSize]="5"
              [pageSizeOptions]="[5, 10, 20]"
            />
          </docs-demo>

          <docs-demo id="selection" title="Selection + CSV export" [code]="selectionCode">
            <div class="w-full">
              <div class="mb-3">
                <nw-button size="small" variant="outlined" (click)="dt.exportCSV()"
                  >Export CSV</nw-button
                >
              </div>
              <nw-data-table
                #dt
                [data]="products"
                [columns]="columns"
                rowKey="code"
                [selectable]="true"
                [selectedRows]="selected()"
                (selectedRowsChange)="selected.set($event)"
              />
              <p class="mt-3 text-sm text-surface-600">
                {{ selected().length }} selected.
              </p>
            </div>
          </docs-demo>

          <docs-demo id="expansion" title="Expandable rows" [code]="expandCode">
            <nw-data-table
              [data]="products"
              [columns]="columns"
              rowKey="code"
            >
              <ng-template nwRowExpansion let-row>
                <div class="text-sm text-surface-700">
                  <strong>{{ $any(row).name }}</strong> ({{ $any(row).code }}) —
                  {{ $any(row).stock }} units in stock at
                  \${{ $any(row).price }} each.
                </div>
              </ng-template>
            </nw-data-table>
          </docs-demo>

          <docs-demo
            id="lazy"
            title="Lazy loading (simulated server)"
            [code]="lazyCode"
          >
            <nw-data-table
              [data]="lazyRows()"
              [columns]="columns"
              [lazy]="true"
              [paginator]="true"
              [pageSize]="10"
              [totalRecords]="lazyTotal()"
              [loading]="lazyLoading()"
              [searchFields]="searchAll"
              (lazyLoad)="onLazyLoad($event)"
            />
          </docs-demo>

          <docs-demo
            id="resize-reorder"
            title="Resizable & reorderable columns (drag headers / drag the right edge)"
            [code]="resizeCode"
          >
            <nw-data-table
              [data]="products"
              [columns]="columns"
              [resizableColumns]="true"
              [reorderableColumns]="true"
            />
          </docs-demo>

          <docs-demo id="frozen" title="Frozen columns (scroll horizontally)" [code]="frozenCode">
            <nw-data-table
              [data]="products"
              [columns]="frozenCols"
              [frozenColumns]="2"
              [resizableColumns]="true"
            />
          </docs-demo>

          <docs-demo
            id="editing"
            title="Inline cell editing (click a Name / Price / Stock cell)"
            [code]="editCode"
          >
            <nw-data-table
              [data]="products"
              [columns]="editColumns"
              rowKey="code"
            />
          </docs-demo>

          <docs-demo
            id="responsive"
            title="Responsive layout (narrow the window to stack)"
            [code]="responsiveCode"
          >
            <nw-data-table
              [data]="products"
              [columns]="columns"
              responsiveLayout="stack"
            />
          </docs-demo>

          <docs-demo
            id="state"
            title="State persistence (sort/reorder/resize survive reload)"
            [code]="stateCode"
          >
            <nw-data-table
              [data]="products"
              [columns]="columns"
              [resizableColumns]="true"
              [reorderableColumns]="true"
              [paginator]="true"
              [pageSize]="5"
              stateKey="ngwave-products-demo"
            />
          </docs-demo>

          <docs-demo id="grouping" title="Row grouping" [code]="groupCode">
            <nw-data-table
              [data]="products"
              [columns]="columns"
              groupBy="category"
            />
          </docs-demo>

          <docs-demo id="row-reorder" title="Row reorder (drag the ⠿ handle)" [code]="rowReorderCode">
            <nw-data-table
              [data]="products"
              [columns]="columns"
              rowKey="code"
              [reorderableRows]="true"
            />
          </docs-demo>

          <docs-demo
            id="virtual"
            title="Virtual scroll (200 rows, only visible ones rendered)"
            [code]="virtualCode"
          >
            <nw-data-table
              [data]="virtualData"
              [columns]="columns"
              rowKey="code"
              [virtualScroll]="true"
              [scrollHeight]="320"
              [rowHeight]="41"
            />
          </docs-demo>

          <docs-demo id="context" title="Context menu (right-click a row)" [code]="contextCode">
            <div class="w-full">
              <nw-data-table
                [data]="products"
                [columns]="columns"
                rowKey="code"
                [contextMenuItems]="menuItems"
                (contextMenuSelect)="onContextSelect($event)"
              />
              <p class="mt-3 text-sm text-surface-600">{{ lastAction() }}</p>
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
export class DataTablePageComponent {
  protected readonly sections: TocSection[] = [
    { id: 'sorting', label: 'Sorting' },
    { id: 'templates', label: 'Cell Templates' },
    { id: 'filtering', label: 'Filtering' },
    { id: 'paginator', label: 'Paginator' },
    { id: 'selection', label: 'Selection & Export' },
    { id: 'expansion', label: 'Expandable Rows' },
    { id: 'lazy', label: 'Lazy Loading' },
    { id: 'resize-reorder', label: 'Resize & Reorder' },
    { id: 'frozen', label: 'Frozen Columns' },
    { id: 'editing', label: 'Cell Editing' },
    { id: 'responsive', label: 'Responsive' },
    { id: 'state', label: 'State Persistence' },
    { id: 'grouping', label: 'Row Grouping' },
    { id: 'row-reorder', label: 'Row Reorder' },
    { id: 'virtual', label: 'Virtual Scroll' },
    { id: 'context', label: 'Context Menu' },
  ];

  protected readonly products: Product[] = [
    { code: 'NW-100', name: 'Wave Router', category: 'Network', price: 149, stock: 32, rating: 5, sku: 'WR-A1' },
    { code: 'NW-101', name: 'Signal Hub', category: 'Network', price: 89, stock: 12, rating: 4, sku: 'SH-B2' },
    { code: 'NW-200', name: 'Token Kit', category: 'Design', price: 39, stock: 54, rating: 5, sku: 'TK-C3' },
    { code: 'NW-201', name: 'Theme Pack', category: 'Design', price: 19, stock: 8, rating: 3, sku: 'TP-D4' },
    { code: 'NW-300', name: 'Table Pro', category: 'Data', price: 59, stock: 27, rating: 4, sku: 'TB-E5' },
    { code: 'NW-301', name: 'Grid Engine', category: 'Data', price: 129, stock: 5, rating: 5, sku: 'GE-F6' },
    { code: 'NW-400', name: 'Form Suite', category: 'Forms', price: 49, stock: 41, rating: 4, sku: 'FS-G7' },
    { code: 'NW-401', name: 'Mask Input', category: 'Forms', price: 15, stock: 19, rating: 3, sku: 'MI-H8' },
  ];

  protected readonly columns: NwColumn<Product>[] = [
    { field: 'code', header: 'Code', sortable: true },
    { field: 'name', header: 'Name', sortable: true },
    { field: 'category', header: 'Category', sortable: true },
    { field: 'price', header: 'Price', sortable: true },
    { field: 'stock', header: 'Stock', sortable: true },
    { field: 'rating', header: 'Rating', sortable: true },
    { field: 'sku', header: 'SKU', sortable: true },
  ];

  protected readonly frozenCols: NwColumn<Product>[] = [
    { field: 'code', header: 'Code', sortable: true, width: 160 },
    { field: 'name', header: 'Name', sortable: true, width: 200 },
    { field: 'category', header: 'Category', sortable: true, width: 160 },
    { field: 'price', header: 'Price', sortable: true, width: 140 },
    { field: 'stock', header: 'Stock', sortable: true, width: 140 },
    { field: 'rating', header: 'Rating', sortable: true, width: 140 },
    { field: 'sku', header: 'SKU', sortable: true, width: 160 },
  ];

  protected readonly editColumns: NwColumn<Product>[] = [
    { field: 'code', header: 'Code' },
    { field: 'name', header: 'Name', editable: true },
    { field: 'category', header: 'Category', editable: true },
    { field: 'price', header: 'Price', editable: true, filterType: 'numeric' },
    { field: 'stock', header: 'Stock', editable: true, filterType: 'numeric' },
  ];

  protected readonly filterColumns: NwColumn<Product>[] = [
    { field: 'code', header: 'Code', sortable: true, filter: true },
    { field: 'name', header: 'Name', sortable: true, filter: true },
    { field: 'category', header: 'Category', sortable: true, filter: true },
    {
      field: 'price',
      header: 'Price',
      sortable: true,
      filter: true,
      filterType: 'numeric',
    },
    {
      field: 'stock',
      header: 'Stock',
      sortable: true,
      filter: true,
      filterType: 'numeric',
    },
  ];

  protected readonly selected = signal<Product[]>([]);
  protected readonly searchAll = ['code', 'name', 'category', 'sku'];

  // Virtual scroll dataset.
  protected readonly virtualData: Product[] = Array.from(
    { length: 200 },
    (_, i) => ({
      code: `NW-${900 + i}`,
      name: `Widget ${i + 1}`,
      category: ['Network', 'Design', 'Data', 'Forms'][i % 4],
      price: 10 + ((i * 7) % 190),
      stock: (i * 13) % 60,
      rating: (i % 5) + 1,
      sku: `SKU-${9000 + i}`,
    }),
  );

  protected readonly menuItems: NwMenuItem[] = [
    { label: 'View details', value: 'view' },
    { label: 'Duplicate', value: 'duplicate' },
    { label: 'Delete', value: 'delete' },
  ];
  protected readonly lastAction = signal('Right-click a row.');

  protected onContextSelect(event: NwContextMenuSelectEvent<Product>): void {
    this.lastAction.set(`${event.item.label} → ${event.row.name}`);
  }

  // Lazy-loading simulation over a larger dataset.
  private readonly allProducts: Product[] = Array.from(
    { length: 45 },
    (_, i) => ({
      code: `NW-${500 + i}`,
      name: `Component ${i + 1}`,
      category: ['Network', 'Design', 'Data', 'Forms'][i % 4],
      price: 10 + ((i * 7) % 190),
      stock: (i * 13) % 60,
      rating: (i % 5) + 1,
      sku: `SKU-${1000 + i}`,
    }),
  );
  protected readonly lazyRows = signal<Product[]>([]);
  protected readonly lazyTotal = signal(0);
  protected readonly lazyLoading = signal(false);

  protected onLazyLoad(event: NwTableLazyLoadEvent): void {
    this.lazyLoading.set(true);
    setTimeout(() => {
      let data = [...this.allProducts];
      const q = event.globalFilter.trim().toLowerCase();
      if (q) {
        data = data.filter((p) =>
          Object.values(p).some((v) =>
            String(v).toLowerCase().includes(q),
          ),
        );
      }
      const sort = event.multiSortMeta[0];
      if (sort) {
        data.sort((a, b) => {
          const av = a[sort.field as keyof Product];
          const bv = b[sort.field as keyof Product];
          const cmp =
            typeof av === 'number' && typeof bv === 'number'
              ? av - bv
              : String(av).localeCompare(String(bv));
          return cmp * sort.order;
        });
      }
      this.lazyTotal.set(data.length);
      this.lazyRows.set(data.slice(event.first, event.first + event.rows));
      this.lazyLoading.set(false);
    }, 400);
  }

  protected readonly sortCode = `<nw-data-table [data]="products" [columns]="columns" [multiSort]="true" />`;

  protected readonly templateCode = `<nw-data-table [data]="products" [columns]="columns">
  <ng-template nwColumn="price" let-row>\${{ row.price }}</ng-template>
  <ng-template nwColumn="category" let-row>
    <span class="badge">{{ row.category }}</span>
  </ng-template>
</nw-data-table>`;

  protected readonly filterCode = `<nw-data-table
  [data]="products"
  [columns]="filterColumns"
  [searchFields]="searchAll"
/>
// filterColumns: { field, header, filter: true, filterType?: 'numeric' }`;

  protected readonly pagedCode = `<nw-data-table
  [data]="products"
  [columns]="columns"
  [paginator]="true"
  [pageSize]="5"
  [pageSizeOptions]="[5, 10, 20]"
/>`;

  protected readonly selectionCode = `<nw-button (click)="dt.exportCSV()">Export CSV</nw-button>
<nw-data-table
  #dt
  [data]="products"
  [columns]="columns"
  rowKey="code"
  [selectable]="true"
  [(selectedRows)]="selected"
/>`;

  protected readonly expandCode = `<nw-data-table [data]="products" [columns]="columns" rowKey="code">
  <ng-template nwRowExpansion let-row>
    <div>{{ row.name }} — {{ row.stock }} in stock</div>
  </ng-template>
</nw-data-table>`;

  protected readonly lazyCode = `<nw-data-table
  [data]="lazyRows()"
  [columns]="columns"
  [lazy]="true"
  [paginator]="true"
  [pageSize]="10"
  [totalRecords]="lazyTotal()"
  [loading]="lazyLoading()"
  [searchFields]="searchAll"
  (lazyLoad)="onLazyLoad($event)"
/>`;

  protected readonly resizeCode = `<nw-data-table
  [data]="products"
  [columns]="columns"
  [resizableColumns]="true"
  [reorderableColumns]="true"
/>`;

  protected readonly frozenCode = `<nw-data-table
  [data]="products"
  [columns]="columns"
  [frozenColumns]="2"
  [resizableColumns]="true"
/>`;

  protected readonly editCode = `<nw-data-table [data]="products" [columns]="editColumns" rowKey="code" />
// editColumns: { field, header, editable: true, filterType?: 'numeric' }
// (nw-data-table emits (cellEdit)="onEdit($event)")`;

  protected readonly responsiveCode = `<nw-data-table [data]="products" [columns]="columns" responsiveLayout="stack" />`;

  protected readonly stateCode = `<nw-data-table
  [data]="products"
  [columns]="columns"
  [resizableColumns]="true"
  [reorderableColumns]="true"
  [paginator]="true"
  stateKey="ngwave-products-demo"
/>`;

  protected readonly groupCode = `<nw-data-table [data]="products" [columns]="columns" groupBy="category" />`;

  protected readonly rowReorderCode = `<nw-data-table
  [data]="products"
  [columns]="columns"
  rowKey="code"
  [reorderableRows]="true"
  (rowReorder)="onReorder($event)"
/>`;

  protected readonly virtualCode = `<nw-data-table
  [data]="virtualData"
  [columns]="columns"
  rowKey="code"
  [virtualScroll]="true"
  [scrollHeight]="320"
  [rowHeight]="41"
/>`;

  protected readonly contextCode = `<nw-data-table
  [data]="products"
  [columns]="columns"
  [contextMenuItems]="menuItems"
  (contextMenuSelect)="onContextSelect($event)"
/>
// menuItems: NwMenuItem[] = [{ label: 'View details' }, { label: 'Delete' }]`;

  protected readonly api: ApiRow[] = [
    { name: 'data', type: 'T[]', default: '[]', description: 'Row data (current page when lazy).' },
    { name: 'columns', type: 'NwColumn<T>[]', default: '[]', description: 'Column defs: field, header, sortable, filter, filterType.' },
    { name: 'rowKey', type: 'string', default: `''`, description: 'Unique row property for selection/expansion tracking (needed for lazy).' },
    { name: 'sortMode', type: `'single' | 'multiple'`, default: `'single'`, description: 'Multiple enables shift-click multi-column sort.' },
    { name: 'filter', type: 'boolean', default: 'false', description: 'Shows the global search box.' },
    { name: 'paginator', type: 'boolean', default: 'false', description: 'Enables the paginator.' },
    { name: 'pageSize', type: 'number', default: '10', description: 'Rows per page.' },
    { name: 'pageSizeOptions', type: 'number[]', default: '[]', description: 'Adds a rows-per-page selector.' },
    { name: 'selectable', type: 'boolean', default: 'false', description: 'Adds selection checkboxes/radios.' },
    { name: 'selectionMode', type: `'single' | 'multiple'`, default: `'multiple'`, description: 'Single- or multi-row selection.' },
    { name: 'selectedRows', type: 'T[]', default: '[]', description: 'Two-way bound selected rows.' },
    { name: 'expandable', type: 'boolean', default: 'false', description: 'Enables expandable rows (use *nwRowExpansion template).' },
    { name: 'lazy', type: 'boolean', default: 'false', description: 'Server-side mode; emits lazyLoad instead of processing client-side.' },
    { name: 'totalRecords', type: 'number', default: '0', description: 'Total row count for the paginator when lazy.' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Shows a loading overlay.' },
    { name: 'lazyLoad', type: 'EventEmitter<NwTableLazyLoadEvent>', default: '—', description: 'Fires with { first, rows, sort, filters, globalFilter }.' },
    { name: 'resizableColumns', type: 'boolean', default: 'false', description: 'Drag column edges to resize.' },
    { name: 'reorderableColumns', type: 'boolean', default: 'false', description: 'Drag column headers to reorder.' },
    { name: 'frozenColumns', type: 'number', default: '0', description: 'Number of leading columns pinned (sticky) while scrolling.' },
    { name: 'responsiveLayout', type: `'scroll' | 'stack'`, default: `'scroll'`, description: `'stack' collapses rows into labelled blocks on small screens.` },
    { name: 'stateKey', type: 'string', default: `''`, description: 'Persists sort/filter/page/column order+widths to localStorage.' },
    { name: 'cellEdit', type: 'EventEmitter<NwCellEditEvent<T>>', default: '—', description: 'Fires with { row, field, value } after an inline edit.' },
    { name: 'reorderableRows', type: 'boolean', default: 'false', description: 'Drag rows (⠿ handle) to reorder; emits rowReorder.' },
    { name: 'groupBy', type: 'string', default: `''`, description: 'Groups rows by a field with subheader rows + counts.' },
    { name: 'virtualScroll', type: 'boolean', default: 'false', description: 'Renders only visible rows for large datasets.' },
    { name: 'rowHeight', type: 'number', default: '40', description: 'Row height (px) used by virtual scroll.' },
    { name: 'scrollHeight', type: 'number', default: '400', description: 'Viewport height (px) when virtual scrolling.' },
    { name: 'contextMenuItems', type: 'NwMenuItem[]', default: '[]', description: 'Right-click menu items; selection emits contextMenuSelect.' },
    { name: 'rowReorder', type: 'EventEmitter<NwRowReorderEvent>', default: '—', description: 'Fires with { dragIndex, dropIndex }.' },
    { name: 'contextMenuSelect', type: 'EventEmitter<NwContextMenuSelectEvent<T>>', default: '—', description: 'Fires with { item, row } from the context menu.' },
    { name: 'nwColumn', type: 'directive', default: '—', description: 'Template directive for a custom cell: <ng-template nwColumn="field" let-row>.' },
    { name: 'nwRowExpansion', type: 'directive', default: '—', description: 'Template directive for expanded-row content.' },
    { name: 'column.editable', type: 'boolean', default: 'false', description: 'Per-column flag enabling inline cell editing.' },
    { name: 'exportCSV()', type: 'method', default: '—', description: 'Downloads the current (filtered/sorted) rows as CSV.' },
  ];
}
