import { describe, expect, it } from 'vitest';
import { migrate } from './index';

describe('menubar adapter', () => {
  it('migrates p-menubar with model', () => {
    const out = migrate(`<p-menubar [model]="items"></p-menubar>`);
    expect(out.code).toContain('<nw-menubar');
    expect(out.code).toContain('[model]="items"');
    expect(out.code).toContain('</nw-menubar>');
    expect(out.imports).toContain('NwMenuBarComponent');
  });
});

describe('tiered-menu adapter', () => {
  it('migrates p-tieredMenu with model/popup', () => {
    const out = migrate(`<p-tieredMenu [model]="items" [popup]="true"></p-tieredMenu>`);
    expect(out.code).toContain('<nw-tiered-menu');
    expect(out.code).toContain('[popup]="true"');
    expect(out.code).toContain('</nw-tiered-menu>');
    expect(out.imports).toContain('NwTieredMenuComponent');
  });
});

describe('context-menu adapter', () => {
  it('migrates p-contextMenu with model', () => {
    const out = migrate(`<p-contextMenu [model]="items"></p-contextMenu>`);
    expect(out.code).toContain('<nw-context-menu');
    expect(out.code).toContain('</nw-context-menu>');
    expect(out.imports).toContain('NwContextMenuComponent');
  });

  it('flags [global] as needing manual host-element wiring', () => {
    const out = migrate(`<p-contextMenu [model]="items" [global]="true"></p-contextMenu>`);
    expect(out.report.manual.some((m) => m.includes('global-listener'))).toBe(true);
  });
});

describe('panel-menu adapter', () => {
  it('migrates p-panelMenu with model', () => {
    const out = migrate(`<p-panelMenu [model]="items"></p-panelMenu>`);
    expect(out.code).toContain('<nw-panel-menu');
    expect(out.code).toContain('</nw-panel-menu>');
    expect(out.imports).toContain('NwPanelMenuComponent');
  });

  it('flags [multiple]="false" as unsupported (nw-panel-menu always allows multiple)', () => {
    const out = migrate(`<p-panelMenu [model]="items" [multiple]="false"></p-panelMenu>`);
    expect(out.report.unsupported.some((m) => m.includes('multiple expanded'))).toBe(true);
  });
});

describe('confirm-popup adapter', () => {
  it('renames p-confirmPopup', () => {
    const out = migrate(`<p-confirmPopup styleClass="mb-2"></p-confirmPopup>`);
    expect(out.code).toContain('<nw-confirm-popup');
    expect(out.code).toContain('class="mb-2"');
    expect(out.code).toContain('</nw-confirm-popup>');
    expect(out.imports).toContain('NwConfirmPopupComponent');
  });

  it('recognizes the lowercase alias (p-confirmpopup)', () => {
    const out = migrate(`<p-confirmpopup></p-confirmpopup>`);
    expect(out.code).toContain('<nw-confirm-popup');
    expect(out.code).not.toContain('p-confirmpopup');
  });
});
