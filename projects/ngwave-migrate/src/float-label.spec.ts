import { describe, expect, it } from 'vitest';
import { migrate } from './index';

describe('float label adapter', () => {
  it('migrates p-floatLabel tag', () => {
    const out = migrate(`<p-floatLabel><input pInputText /><label>Email</label></p-floatLabel>`);
    expect(out.code).toContain('<nw-float-label');
    expect(out.code).toContain('</nw-float-label>');
    expect(out.imports).toContain('NwFloatLabelComponent');
  });

  it('flags variant attribute as manual', () => {
    const out = migrate(`<p-floatLabel variant="on"><input pInputText /></p-floatLabel>`);
    expect(out.report.manual.some((m) => m.includes('variant'))).toBe(true);
  });
});
