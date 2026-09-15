import { describe, expect, it } from 'vitest';
import { migrate } from './index';

describe('p-sortIcon', () => {
  it('strips the element and leaves a manual note', () => {
    const out = migrate(
      `<th>Name <p-sortIcon field="name"></p-sortIcon></th>`,
    );
    expect(out.code).not.toContain('p-sortIcon');
    expect(out.report.manual.some((m) => m.includes('sort indicator'))).toBe(true);
  });
});

describe('pRipple', () => {
  it('strips the attribute wherever it appears', () => {
    const out = migrate(`<div pRipple class="x"><p-button pRipple label="Go"></p-button></div>`);
    expect(out.code).not.toContain('pRipple');
    expect(out.report.manual.some((m) => m.includes('ripple'))).toBe(true);
  });
});

describe('p-columnFilter', () => {
  it('strips the element with a DataTable feature-gap note', () => {
    const out = migrate(`<p-columnFilter field="name" type="text"></p-columnFilter>`);
    expect(out.code).not.toContain('p-columnFilter');
    expect(out.report.manual.some((m) => m.includes('[columns]'))).toBe(true);
  });
});

describe('p-iconField + p-inputIcon', () => {
  it('collapses the wrapper onto nw-input-text iconLeft', () => {
    const out = migrate(
      `<p-iconField><p-inputIcon class="pi pi-search" /><input pInputText [(ngModel)]="q" /></p-iconField>`,
    );
    expect(out.code).toContain('<nw-input-text');
    expect(out.code).toContain('iconLeft="pi pi-search"');
    expect(out.code).toContain('[(value)]="q"');
    expect(out.code).not.toContain('p-iconField');
    expect(out.code).not.toContain('p-inputIcon');
    expect(out.imports).toContain('NwInputTextComponent');
  });

  it('places the icon on iconRight when p-inputIcon follows the input', () => {
    const out = migrate(
      `<p-iconField><input pInputText [(ngModel)]="q" /><p-inputIcon class="pi pi-times" /></p-iconField>`,
    );
    expect(out.code).toContain('iconRight="pi pi-times"');
  });
});

describe('p-fluid', () => {
  it('maps to a full-width div wrapper', () => {
    const out = migrate(`<p-fluid><input pInputText /></p-fluid>`);
    expect(out.code).toContain('<div class="w-full">');
    expect(out.code).toContain('</div>');
    expect(out.code).not.toContain('p-fluid');
  });
});

describe('accordion v19 compositional API', () => {
  it('maps p-accordion-panel to nw-accordion-tab', () => {
    const out = migrate(
      `<p-accordion><p-accordion-panel value="0"><p-accordion-header>Title</p-accordion-header><p-accordion-content>Body</p-accordion-content></p-accordion-panel></p-accordion>`,
    );
    expect(out.code).toContain('<nw-accordion>');
    expect(out.code).toContain('<nw-accordion-tab');
    expect(out.code).toContain('</nw-accordion-tab>');
    expect(out.code).toContain('<ng-template nwAccordionHeader>Title</ng-template>');
    expect(out.code).toContain('Body');
    expect(out.code).not.toContain('p-accordion-content');
    expect(out.code).not.toContain('p-accordion-header');
    expect(out.imports).toContain('NwAccordionTabComponent');
    expect(out.imports).toContain('NwAccordionHeaderDirective');
  });
});

describe('p-tableHeaderCheckbox / p-tableCheckbox', () => {
  it('strips both with a note that selection is automatic', () => {
    const out = migrate(
      `<p-tableHeaderCheckbox></p-tableHeaderCheckbox><p-tableCheckbox [value]="row"></p-tableCheckbox>`,
    );
    expect(out.code).not.toContain('p-tableHeaderCheckbox');
    expect(out.code).not.toContain('p-tableCheckbox');
    expect(out.report.manual.some((m) => m.includes('select-all'))).toBe(true);
    expect(out.report.manual.some((m) => m.includes('row checkboxes'))).toBe(true);
  });
});

describe('p-breadcrumb', () => {
  it('maps to nw-breadcrumb, model → items', () => {
    const out = migrate(`<p-breadcrumb [model]="items"></p-breadcrumb>`);
    expect(out.code).toContain('<nw-breadcrumb');
    expect(out.code).toContain('[items]="items"');
    expect(out.code).toContain('</nw-breadcrumb>');
    expect(out.imports).toContain('NwBreadcrumbComponent');
  });
});

describe('p-popover', () => {
  it('maps to nw-overlay-panel', () => {
    const out = migrate(`<p-popover #op><p>Hi</p></p-popover>`);
    expect(out.code).toContain('<nw-overlay-panel');
    expect(out.code).toContain('</nw-overlay-panel>');
    expect(out.imports).toContain('NwOverlayPanelComponent');
  });
});

describe('p-buttongroup', () => {
  it('maps to a plain flex wrapper div', () => {
    const out = migrate(
      `<p-buttongroup><p-button label="A"></p-button><p-button label="B"></p-button></p-buttongroup>`,
    );
    expect(out.code).toContain('<div class="inline-flex -space-x-px">');
    expect(out.code).not.toContain('p-buttongroup');
  });
});
