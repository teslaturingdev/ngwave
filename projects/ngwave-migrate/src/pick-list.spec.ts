import { describe, expect, it } from 'vitest';
import { migrate } from './index';

describe('pick list adapter', () => {
  it('migrates p-pickList tag and its item template', () => {
    const out = migrate(
      `<p-pickList [source]="a" [target]="b" sourceHeader="A" targetHeader="B"><ng-template let-item pTemplate="item">{{ item }}</ng-template></p-pickList>`,
    );
    expect(out.code).toContain('<nw-pick-list');
    expect(out.code).toContain('</nw-pick-list>');
    expect(out.code).toContain('nwPickListItem');
    expect(out.code).not.toContain('pTemplate');
    expect(out.imports).toContain('NwPickListComponent');
  });

  it('flags dragdrop as unsupported', () => {
    const out = migrate(`<p-pickList [source]="a" [target]="b" [dragdrop]="true"></p-pickList>`);
    expect(out.report.unsupported.some((m) => m.includes('dragdrop'))).toBe(true);
  });
});
