/**
 * Hand-curated PrimeNG → Angular Material cost estimate. This is an ESTIMATE,
 * not a guarantee — Material has no packaged equivalent for a lot of PrimeNG's
 * surface area, and "mapped" here means "a close 1:1 swap exists", not
 * "identical behavior". Keep notes honest; this is what earns trust for the
 * whole report (see Design Doc — "NgWave's column being exact anchors trust
 * for the estimated columns").
 */

export type MaterialStatus = 'mapped' | 'partial' | 'unsupported';

export interface MaterialMapping {
  materialEquivalent: string;
  status: MaterialStatus;
  /** 1 = trivial swap, 2 = moderate rework, 3 = heavy rework / custom build. */
  effort: 1 | 2 | 3;
  note: string;
}

export const MATERIAL_FALLBACK: MaterialMapping = {
  materialEquivalent: '—',
  status: 'unsupported',
  effort: 3,
  note: 'Not yet catalogued in this report — treat as a custom build until confirmed otherwise.',
};

export const MATERIAL_MAP: Record<string, MaterialMapping> = {
  'p-button': {
    materialEquivalent: 'mat-button family (raised/flat/stroked/icon)',
    status: 'partial',
    effort: 2,
    note: 'No single component — severity/outlined/text map to different Material button variants; needs remapping per usage.',
  },
  pButton: {
    materialEquivalent: 'matButton directive',
    status: 'partial',
    effort: 2,
    note: 'Same remapping work as p-button, applied to the attribute-directive form.',
  },
  'p-table': {
    materialEquivalent: 'mat-table + MatSort + MatPaginator + MatTableDataSource',
    status: 'partial',
    effort: 3,
    note: 'Material’s table is headless — you assemble sort/paginate/filter yourself. No built-in global filter, frozen columns, row grouping, or inline edit.',
  },
  'p-dropdown': {
    materialEquivalent: 'mat-select',
    status: 'mapped',
    effort: 1,
    note: 'Close 1:1 for simple option lists.',
  },
  'p-select': {
    materialEquivalent: 'mat-select',
    status: 'mapped',
    effort: 1,
    note: 'Close 1:1 for simple option lists.',
  },
  'p-multiSelect': {
    materialEquivalent: 'mat-select [multiple]',
    status: 'mapped',
    effort: 1,
    note: 'Close 1:1; chip-list display needs a small template change.',
  },
  'p-dialog': {
    materialEquivalent: 'MatDialog (service-based)',
    status: 'partial',
    effort: 3,
    note: 'Structural rework — declarative <p-dialog> becomes a component opened imperatively via a service call.',
  },
  'p-sidebar': {
    materialEquivalent: 'MatSidenav',
    status: 'partial',
    effort: 2,
    note: 'Needs a <mat-sidenav-container> wrapper — different structural model than a standalone overlay.',
  },
  'p-tabView': {
    materialEquivalent: 'mat-tab-group',
    status: 'mapped',
    effort: 1,
    note: 'Close 1:1.',
  },
  'p-tabPanel': {
    materialEquivalent: 'mat-tab',
    status: 'mapped',
    effort: 1,
    note: 'Close 1:1.',
  },
  'p-checkbox': {
    materialEquivalent: 'mat-checkbox',
    status: 'mapped',
    effort: 1,
    note: 'Close 1:1.',
  },
  'p-radioButton': {
    materialEquivalent: 'mat-radio-button + mat-radio-group',
    status: 'mapped',
    effort: 1,
    note: 'Close 1:1.',
  },
  'p-progressSpinner': {
    materialEquivalent: 'mat-progress-spinner',
    status: 'mapped',
    effort: 1,
    note: 'Close 1:1.',
  },
  'p-skeleton': {
    materialEquivalent: '—',
    status: 'unsupported',
    effort: 2,
    note: 'No built-in Material skeleton — custom CSS shimmer or a third-party package.',
  },
  'p-toast': {
    materialEquivalent: 'MatSnackBar (service-based)',
    status: 'partial',
    effort: 2,
    note: 'One message at a time by default — no built-in stacked toast list like PrimeNG’s.',
  },
  'p-inputNumber': {
    materialEquivalent: '—',
    status: 'unsupported',
    effort: 2,
    note: 'No native Material numeric input with currency/steppers — custom component or third-party package.',
  },
  'p-autoComplete': {
    materialEquivalent: 'MatAutocomplete',
    status: 'partial',
    effort: 2,
    note: 'Different completion event model — the (input) + panel wiring needs rework, similar to NgWave’s own note on this component.',
  },
  pInputText: {
    materialEquivalent: 'matInput directive',
    status: 'mapped',
    effort: 1,
    note: 'Close 1:1; wrap in <mat-form-field> for label/hint/error styling.',
  },
  pInputTextarea: {
    materialEquivalent: 'matInput on <textarea>',
    status: 'mapped',
    effort: 1,
    note: 'Close 1:1.',
  },
  'p-calendar': {
    materialEquivalent: 'MatDatepicker',
    status: 'partial',
    effort: 2,
    note: 'Different API; classic MatDatepicker has no built-in time picker.',
  },
  'p-chart': {
    materialEquivalent: '—',
    status: 'unsupported',
    effort: 3,
    note: 'Material has no charting library — bring your own (ngx-charts, Chart.js) regardless of destination.',
  },
  'p-menu': {
    materialEquivalent: 'mat-menu',
    status: 'partial',
    effort: 2,
    note: 'Different trigger/composition model.',
  },
  'p-menubar': {
    materialEquivalent: 'mat-toolbar + mat-menu',
    status: 'partial',
    effort: 2,
    note: 'Assembled from parts, not a single component.',
  },
  'p-accordion': {
    materialEquivalent: 'mat-accordion + mat-expansion-panel',
    status: 'mapped',
    effort: 1,
    note: 'Close 1:1.',
  },
  'p-card': {
    materialEquivalent: 'mat-card',
    status: 'mapped',
    effort: 1,
    note: 'Close 1:1.',
  },
  'p-fileUpload': {
    materialEquivalent: '—',
    status: 'unsupported',
    effort: 2,
    note: 'No built-in Material upload component — build on <input type="file"> + custom UI.',
  },
  'p-tag': {
    materialEquivalent: 'mat-chip',
    status: 'partial',
    effort: 1,
    note: 'Severity-based coloring needs custom styling.',
  },
  'p-chip': {
    materialEquivalent: 'mat-chip',
    status: 'mapped',
    effort: 1,
    note: 'Close 1:1.',
  },
  'p-confirmDialog': {
    materialEquivalent: 'MatDialog + a custom confirm component',
    status: 'partial',
    effort: 2,
    note: 'No built-in confirm service like PrimeNG’s ConfirmationService — build a small reusable dialog.',
  },
  'p-confirmPopup': {
    materialEquivalent: 'CDK Overlay + a custom confirm component',
    status: 'partial',
    effort: 2,
    note: 'Same gap as p-confirmDialog, anchored instead of centered.',
  },
  'p-avatar': {
    materialEquivalent: '—',
    status: 'unsupported',
    effort: 1,
    note: 'Trivial to build with CSS, but no packaged component.',
  },
  'p-breadcrumb': {
    materialEquivalent: '—',
    status: 'unsupported',
    effort: 1,
    note: 'No dedicated Material breadcrumb component.',
  },
  'p-splitButton': {
    materialEquivalent: 'mat-button + mat-menu',
    status: 'partial',
    effort: 2,
    note: 'Assembled from parts, not a single component.',
  },
  'p-inputSwitch': {
    materialEquivalent: 'mat-slide-toggle',
    status: 'mapped',
    effort: 1,
    note: 'Close 1:1.',
  },
  'p-toggleSwitch': {
    materialEquivalent: 'mat-slide-toggle',
    status: 'mapped',
    effort: 1,
    note: 'Close 1:1 (newer PrimeNG naming for p-inputSwitch).',
  },
  'p-slider': {
    materialEquivalent: 'mat-slider',
    status: 'mapped',
    effort: 1,
    note: 'Close 1:1.',
  },
  'p-rating': {
    materialEquivalent: '—',
    status: 'unsupported',
    effort: 1,
    note: 'No built-in Material rating component.',
  },
  'p-progressBar': {
    materialEquivalent: 'mat-progress-bar',
    status: 'mapped',
    effort: 1,
    note: 'Close 1:1.',
  },
  pTooltip: {
    materialEquivalent: 'matTooltip directive',
    status: 'mapped',
    effort: 1,
    note: 'Close 1:1.',
  },
  'p-paginator': {
    materialEquivalent: 'MatPaginator',
    status: 'mapped',
    effort: 1,
    note: 'Close 1:1 when used standalone.',
  },
  'p-panel': {
    materialEquivalent: 'mat-expansion-panel or mat-card',
    status: 'partial',
    effort: 1,
    note: 'Toggle/header behavior differs slightly.',
  },
  'p-fieldset': {
    materialEquivalent: 'mat-card or plain <fieldset>',
    status: 'partial',
    effort: 1,
    note: 'No dedicated Material fieldset component.',
  },
  'p-divider': {
    materialEquivalent: 'mat-divider',
    status: 'mapped',
    effort: 1,
    note: 'Close 1:1.',
  },
  'p-toolbar': {
    materialEquivalent: 'mat-toolbar',
    status: 'mapped',
    effort: 1,
    note: 'Close 1:1.',
  },
  'p-tree': {
    materialEquivalent: 'mat-tree (CDK-based)',
    status: 'partial',
    effort: 3,
    note: 'Requires manual data-source wiring; no built-in checkbox-selection or drag-drop like PrimeNG’s.',
  },
  'p-listbox': {
    materialEquivalent: 'mat-selection-list',
    status: 'mapped',
    effort: 1,
    note: 'Close 1:1.',
  },
  'p-colorPicker': {
    materialEquivalent: '—',
    status: 'unsupported',
    effort: 2,
    note: 'No built-in Material color picker.',
  },
  'p-inputMask': {
    materialEquivalent: '—',
    status: 'unsupported',
    effort: 2,
    note: 'No built-in input masking — needs a masking library.',
  },
  'p-cascadeSelect': {
    materialEquivalent: '—',
    status: 'unsupported',
    effort: 3,
    note: 'No direct equivalent.',
  },
  'p-treeSelect': {
    materialEquivalent: '—',
    status: 'unsupported',
    effort: 3,
    note: 'No direct equivalent.',
  },
  'p-overlayPanel': {
    materialEquivalent: 'CDK Overlay (direct)',
    status: 'partial',
    effort: 2,
    note: 'No packaged component — build directly on CDK Overlay.',
  },
  'p-galleria': {
    materialEquivalent: '—',
    status: 'unsupported',
    effort: 3,
    note: 'No Material gallery/lightbox component.',
  },
  'p-carousel': {
    materialEquivalent: '—',
    status: 'unsupported',
    effort: 2,
    note: 'No Material carousel component.',
  },
  'p-image': {
    materialEquivalent: '<img> + CDK dialog for preview',
    status: 'partial',
    effort: 1,
    note: 'Basic display is trivial; zoom/preview needs assembly.',
  },
  'p-steps': {
    materialEquivalent: 'mat-stepper',
    status: 'partial',
    effort: 2,
    note: 'Structurally different — mat-stepper requires step content, not just labels.',
  },
  'p-organizationChart': {
    materialEquivalent: '—',
    status: 'unsupported',
    effort: 3,
    note: 'No equivalent.',
  },
  'p-timeline': {
    materialEquivalent: '—',
    status: 'unsupported',
    effort: 2,
    note: 'No built-in Material timeline component.',
  },
  'p-splitter': {
    materialEquivalent: '—',
    status: 'unsupported',
    effort: 2,
    note: 'No built-in Material splitter/resizable-panes component.',
  },
  'p-orderList': {
    materialEquivalent: 'CDK drag-drop (custom)',
    status: 'unsupported',
    effort: 3,
    note: 'No packaged component — build on CDK drag-drop.',
  },
  'p-pickList': {
    materialEquivalent: 'CDK drag-drop (custom)',
    status: 'unsupported',
    effort: 3,
    note: 'No packaged component — build on CDK drag-drop.',
  },
  'p-virtualScroller': {
    materialEquivalent: 'cdk-virtual-scroll-viewport',
    status: 'partial',
    effort: 2,
    note: 'The list template needs to be rebuilt against CDK’s virtual scroll API.',
  },
  'p-blockUI': {
    materialEquivalent: '—',
    status: 'unsupported',
    effort: 1,
    note: 'Simple to build as an overlay div — no packaged component.',
  },
  'p-scrollTop': {
    materialEquivalent: '—',
    status: 'unsupported',
    effort: 1,
    note: 'Trivial to build — no packaged component.',
  },
  'p-knob': {
    materialEquivalent: '—',
    status: 'unsupported',
    effort: 2,
    note: 'No equivalent.',
  },
  'p-inplace': {
    materialEquivalent: '—',
    status: 'unsupported',
    effort: 1,
    note: 'Simple to build as a click-to-edit toggle — no packaged component.',
  },
};

export function getMaterialMapping(tag: string): MaterialMapping {
  return MATERIAL_MAP[tag] ?? MATERIAL_FALLBACK;
}
