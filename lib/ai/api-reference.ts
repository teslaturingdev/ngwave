/**
 * Compact NgWave (@ngwave/ui) API reference given to the model so it only emits
 * real props/components and never invents an API. Keep this in sync with the
 * library's public surface. This is plain data — no dependencies — so it can be
 * bundled into the serverless function and used in tests alike.
 */
export const NGWAVE_API_REFERENCE = `# @ngwave/ui — component & service API (migration target)

All components are standalone Angular 22, OnPush, Signals-based. Import each from
'@ngwave/ui'. Selector prefix nw-, class prefix Nw. Form controls implement
ControlValueAccessor (work with [(ngModel)] and [formControl]).

## Button — <nw-button> (NwButtonComponent)
Inputs: variant('primary'|'secondary'|'success'|'info'|'warn'|'help'|'danger'|'contrast'|'outlined'|'text'|'link'|'raised'), size('small'|'normal'|'large'),
type, disabled, loading, icon(css class string), iconPosition('left'|'right'), label, rounded, badge, badgeVariant, fluid, iconOnly, ariaLabel.
Content projection for the label is supported. Click via native (click).

## DataTable — <nw-data-table> (NwDataTableComponent), NwColumn<T>
Data-driven: bind [data]="rows" and [columns]="cols". A column is
NwColumn<T> = { field: keyof T & string; header: string; sortable?: boolean; filter?: boolean; filterType?: 'text'|'numeric'|'date'|'boolean'; body?: (row)=>string; width?: number }.
Inputs include: data, columns, rowKey, emptyMessage, rowHover, gridlines, striped, multiSort, sortField, sortOrder,
paginator, pageSize, pageIndex(model), pageSizeOptions, totalRecords, selectable, selectionMode('single'|'multiple'),
selectedRows(model), selectAll, filters(model), searchFields, expandedRows(model), lazy, lazyLoadOnInit, reorderableColumns,
reorderableRows, scrollable, scrollHeight, virtualScroll, resizableColumns, stateKey, stateStorage.
Outputs: sortChange, pageChange, rowSelect, rowUnselect, selectAllChange, filterChange, rowExpand, rowCollapse,
columnReorder, rowReorder, lazyLoad, cellEdit, contextMenuSelect, stateSave, stateRestore. Method: exportCSV().
IMPORTANT: NgWave DataTable does NOT support PrimeNG's column body/header ng-templates directly — build the [columns]
array instead. For a custom cell renderer, use a column 'body' function returning a string. Complex per-cell markup
(buttons/links inside cells) is NOT expressible via [columns] — flag it as needing manual work.

## Dropdown — <nw-dropdown> (NwDropdownComponent)
Inputs: options(unknown[]), optionLabel('label'), optionValue('value'), optionDisabled('disabled'), optionGroupLabel,
optionGroupChildren, group, value(model / CVA), placeholder, multiple, filter, disabled, clearable, loading,
display('comma'|'chip'), emptyMessage, filterPlaceholder. Output: valueChange. Directives: nwDropdownOption, nwDropdownSelected (custom templates).

## Autocomplete — <nw-autocomplete> (NwAutocompleteComponent)
Inputs: suggestions(unknown[]), optionLabel, multiple, dropdown, minLength, delay, forceSelection, clearable, loading,
placeholder, emptyMessage, value(model / CVA), disabled, readonly, invalid, fluid.
Output: complete (emits the debounced query STRING — the parent filters/fetches and sets [suggestions]).
NOTE: PrimeNG's (completeMethod)="search($event)" passes an event object { query }. NgWave's (complete) passes the query
STRING directly, so the handler signature changes: search(query: string) { ... } and it should set the suggestions signal/array.
Directive: nwAutocompleteItem (custom item template).

## Form inputs
<nw-input-text> (NwInputTextComponent): value(model/CVA), type, placeholder, disabled, readonly, invalid, size, clearable, fluid, iconLeft, iconRight, inputId, name, autocomplete, maxlength.
<nw-input-number> (NwInputNumberComponent): value(model/CVA number|null), min, max, step, showButtons, buttonLayout('stacked'|'horizontal'), mode('decimal'|'currency'), currency, locale, minFractionDigits, maxFractionDigits, useGrouping, prefix, suffix, placeholder, disabled, readonly, invalid, size, fluid.
<nw-textarea> (NwTextareaComponent): value(model/CVA), placeholder, rows, disabled, readonly, invalid, autoResize, maxlength, fluid.

## Dialog — <nw-dialog> (NwDialogComponent)
Inputs: visible(model), header, modal, closable, dismissableMask, position('center'|'left'|'right'|'top'|'bottom'),
width, draggable, resizable, maximizable, blockScroll. Outputs: shown, hidden. Directives: nwDialogHeader, nwDialogFooter (templates).
Confirm dialogs: NwConfirmationService.confirm({ message, header?, icon?, acceptLabel?, rejectLabel?, acceptVariant?, rejectVariant?, accept?: ()=>void, reject?: ()=>void }); render a single <nw-confirm-dialog /> at the app root.

## Toast — <nw-toast> (NwToastComponent) + NwToastService
Render <nw-toast position="..." key?="..." /> once at the app root. Fire messages via:
NwToastService.show({ severity: 'success'|'info'|'warn'|'error'|'secondary'|'contrast', summary: string, detail?: string, life?: number, sticky?: boolean, closable?: boolean, key?: string, icon?: string }).
MIGRATION: PrimeNG MessageService.add({ severity, summary, detail }) becomes this.toast.show({ severity, summary, detail }) where
private toast = inject(NwToastService). PrimeNG severity 'error' stays 'error'.

## Tabs — <nw-tabs> (NwTabsComponent) / <nw-tab> (NwTabComponent)
<nw-tabs> inputs: activeIndex(model), orientation, scrollable, lazy; output tabClose. <nw-tab> inputs: header, disabled, closable, leftIcon, badge; directive nwTabHeader.

## Checkbox / Radio
<nw-checkbox> (NwCheckboxComponent): checked(model/CVA), label, disabled, indeterminate, size, invalid, readonly, inputId, name.
<nw-radio> (NwRadioComponent): value, selected(model/CVA), label, disabled, size, invalid, inputId, name. Bind the same [(selected)] (or [formControl]) across a radio set; use a shared name.

## Spinner / Skeleton
<nw-spinner> (NwSpinnerComponent): size(number px), label, variant, strokeWidth, animationDuration.
<nw-skeleton> (NwSkeletonComponent): width, height, shape('rect'|'circle'), rounded.

## NOT SUPPORTED yet (never fake these — flag as unresolved with a short TODO)
- DataTable: frozen columns/rows, cell/row inline editing, row grouping, per-cell custom template markup (buttons/links in cells).
- Dropdown: editable input, virtual scroll.
- Dialog: full-screen mode.
`;
