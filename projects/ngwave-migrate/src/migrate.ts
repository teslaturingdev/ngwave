import {
  Adapter,
  accordionAdapter,
  accordionPanelAdapter,
  accordionTabAdapter,
  autocompleteAdapter,
  avatarAdapter,
  avatarGroupAdapter,
  badgeAdapter,
  breadcrumbAdapter,
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
  messageAdapter,
  overlayBadgeAdapter,
  overlayPanelAdapter,
  panelAdapter,
  popoverAdapter,
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

/** Remove every instance (all casing aliases) of a self-contained element, tag and content included. */
function stripElement(
  code: string,
  sourceTag: string,
  message: string,
  bucket: keyof MigrationReport = 'manual',
): { code: string; notes: Note[] } {
  let out = code;
  let found = false;
  for (const tag of primengTagAliases(sourceTag)) {
    while (true) {
      const els = findElements(out, tag);
      if (els.length === 0) break;
      const el = els[0];
      found = true;
      let end = el.end;
      if (!el.selfClosing) {
        const closeIdx = findMatchingClose(out, tag, el.end);
        end = closeIdx >= 0 ? closeIdx + `</${tag}>`.length : el.end;
      }
      out = out.slice(0, el.start) + out.slice(end);
    }
  }
  return { code: out, notes: found ? [{ bucket, message }] : [] };
}

/** Remove just the open/close tags of an element (all casing aliases), keeping its inner content. */
function unwrapElement(
  code: string,
  sourceTag: string,
): { code: string; found: boolean } {
  let out = code;
  let found = false;
  for (const tag of primengTagAliases(sourceTag)) {
    while (true) {
      const els = findElements(out, tag);
      if (els.length === 0) break;
      const el = els[0];
      found = true;
      if (el.selfClosing) {
        out = out.slice(0, el.start) + out.slice(el.end);
        continue;
      }
      const closeIdx = findMatchingClose(out, tag, el.end);
      if (closeIdx < 0) {
        out = out.slice(0, el.start) + out.slice(el.end);
        continue;
      }
      const closeEnd = closeIdx + `</${tag}>`.length;
      out = out.slice(0, closeIdx) + out.slice(closeEnd);
      out = out.slice(0, el.start) + out.slice(el.end);
    }
  }
  return { code: out, found };
}

/** Remove a bare attribute (e.g. `pRipple`) wherever it appears in any tag, across the whole source. */
function stripAttrGlobal(
  code: string,
  attrName: string,
  message: string,
): { code: string; notes: Note[] } {
  const re = new RegExp(`\\s${attrName}(?=[\\s/>])`, 'g');
  let found = false;
  const out = code.replace(re, () => {
    found = true;
    return '';
  });
  return { code: out, notes: found ? [{ bucket: 'manual', message }] : [] };
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

  // --- p-tabs / p-tablist / p-tab / p-tabpanels / p-tabpanel (PrimeNG v19
  // compositional Tabs API) → nw-tabs / nw-tab. Structurally distinct from
  // the legacy p-tabView/p-tabPanel API (separate header list + panel list
  // vs. NgWave's single paired nw-tab), so this restructures the whole
  // <p-tabs> subtree in one edit rather than a per-attribute rename. Note:
  // PrimeNG's own casing-alias scheme makes lowercase `p-tabpanel` (this
  // API's individual panel) collide with legacy p-tabPanel's lowercase
  // alias — consumedTabsRanges below tells the legacy tabAdapter loop to
  // skip anything already claimed here.
  const consumedTabsRanges: [number, number][] = [];
  for (const el of findElements(source, 'p-tabs')) {
    if (el.selfClosing) continue;
    const closeIdx = findMatchingClose(source, 'p-tabs', el.end);
    if (closeIdx < 0) continue;
    const outerEnd = closeIdx + '</p-tabs>'.length;
    consumedTabsRanges.push([el.start, outerEnd]);
    const inner = source.slice(el.end, closeIdx);

    const tabs: { value: string; header: string }[] = [];
    for (const te of findElements(inner, 'p-tab')) {
      const attrs = parseAttributes(te.attrsText);
      const value = attrs.find((a) => a.name === 'value')?.value ?? String(tabs.length);
      const closeI = te.selfClosing ? te.end : findMatchingClose(inner, 'p-tab', te.end);
      const header = te.selfClosing
        ? ''
        : (closeI >= 0 ? inner.slice(te.end, closeI) : '').trim();
      tabs.push({ value, header });
    }

    const panels = new Map<string, string>();
    for (const pe of findElements(inner, 'p-tabpanel')) {
      const attrs = parseAttributes(pe.attrsText);
      const value = attrs.find((a) => a.name === 'value')?.value ?? String(panels.size);
      const closeI = pe.selfClosing ? pe.end : findMatchingClose(inner, 'p-tabpanel', pe.end);
      const body = pe.selfClosing ? '' : closeI >= 0 ? inner.slice(pe.end, closeI) : '';
      panels.set(value, body);
    }

    let activeAttr = '';
    const tabsAttrs = parseAttributes(el.attrsText);
    const valueAttr = tabsAttrs.find((a) => a.name === 'value');
    if (valueAttr) {
      if (valueAttr.kind !== 'plain') {
        notes.push({
          bucket: 'manual',
          message:
            '<p-tabs> [value]/(valueChange) binding — wire nw-tabs [(activeIndex)] to your own numeric index manually',
        });
      } else {
        const idx = tabs.findIndex((t) => t.value === valueAttr.value);
        if (idx >= 0) activeAttr = ` activeIndex="${idx}"`;
      }
    }

    const tabsMarkup = tabs
      .map(
        (t) =>
          `<nw-tab header="${t.header.replace(/"/g, '&quot;')}">${panels.get(t.value) ?? ''}</nw-tab>`,
      )
      .join('\n  ');

    edits.push({
      start: el.start,
      end: outerEnd,
      replacement: `<nw-tabs${activeAttr}>\n  ${tabsMarkup}\n</nw-tabs>`,
    });
    notes.push({
      bucket: 'mapped',
      message:
        '<p-tabs>/<p-tablist>/<p-tab>/<p-tabpanels>/<p-tabpanel> (v19 compositional API) → <nw-tabs>/<nw-tab>',
    });
    imports.add('NwTabsComponent');
    imports.add('NwTabComponent');
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
    breadcrumbAdapter,
    popoverAdapter,
    accordionPanelAdapter,
    badgeAdapter,
    overlayBadgeAdapter,
    messageAdapter,
  ];
  for (const adapter of simpleAdapters) {
    for (const tag of primengTagAliases(adapter.sourceTag)) {
      for (const el of findElements(source, tag)) {
        if (consumedTabsRanges.some(([s, e]) => el.start >= s && el.start < e)) continue;
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

  // --- p-iconField + p-inputIcon + input[pInputText] wrapper pattern ---
  // Collapses PrimeNG's `<p-iconField><p-inputIcon class="..." /><input pInputText/></p-iconField>`
  // onto nw-input-text's built-in iconLeft/iconRight, since it already supports icons natively.
  const consumedInputStarts = new Set<number>();
  for (const tag of primengTagAliases('p-iconField')) {
    for (const el of findElements(source, tag)) {
      if (el.selfClosing) continue;
      const closeIdx = findMatchingClose(source, tag, el.end);
      if (closeIdx < 0) continue;
      const inner = source.slice(el.end, closeIdx);

      let iconClass: string | undefined;
      let iconElStart = -1;
      for (const iconTag of primengTagAliases('p-inputIcon')) {
        const found = findElements(inner, iconTag);
        if (found.length) {
          const fe = found[0];
          const iconAttrs = parseAttributes(fe.attrsText);
          const classAttr = iconAttrs.find(
            (a) => a.name === 'class' || a.name === 'styleClass',
          );
          iconClass = classAttr?.value ?? '';
          iconElStart = fe.start;
          break;
        }
      }

      const inputEl = findElements(inner, 'input').find((ie) =>
        hasPlainAttr(parseAttributes(ie.attrsText), 'pInputText'),
      );

      if (inputEl && iconClass !== undefined) {
        const { opening } = transformOpening(inputTextAdapter, inputEl, [
          'pInputText',
        ]);
        const iconAttrName = iconElStart > inputEl.start ? 'iconRight' : 'iconLeft';
        const merged = opening.replace(
          /\s*\/?>$/,
          ` ${iconAttrName}="${iconClass}" />`,
        );
        edits.push({
          start: el.start,
          end: closeIdx + `</${tag}>`.length,
          replacement: merged,
        });
        notes.push({
          bucket: 'mapped',
          message: `<p-iconField>+<p-inputIcon>+input[pInputText] → <nw-input-text ${iconAttrName}="${iconClass}" />`,
        });
        imports.add(inputTextAdapter.importName);
        consumedInputStarts.add(el.end + inputEl.start);
      }
    }
  }

  // --- input[pInputText] (attribute directive on a void element) ---
  for (const el of findElements(source, 'input')) {
    if (consumedInputStarts.has(el.start)) continue;
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
    ['p-breadcrumb', 'nw-breadcrumb'],
    ['p-popover', 'nw-overlay-panel'],
    ['p-accordion-panel', 'nw-accordion-tab'],
    ['p-badge', 'nw-badge'],
    ['p-overlaybadge', 'nw-overlay-badge'],
    ['p-message', 'nw-message'],
  ];

  let code = applyEdits(source, edits);
  for (const [sourceTag, targetTag] of CLOSING_TAG_MAP) {
    for (const alias of primengTagAliases(sourceTag)) {
      code = code.split(`</${alias}>`).join(`</${targetTag}>`);
    }
  }

  // --- p-fluid: full-width layout wrapper → plain <div class="w-full"> ---
  for (const tag of primengTagAliases('p-fluid')) {
    let hadFluid = false;
    while (true) {
      const els = findElements(code, tag);
      if (els.length === 0) break;
      const el = els[0];
      hadFluid = true;
      const replacement = el.selfClosing ? '' : '<div class="w-full">';
      code = code.slice(0, el.start) + replacement + code.slice(el.end);
    }
    if (hadFluid) {
      for (const alias of primengTagAliases('p-fluid')) {
        code = code.split(`</${alias}>`).join('</div>');
      }
      notes.push({
        bucket: 'mapped',
        message: '<p-fluid> → <div class="w-full"> (full-width form layout)',
      });
    }
  }

  // --- p-buttongroup: connected-button wrapper → plain flex div ---
  for (const tag of primengTagAliases('p-buttongroup')) {
    let hadGroup = false;
    while (true) {
      const els = findElements(code, tag);
      if (els.length === 0) break;
      const el = els[0];
      hadGroup = true;
      const replacement = el.selfClosing ? '' : '<div class="inline-flex -space-x-px">';
      code = code.slice(0, el.start) + replacement + code.slice(el.end);
    }
    if (hadGroup) {
      for (const alias of primengTagAliases('p-buttongroup')) {
        code = code.split(`</${alias}>`).join('</div>');
      }
      notes.push({
        bucket: 'manual',
        message:
          '<p-buttongroup> → <div class="inline-flex -space-x-px"> — adjust nw-button rounding manually for a fully connected look if desired',
      });
    }
  }

  // --- p-accordion-header (v19 compositional accordion) → <ng-template nwAccordionHeader> ---
  for (const tag of primengTagAliases('p-accordion-header')) {
    let hadHeader = false;
    while (true) {
      const els = findElements(code, tag);
      if (els.length === 0) break;
      const el = els[0];
      hadHeader = true;
      const replacement = el.selfClosing ? '' : '<ng-template nwAccordionHeader>';
      code = code.slice(0, el.start) + replacement + code.slice(el.end);
    }
    if (hadHeader) {
      for (const alias of primengTagAliases('p-accordion-header')) {
        code = code.split(`</${alias}>`).join('</ng-template>');
      }
      imports.add('NwAccordionHeaderDirective');
      notes.push({
        bucket: 'mapped',
        message:
          '<p-accordion-header> → <ng-template nwAccordionHeader> — for plain-text headers, the header="" input on nw-accordion-tab is simpler',
      });
    }
  }

  // --- p-accordion-content (v19 compositional accordion) → unwrap, nw-accordion-tab projects its body directly ---
  {
    const { code: unwrapped, found } = unwrapElement(code, 'p-accordion-content');
    code = unwrapped;
    if (found) {
      notes.push({
        bucket: 'mapped',
        message: '<p-accordion-content> unwrapped — nw-accordion-tab projects its body directly',
      });
    }
  }

  // --- p-iconField / p-inputIcon fallback for shapes the wrapper-pattern block above didn't recognize ---
  {
    const { code: unwrapped, found } = unwrapElement(code, 'p-iconField');
    code = unwrapped;
    if (found) {
      notes.push({
        bucket: 'manual',
        message:
          '<p-iconField> unwrapped — could not auto-detect an input[pInputText] inside; set iconLeft/iconRight on the target nw- input component manually',
      });
    }
    const res = stripElement(
      code,
      'p-inputIcon',
      '<p-inputIcon> removed — set its icon class via iconLeft/iconRight on the sibling nw- input component manually',
      'manual',
    );
    code = res.code;
    notes.push(...res.notes);
  }

  // --- Strip-only tags with no NgWave target: remove and leave a note ---
  const STRIP_ELEMENTS: [string, string, keyof MigrationReport][] = [
    [
      'p-sortIcon',
      "<p-sortIcon> removed — nw-data-table's sort indicator is built in automatically",
      'manual',
    ],
    [
      'p-columnFilter',
      '<p-columnFilter> removed — configure per-column filtering via the filter property on the matching entry in nw-data-table\'s [columns] array',
      'manual',
    ],
    [
      'p-tableHeaderCheckbox',
      '<p-tableHeaderCheckbox> removed — nw-data-table renders the select-all checkbox automatically when [selectable]="true"',
      'manual',
    ],
    [
      'p-tableCheckbox',
      '<p-tableCheckbox> removed — nw-data-table renders row checkboxes automatically when [selectable]="true"',
      'manual',
    ],
  ];
  for (const [tag, message, bucket] of STRIP_ELEMENTS) {
    const res = stripElement(code, tag, message, bucket);
    code = res.code;
    notes.push(...res.notes);
  }

  // --- pRipple: attribute directive, NgWave has no ripple system — safe to drop ---
  {
    const res = stripAttrGlobal(
      code,
      'pRipple',
      'pRipple removed — NgWave has no ripple-effect system; this is safe to drop',
    );
    code = res.code;
    notes.push(...res.notes);
  }

  // --- pBadge: attribute directive that overlays a badge on its host element.
  // Wrapping the host in <nw-overlay-badge> is a structural change (unlike a
  // simple attribute rename), so this strips the directive and its own
  // value/severity attrs and leaves a manual note instead of guessing.
  {
    const re = /\spBadge(?:="[^"]*"|='[^']*')?(?=[\s/>])/g;
    let hadPBadge = false;
    code = code.replace(re, () => {
      hadPBadge = true;
      return '';
    });
    if (hadPBadge) {
      notes.push({
        bucket: 'manual',
        message:
          'pBadge removed — wrap the element in <nw-overlay-badge value="..." severity="...">...</nw-overlay-badge> manually',
      });
    }
  }

  const report: MigrationReport = { mapped: [], manual: [], unsupported: [] };
  for (const note of notes) {
    const bucket = report[note.bucket];
    if (!bucket.includes(note.message)) bucket.push(note.message);
  }

  return { code, imports: [...imports], report };
}
