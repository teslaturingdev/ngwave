import { describe, expect, it } from 'vitest';
import { migrate } from './index';

describe('order list adapter', () => {
  it('migrates p-orderList tag and its item template', () => {
    const out = migrate(
      `<p-orderList [value]="items" header="Playlist"><ng-template let-item pTemplate="item">{{ item }}</ng-template></p-orderList>`,
    );
    expect(out.code).toContain('<nw-order-list');
    expect(out.code).toContain('</nw-order-list>');
    expect(out.code).toContain('nwOrderListItem');
    expect(out.code).not.toContain('pTemplate');
    expect(out.imports).toContain('NwOrderListComponent');
  });

  it('flags dragdrop as unsupported', () => {
    const out = migrate(`<p-orderList [value]="items" [dragdrop]="true"></p-orderList>`);
    expect(out.report.unsupported.some((m) => m.includes('dragdrop'))).toBe(true);
  });
});
