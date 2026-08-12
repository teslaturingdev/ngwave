import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  computed,
  contentChildren,
  effect,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import {
  NwColumnTemplateDirective,
  NwRowExpansionDirective,
} from './column-template.directive';
import {
  NW_MATCH_MODE_LABELS,
  NW_NUMERIC_MATCH_MODES,
  NW_TEXT_MATCH_MODES,
  NwCellEditEvent,
  NwColumn,
  NwColumnReorderEvent,
  NwContextMenuSelectEvent,
  NwFilterMeta,
  NwMatchMode,
  NwMenuItem,
  NwPageChangeEvent,
  NwResponsiveLayout,
  NwRowReorderEvent,
  NwSelectionMode,
  NwSortMeta,
  NwSortOrder,
  NwTableLazyLoadEvent,
  NwTableRow,
  NwTableState,
} from './data-table.types';

type RenderItem<T> =
  | { type: 'group'; value: unknown; count: number }
  | { type: 'row'; row: T; index: number };

const DEFAULT_COL_WIDTH = 160;
const GUTTER_WIDTH = 40;

@Component({
  selector: 'nw-data-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  styles: `
    :host {
      display: block;
      width: 100%;
    }
    table.nw-gridlines th,
    table.nw-gridlines td {
      border: 1px solid rgb(var(--surface-200));
    }
    table.nw-striped tbody tr:nth-child(even) {
      background: rgb(var(--surface-50));
    }
    @media (max-width: 640px) {
      table.nw-stack colgroup,
      table.nw-stack thead {
        display: none;
      }
      table.nw-stack tr {
        display: block;
        border-top: 1px solid rgb(var(--surface-200));
      }
      table.nw-stack td {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        border: 0;
        text-align: right;
      }
      table.nw-stack td::before {
        content: attr(data-label);
        font-weight: 600;
        color: rgb(var(--surface-500));
        text-align: left;
      }
    }
  `,
  template: `
    @if (searchFields().length) {
      <div class="mb-3">
        <input
          type="search"
          [value]="globalFilter()"
          (input)="onGlobalFilter($event)"
          placeholder="Search…"
          aria-label="Search table"
          class="w-full sm:w-64 h-9 px-3 rounded-nw border border-surface-300 bg-surface-0 text-surface-900 placeholder:text-surface-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nw-500"
        />
      </div>
    }

    @if (paginator() && showTopPaginator()) {
      <div class="mb-3">
        <ng-container [ngTemplateOutlet]="pager" />
      </div>
    }

    <div
      class="relative overflow-x-auto rounded-nw-lg border border-surface-200 shadow-nw-sm"
      [style.height.px]="scrolls() ? scrollHeightPx() : null"
      [style.overflow-y]="scrolls() ? 'auto' : null"
      (scroll)="onScroll($event)"
    >
      @if (loading()) {
        <div
          class="absolute inset-0 z-30 flex items-center justify-center bg-surface-0/60 backdrop-blur-[1px]"
        >
          <svg
            class="animate-spin h-6 w-6 text-nw-600"
            viewBox="0 0 24 24"
            fill="none"
            aria-label="Loading"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-90"
              fill="currentColor"
              d="M4 12a8 8 0 0 1 8-8V0C5.4 0 0 5.4 0 12h4z"
            ></path>
          </svg>
        </div>
      }

      <table [class]="tableClass()" [style.width.px]="tableWidthPx()">
        <colgroup>
          @if (reorderableRows()) {
            <col style="width: 2.5rem" />
          }
          @if (hasExpansion()) {
            <col style="width: 2.5rem" />
          }
          @if (selectable()) {
            <col style="width: 2.5rem" />
          }
          @for (col of orderedColumns(); track col.field) {
            <col [style.width.px]="colWidthStyle(col.field)" />
          }
        </colgroup>
        <thead
          class="bg-surface-50 text-surface-500 text-xs uppercase tracking-wide font-semibold"
          [class.sticky]="virtualScroll() || scrollable()"
          [class.top-0]="virtualScroll() || scrollable()"
          [class.z-20]="virtualScroll() || scrollable()"
        >
          <tr>
            @if (reorderableRows()) {
              <th class="w-10 px-3 py-2"></th>
            }
            @if (hasExpansion()) {
              <th
                class="w-10 px-3 py-2"
                [class.sticky]="frozenColumns() > 0"
                [class.z-10]="frozenColumns() > 0"
                [class.bg-surface-50]="frozenColumns() > 0"
                [style.left.px]="frozenColumns() > 0 ? 0 : null"
              ></th>
            }
            @if (selectable()) {
              <th
                class="w-10 px-3 py-2"
                [class.sticky]="frozenColumns() > 0"
                [class.z-10]="frozenColumns() > 0"
                [class.bg-surface-50]="frozenColumns() > 0"
                [style.left.px]="frozenColumns() > 0 ? selectGutterLeft() : null"
              >
                @if (selectionMode() === 'multiple') {
                  <input
                    type="checkbox"
                    class="h-4 w-4 accent-nw-600 align-middle"
                    [checked]="allSelected()"
                    [indeterminate]="someSelected()"
                    (change)="toggleAll()"
                    aria-label="Select all rows"
                  />
                }
              </th>
            }
            @for (col of orderedColumns(); track col.field) {
              <th
                class="relative px-3 py-2 font-medium whitespace-nowrap"
                [class.sticky]="isFrozen(col.field)"
                [class.z-10]="isFrozen(col.field)"
                [class.bg-surface-50]="isFrozen(col.field)"
                [style.left.px]="frozenLeft(col.field)"
                [attr.aria-sort]="ariaSort(col)"
                [attr.draggable]="reorderableColumns() ? true : null"
                (dragstart)="onColDragStart(col)"
                (dragover)="onColDragOver($event)"
                (drop)="onColDrop(col)"
              >
                <div class="flex items-center gap-1">
                  @if (col.sortable) {
                    <button
                      type="button"
                      (click)="toggleSort(col, $event)"
                      class="inline-flex items-center gap-1 hover:text-surface-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nw-500 rounded-nw px-1 -mx-1"
                    >
                      {{ col.header }}
                      <span class="text-surface-400 w-3 inline-block text-center">
                        {{ sortIcon(col) }}
                      </span>
                      @if (sortPriority(col); as p) {
                        <span
                          class="text-[10px] leading-none px-1 rounded-full bg-nw-100 text-nw-700"
                          >{{ p }}</span
                        >
                      }
                    </button>
                  } @else {
                    <span>{{ col.header }}</span>
                  }

                  @if (col.filter) {
                    <button
                      type="button"
                      (click)="toggleFilterMenu(col)"
                      [attr.aria-label]="'Filter ' + col.header"
                      class="ml-auto p-1 rounded-nw hover:bg-surface-200"
                      [class.text-nw-600]="hasFilter(col)"
                      [class.text-surface-400]="!hasFilter(col)"
                    >
                      <svg
                        class="h-3.5 w-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        aria-hidden="true"
                      >
                        <path d="M3 5h18l-7 8v5l-4 2v-7z" />
                      </svg>
                    </button>
                  }
                </div>

                @if (resizableColumns()) {
                  <span
                    draggable="false"
                    (pointerdown)="startResize(col, $event)"
                    (dragstart)="$event.preventDefault()"
                    class="absolute top-0 right-0 h-full w-1.5 cursor-col-resize hover:bg-nw-400"
                  ></span>
                }

                @if (openFilterField() === col.field) {
                  <div
                    class="absolute z-20 mt-1 left-0 w-56 p-3 rounded-nw border border-surface-200 bg-surface-0 shadow-nw text-surface-900 font-normal whitespace-normal"
                  >
                    <select
                      [value]="filterMatchMode(col)"
                      (change)="onMatchModeChange(col, $event)"
                      class="block w-full h-8 mb-2 px-2 rounded-nw border border-surface-300 bg-surface-0 text-sm"
                    >
                      @for (m of matchModes(col); track m) {
                        <option [value]="m">{{ matchModeLabel(m) }}</option>
                      }
                    </select>
                    <input
                      [type]="col.filterType === 'numeric' ? 'number' : 'text'"
                      [value]="filterValue(col)"
                      (input)="onColumnFilter(col, $event)"
                      placeholder="Value"
                      class="block w-full h-8 px-2 rounded-nw border border-surface-300 bg-surface-0 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nw-500"
                    />
                    <div class="mt-2 flex justify-between">
                      <button
                        type="button"
                        (click)="clearColumnFilter(col)"
                        class="text-xs text-surface-600 hover:text-surface-900"
                      >
                        Clear
                      </button>
                      <button
                        type="button"
                        (click)="closeFilterMenu()"
                        class="text-xs text-nw-600 hover:text-nw-700"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                }
              </th>
            }
          </tr>
        </thead>
        <tbody>
          @if (virtualScroll() && virtualRange().start > 0) {
            <tr aria-hidden="true">
              <td
                [attr.colspan]="colspan()"
                class="p-0"
                [style.height.px]="virtualRange().start * rowHeight()"
              ></td>
            </tr>
          }
          @for (item of renderItems(); track itemKey(item)) {
            @if (item.type === 'group') {
              <tr class="bg-surface-100 border-t border-surface-200">
                <td
                  [attr.colspan]="colspan()"
                  class="px-3 py-2 font-semibold text-surface-700"
                >
                  {{ groupByHeader() }}: {{ item.value }}
                  <span class="ml-2 text-xs font-normal text-surface-500"
                    >({{ item.count }})</span
                  >
                </td>
              </tr>
            } @else {
              <tr
                class="border-t border-surface-200 transition-colors"
                [class.hover:bg-surface-50]="rowHover()"
                [class.bg-nw-50]="isSelected(item.row)"
                [style.height.px]="virtualScroll() ? rowHeight() : null"
                [attr.draggable]="reorderableRows() ? true : null"
                (dragstart)="onRowDragStart(item.index)"
                (dragover)="onRowDragOver($event)"
                (drop)="onRowDrop(item.index)"
                (contextmenu)="onContextMenu(item.row, $event)"
              >
                @if (reorderableRows()) {
                  <td
                    class="px-3 py-2 text-surface-400 cursor-move select-none"
                    aria-label="Drag to reorder"
                  >
                    ⠿
                  </td>
                }
                @if (hasExpansion()) {
                  <td
                    class="px-3 py-2"
                    [class.sticky]="frozenColumns() > 0"
                    [class.z-10]="frozenColumns() > 0"
                    [class.bg-surface-0]="frozenColumns() > 0"
                    [style.left.px]="frozenColumns() > 0 ? 0 : null"
                  >
                    <button
                      type="button"
                      (click)="toggleExpand(item.row)"
                      class="h-6 w-6 rounded-nw hover:bg-surface-200 text-surface-500"
                      [attr.aria-expanded]="isExpanded(item.row)"
                      aria-label="Toggle row"
                    >
                      {{ isExpanded(item.row) ? '▾' : '▸' }}
                    </button>
                  </td>
                }
                @if (selectable()) {
                  <td
                    class="px-3 py-2"
                    [class.sticky]="frozenColumns() > 0"
                    [class.z-10]="frozenColumns() > 0"
                    [class.bg-surface-0]="frozenColumns() > 0"
                    [style.left.px]="
                      frozenColumns() > 0 ? selectGutterLeft() : null
                    "
                  >
                    <input
                      [type]="selectionMode() === 'single' ? 'radio' : 'checkbox'"
                      class="h-4 w-4 accent-nw-600 align-middle"
                      [checked]="isSelected(item.row)"
                      (change)="toggleRow(item.row)"
                      aria-label="Select row"
                    />
                  </td>
                }
                @for (col of orderedColumns(); track col.field) {
                  <td
                    class="px-3 py-2 text-surface-800 whitespace-nowrap"
                    [class.sticky]="isFrozen(col.field)"
                    [class.z-10]="isFrozen(col.field)"
                    [class.bg-surface-0]="isFrozen(col.field)"
                    [class.cursor-text]="col.editable"
                    [style.left.px]="frozenLeft(col.field)"
                    [attr.data-label]="col.header"
                    (click)="startEdit(item.row, col)"
                  >
                    @if (isEditing(item.row, col)) {
                      <input
                        class="nw-edit-input w-full h-7 px-1 rounded border border-nw-500 bg-surface-0 text-surface-900 focus:outline-none"
                        [type]="col.filterType === 'numeric' ? 'number' : 'text'"
                        [value]="display(item.row, col)"
                        (click)="$event.stopPropagation()"
                        (keydown.enter)="commitEdit(item.row, col, $event)"
                        (keydown.escape)="cancelEdit()"
                        (blur)="commitEdit(item.row, col, $event)"
                      />
                    } @else if (cellTemplate(col.field); as tpl) {
                      <ng-container
                        [ngTemplateOutlet]="tpl"
                        [ngTemplateOutletContext]="{
                          $implicit: item.row,
                          value: editedValue(item.row, col),
                          column: col.field,
                        }"
                      />
                    } @else {
                      {{ display(item.row, col) }}
                    }
                  </td>
                }
              </tr>
              @if (hasExpansion() && isExpanded(item.row) && expansionTemplate()) {
                <tr class="border-t border-surface-200 bg-surface-50">
                  <td [attr.colspan]="colspan()" class="px-3 py-3">
                    <ng-container
                      [ngTemplateOutlet]="expansionTemplate()!"
                      [ngTemplateOutletContext]="{ $implicit: item.row }"
                    />
                  </td>
                </tr>
              }
            }
          } @empty {
            <tr>
              <td
                [attr.colspan]="colspan()"
                class="px-3 py-8 text-center text-surface-500"
              >
                {{ emptyMessage() }}
              </td>
            </tr>
          }
          @if (virtualScroll() && virtualRange().end < virtualRange().total) {
            <tr aria-hidden="true">
              <td
                [attr.colspan]="colspan()"
                class="p-0"
                [style.height.px]="
                  (virtualRange().total - virtualRange().end) * rowHeight()
                "
              ></td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    @if (paginator() && showBottomPaginator()) {
      <div class="mt-3">
        <ng-container [ngTemplateOutlet]="pager" />
      </div>
    }

    <ng-template #pager>
      <div
        class="flex flex-wrap items-center justify-between gap-3 text-sm text-surface-600"
      >
        <div class="flex items-center gap-3">
          <span>{{ rangeLabel() }}</span>
          @if (pageSizeOptions().length) {
            <label class="flex items-center gap-1">
              <span class="text-surface-500">Rows:</span>
              <select
                [value]="rows()"
                (change)="onRowsChange($event)"
                class="h-8 px-2 rounded-nw border border-surface-300 bg-surface-0"
              >
                @for (opt of pageSizeOptions(); track opt) {
                  <option [value]="opt">{{ opt }}</option>
                }
              </select>
            </label>
          }
        </div>
        <div class="flex items-center gap-1">
          <button
            type="button"
            (click)="firstPage()"
            [disabled]="currentPage() === 0"
            class="h-8 px-2 rounded-nw border border-surface-300 hover:bg-surface-100 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="First page"
          >
            «
          </button>
          <button
            type="button"
            (click)="prevPage()"
            [disabled]="currentPage() === 0"
            class="h-8 px-2 rounded-nw border border-surface-300 hover:bg-surface-100 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            ‹
          </button>
          @for (p of pageLinks(); track p) {
            <button
              type="button"
              (click)="goToPage(p)"
              class="h-8 min-w-8 px-2 rounded-nw border"
              [class.border-nw-600]="p === currentPage()"
              [class.bg-nw-600]="p === currentPage()"
              [class.text-white]="p === currentPage()"
              [class.border-surface-300]="p !== currentPage()"
              [class.hover:bg-surface-100]="p !== currentPage()"
            >
              {{ p + 1 }}
            </button>
          }
          <button
            type="button"
            (click)="nextPage()"
            [disabled]="currentPage() >= totalPages() - 1"
            class="h-8 px-2 rounded-nw border border-surface-300 hover:bg-surface-100 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            ›
          </button>
          <button
            type="button"
            (click)="lastPage()"
            [disabled]="currentPage() >= totalPages() - 1"
            class="h-8 px-2 rounded-nw border border-surface-300 hover:bg-surface-100 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Last page"
          >
            »
          </button>
        </div>
      </div>
    </ng-template>

    @if (contextMenu(); as cm) {
      <div
        class="fixed inset-0 z-40"
        (click)="closeContextMenu()"
        (contextmenu)="$event.preventDefault(); closeContextMenu()"
      ></div>
      <div
        class="fixed z-50 min-w-40 py-1 rounded-nw border border-surface-200 bg-surface-0 shadow-nw"
        [style.left.px]="cm.x"
        [style.top.px]="cm.y"
      >
        @for (mi of contextMenuItems(); track mi.label) {
          <button
            type="button"
            (click)="selectContextMenu(mi)"
            class="w-full text-left px-3 py-1.5 text-sm text-surface-800 hover:bg-surface-100 flex items-center gap-2"
          >
            @if (mi.icon) {
              <span [class]="mi.icon" aria-hidden="true"></span>
            }
            {{ mi.label }}
          </button>
        }
      </div>
    }
  `,
})
export class NwDataTableComponent<T extends NwTableRow> implements OnInit {
  private readonly doc = inject(DOCUMENT);
  private readonly hostEl = inject<ElementRef<HTMLElement>>(ElementRef)
    .nativeElement;

  // Data & display
  readonly data = input<T[]>([]);
  readonly columns = input<NwColumn<T>[]>([]);
  readonly rowKey = input<string>('');
  readonly emptyMessage = input('No records found.');
  readonly loading = input(false);
  readonly rowHover = input(true);
  readonly gridlines = input(false);
  readonly striped = input(false);

  // Sorting
  readonly multiSort = input(false);
  readonly sortField = input<string | null>(null);
  readonly sortOrder = input<NwSortOrder>(1);
  readonly multiSortMeta = model<NwSortMeta[]>([]);

  // Pagination
  readonly paginator = input(false);
  readonly pageSize = input(10);
  readonly pageIndex = model(0);
  readonly pageSizeOptions = input<number[]>([]);
  readonly paginatorPosition = input<'top' | 'bottom' | 'both'>('bottom');
  readonly totalRecords = input(0);

  // Selection
  readonly selectable = input(false);
  readonly selectionMode = input<NwSelectionMode>('multiple');
  readonly selectedRows = model<T[]>([]);
  readonly selectAll = input(false);

  // Filtering
  readonly filters = model<Record<string, NwFilterMeta>>({});
  readonly filterMode = input<'and' | 'or'>('and');
  readonly searchFields = input<string[]>([]);

  // Expansion
  readonly expandedRows = model<Record<string, boolean>>({});
  readonly expandMode = input<'single' | 'multiple'>('multiple');

  // Lazy
  readonly lazy = input(false);
  readonly lazyLoadOnInit = input(true);

  // Reordering
  readonly reorderableColumns = input(false);
  readonly reorderableRows = input(false);

  // Scroll & size
  readonly scrollable = input(false);
  readonly scrollHeight = input<string | number>('');
  readonly virtualScroll = input(false);
  readonly rowHeight = input(40);
  readonly resizableColumns = input(false);
  readonly resizeMode = input<'fit' | 'expand'>('fit');

  // State
  readonly stateKey = input<string>('');
  readonly stateStorage = input<'local' | 'session'>('local');

  // Extras (NgWave-specific)
  readonly frozenColumns = input(0);
  readonly responsiveLayout = input<NwResponsiveLayout>('scroll');
  readonly groupBy = input<string>('');
  readonly contextMenuItems = input<NwMenuItem[]>([]);

  // Outputs
  readonly sortChange = output<NwSortMeta[]>();
  readonly pageChange = output<NwPageChangeEvent>();
  readonly rowSelect = output<T>();
  readonly rowUnselect = output<T>();
  readonly selectAllChange = output<boolean>();
  readonly filterChange = output<Record<string, NwFilterMeta>>();
  readonly rowExpand = output<T>();
  readonly rowCollapse = output<T>();
  readonly columnReorder = output<NwColumnReorderEvent>();
  readonly rowReorder = output<NwRowReorderEvent>();
  readonly lazyLoad = output<NwTableLazyLoadEvent>();
  readonly cellEdit = output<NwCellEditEvent<T>>();
  readonly contextMenuSelect = output<NwContextMenuSelectEvent<T>>();
  readonly stateSave = output<NwTableState>();
  readonly stateRestore = output<NwTableState>();

  // Content templates
  private readonly cellTemplateDirs = contentChildren(
    NwColumnTemplateDirective,
  );
  private readonly rowExpansionDirs = contentChildren(NwRowExpansionDirective);

  protected readonly cellTemplateMap = computed(() => {
    const map = new Map<string, TemplateRef<unknown>>();
    for (const d of this.cellTemplateDirs()) map.set(d.nwColumn(), d.template);
    return map;
  });
  protected readonly expansionTemplate = computed(
    () => this.rowExpansionDirs()[0]?.template ?? null,
  );
  protected readonly hasExpansion = computed(() => !!this.expansionTemplate());

  // Internal state
  protected readonly globalFilter = signal('');
  protected readonly openFilterField = signal<string | null>(null);
  protected readonly columnOrder = signal<string[]>([]);
  protected readonly columnWidths = signal<Record<string, number>>({});
  private readonly rowsOverride = signal<number | null>(null);
  private readonly editingCell = signal<{ row: T; field: string } | null>(null);
  private readonly edits = signal<Map<T, Record<string, unknown>>>(new Map());
  private readonly rowOrderOverride = signal<T[] | null>(null);
  protected readonly scrollTop = signal(0);
  protected readonly contextMenu = signal<{
    x: number;
    y: number;
    row: T;
  } | null>(null);
  private dragField: string | null = null;
  private dragRowIndex: number | null = null;
  private lazyInitDone = false;

  protected readonly rows = computed(
    () => this.rowsOverride() ?? this.pageSize(),
  );

  protected readonly scrolls = computed(
    () => this.virtualScroll() || this.scrollable(),
  );

  protected readonly scrollHeightPx = computed<number>(() => {
    const h = this.scrollHeight();
    if (typeof h === 'number') return h || 400;
    return parseInt(h, 10) || 400;
  });

  protected readonly showTopPaginator = computed(
    () => this.paginatorPosition() === 'top' || this.paginatorPosition() === 'both',
  );
  protected readonly showBottomPaginator = computed(
    () =>
      this.paginatorPosition() === 'bottom' ||
      this.paginatorPosition() === 'both',
  );

  protected readonly orderedColumns = computed<NwColumn<T>[]>(() => {
    const cols = this.columns();
    const order = this.columnOrder();
    if (order.length === 0) return cols;
    const map = new Map(cols.map((c) => [c.field, c]));
    const ordered = order
      .map((f) => map.get(f))
      .filter((c): c is NwColumn<T> => !!c);
    const missing = cols.filter((c) => !order.includes(c.field));
    return [...ordered, ...missing];
  });

  private readonly baseRows = computed<T[]>(
    () => this.rowOrderOverride() ?? this.data(),
  );

  private readonly filteredRows = computed<T[]>(() => {
    const rows = this.baseRows();
    const global = this.globalFilter().trim().toLowerCase();
    const fields = this.searchFields();
    const colFilters = this.filters();
    const mode = this.filterMode();
    return rows.filter((row) => {
      if (global && fields.length) {
        const matchesGlobal = fields.some((f) =>
          String(row[f] ?? '')
            .toLowerCase()
            .includes(global),
        );
        if (!matchesGlobal) return false;
      }
      const entries = Object.entries(colFilters);
      if (entries.length) {
        const results = entries.map(([field, meta]) =>
          this.matchModeTest(row[field], meta),
        );
        const pass =
          mode === 'or' ? results.some(Boolean) : results.every(Boolean);
        if (!pass) return false;
      }
      return true;
    });
  });

  private readonly sortedRows = computed<T[]>(() => {
    const meta = this.multiSortMeta();
    const rows = this.filteredRows();
    if (meta.length === 0) return rows;
    return [...rows].sort((a, b) => {
      for (const { field, order } of meta) {
        const cmp = this.compare(a[field], b[field]) * order;
        if (cmp !== 0) return cmp;
      }
      return 0;
    });
  });

  protected readonly processedRows = computed<T[]>(() =>
    this.lazy() ? this.data() : this.sortedRows(),
  );

  protected readonly recordCount = computed(() =>
    this.lazy() ? this.totalRecords() : this.processedRows().length,
  );

  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.recordCount() / this.rows())),
  );

  protected readonly currentPage = computed(() =>
    Math.min(Math.max(0, this.pageIndex()), this.totalPages() - 1),
  );

  protected readonly viewRows = computed<T[]>(() => {
    if (this.lazy()) return this.data();
    const rows = this.processedRows();
    if (!this.paginator()) return rows;
    const start = this.currentPage() * this.rows();
    return rows.slice(start, start + this.rows());
  });

  protected readonly virtualRange = computed(() => {
    const size = this.rowHeight();
    const total = this.processedRows().length;
    const buffer = 6;
    const start = Math.max(0, Math.floor(this.scrollTop() / size) - buffer);
    const visible = Math.ceil(this.scrollHeightPx() / size) + buffer * 2;
    const end = Math.min(total, start + visible);
    return { start, end, total };
  });

  /** The T[] rows actually rendered (after pagination / virtual window). */
  private readonly displayRows = computed<T[]>(() => {
    if (this.lazy()) return this.data();
    if (this.groupBy()) return this.processedRows();
    if (this.virtualScroll()) {
      const { start, end } = this.virtualRange();
      return this.processedRows().slice(start, end);
    }
    return this.viewRows();
  });

  protected readonly renderItems = computed<RenderItem<T>[]>(() => {
    const field = this.groupBy();
    if (field) {
      const rows = [...this.displayRows()].sort((a, b) =>
        this.compare(a[field], b[field]),
      );
      const items: RenderItem<T>[] = [];
      let started = false;
      let lastKey: unknown;
      let groupIdx = -1;
      rows.forEach((row, index) => {
        const k = row[field];
        if (!started || k !== lastKey) {
          items.push({ type: 'group', value: k, count: 0 });
          groupIdx = items.length - 1;
          lastKey = k;
          started = true;
        }
        (items[groupIdx] as { count: number }).count++;
        items.push({ type: 'row', row, index });
      });
      return items;
    }
    return this.displayRows().map(
      (row, index) => ({ type: 'row', row, index }) as RenderItem<T>,
    );
  });

  protected readonly pageLinks = computed<number[]>(() => {
    const tp = this.totalPages();
    const current = this.currentPage();
    const max = 5;
    let start = Math.max(0, current - 2);
    const end = Math.min(tp - 1, start + max - 1);
    start = Math.max(0, end - max + 1);
    const arr: number[] = [];
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
  });

  protected readonly allSelected = computed(() => {
    const rows = this.displayRows();
    return rows.length > 0 && rows.every((r) => this.isSelected(r));
  });

  protected readonly someSelected = computed(() => {
    const rows = this.displayRows();
    const selected = rows.filter((r) => this.isSelected(r)).length;
    return selected > 0 && selected < rows.length;
  });

  private readonly colMap = computed(
    () => new Map(this.columns().map((c) => [c.field, c])),
  );

  private readonly frozenFields = computed(
    () =>
      new Set(
        this.orderedColumns()
          .slice(0, this.frozenColumns())
          .map((c) => c.field),
      ),
  );

  private readonly frozenLefts = computed<Record<string, number>>(() => {
    const res: Record<string, number> = {};
    const n = this.frozenColumns();
    if (n <= 0) return res;
    let left = this.leadingGutter();
    const cols = this.orderedColumns();
    for (let i = 0; i < Math.min(n, cols.length); i++) {
      res[cols[i].field] = left;
      left += this.colWidth(cols[i].field) ?? DEFAULT_COL_WIDTH;
    }
    return res;
  });

  protected readonly tableWidthPx = computed<number | null>(() => {
    if (this.frozenColumns() <= 0) return null;
    let total = this.leadingGutter();
    for (const c of this.orderedColumns()) {
      total += this.colWidth(c.field) ?? DEFAULT_COL_WIDTH;
    }
    return total;
  });

  private readonly lazyEvent = computed<NwTableLazyLoadEvent>(() => ({
    first: this.currentPage() * this.rows(),
    rows: this.rows(),
    sortField: this.multiSortMeta()[0]?.field ?? null,
    sortOrder: this.multiSortMeta()[0]?.order ?? 1,
    multiSortMeta: this.multiSortMeta(),
    filters: this.filters(),
    globalFilter: this.globalFilter(),
  }));

  private readonly tableState = computed<NwTableState>(() => ({
    columnOrder: this.columnOrder(),
    columnWidths: this.columnWidths(),
    multiSortMeta: this.multiSortMeta(),
    columnFilters: this.filters(),
    globalFilter: this.globalFilter(),
    first: this.pageIndex(),
    rows: this.rowsOverride(),
  }));

  constructor() {
    effect(() => {
      const event = this.lazyEvent();
      if (!this.lazy()) return;
      if (!this.lazyInitDone) {
        this.lazyInitDone = true;
        if (!this.lazyLoadOnInit()) return;
      }
      this.lazyLoad.emit(event);
    });
    effect(() => {
      const state = this.tableState();
      const key = this.stateKey();
      if (!key) return;
      try {
        this.storage()?.setItem(`nw-table-${key}`, JSON.stringify(state));
        this.stateSave.emit(state);
      } catch {
        /* storage unavailable */
      }
    });
  }

  ngOnInit(): void {
    let restored = false;
    const key = this.stateKey();
    if (key) {
      try {
        const raw = this.storage()?.getItem(`nw-table-${key}`);
        if (raw) {
          const s = JSON.parse(raw) as NwTableState;
          this.columnOrder.set(s.columnOrder ?? []);
          this.columnWidths.set(s.columnWidths ?? {});
          this.multiSortMeta.set(s.multiSortMeta ?? []);
          this.filters.set(s.columnFilters ?? {});
          this.globalFilter.set(s.globalFilter ?? '');
          this.pageIndex.set(s.first ?? 0);
          this.rowsOverride.set(s.rows ?? null);
          restored = true;
          this.stateRestore.emit(s);
        }
      } catch {
        /* ignore malformed state */
      }
    }
    if (!restored && this.sortField() && this.multiSortMeta().length === 0) {
      this.multiSortMeta.set([
        { field: this.sortField()!, order: this.sortOrder() },
      ]);
    }
    if (this.selectAll() && this.selectedRows().length === 0) {
      this.selectedRows.set([...this.data()]);
    }
  }

  private storage(): Storage | undefined {
    const view = this.doc.defaultView;
    return this.stateStorage() === 'session'
      ? view?.sessionStorage
      : view?.localStorage;
  }

  // ---- Layout helpers ----
  protected tableClass(): string {
    const fixed =
      this.resizableColumns() ||
      this.frozenColumns() > 0 ||
      Object.keys(this.columnWidths()).length > 0;
    return (
      'w-full text-sm text-left border-collapse' +
      (fixed ? ' table-fixed' : '') +
      (this.responsiveLayout() === 'stack' ? ' nw-stack' : '') +
      (this.striped() ? ' nw-striped' : '') +
      (this.gridlines() ? ' nw-gridlines' : '')
    );
  }

  private colWidth(field: string): number | undefined {
    return this.columnWidths()[field] ?? this.colMap().get(field)?.width;
  }

  protected colWidthStyle(field: string): number | null {
    const w = this.colWidth(field);
    if (w != null) return w;
    return this.isFrozen(field) ? DEFAULT_COL_WIDTH : null;
  }

  protected isFrozen(field: string): boolean {
    return this.frozenColumns() > 0 && this.frozenFields().has(field);
  }

  protected frozenLeft(field: string): number | null {
    return this.frozenLefts()[field] ?? null;
  }

  protected selectGutterLeft(): number {
    return this.hasExpansion() ? GUTTER_WIDTH : 0;
  }

  private leadingGutter(): number {
    return (
      (this.reorderableRows() ? GUTTER_WIDTH : 0) +
      (this.hasExpansion() ? GUTTER_WIDTH : 0) +
      (this.selectable() ? GUTTER_WIDTH : 0)
    );
  }

  // ---- Column resize ----
  protected startResize(col: NwColumn<T>, ev: PointerEvent): void {
    ev.preventDefault();
    ev.stopPropagation();
    const th = (ev.target as HTMLElement).closest('th');
    const startWidth =
      this.columnWidths()[col.field] ?? th?.offsetWidth ?? DEFAULT_COL_WIDTH;
    const cols = this.orderedColumns();
    const idx = cols.findIndex((c) => c.field === col.field);
    const next = cols[idx + 1];
    const nextStart =
      next != null
        ? (this.colWidth(next.field) ?? DEFAULT_COL_WIDTH)
        : 0;
    const startX = ev.clientX;
    const move = (e: PointerEvent) => {
      const delta = e.clientX - startX;
      const w = Math.max(60, startWidth + delta);
      this.columnWidths.update((m) => {
        const out = { ...m, [col.field]: w };
        if (this.resizeMode() === 'fit' && next) {
          out[next.field] = Math.max(60, nextStart - delta);
        }
        return out;
      });
    };
    const up = () => {
      this.doc.removeEventListener('pointermove', move);
      this.doc.removeEventListener('pointerup', up);
    };
    this.doc.addEventListener('pointermove', move);
    this.doc.addEventListener('pointerup', up);
  }

  // ---- Column reorder ----
  protected onColDragStart(col: NwColumn<T>): void {
    if (this.reorderableColumns()) this.dragField = col.field;
  }

  protected onColDragOver(ev: DragEvent): void {
    if (this.reorderableColumns()) ev.preventDefault();
  }

  protected onColDrop(target: NwColumn<T>): void {
    if (
      !this.reorderableColumns() ||
      !this.dragField ||
      this.dragField === target.field
    ) {
      this.dragField = null;
      return;
    }
    const order = this.orderedColumns().map((c) => c.field);
    const from = order.indexOf(this.dragField);
    const to = order.indexOf(target.field);
    order.splice(from, 1);
    order.splice(to, 0, this.dragField);
    this.columnOrder.set(order);
    this.columnReorder.emit({ field: this.dragField, fromIndex: from, toIndex: to });
    this.dragField = null;
  }

  // ---- Editing ----
  protected isEditing(row: T, col: NwColumn<T>): boolean {
    const e = this.editingCell();
    return !!e && e.row === row && e.field === col.field;
  }

  protected startEdit(row: T, col: NwColumn<T>): void {
    if (!col.editable) return;
    this.editingCell.set({ row, field: col.field });
    queueMicrotask(() => {
      const inp = this.hostEl.querySelector(
        '.nw-edit-input',
      ) as HTMLInputElement | null;
      inp?.focus();
      inp?.select();
    });
  }

  protected editedValue(row: T, col: NwColumn<T>): unknown {
    const m = this.edits().get(row);
    return m && col.field in m ? m[col.field] : row[col.field];
  }

  protected commitEdit(row: T, col: NwColumn<T>, ev: Event): void {
    const raw = (ev.target as HTMLInputElement).value;
    const value =
      col.filterType === 'numeric' ? (raw === '' ? null : Number(raw)) : raw;
    const m = new Map(this.edits());
    const cur = { ...(m.get(row) ?? {}) };
    cur[col.field] = value;
    m.set(row, cur);
    this.edits.set(m);
    this.cellEdit.emit({ row, field: col.field, value });
    this.editingCell.set(null);
  }

  protected cancelEdit(): void {
    this.editingCell.set(null);
  }

  // ---- Display helpers ----
  protected display(row: T, col: NwColumn<T>): string {
    const v = this.editedValue(row, col);
    return v == null ? '' : String(v);
  }

  protected cellTemplate(field: string): TemplateRef<unknown> | undefined {
    return this.cellTemplateMap().get(field);
  }

  protected colspan(): number {
    return (
      this.columns().length +
      (this.selectable() ? 1 : 0) +
      (this.hasExpansion() ? 1 : 0) +
      (this.reorderableRows() ? 1 : 0)
    );
  }

  protected itemKey(item: RenderItem<T>): unknown {
    return item.type === 'group'
      ? `g:${String(item.value)}`
      : this.keyOf(item.row);
  }

  protected groupByHeader(): string {
    const f = this.groupBy();
    return this.colMap().get(f)?.header ?? f;
  }

  // ---- Virtual scroll ----
  protected onScroll(ev: Event): void {
    if (this.virtualScroll()) {
      this.scrollTop.set((ev.target as HTMLElement).scrollTop);
    }
  }

  // ---- Row reorder ----
  protected onRowDragStart(index: number): void {
    if (this.reorderableRows()) this.dragRowIndex = index;
  }

  protected onRowDragOver(ev: DragEvent): void {
    if (this.reorderableRows()) ev.preventDefault();
  }

  protected onRowDrop(dropIndex: number): void {
    if (
      !this.reorderableRows() ||
      this.dragRowIndex == null ||
      this.dragRowIndex === dropIndex
    ) {
      this.dragRowIndex = null;
      return;
    }
    const arr = [...this.baseRows()];
    const [moved] = arr.splice(this.dragRowIndex, 1);
    arr.splice(dropIndex, 0, moved);
    this.rowOrderOverride.set(arr);
    this.rowReorder.emit({ dragIndex: this.dragRowIndex, dropIndex });
    this.dragRowIndex = null;
  }

  // ---- Context menu ----
  protected onContextMenu(row: T, ev: MouseEvent): void {
    if (this.contextMenuItems().length === 0) return;
    ev.preventDefault();
    this.contextMenu.set({ x: ev.clientX, y: ev.clientY, row });
  }

  protected selectContextMenu(item: NwMenuItem): void {
    const cm = this.contextMenu();
    if (cm) this.contextMenuSelect.emit({ item, row: cm.row });
    this.contextMenu.set(null);
  }

  protected closeContextMenu(): void {
    this.contextMenu.set(null);
  }

  private keyOf(row: T): unknown {
    const key = this.rowKey();
    return key ? row[key] : row;
  }

  // ---- Sorting ----
  protected toggleSort(col: NwColumn<T>, event: MouseEvent): void {
    const field = col.field;
    const additive = this.multiSort() && event.shiftKey;
    const meta = this.multiSortMeta();
    const existing = meta.find((m) => m.field === field);

    if (!additive) {
      if (!existing) {
        this.multiSortMeta.set([{ field, order: 1 }]);
      } else if (existing.order === 1) {
        this.multiSortMeta.set([{ field, order: -1 }]);
      } else {
        this.multiSortMeta.set([]);
      }
    } else {
      if (!existing) {
        this.multiSortMeta.set([...meta, { field, order: 1 }]);
      } else if (existing.order === 1) {
        this.multiSortMeta.set(
          meta.map((m) =>
            m.field === field ? { field, order: -1 as NwSortOrder } : m,
          ),
        );
      } else {
        this.multiSortMeta.set(meta.filter((m) => m.field !== field));
      }
    }
    this.pageIndex.set(0);
    this.sortChange.emit(this.multiSortMeta());
  }

  protected ariaSort(col: NwColumn<T>): 'ascending' | 'descending' | 'none' {
    const m = this.multiSortMeta().find((x) => x.field === col.field);
    if (!m) return 'none';
    return m.order === 1 ? 'ascending' : 'descending';
  }

  protected sortIcon(col: NwColumn<T>): string {
    const m = this.multiSortMeta().find((x) => x.field === col.field);
    if (!m) return '↕';
    return m.order === 1 ? '↑' : '↓';
  }

  protected sortPriority(col: NwColumn<T>): number | null {
    const meta = this.multiSortMeta();
    if (!this.multiSort() || meta.length < 2) return null;
    const idx = meta.findIndex((x) => x.field === col.field);
    return idx === -1 ? null : idx + 1;
  }

  private compare(a: unknown, b: unknown): number {
    if (a == null) return 1;
    if (b == null) return -1;
    if (typeof a === 'number' && typeof b === 'number') return a - b;
    return String(a).localeCompare(String(b));
  }

  // ---- Filtering ----
  protected onGlobalFilter(event: Event): void {
    this.globalFilter.set((event.target as HTMLInputElement).value);
    this.pageIndex.set(0);
  }

  protected toggleFilterMenu(col: NwColumn<T>): void {
    this.openFilterField.update((f) => (f === col.field ? null : col.field));
  }

  protected closeFilterMenu(): void {
    this.openFilterField.set(null);
  }

  protected matchModes(col: NwColumn<T>): NwMatchMode[] {
    return col.filterType === 'numeric'
      ? NW_NUMERIC_MATCH_MODES
      : NW_TEXT_MATCH_MODES;
  }

  protected matchModeLabel(mode: NwMatchMode): string {
    return NW_MATCH_MODE_LABELS[mode];
  }

  protected filterMatchMode(col: NwColumn<T>): NwMatchMode {
    return (
      this.filters()[col.field]?.matchMode ??
      (col.filterType === 'numeric' ? 'equals' : 'contains')
    );
  }

  protected filterValue(col: NwColumn<T>): string | number | null {
    return this.filters()[col.field]?.value ?? '';
  }

  protected hasFilter(col: NwColumn<T>): boolean {
    const meta = this.filters()[col.field];
    return meta != null && meta.value !== '' && meta.value != null;
  }

  protected onMatchModeChange(col: NwColumn<T>, event: Event): void {
    const matchMode = (event.target as HTMLSelectElement).value as NwMatchMode;
    const current = this.filters()[col.field];
    this.setColumnFilter(col.field, {
      value: current?.value ?? '',
      matchMode,
    });
  }

  protected onColumnFilter(col: NwColumn<T>, event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    const value =
      col.filterType === 'numeric' ? (raw === '' ? '' : Number(raw)) : raw;
    this.setColumnFilter(col.field, {
      value,
      matchMode: this.filterMatchMode(col),
    });
  }

  protected clearColumnFilter(col: NwColumn<T>): void {
    const next = { ...this.filters() };
    delete next[col.field];
    this.filters.set(next);
    this.pageIndex.set(0);
    this.filterChange.emit(next);
  }

  private setColumnFilter(field: string, meta: NwFilterMeta): void {
    const next = { ...this.filters(), [field]: meta };
    this.filters.set(next);
    this.pageIndex.set(0);
    this.filterChange.emit(next);
  }

  private matchModeTest(cell: unknown, meta: NwFilterMeta): boolean {
    if (meta.value === '' || meta.value == null) return true;
    if (
      meta.matchMode === 'lt' ||
      meta.matchMode === 'lte' ||
      meta.matchMode === 'gt' ||
      meta.matchMode === 'gte'
    ) {
      const a = Number(cell);
      const b = Number(meta.value);
      if (Number.isNaN(a) || Number.isNaN(b)) return false;
      switch (meta.matchMode) {
        case 'lt':
          return a < b;
        case 'lte':
          return a <= b;
        case 'gt':
          return a > b;
        case 'gte':
          return a >= b;
      }
    }
    const c = String(cell ?? '').toLowerCase();
    const v = String(meta.value).toLowerCase();
    switch (meta.matchMode) {
      case 'startsWith':
        return c.startsWith(v);
      case 'contains':
        return c.includes(v);
      case 'notContains':
        return !c.includes(v);
      case 'endsWith':
        return c.endsWith(v);
      case 'equals':
        return c === v;
      case 'notEquals':
        return c !== v;
      default:
        return true;
    }
  }

  // ---- Selection ----
  protected isSelected(row: T): boolean {
    const k = this.keyOf(row);
    return this.selectedRows().some((r) => this.keyOf(r) === k);
  }

  protected toggleRow(row: T): void {
    const selected = this.isSelected(row);
    if (this.selectionMode() === 'single') {
      this.selectedRows.set(selected ? [] : [row]);
    } else {
      const k = this.keyOf(row);
      const current = this.selectedRows();
      this.selectedRows.set(
        selected
          ? current.filter((r) => this.keyOf(r) !== k)
          : [...current, row],
      );
    }
    if (selected) this.rowUnselect.emit(row);
    else this.rowSelect.emit(row);
  }

  protected toggleAll(): void {
    const rows = this.displayRows();
    const willSelectAll = !this.allSelected();
    if (!willSelectAll) {
      const keys = new Set(rows.map((r) => this.keyOf(r)));
      this.selectedRows.set(
        this.selectedRows().filter((r) => !keys.has(this.keyOf(r))),
      );
    } else {
      const current = this.selectedRows();
      const currentKeys = new Set(current.map((r) => this.keyOf(r)));
      const additions = rows.filter((r) => !currentKeys.has(this.keyOf(r)));
      this.selectedRows.set([...current, ...additions]);
    }
    this.selectAllChange.emit(willSelectAll);
  }

  // ---- Expansion ----
  protected isExpanded(row: T): boolean {
    return !!this.expandedRows()[String(this.keyOf(row))];
  }

  protected toggleExpand(row: T): void {
    const k = String(this.keyOf(row));
    const map = { ...this.expandedRows() };
    if (map[k]) {
      delete map[k];
      this.expandedRows.set(map);
      this.rowCollapse.emit(row);
    } else {
      if (this.expandMode() === 'single') {
        for (const key of Object.keys(map)) delete map[key];
      }
      map[k] = true;
      this.expandedRows.set(map);
      this.rowExpand.emit(row);
    }
  }

  // ---- Pagination ----
  private setPage(page: number): void {
    const clamped = Math.min(Math.max(0, page), this.totalPages() - 1);
    this.pageIndex.set(clamped);
    this.pageChange.emit({ pageIndex: clamped, pageSize: this.rows() });
  }

  protected onRowsChange(event: Event): void {
    this.rowsOverride.set(Number((event.target as HTMLSelectElement).value));
    this.setPage(0);
  }

  protected goToPage(page: number): void {
    this.setPage(page);
  }

  protected firstPage(): void {
    this.setPage(0);
  }

  protected prevPage(): void {
    this.setPage(this.currentPage() - 1);
  }

  protected nextPage(): void {
    this.setPage(this.currentPage() + 1);
  }

  protected lastPage(): void {
    this.setPage(this.totalPages() - 1);
  }

  protected rangeLabel(): string {
    const total = this.recordCount();
    if (total === 0) return 'No records';
    const start = this.currentPage() * this.rows() + 1;
    const end = Math.min(total, start + this.rows() - 1);
    return `Showing ${start}–${end} of ${total}`;
  }

  // ---- Export ----
  exportCSV(): void {
    const cols = this.orderedColumns();
    const rows = this.processedRows();
    const escape = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const header = cols.map((c) => escape(c.header)).join(',');
    const body = rows
      .map((row) => cols.map((c) => escape(this.editedValue(row, c))).join(','))
      .join('\n');
    const csv = `${header}\n${body}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = this.doc.createElement('a');
    link.href = url;
    link.download = 'export.csv';
    link.click();
    URL.revokeObjectURL(url);
  }
}
