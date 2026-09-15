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

/**
 * PrimeNG registers every compound-word component selector under three
 * spellings — camelCase (`p-radioButton`), all-lowercase (`p-radiobutton`),
 * and kebab-case (`p-radio-button`) — confirmed against the real primeng
 * v19 package source (e.g. `selector: "p-radioButton, p-radiobutton,
 * p-radio-button"`). Adapters only declare the camelCase sourceTag, so
 * anything authored with one of the other two spellings would otherwise go
 * unrecognized. This expands one tag to all three (deduped, so single-word
 * tags like `p-table` just return themselves).
 */
export function primengTagAliases(sourceTag: string): string[] {
  const lower = sourceTag.toLowerCase();
  const kebab = sourceTag.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  return [...new Set([sourceTag, lower, kebab])];
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

// ---------------------------------------------------------------------------
// Divider: p-divider → nw-divider
// ---------------------------------------------------------------------------

const DIVIDER_RENAMES: Record<string, Rename> = {
  layout: { to: 'layout' },
  type: { to: 'type' },
  align: { to: 'align' },
  styleClass: { to: 'class' },
};

export const dividerAdapter: Adapter = {
  sourceTag: 'p-divider',
  targetTag: 'nw-divider',
  importName: 'NwDividerComponent',
  mapAttr(attr) {
    const r = DIVIDER_RENAMES[attr.name];
    if (r) return rename(attr, r);
    return { bucket: 'passthrough' };
  },
};

// ---------------------------------------------------------------------------
// Avatar: p-avatar → nw-avatar
// ---------------------------------------------------------------------------

const AVATAR_RENAMES: Record<string, Rename> = {
  label: { to: 'label' },
  icon: { to: 'icon' },
  image: { to: 'image' },
  size: { to: 'size' },
  shape: { to: 'shape' },
  onImageError: { to: 'imageError' },
  styleClass: { to: 'class' },
};

export const avatarAdapter: Adapter = {
  sourceTag: 'p-avatar',
  targetTag: 'nw-avatar',
  importName: 'NwAvatarComponent',
  mapAttr(attr) {
    const r = AVATAR_RENAMES[attr.name];
    if (r) return rename(attr, r);
    return { bucket: 'passthrough' };
  },
};

export const avatarGroupAdapter: Adapter = {
  sourceTag: 'p-avatarGroup',
  targetTag: 'nw-avatar-group',
  importName: 'NwAvatarGroupComponent',
  mapAttr(attr) {
    if (attr.name === 'styleClass') return rename(attr, { to: 'class' });
    return { bucket: 'passthrough' };
  },
};

// ---------------------------------------------------------------------------
// Tag: p-tag → nw-tag
// ---------------------------------------------------------------------------

const TAG_RENAMES: Record<string, Rename> = {
  value: { to: 'value' },
  severity: { to: 'severity' },
  icon: { to: 'icon' },
  rounded: { to: 'rounded' },
  styleClass: { to: 'class' },
};

export const tagAdapter: Adapter = {
  sourceTag: 'p-tag',
  targetTag: 'nw-tag',
  importName: 'NwTagComponent',
  mapAttr(attr) {
    const r = TAG_RENAMES[attr.name];
    if (r) return rename(attr, r);
    return { bucket: 'passthrough' };
  },
};

// ---------------------------------------------------------------------------
// Chip: p-chip → nw-chip
// ---------------------------------------------------------------------------

const CHIP_RENAMES: Record<string, Rename> = {
  label: { to: 'label' },
  icon: { to: 'icon' },
  image: { to: 'image' },
  removable: { to: 'removable' },
  removeIcon: { to: 'removeIcon' },
  onRemove: { to: 'removed' },
  styleClass: { to: 'class' },
};

export const chipAdapter: Adapter = {
  sourceTag: 'p-chip',
  targetTag: 'nw-chip',
  importName: 'NwChipComponent',
  mapAttr(attr) {
    const r = CHIP_RENAMES[attr.name];
    if (r) return rename(attr, r);
    return { bucket: 'passthrough' };
  },
};

// ---------------------------------------------------------------------------
// Fieldset: p-fieldset → nw-fieldset
// ---------------------------------------------------------------------------

const FIELDSET_RENAMES: Record<string, Rename> = {
  legend: { to: 'legend' },
  toggleable: { to: 'toggleable' },
  collapsed: { to: 'collapsed' },
  styleClass: { to: 'class' },
};

export const fieldsetAdapter: Adapter = {
  sourceTag: 'p-fieldset',
  targetTag: 'nw-fieldset',
  importName: 'NwFieldsetComponent',
  mapAttr(attr) {
    const r = FIELDSET_RENAMES[attr.name];
    if (r) return rename(attr, r);
    return { bucket: 'passthrough' };
  },
};

// ---------------------------------------------------------------------------
// Panel: p-panel → nw-panel
// ---------------------------------------------------------------------------

const PANEL_RENAMES: Record<string, Rename> = {
  header: { to: 'header' },
  toggleable: { to: 'toggleable' },
  collapsed: { to: 'collapsed' },
  expandIcon: { to: 'expandIcon' },
  collapseIcon: { to: 'collapseIcon' },
  styleClass: { to: 'class' },
};

export const panelAdapter: Adapter = {
  sourceTag: 'p-panel',
  targetTag: 'nw-panel',
  importName: 'NwPanelComponent',
  mapAttr(attr) {
    const r = PANEL_RENAMES[attr.name];
    if (r) return rename(attr, r);
    return { bucket: 'passthrough' };
  },
};

// ---------------------------------------------------------------------------
// Card: p-card → nw-card
// ---------------------------------------------------------------------------

const CARD_RENAMES: Record<string, Rename> = {
  header: { to: 'header' },
  subheader: { to: 'subheader' },
  styleClass: { to: 'class' },
};

export const cardAdapter: Adapter = {
  sourceTag: 'p-card',
  targetTag: 'nw-card',
  importName: 'NwCardComponent',
  mapAttr(attr) {
    const r = CARD_RENAMES[attr.name];
    if (r) return rename(attr, r);
    return { bucket: 'passthrough' };
  },
};

// ---------------------------------------------------------------------------
// Accordion: p-accordion / p-accordionTab → nw-accordion / nw-accordion-tab
// ---------------------------------------------------------------------------

const ACCORDION_RENAMES: Record<string, Rename> = {
  multiple: { to: 'multiple' },
  activeIndex: { to: 'expandedIndices' },
  expandIcon: { to: 'expandIcon' },
  collapseIcon: { to: 'collapseIcon' },
  selectOnFocus: { to: 'selectOnFocus' },
  styleClass: { to: 'class' },
};

export const accordionAdapter: Adapter = {
  sourceTag: 'p-accordion',
  targetTag: 'nw-accordion',
  importName: 'NwAccordionComponent',
  mapAttr(attr) {
    const r = ACCORDION_RENAMES[attr.name];
    if (r) return rename(attr, r);
    return { bucket: 'passthrough' };
  },
};

const ACCORDION_TAB_RENAMES: Record<string, Rename> = {
  header: { to: 'header' },
  disabled: { to: 'disabled' },
  styleClass: { to: 'class' },
};

export const accordionTabAdapter: Adapter = {
  sourceTag: 'p-accordionTab',
  targetTag: 'nw-accordion-tab',
  importName: 'NwAccordionTabComponent',
  mapAttr(attr) {
    const r = ACCORDION_TAB_RENAMES[attr.name];
    if (r) return rename(attr, r);
    return { bucket: 'passthrough' };
  },
};

// ---------------------------------------------------------------------------
// Steps: p-steps → nw-steps
// ---------------------------------------------------------------------------

const STEPS_RENAMES: Record<string, Rename> = {
  model: { to: 'items' },
  activeIndex: { to: 'activeIndex' },
  readonly: { to: 'readonly' },
  styleClass: { to: 'class' },
};

export const stepsAdapter: Adapter = {
  sourceTag: 'p-steps',
  targetTag: 'nw-steps',
  importName: 'NwStepsComponent',
  mapAttr(attr) {
    const r = STEPS_RENAMES[attr.name];
    if (r) return rename(attr, r);
    return { bucket: 'passthrough' };
  },
};

// ---------------------------------------------------------------------------
// Slider: p-slider → nw-slider
// ---------------------------------------------------------------------------

const SLIDER_RENAMES: Record<string, Rename> = {
  min: { to: 'min' },
  max: { to: 'max' },
  step: { to: 'step' },
  disabled: { to: 'disabled' },
  range: { to: 'range' },
  orientation: { to: 'orientation' },
  animate: { to: 'animate' },
  onSlideEnd: { to: 'onSlideEnd' },
  styleClass: { to: 'class' },
};

export const sliderAdapter: Adapter = {
  sourceTag: 'p-slider',
  targetTag: 'nw-slider',
  importName: 'NwSliderComponent',
  mapAttr(attr) {
    const r = SLIDER_RENAMES[attr.name];
    if (r) return rename(attr, r);
    return { bucket: 'passthrough' };
  },
};

// ---------------------------------------------------------------------------
// Rating: p-rating → nw-rating
// ---------------------------------------------------------------------------

const RATING_RENAMES: Record<string, Rename> = {
  stars: { to: 'count' },
  disabled: { to: 'disabled' },
  readonly: { to: 'readonly' },
  cancel: { to: 'cancel' },
  onIcon: { to: 'onIcon' },
  offIcon: { to: 'offIcon' },
  styleClass: { to: 'class' },
};

export const ratingAdapter: Adapter = {
  sourceTag: 'p-rating',
  targetTag: 'nw-rating',
  importName: 'NwRatingComponent',
  mapAttr(attr) {
    const r = RATING_RENAMES[attr.name];
    if (r) return rename(attr, r);
    return { bucket: 'passthrough' };
  },
};

// ---------------------------------------------------------------------------
// FileUpload: p-fileUpload → nw-file-upload
// ---------------------------------------------------------------------------

const FILE_UPLOAD_RENAMES: Record<string, Rename> = {
  mode: { to: 'mode' },
  name: { to: 'name' },
  url: { to: 'url' },
  method: { to: 'method' },
  multiple: { to: 'multiple' },
  accept: { to: 'accept' },
  disabled: { to: 'disabled' },
  auto: { to: 'auto' },
  maxFileSize: { to: 'maxFileSize' },
  withCredentials: { to: 'withCredentials' },
  customUpload: { to: 'customUpload' },
  chooseLabel: { to: 'chooseLabel' },
  uploadLabel: { to: 'uploadLabel' },
  cancelLabel: { to: 'cancelLabel' },
  showUploadButton: { to: 'showUploadButton' },
  showCancelButton: { to: 'showCancelButton' },
  previewWidth: { to: 'previewWidth' },
  onSelect: { to: 'selected' },
  onUpload: { to: 'uploaded' },
  onError: { to: 'uploadError' },
  onClear: { to: 'cleared' },
  onRemove: { to: 'removed' },
  onProgress: { to: 'progress' },
  uploadHandler: { to: 'uploadHandler' },
  styleClass: { to: 'class' },
};

export const fileUploadAdapter: Adapter = {
  sourceTag: 'p-fileUpload',
  targetTag: 'nw-file-upload',
  importName: 'NwFileUploadComponent',
  mapAttr(attr) {
    const r = FILE_UPLOAD_RENAMES[attr.name];
    if (r) return rename(attr, r);
    return { bucket: 'passthrough' };
  },
};

// ---------------------------------------------------------------------------
// Listbox: p-listbox → nw-listbox
// ---------------------------------------------------------------------------

const LISTBOX_RENAMES: Record<string, Rename> = {
  options: { to: 'options' },
  multiple: { to: 'multiple' },
  checkbox: { to: 'checkbox' },
  showToggleAll: { to: 'showToggleAll' },
  metaKeySelection: { to: 'metaKeySelection' },
  disabled: { to: 'disabled' },
  filter: { to: 'filter' },
  filterPlaceholder: { to: 'filterPlaceholder' },
  filterPlaceHolder: { to: 'filterPlaceholder' },
  emptyMessage: { to: 'emptyMessage' },
  emptyFilterMessage: { to: 'emptyFilterMessage' },
  styleClass: { to: 'class' },
};

export const listboxAdapter: Adapter = {
  sourceTag: 'p-listbox',
  targetTag: 'nw-listbox',
  importName: 'NwListboxComponent',
  mapAttr(attr) {
    const r = LISTBOX_RENAMES[attr.name];
    if (r) return rename(attr, r);
    return { bucket: 'passthrough' };
  },
};

// ---------------------------------------------------------------------------
// SplitButton: p-splitButton → nw-split-button
// ---------------------------------------------------------------------------

const SPLIT_BUTTON_RENAMES: Record<string, Rename> = {
  label: { to: 'label' },
  icon: { to: 'icon' },
  iconPos: { to: 'iconPosition' },
  disabled: { to: 'disabled' },
  severity: { to: 'variant' },
  size: { to: 'size' },
  model: { to: 'model' },
  onClick: { to: 'clicked' },
  styleClass: { to: 'class' },
};

export const splitButtonAdapter: Adapter = {
  sourceTag: 'p-splitButton',
  targetTag: 'nw-split-button',
  importName: 'NwSplitButtonComponent',
  mapAttr(attr) {
    const r = SPLIT_BUTTON_RENAMES[attr.name];
    if (r) return rename(attr, r);
    return { bucket: 'passthrough' };
  },
};

// ---------------------------------------------------------------------------
// OverlayPanel: p-overlayPanel → nw-overlay-panel
// ---------------------------------------------------------------------------

const OVERLAY_PANEL_RENAMES: Record<string, Rename> = {
  dismissable: { to: 'dismissable' },
  showCloseIcon: { to: 'showCloseIcon' },
  onShow: { to: 'onShow' },
  onHide: { to: 'onHide' },
  styleClass: { to: 'class' },
};

export const overlayPanelAdapter: Adapter = {
  sourceTag: 'p-overlayPanel',
  targetTag: 'nw-overlay-panel',
  importName: 'NwOverlayPanelComponent',
  mapAttr(attr) {
    const r = OVERLAY_PANEL_RENAMES[attr.name];
    if (r) return rename(attr, r);
    return { bucket: 'passthrough' };
  },
};

// ---------------------------------------------------------------------------
// CascadeSelect: p-cascadeSelect → nw-cascade-select
// ---------------------------------------------------------------------------

const CASCADE_SELECT_RENAMES: Record<string, Rename> = {
  options: { to: 'options' },
  disabled: { to: 'disabled' },
  placeholder: { to: 'placeholder' },
  styleClass: { to: 'class' },
};

export const cascadeSelectAdapter: Adapter = {
  sourceTag: 'p-cascadeSelect',
  targetTag: 'nw-cascade-select',
  importName: 'NwCascadeSelectComponent',
  mapAttr(attr) {
    const r = CASCADE_SELECT_RENAMES[attr.name];
    if (r) return rename(attr, r);
    return { bucket: 'passthrough' };
  },
};

// ---------------------------------------------------------------------------
// Splitter: p-splitter / p-splitterPanel → nw-splitter / nw-splitter-panel
// ---------------------------------------------------------------------------

const SPLITTER_RENAMES: Record<string, Rename> = {
  layout: { to: 'orientation' },
  gutterSize: { to: 'gutterSize' },
  stateKey: { to: 'stateKey' },
  stateStorage: { to: 'stateStorage' },
  onResizeStart: { to: 'resizeStart' },
  onResizeEnd: { to: 'resizeEnd' },
  styleClass: { to: 'class' },
};

export const splitterAdapter: Adapter = {
  sourceTag: 'p-splitter',
  targetTag: 'nw-splitter',
  importName: 'NwSplitterComponent',
  mapAttr(attr) {
    const r = SPLITTER_RENAMES[attr.name];
    if (r) return rename(attr, r);
    return { bucket: 'passthrough' };
  },
};

const SPLITTER_PANEL_RENAMES: Record<string, Rename> = {
  size: { to: 'size' },
  minSize: { to: 'minSize' },
  styleClass: { to: 'class' },
};

export const splitterPanelAdapter: Adapter = {
  sourceTag: 'p-splitterPanel',
  targetTag: 'nw-splitter-panel',
  importName: 'NwSplitterPanelComponent',
  mapAttr(attr) {
    const r = SPLITTER_PANEL_RENAMES[attr.name];
    if (r) return rename(attr, r);
    return { bucket: 'passthrough' };
  },
};

// ---------------------------------------------------------------------------
// Tree: p-tree → nw-tree
// ---------------------------------------------------------------------------

const TREE_RENAMES: Record<string, Rename> = {
  value: { to: 'nodes' },
  selectionMode: { to: 'selectionMode' },
  selection: { to: 'selection' },
  styleClass: { to: 'class' },
};

export const treeAdapter: Adapter = {
  sourceTag: 'p-tree',
  targetTag: 'nw-tree',
  importName: 'NwTreeComponent',
  mapAttr(attr) {
    const r = TREE_RENAMES[attr.name];
    if (r) return rename(attr, r);
    return { bucket: 'passthrough' };
  },
};

// ---------------------------------------------------------------------------
// TreeSelect: p-treeSelect → nw-tree-select
// ---------------------------------------------------------------------------

const TREE_SELECT_RENAMES: Record<string, Rename> = {
  options: { to: 'nodes' },
  disabled: { to: 'disabled' },
  placeholder: { to: 'placeholder' },
  styleClass: { to: 'class' },
};

export const treeSelectAdapter: Adapter = {
  sourceTag: 'p-treeSelect',
  targetTag: 'nw-tree-select',
  importName: 'NwTreeSelectComponent',
  mapAttr(attr) {
    const r = TREE_SELECT_RENAMES[attr.name];
    if (r) return rename(attr, r);
    return { bucket: 'passthrough' };
  },
};

// ---------------------------------------------------------------------------
// Breadcrumb: p-breadcrumb → nw-breadcrumb (component already existed)
// ---------------------------------------------------------------------------

const BREADCRUMB_RENAMES: Record<string, Rename> = {
  model: { to: 'items' },
  styleClass: { to: 'class' },
};

export const breadcrumbAdapter: Adapter = {
  sourceTag: 'p-breadcrumb',
  targetTag: 'nw-breadcrumb',
  importName: 'NwBreadcrumbComponent',
  mapAttr(attr) {
    if (attr.name === 'home') {
      return {
        bucket: 'manual',
        message: `${attr.raw} — nw-breadcrumb has no separate home slot; prepend a home entry to [items] instead`,
      };
    }
    const r = BREADCRUMB_RENAMES[attr.name];
    if (r) return rename(attr, r);
    return { bucket: 'passthrough' };
  },
};

// ---------------------------------------------------------------------------
// Popover: p-popover → nw-overlay-panel (functionally equivalent, adapter-only)
// ---------------------------------------------------------------------------

const POPOVER_RENAMES: Record<string, Rename> = {
  dismissable: { to: 'dismissable' },
  showCloseIcon: { to: 'showCloseIcon' },
  onShow: { to: 'onShow' },
  onHide: { to: 'onHide' },
  styleClass: { to: 'class' },
};

export const popoverAdapter: Adapter = {
  sourceTag: 'p-popover',
  targetTag: 'nw-overlay-panel',
  importName: 'NwOverlayPanelComponent',
  mapAttr(attr) {
    const r = POPOVER_RENAMES[attr.name];
    if (r) return rename(attr, r);
    return { bucket: 'passthrough' };
  },
};

// ---------------------------------------------------------------------------
// Accordion v19 compositional API: p-accordion-panel → nw-accordion-tab
// (p-accordion itself is unchanged — same root tag as the legacy API, so the
// existing accordionAdapter already covers it. p-accordion-header and
// p-accordion-content are handled with dedicated string transforms in
// migrate.ts since their targets aren't NgWave components.)
// ---------------------------------------------------------------------------

const ACCORDION_PANEL_RENAMES: Record<string, Rename> = {
  disabled: { to: 'disabled' },
  styleClass: { to: 'class' },
};

export const accordionPanelAdapter: Adapter = {
  sourceTag: 'p-accordion-panel',
  targetTag: 'nw-accordion-tab',
  importName: 'NwAccordionTabComponent',
  mapAttr(attr) {
    if (attr.name === 'value') {
      return {
        bucket: 'manual',
        message: `${attr.raw} — nw-accordion-tab has no per-tab value; expansion is driven by the parent's [expandedIndices]`,
      };
    }
    const r = ACCORDION_PANEL_RENAMES[attr.name];
    if (r) return rename(attr, r);
    return { bucket: 'passthrough' };
  },
};

// ---------------------------------------------------------------------------
// Badge / OverlayBadge: p-badge → nw-badge, p-overlaybadge → nw-overlay-badge
// (pBadge attribute directive is handled as a strip + manual note in
// migrate.ts — wrapping an arbitrary host element structurally isn't a
// per-attribute rename.)
// ---------------------------------------------------------------------------

const BADGE_RENAMES: Record<string, Rename> = {
  value: { to: 'value' },
  severity: { to: 'severity' },
  size: { to: 'size' },
  styleClass: { to: 'class' },
};

export const badgeAdapter: Adapter = {
  sourceTag: 'p-badge',
  targetTag: 'nw-badge',
  importName: 'NwBadgeComponent',
  mapAttr(attr) {
    const r = BADGE_RENAMES[attr.name];
    if (r) return rename(attr, r);
    return { bucket: 'passthrough' };
  },
};

export const overlayBadgeAdapter: Adapter = {
  sourceTag: 'p-overlaybadge',
  targetTag: 'nw-overlay-badge',
  importName: 'NwOverlayBadgeComponent',
  mapAttr(attr) {
    const r = BADGE_RENAMES[attr.name];
    if (r) return rename(attr, r);
    return { bucket: 'passthrough' };
  },
};

// ---------------------------------------------------------------------------
// Message: p-message → nw-message
// ---------------------------------------------------------------------------

const MESSAGE_RENAMES: Record<string, Rename> = {
  severity: { to: 'severity' },
  text: { to: 'text' },
  closable: { to: 'closable' },
  life: { to: 'life' },
  styleClass: { to: 'class' },
};

export const messageAdapter: Adapter = {
  sourceTag: 'p-message',
  targetTag: 'nw-message',
  importName: 'NwMessageComponent',
  mapAttr(attr) {
    if (attr.name === 'icon') {
      return {
        bucket: 'manual',
        message: `${attr.raw} — nw-message picks its icon from severity automatically; a custom icon isn't supported yet`,
      };
    }
    if (attr.name === 'escape') {
      return { bucket: 'mapped', message: `${attr.raw} — nw-message always renders text as plain text (dropped)` };
    }
    const r = MESSAGE_RENAMES[attr.name];
    if (r) return rename(attr, r);
    return { bucket: 'passthrough' };
  },
};

// ---------------------------------------------------------------------------
// Full set of PrimeNG element tags this codemod has an adapter for. Attribute
// directives (pButton, pInputText, pInputTextarea) apply to plain elements
// (button/input/textarea) and aren't tag names, so they're listed separately.
// ---------------------------------------------------------------------------

const CANONICAL_SUPPORTED_PRIMENG_TAGS: string[] = [
  buttonAdapter.sourceTag,
  dataTableAdapter.sourceTag,
  dropdownAdapter.sourceTag,
  'p-select',
  'p-multiSelect',
  dialogAdapter.sourceTag,
  'p-sidebar',
  tabsAdapter.sourceTag,
  tabAdapter.sourceTag,
  checkboxAdapter.sourceTag,
  radioAdapter.sourceTag,
  spinnerAdapter.sourceTag,
  skeletonAdapter.sourceTag,
  toastAdapter.sourceTag,
  inputNumberAdapter.sourceTag,
  autocompleteAdapter.sourceTag,
  dividerAdapter.sourceTag,
  avatarAdapter.sourceTag,
  avatarGroupAdapter.sourceTag,
  tagAdapter.sourceTag,
  chipAdapter.sourceTag,
  fieldsetAdapter.sourceTag,
  panelAdapter.sourceTag,
  cardAdapter.sourceTag,
  accordionAdapter.sourceTag,
  accordionTabAdapter.sourceTag,
  stepsAdapter.sourceTag,
  sliderAdapter.sourceTag,
  ratingAdapter.sourceTag,
  fileUploadAdapter.sourceTag,
  listboxAdapter.sourceTag,
  splitButtonAdapter.sourceTag,
  overlayPanelAdapter.sourceTag,
  cascadeSelectAdapter.sourceTag,
  splitterAdapter.sourceTag,
  splitterPanelAdapter.sourceTag,
  treeAdapter.sourceTag,
  treeSelectAdapter.sourceTag,
  breadcrumbAdapter.sourceTag,
  popoverAdapter.sourceTag,
  accordionPanelAdapter.sourceTag,
  badgeAdapter.sourceTag,
  overlayBadgeAdapter.sourceTag,
  messageAdapter.sourceTag,
  // Strip-only tags: no NgWave component target, handled by dedicated
  // string transforms in migrate.ts (removed, unwrapped, or renamed to a
  // plain element) rather than a full Adapter.
  'p-sortIcon',
  'p-columnFilter',
  'p-iconField',
  'p-inputIcon',
  'p-fluid',
  'p-accordion-header',
  'p-accordion-content',
  'p-tableHeaderCheckbox',
  'p-tableCheckbox',
  'p-buttongroup',
  // Tabs v19 compositional API (p-tabpanel is already covered via the
  // legacy tabAdapter's casing-alias expansion of p-tabPanel).
  'p-tabs',
  'p-tablist',
  'p-tab',
  'p-tabpanels',
];

/** Every casing alias (see primengTagAliases) of every tag this codemod supports. */
export const SUPPORTED_PRIMENG_TAGS: string[] = [
  ...new Set(CANONICAL_SUPPORTED_PRIMENG_TAGS.flatMap(primengTagAliases)),
];

export const SUPPORTED_PRIMENG_ATTR_DIRECTIVES: string[] = [
  'pButton',
  'pInputText',
  'pInputTextarea',
  'pRipple',
  'pBadge',
];
