export type NwTableRow = Record<string, unknown>;

export type NwColumnFilterType = 'text' | 'numeric';

export interface NwColumn<T extends NwTableRow> {
  /** Property name on the row object. */
  field: keyof T & string;
  /** Column header label. */
  header: string;
  /** Enables click-to-sort on this column. */
  sortable?: boolean;
  /** Enables a per-column filter menu on this column. */
  filter?: boolean;
  /** Input type used by the column filter. Defaults to 'text'. */
  filterType?: NwColumnFilterType;
  /** Enables inline editing of cells in this column. */
  editable?: boolean;
  /** Initial column width in pixels. */
  width?: number;
}

export type NwResponsiveLayout = 'scroll' | 'stack';

export interface NwCellEditEvent<T extends NwTableRow> {
  row: T;
  field: string;
  value: unknown;
}

/** Persisted table UI state, keyed by `stateKey`. */
export interface NwTableState {
  columnOrder: string[];
  columnWidths: Record<string, number>;
  multiSortMeta: NwSortMeta[];
  columnFilters: Record<string, NwFilterMeta>;
  globalFilter: string;
  first: number;
  rows: number | null;
}

export type NwSortDirection = 'asc' | 'desc';
export type NwSortOrder = 1 | -1;

export interface NwSortState {
  field: string | null;
  direction: NwSortDirection;
}

export interface NwSortMeta {
  field: string;
  order: NwSortOrder;
}

export type NwSelectionMode = 'single' | 'multiple';

export type NwMatchMode =
  | 'startsWith'
  | 'contains'
  | 'notContains'
  | 'endsWith'
  | 'equals'
  | 'notEquals'
  | 'lt'
  | 'lte'
  | 'gt'
  | 'gte';

export interface NwFilterMeta {
  value: string | number | null;
  matchMode: NwMatchMode;
}

export const NW_TEXT_MATCH_MODES: NwMatchMode[] = [
  'startsWith',
  'contains',
  'notContains',
  'endsWith',
  'equals',
  'notEquals',
];

export const NW_NUMERIC_MATCH_MODES: NwMatchMode[] = [
  'equals',
  'notEquals',
  'lt',
  'lte',
  'gt',
  'gte',
];

export const NW_MATCH_MODE_LABELS: Record<NwMatchMode, string> = {
  startsWith: 'Starts with',
  contains: 'Contains',
  notContains: 'Not contains',
  endsWith: 'Ends with',
  equals: 'Equals',
  notEquals: 'Not equals',
  lt: 'Less than',
  lte: 'Less or equal',
  gt: 'Greater than',
  gte: 'Greater or equal',
};

export interface NwRowReorderEvent {
  dragIndex: number;
  dropIndex: number;
}

export interface NwColumnReorderEvent {
  field: string;
  fromIndex: number;
  toIndex: number;
}

export interface NwPageChangeEvent {
  pageIndex: number;
  pageSize: number;
}

export interface NwMenuItem {
  label: string;
  /** Optional CSS class for a leading icon element. */
  icon?: string;
  /** Optional identifier passed back on select. */
  value?: string;
}

export interface NwContextMenuSelectEvent<T extends NwTableRow> {
  item: NwMenuItem;
  row: T;
}

/** Emitted on sort/filter/page changes when `lazy` is enabled. */
export interface NwTableLazyLoadEvent {
  first: number;
  rows: number;
  sortField: string | null;
  sortOrder: NwSortOrder;
  multiSortMeta: NwSortMeta[];
  filters: Record<string, NwFilterMeta>;
  globalFilter: string;
}
