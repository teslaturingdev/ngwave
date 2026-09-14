import {
  Adapter,
  accordionAdapter,
  accordionTabAdapter,
  autocompleteAdapter,
  avatarAdapter,
  avatarGroupAdapter,
  buttonAdapter,
  cardAdapter,
  cascadeSelectAdapter,
  checkboxAdapter,
  chipAdapter,
  dataTableAdapter,
  dialogAdapter,
  dividerAdapter,
  dropdownAdapter,
  fieldsetAdapter,
  fileUploadAdapter,
  inputNumberAdapter,
  inputTextAdapter,
  listboxAdapter,
  overlayPanelAdapter,
  panelAdapter,
  primengTagAliases,
  radioAdapter,
  ratingAdapter,
  skeletonAdapter,
  sliderAdapter,
  spinnerAdapter,
  splitButtonAdapter,
  splitterAdapter,
  splitterPanelAdapter,
  stepsAdapter,
  tabAdapter,
  tabsAdapter,
  tagAdapter,
  textareaAdapter,
  toastAdapter,
  treeAdapter,
  treeSelectAdapter,
} from './adapters.js';
import {
  FoundElement,
  findElements,
  findMatchingClose,
  hasPlainAttr,
  parseAttributes,
} from './parser.js';
import { MigrationReport, MigrationResult } from './types.js';

interface Edit {
  start: number;
  end: number;
  replacement: string;
}

interface Note {
  bucket: keyof MigrationReport;
  message: string;
}

const PTEMPLATE_NOTES: Record<string, string> = {
  header:
    'Column header <ng-template pTemplate="header"> — build the [columns] array manually',
  body:
    'Cell template <ng-template pTemplate="body"> — build the [columns] array manually',
  footer:
    'Footer <ng-template pTemplate="footer"> — use the [footerColumns] array manually',
  caption:
    'Caption <ng-template pTemplate="caption"> — use the [caption] input manually',
};

function transformOpening(
  adapter: Adapter,
  el: FoundElement,
  dropNames: string[] = [],
): { opening: string; notes: Note[] } {
  const attrs = parseAttributes(el.attrsText);
  const outAttrs: string[] = [];
  const notes: Note[] = [];

  for (const attr of attrs) {
    if (dropNames.includes(attr.name)) continue;
    const res = adapter.mapAttr(attr);
    if (res.bucket === 'passthrough') {
      outAttrs.push(attr.raw);
      continue;
    }
    if (res.message) notes.push({ bucket: res.bucket, message: res.message });
    if (res.output) outAttrs.push(res.output);
  }

  // De-duplicate target attributes (e.g. severity + [outlined] both → variant);
  // the last occurrence wins, and we flag the collision for review.
  const seen = new Map<string, number>();
  const deduped: string[] = [];
  for (const a of outAttrs) {
    const key = a.split('=')[0].trim();
    const existing = seen.get(key);
    if (existing !== undefined) {
      deduped[existing] = a;
      notes.push({
        bucket: 'manual',
        message: `Multiple PrimeNG props mapped to "${key}" — kept ${a}, please review`,
      });
    } else {
      seen.set(key, deduped.length);
      deduped.push(a);
    }
  }

  const attrsStr = deduped.length ? ' ' + deduped.join(' ') : '';
  const opening = `<${adapter.targetTag}${attrsStr}${
    el.selfClosing ? ' />' : '>'
  }`;
  return { opening, notes };
}

function scanTemplates(inner: string): Note[] {
  const notes: Note[] = [];
  const seen = new Set<string>();
  const re = /pTemplate\s*=\s*["'](\w+)["']/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(inner))) {
    const kind = m[1];
    const message = PTEMPLATE_NOTES[kind];
    if (message && !seen.has(kind)) {
      seen.add(kind);
      notes.push({ bucket: 'manual', message });
    }
  }
  return notes;
}

function applyEdits(src: string, edits: Edit[]): string {
  const sorted = [...edits].sort((a, b) => b.start - a.start);
  let out = src;
  for (const e of sorted) {
    out = out.slice(0, e.start) + e.replacement + out.slice(e.end);
  }
  return out;
}

export function migrate(source: string): MigrationResult {
  const edits: Edit[] = [];
  const notes: Note[] = [];
  const imports = new Set<string>();

  // --- p-table (element) ---
  for (const tag of primengTagAliases('p-table')) {
    for (const el of findElements(source, tag)) {
      const { opening, notes: n } = transformOpening(dataTableAdapter, el);
      edits.push({ start: el.start, end: el.end, replacement: opening });
      notes.push(...n);
      imports.add(dataTableAdapter.importName);

      if (!el.selfClosing) {
        const closeIdx = findMatchingClose(source, tag, el.end);
        const inner =
          closeIdx >= 0 ? source.slice(el.end, closeIdx) : source.slice(el.end);
        notes.push(...scanTemplates(inner));
      }
    }
  }

  // --- p-dropdown / p-select / p-multiSelect (element) ---
  for (const { tag: canonicalTag, multiple } of [
    { tag: 'p-dropdown', multiple: false },
    { tag: 'p-select', multiple: false },
    { tag: 'p-multiSelect', multiple: true },
  ]) {
    for (const tag of primengTagAliases(canonicalTag)) {
      for (const el of findElements(source, tag)) {
        const res = transformOpening(dropdownAdapter, el);
        let opening = res.opening;
        if (multiple) {
          opening = opening.replace(
            '<nw-dropdown',
            '<nw-dropdown [multiple]="true"',
          );
        }
        edits.push({ start: el.start, end: el.end, replacement: opening });
        notes.push(...res.notes);
        imports.add(dropdownAdapter.importName);
      }
    }
  }

  // --- p-dialog / p-sidebar (element) ---
  for (const canonicalTag of ['p-dialog', 'p-sidebar']) {
    for (const tag of primengTagAliases(canonicalTag)) {
      for (const el of findElements(source, tag)) {
        const { opening, notes: n } = transformOpening(dialogAdapter, el);
        edits.push({ start: el.start, end: el.end, replacement: opening });
        notes.push(...n);
        imports.add(dialogAdapter.importName);
      }
    }
  }

  // --- simple element adapters (opening transform + closing rename) ---
  const simpleAdapters: Adapter[] = [
    tabsAdapter,
    tabAdapter,
    checkboxAdapter,
    radioAdapter,
    spinnerAdapter,
    skeletonAdapter,
    dividerAdapter,
    avatarAdapter,
    avatarGroupAdapter,
    tagAdapter,
    chipAdapter,
    fieldsetAdapter,
    panelAdapter,
    cardAdapter,
    accordionAdapter,
    accordionTabAdapter,
    stepsAdapter,
    sliderAdapter,
    ratingAdapter,
    fileUploadAdapter,
    listboxAdapter,
    splitButtonAdapter,
    overlayPanelAdapter,
    cascadeSelectAdapter,
    splitterAdapter,
    splitterPanelAdapter,
    treeAdapter,
    treeSelectAdapter,
  ];
  for (const adapter of simpleAdapters) {
    for (const tag of primengTagAliases(adapter.sourceTag)) {
      for (const el of findElements(source, tag)) {
        const { opening, notes: n } = transformOpening(adapter, el);
        edits.push({ start: el.start, end: el.end, replacement: opening });
        notes.push(...n);
        imports.add(adapter.importName);
      }
    }
  }

  // --- p-toast (element) ---
  for (const tag of primengTagAliases('p-toast')) {
    for (const el of findElements(source, tag)) {
      const { opening, notes: n } = transformOpening(toastAdapter, el);
      edits.push({ start: el.start, end: el.end, replacement: opening });
      notes.push(...n);
      notes.push({
        bucket: 'manual',
        message:
          'Replace PrimeNG MessageService.add(...) calls with NwToastService.show({ severity, summary, detail })',
      });
      imports.add(toastAdapter.importName);
    }
  }

  // --- p-button (element) ---
  for (const tag of primengTagAliases('p-button')) {
    for (const el of findElements(source, tag)) {
      const { opening, notes: n } = transformOpening(buttonAdapter, el);
      edits.push({ start: el.start, end: el.end, replacement: opening });
      notes.push(...n);
      imports.add(buttonAdapter.importName);
    }
  }

  // --- button[pButton] (attribute directive) ---
  for (const el of findElements(source, 'button')) {
    const attrs = parseAttributes(el.attrsText);
    if (!hasPlainAttr(attrs, 'pButton')) continue;
    const { opening, notes: n } = transformOpening(buttonAdapter, el, ['pButton']);
    edits.push({ start: el.start, end: el.end, replacement: opening });
    notes.push(...n);
    imports.add(buttonAdapter.importName);
    if (!el.selfClosing) {
      const closeIdx = findMatchingClose(source, 'button', el.end);
      if (closeIdx >= 0) {
        edits.push({
          start: closeIdx,
          end: closeIdx + '</button>'.length,
          replacement: '</nw-button>',
        });
      }
    }
  }

  // --- p-inputNumber / p-autoComplete (elements) ---
  for (const { adapter, tag: canonicalTag } of [
    { adapter: inputNumberAdapter, tag: 'p-inputNumber' },
    { adapter: autocompleteAdapter, tag: 'p-autoComplete' },
  ]) {
    for (const tag of primengTagAliases(canonicalTag)) {
      for (const el of findElements(source, tag)) {
        const { opening, notes: n } = transformOpening(adapter, el);
        edits.push({ start: el.start, end: el.end, replacement: opening });
        notes.push(...n);
        imports.add(adapter.importName);
      }
    }
  }

  // --- input[pInputText] (attribute directive on a void element) ---
  for (const el of findElements(source, 'input')) {
    const attrs = parseAttributes(el.attrsText);
    if (!hasPlainAttr(attrs, 'pInputText')) continue;
    const { opening, notes: n } = transformOpening(inputTextAdapter, el, [
      'pInputText',
    ]);
    const open = opening.replace(/\s*\/?>$/, '');
    edits.push({
      start: el.start,
      end: el.end,
      replacement: `${open}></nw-input-text>`,
    });
    notes.push(...n);
    imports.add(inputTextAdapter.importName);
  }

  // --- textarea[pInputTextarea] (attribute directive) ---
  for (const el of findElements(source, 'textarea')) {
    const attrs = parseAttributes(el.attrsText);
    if (!hasPlainAttr(attrs, 'pInputTextarea')) continue;
    const { opening, notes: n } = transformOpening(textareaAdapter, el, [
      'pInputTextarea',
    ]);
    edits.push({ start: el.start, end: el.end, replacement: opening });
    notes.push(...n);
    imports.add(textareaAdapter.importName);
    if (!el.selfClosing) {
      const closeIdx = findMatchingClose(source, 'textarea', el.end);
      if (closeIdx >= 0) {
        edits.push({
          start: closeIdx,
          end: closeIdx + '</textarea>'.length,
          replacement: '</nw-textarea>',
        });
      }
    }
  }

  // Closing tags are matched literally (not via findElements), so every
  // casing alias of every source tag needs its own replacement — otherwise
  // e.g. `<p-radiobutton>` would open as `<nw-radio>` but close as the
  // untouched `</p-radiobutton>`, producing invalid mismatched output.
  const CLOSING_TAG_MAP: [string, string][] = [
    ['p-table', 'nw-data-table'],
    ['p-inputNumber', 'nw-input-number'],
    ['p-autoComplete', 'nw-autocomplete'],
    ['p-button', 'nw-button'],
    ['p-dropdown', 'nw-dropdown'],
    ['p-select', 'nw-dropdown'],
    ['p-multiSelect', 'nw-dropdown'],
    ['p-dialog', 'nw-dialog'],
    ['p-sidebar', 'nw-dialog'],
    ['p-toast', 'nw-toast'],
    ['p-tabView', 'nw-tabs'],
    ['p-tabPanel', 'nw-tab'],
    ['p-checkbox', 'nw-checkbox'],
    ['p-radioButton', 'nw-radio'],
    ['p-progressSpinner', 'nw-spinner'],
    ['p-skeleton', 'nw-skeleton'],
    ['p-divider', 'nw-divider'],
    ['p-avatar', 'nw-avatar'],
    ['p-avatarGroup', 'nw-avatar-group'],
    ['p-tag', 'nw-tag'],
    ['p-chip', 'nw-chip'],
    ['p-fieldset', 'nw-fieldset'],
    ['p-panel', 'nw-panel'],
    ['p-card', 'nw-card'],
    ['p-accordion', 'nw-accordion'],
    ['p-accordionTab', 'nw-accordion-tab'],
    ['p-steps', 'nw-steps'],
    ['p-slider', 'nw-slider'],
    ['p-rating', 'nw-rating'],
    ['p-fileUpload', 'nw-file-upload'],
    ['p-listbox', 'nw-listbox'],
    ['p-splitButton', 'nw-split-button'],
    ['p-overlayPanel', 'nw-overlay-panel'],
    ['p-cascadeSelect', 'nw-cascade-select'],
    ['p-splitter', 'nw-splitter'],
    ['p-splitterPanel', 'nw-splitter-panel'],
    ['p-tree', 'nw-tree'],
    ['p-treeSelect', 'nw-tree-select'],
  ];

  let code = applyEdits(source, edits);
  for (const [sourceTag, targetTag] of CLOSING_TAG_MAP) {
    for (const alias of primengTagAliases(sourceTag)) {
      code = code.split(`</${alias}>`).join(`</${targetTag}>`);
    }
  }

  const report: MigrationReport = { mapped: [], manual: [], unsupported: [] };
  for (const note of notes) {
    const bucket = report[note.bucket];
    if (!bucket.includes(note.message)) bucket.push(note.message);
  }

  return { code, imports: [...imports], report };
}
