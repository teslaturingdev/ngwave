import { describe, expect, it } from 'vitest';
import { migrate } from './index';

const code = (attrs: string) =>
  migrate(`<p-dialog ${attrs}></p-dialog>`).code;

describe('dialog adapter — attribute map', () => {
  const cases: [string, string][] = [
    ['[(visible)]="show"', '[(visible)]="show"'],
    ['header="Confirm"', 'header="Confirm"'],
    ['[modal]="true"', '[modal]="true"'],
    ['[closable]="true"', '[closable]="true"'],
    ['[dismissableMask]="true"', '[dismissableMask]="true"'],
    ['position="top"', 'position="top"'],
    ['[draggable]="true"', '[draggable]="true"'],
    ['[resizable]="true"', '[resizable]="true"'],
    ['[maximizable]="true"', '[maximizable]="true"'],
    ['[blockScroll]="true"', '[blockScroll]="true"'],
    ['(onShow)="s()"', '(shown)="s()"'],
    ['(onHide)="h()"', '(hidden)="h()"'],
    ['styleClass="wide"', 'class="wide"'],
  ];

  for (const [input, expected] of cases) {
    it(`${input} → ${expected}`, () => {
      const out = code(input);
      expect(out).toContain('<nw-dialog');
      expect(out).toContain(expected);
      expect(out).not.toContain('<p-dialog');
    });
  }

  it('adds the import and renames the closing tag', () => {
    const out = migrate(`<p-dialog [(visible)]="s"></p-dialog>`);
    expect(out.imports).toContain('NwDialogComponent');
    expect(out.code).toContain('</nw-dialog>');
  });

  it('maps draggable / resizable / maximizable now that they are supported', () => {
    const out = migrate(
      `<p-dialog [(visible)]="s" [draggable]="true" [resizable]="true" [maximizable]="true"></p-dialog>`,
    );
    expect(out.report.unsupported.length).toBe(0);
    expect(out.code).toContain('[draggable]="true"');
    expect(out.code).toContain('[resizable]="true"');
    expect(out.code).toContain('[maximizable]="true"');
  });

  it('still flags fullScreen as unsupported', () => {
    const out = migrate(`<p-dialog [(visible)]="s" [fullScreen]="true"></p-dialog>`);
    expect(out.report.unsupported.length).toBe(1);
  });

  it('migrates p-sidebar (drawer) to nw-dialog', () => {
    const out = migrate(
      `<p-sidebar [(visible)]="s" position="right" [dismissible]="true" [showCloseIcon]="true"></p-sidebar>`,
    );
    expect(out.code).toContain('<nw-dialog');
    expect(out.code).toContain('[(visible)]="s"');
    expect(out.code).toContain('[dismissableMask]="true"');
    expect(out.code).toContain('[closable]="true"');
    expect(out.code).toContain('</nw-dialog>');
  });
});
