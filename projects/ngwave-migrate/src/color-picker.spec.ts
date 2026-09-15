import { describe, expect, it } from 'vitest';
import { migrate } from './index';

describe('color picker adapter', () => {
  it('migrates p-colorPicker tag', () => {
    const out = migrate(`<p-colorPicker [(ngModel)]="color"></p-colorPicker>`);
    expect(out.code).toContain('<nw-color-picker');
    expect(out.imports).toContain('NwColorPickerComponent');
  });

  it('flags non-hex format and inline as unsupported', () => {
    const out = migrate(`<p-colorPicker format="rgb" [inline]="true"></p-colorPicker>`);
    expect(out.report.unsupported.some((m) => m.includes('format'))).toBe(true);
    expect(out.report.unsupported.some((m) => m.includes('inline'))).toBe(true);
  });
});
