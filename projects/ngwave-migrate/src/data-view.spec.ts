import { describe, expect, it } from 'vitest';
import { migrate } from './index';

describe('data view adapter', () => {
  it('migrates p-dataView tag', () => {
    const out = migrate(`<p-dataView [value]="products" layout="list"></p-dataView>`);
    expect(out.code).toContain('<nw-data-view');
    expect(out.code).toContain('</nw-data-view>');
    expect(out.imports).toContain('NwDataViewComponent');
  });

  it('flags sortField/sortOrder as unsupported', () => {
    const out = migrate(`<p-dataView [value]="products" sortField="name" sortOrder="1"></p-dataView>`);
    expect(out.report.unsupported.some((m) => m.includes('sortField'))).toBe(true);
    expect(out.report.unsupported.some((m) => m.includes('sortOrder'))).toBe(true);
  });

  it('notes pTemplate list/grid needs restructuring to a per-item template', () => {
    const out = migrate(
      `<p-dataView [value]="products"><ng-template pTemplate="list" let-items>...</ng-template></p-dataView>`,
    );
    expect(out.report.manual.some((m) => m.includes('nwDataViewItem'))).toBe(true);
  });
});
