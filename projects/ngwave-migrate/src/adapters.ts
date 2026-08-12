import { serializeAttr } from './parser.js';
import { AttrKind, ParsedAttr } from './types.js';

export interface AttrResult {
  /** Rebuilt attribute text to emit; omitted means the attribute is dropped. */
  output?: string;
  bucket: 'mapped' | 'manual' | 'unsupported' | 'passthrough';
  message?: string;
}

export interface Adapter {
  sourceTag: string;
  targetTag: string;
  importName: string;
  mapAttr(attr: ParsedAttr): AttrResult;
}

interface Rename {
  to: string;
  /** Force a target kind; otherwise the source kind is preserved. */
  kind?: AttrKind;
}

function rename(attr: ParsedAttr, r: Rename): AttrResult {
  const output = serializeAttr(r.kind ?? attr.kind, r.to, attr.value, attr.quote);
  return { output, bucket: 'mapped', message: `${attr.raw} → ${output}` };
}

// ---------------------------------------------------------------------------
// Button: p-button / button[pButton] → nw-button
// ---------------------------------------------------------------------------

const BUTTON_PRESENCE: Record<string, string> = {
  outlined: 'variant="outlined"',
  text: 'variant="text"',
  raised: 'variant="raised"',
  rounded: '[rounded]="true"',
};

const BUTTON_RENAMES: Record<string, Rename> = {
  label: { to: 'label' },
  icon: { to: 'icon' },
  iconPos: { to: 'iconPosition' },
  disabled: { to: 'disabled' },
  loading: { to: 'loading' },
  severity: { to: 'variant' },
  size: { to: 'size' },
  onClick: { to: 'click' },
  styleClass: { to: 'class' },
  type: { to: 'type' },
  badge: { to: 'badge' },
  badgeSeverity: { to: 'badgeVariant' },
};

export const buttonAdapter: Adapter = {
  sourceTag: 'p-button',
  targetTag: 'nw-button',
  importName: 'NwButtonComponent',
  mapAttr(attr) {
    if (attr.name === 'pButton') return { bucket: 'passthrough' }; // handled by caller (dropped)
    const presence = BUTTON_PRESENCE[attr.name];
    if (presence) {
      return { output: presence, bucket: 'mapped', message: `${attr.raw} → ${presence}` };
    }
    const r = BUTTON_RENAMES[attr.name];
    if (r) return rename(attr, r);
    return { bucket: 'passthrough' };
  },
};

// ---------------------------------------------------------------------------
// DataTable: p-table → nw-data-table
// ---------------------------------------------------------------------------

const TABLE_UNSUPPORTED: Record<string, string> = {
  frozenColumns: 'frozen columns are not supported in NgWave yet',
  frozenValue: 'frozen rows are not supported in NgWave yet',
  editMode: 'cell/row editing is not supported in NgWave yet',
  rowGroupMode: 'row grouping is not supported in NgWave yet',
  groupRowsBy: 'row grouping is not supported in NgWave yet',
};

const TABLE_RENAMES: Record<string, Rename> = {
  // Data & display
  value: { to: 'data' },
  columns: { to: 'columns' },
  rows: { to: 'pageSize' },
  first: { to: 'pageIndex' },
  totalRecords: { to: 'totalRecords' },
  loading: { to: 'loading' },
  rowHover: { to: 'rowHover' },
  showGridlines: { to: 'gridlines' },
  stripedRows: { to: 'striped' },
  dataKey: { to: 'rowKey' },
  emptyMessage: { to: 'emptyMessage' },
  // Sorting
  sortField: { to: 'sortField' },
  sortOrder: { to: 'sortOrder' },
  multiSortMeta: { to: 'multiSortMeta' },
  onSort: { to: 'sortChange' },
  // Pagination
  paginator: { to: 'paginator' },
  rowsPerPageOptions: { to: 'pageSizeOptions' },
  paginatorPosition: { to: 'paginatorPosition' },
  onPage: { to: 'pageChange' },
  // Selection
  selection: { to: 'selectedRows' },
  selectAll: { to: 'selectAll' },
  onRowSelect: { to: 'rowSelect' },
  onRowUnselect: { to: 'rowUnselect' },
  onSelectAllChange: { to: 'selectAllChange' },
  // Filtering
  filters: { to: 'filters' },
  filterMode: { to: 'filterMode' },
  globalFilterFields: { to: 'searchFields' },
  onFilter: { to: 'filterChange' },
  // Row expansion
  expandedRowKeys: { to: 'expandedRows' },
  rowExpandMode: { to: 'expandMode' },
  onRowExpand: { to: 'rowExpand' },
  onRowCollapse: { to: 'rowCollapse' },
  // Lazy loading
  lazy: { to: 'lazy' },
  onLazyLoad: { to: 'lazyLoad' },
  lazyLoadOnInit: { to: 'lazyLoadOnInit' },
  // Reordering
  reorderableColumns: { to: 'reorderableColumns' },
  reorderableRows: { to: 'reorderableRows' },
  onColReorder: { to: 'columnReorder' },
  onRowReorder: { to: 'rowReorder' },
  // Scroll & size
  scrollable: { to: 'scrollable' },
  scrollHeight: { to: 'scrollHeight' },
  virtualScroll: { to: 'virtualScroll' },
  virtualScrollItemSize: { to: 'rowHeight' },
  resizableColumns: { to: 'resizableColumns' },
  columnResizeMode: { to: 'resizeMode' },
  // State
  stateKey: { to: 'stateKey' },
  stateStorage: { to: 'stateStorage' },
  onStateSave: { to: 'stateSave' },
  onStateRestore: { to: 'stateRestore' },
};

// ---------------------------------------------------------------------------
// Tabs: p-tabView → nw-tabs, p-tabPanel → nw-tab
// ---------------------------------------------------------------------------

export const tabsAdapter: Adapter = {
  sourceTag: 'p-tabView',
  targetTag: 'nw-tabs',
  importName: 'NwTabsComponent',
  mapAttr(attr) {
    if (attr.name === 'activeIndex') return rename(attr, { to: 'activeIndex' });
    if (attr.name === 'styleClass') return rename(attr, { to: 'class' });
    return { bucket: 'passthrough' };
  },
};

export const tabAdapter: Adapter = {
  sourceTag: 'p-tabPanel',
  targetTag: 'nw-tab',
  importName: 'NwTabComponent',
  mapAttr(attr) {
    if (attr.name === 'header') return rename(attr, { to: 'header' });
    if (attr.name === 'disabled') return rename(attr, { to: 'disabled' });
    return { bucket: 'passthrough' };
  },
};

// ---------------------------------------------------------------------------
// Checkbox / Radio
// ---------------------------------------------------------------------------

export const checkboxAdapter: Adapter = {
  sourceTag: 'p-checkbox',
  targetTag: 'nw-checkbox',
  importName: 'NwCheckboxComponent',
  mapAttr(attr) {
    if (attr.name === 'binary') {
      return { bucket: 'mapped', message: `${attr.raw} — binary is the default (dropped)` };
    }
    if (attr.name === 'value') {
      return {
        bucket: 'manual',
        message: `${attr.raw} — checkbox groups: use one nw-checkbox per value with its own [(checked)]`,
      };
    }
    const renames: Record<string, Rename> = {
      ngModel: { to: 'checked' },
      label: { to: 'label' },
      disabled: { to: 'disabled' },
      indeterminate: { to: 'indeterminate' },
      readonly: { to: 'readonly' },
      inputId: { to: 'inputId' },
      invalid: { to: 'invalid' },
      styleClass: { to: 'class' },
    };
    const r = renames[attr.name];
    if (r) return rename(attr, r);
    return { bucket: 'passthrough' };
  },
};

export const radioAdapter: Adapter = {
  sourceTag: 'p-radioButton',
  targetTag: 'nw-radio',
  importName: 'NwRadioComponent',
  mapAttr(attr) {
    const renames: Record<string, Rename> = {
      value: { to: 'value' },
      ngModel: { to: 'selected' },
      label: { to: 'label' },
      disabled: { to: 'disabled' },
      name: { to: 'name' },
      inputId: { to: 'inputId' },
      invalid: { to: 'invalid' },
      styleClass: { to: 'class' },
    };
    const r = renames[attr.name];
    if (r) return rename(attr, r);
    return { bucket: 'passthrough' };
  },
};

// ---------------------------------------------------------------------------
// Spinner / Skeleton
// ---------------------------------------------------------------------------

export const spinnerAdapter: Adapter = {
  sourceTag: 'p-progressSpinner',
  targetTag: 'nw-spinner',
  importName: 'NwSpinnerComponent',
  mapAttr(attr) {
    const renames: Record<string, Rename> = {
      strokeWidth: { to: 'strokeWidth' },
      animationDuration: { to: 'animationDuration' },
      styleClass: { to: 'class' },
    };
    const r = renames[attr.name];
    if (r) return rename(attr, r);
    return { bucket: 'passthrough' };
  },
};

export const skeletonAdapter: Adapter = {
  sourceTag: 'p-skeleton',
  targetTag: 'nw-skeleton',
  importName: 'NwSkeletonComponent',
  mapAttr(attr) {
    const renames: Record<string, Rename> = {
      width: { to: 'width' },
      height: { to: 'height' },
      shape: { to: 'shape' },
      styleClass: { to: 'class' },
    };
    const r = renames[attr.name];
    if (r) return rename(attr, r);
    return { bucket: 'passthrough' };
  },
};

// ---------------------------------------------------------------------------
// Toast: p-toast → nw-toast
// ---------------------------------------------------------------------------

const TOAST_RENAMES: Record<string, Rename> = {
  position: { to: 'position' },
  key: { to: 'key' },
  styleClass: { to: 'class' },
};

export const toastAdapter: Adapter = {
  sourceTag: 'p-toast',
  targetTag: 'nw-toast',
  importName: 'NwToastComponent',
  mapAttr(attr) {
    const r = TOAST_RENAMES[attr.name];
    if (r) return rename(attr, r);
    return { bucket: 'passthrough' };
  },
};

// ---------------------------------------------------------------------------
// Dialog: p-dialog / p-sidebar → nw-dialog
// ---------------------------------------------------------------------------

const DIALOG_UNSUPPORTED: Record<string, string> = {
  fullScreen: 'full-screen mode is not supported in NgWave yet',
};

const DIALOG_RENAMES: Record<string, Rename> = {
  visible: { to: 'visible' },
  header: { to: 'header' },
  modal: { to: 'modal' },
  closable: { to: 'closable' },
  dismissableMask: { to: 'dismissableMask' },
  position: { to: 'position' },
  draggable: { to: 'draggable' },
  resizable: { to: 'resizable' },
  maximizable: { to: 'maximizable' },
  blockScroll: { to: 'blockScroll' },
  styleClass: { to: 'class' },
  onShow: { to: 'shown' },
  onHide: { to: 'hidden' },
  // p-sidebar (drawer) equivalents
  dismissible: { to: 'dismissableMask' },
  showCloseIcon: { to: 'closable' },
};

export const dialogAdapter: Adapter = {
  sourceTag: 'p-dialog',
  targetTag: 'nw-dialog',
  importName: 'NwDialogComponent',
  mapAttr(attr) {
    const unsupported = DIALOG_UNSUPPORTED[attr.name];
    if (unsupported) {
      return { bucket: 'unsupported', message: `${attr.raw} — ${unsupported}` };
    }
    const r = DIALOG_RENAMES[attr.name];
    if (r) return rename(attr, r);
    return { bucket: 'passthrough' };
  },
};

// ---------------------------------------------------------------------------
// Dropdown: p-dropdown / p-select → nw-dropdown
// ---------------------------------------------------------------------------

const DROPDOWN_MANUAL: Record<string, string> = {
  editable: 'editable dropdown is not supported in NgWave yet',
  virtualScroll: 'dropdown virtual scroll is not supported in NgWave yet',
};

const DROPDOWN_RENAMES: Record<string, Rename> = {
  options: { to: 'options' },
  optionLabel: { to: 'optionLabel' },
  optionValue: { to: 'optionValue' },
  optionDisabled: { to: 'optionDisabled' },
  optionGroupLabel: { to: 'optionGroupLabel' },
  optionGroupChildren: { to: 'optionGroupChildren' },
  group: { to: 'group' },
  ngModel: { to: 'value' },
  placeholder: { to: 'placeholder' },
  filter: { to: 'filter' },
  showClear: { to: 'clearable' },
  disabled: { to: 'disabled' },
  loading: { to: 'loading' },
  display: { to: 'display' },
  onChange: { to: 'valueChange' },
};

export const dropdownAdapter: Adapter = {
  sourceTag: 'p-dropdown',
  targetTag: 'nw-dropdown',
  importName: 'NwDropdownComponent',
  mapAttr(attr) {
    const manual = DROPDOWN_MANUAL[attr.name];
    if (manual) {
      return { bucket: 'manual', message: `${attr.raw} — ${manual}` };
    }
    const r = DROPDOWN_RENAMES[attr.name];
    if (r) return rename(attr, r);
    return { bucket: 'passthrough' };
  },
};

export const dataTableAdapter: Adapter = {
  sourceTag: 'p-table',
  targetTag: 'nw-data-table',
  importName: 'NwDataTableComponent',
  mapAttr(attr) {
    // Unsupported → drop + flag
    const unsupported = TABLE_UNSUPPORTED[attr.name];
    if (unsupported) {
      return { bucket: 'unsupported', message: `${attr.raw} — ${unsupported}` };
    }

    // Specials
    if (attr.name === 'sortMode') {
      if (attr.value === 'multiple') {
        return {
          output: '[multiSort]="true"',
          bucket: 'mapped',
          message: `${attr.raw} → [multiSort]="true"`,
        };
      }
      return {
        bucket: 'mapped',
        message: `${attr.raw} — single sort is the default (dropped)`,
      };
    }
    if (attr.name === 'selectionMode') {
      return {
        output: '[selectable]="true"',
        bucket: 'mapped',
        message: `${attr.raw} → [selectable]="true"`,
      };
    }
    if (attr.name === 'paginator' && attr.kind === 'plain' && attr.value === undefined) {
      return {
        output: '[paginator]="true"',
        bucket: 'mapped',
        message: `paginator → [paginator]="true"`,
      };
    }

    const r = TABLE_RENAMES[attr.name];
    if (r) return rename(attr, r);
    return { bucket: 'passthrough' };
  },
};

// ---------------------------------------------------------------------------
// Form inputs: input[pInputText] → nw-input-text, p-inputNumber → nw-input-number,
// textarea[pInputTextarea] → nw-textarea
// ---------------------------------------------------------------------------

export const inputTextAdapter: Adapter = {
  sourceTag: 'input',
  targetTag: 'nw-input-text',
  importName: 'NwInputTextComponent',
  mapAttr(attr) {
    if (attr.name === 'pInputText') return { bucket: 'passthrough' }; // dropped by caller
    const renames: Record<string, Rename> = {
      ngModel: { to: 'value' },
      placeholder: { to: 'placeholder' },
      disabled: { to: 'disabled' },
      readonly: { to: 'readonly' },
      type: { to: 'type' },
      name: { to: 'name' },
      maxlength: { to: 'maxlength' },
      autocomplete: { to: 'autocomplete' },
      styleClass: { to: 'class' },
    };
    const r = renames[attr.name];
    if (r) return rename(attr, r);
    return { bucket: 'passthrough' };
  },
};

export const textareaAdapter: Adapter = {
  sourceTag: 'textarea',
  targetTag: 'nw-textarea',
  importName: 'NwTextareaComponent',
  mapAttr(attr) {
    if (attr.name === 'pInputTextarea') return { bucket: 'passthrough' }; // dropped by caller
    const renames: Record<string, Rename> = {
      ngModel: { to: 'value' },
      placeholder: { to: 'placeholder' },
      disabled: { to: 'disabled' },
      readonly: { to: 'readonly' },
      rows: { to: 'rows' },
      maxlength: { to: 'maxlength' },
      autoResize: { to: 'autoResize' },
      name: { to: 'name' },
      styleClass: { to: 'class' },
    };
    const r = renames[attr.name];
    if (r) return rename(attr, r);
    return { bucket: 'passthrough' };
  },
};

const INPUT_NUMBER_RENAMES: Record<string, Rename> = {
  ngModel: { to: 'value' },
  min: { to: 'min' },
  max: { to: 'max' },
  step: { to: 'step' },
  showButtons: { to: 'showButtons' },
  buttonLayout: { to: 'buttonLayout' },
  mode: { to: 'mode' },
  currency: { to: 'currency' },
  locale: { to: 'locale' },
  minFractionDigits: { to: 'minFractionDigits' },
  maxFractionDigits: { to: 'maxFractionDigits' },
  useGrouping: { to: 'useGrouping' },
  prefix: { to: 'prefix' },
  suffix: { to: 'suffix' },
  placeholder: { to: 'placeholder' },
  disabled: { to: 'disabled' },
  readonly: { to: 'readonly' },
  styleClass: { to: 'class' },
};

export const inputNumberAdapter: Adapter = {
  sourceTag: 'p-inputNumber',
  targetTag: 'nw-input-number',
  importName: 'NwInputNumberComponent',
  mapAttr(attr) {
    const r = INPUT_NUMBER_RENAMES[attr.name];
    if (r) return rename(attr, r);
    return { bucket: 'passthrough' };
  },
};

// ---------------------------------------------------------------------------
// Autocomplete: p-autoComplete → nw-autocomplete
// ---------------------------------------------------------------------------

const AUTOCOMPLETE_RENAMES: Record<string, Rename> = {
  suggestions: { to: 'suggestions' },
  ngModel: { to: 'value' },
  field: { to: 'optionLabel' },
  optionLabel: { to: 'optionLabel' },
  multiple: { to: 'multiple' },
  dropdown: { to: 'dropdown' },
  minLength: { to: 'minLength' },
  delay: { to: 'delay' },
  forceSelection: { to: 'forceSelection' },
  placeholder: { to: 'placeholder' },
  disabled: { to: 'disabled' },
  readonly: { to: 'readonly' },
  emptyMessage: { to: 'emptyMessage' },
  styleClass: { to: 'class' },
};

export const autocompleteAdapter: Adapter = {
  sourceTag: 'p-autoComplete',
  targetTag: 'nw-autocomplete',
  importName: 'NwAutocompleteComponent',
  mapAttr(attr) {
    if (attr.name === 'completeMethod') {
      const output = serializeAttr('output', 'complete', attr.value, attr.quote);
      return {
        output,
        bucket: 'manual',
        message: `${attr.raw} → ${output} — NgWave emits the query string, not { query }; update the handler signature`,
      };
    }
    const r = AUTOCOMPLETE_RENAMES[attr.name];
    if (r) return rename(attr, r);
    return { bucket: 'passthrough' };
  },
};
