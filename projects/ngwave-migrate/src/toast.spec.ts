import { describe, expect, it } from 'vitest';
import { migrate } from './index';

describe('toast adapter', () => {
  it('migrates p-toast → nw-toast with position', () => {
    const out = migrate(`<p-toast position="bottom-right"></p-toast>`);
    expect(out.code).toContain('<nw-toast position="bottom-right"');
    expect(out.code).toContain('</nw-toast>');
    expect(out.imports).toContain('NwToastComponent');
  });

  it('flags the MessageService replacement as manual', () => {
    const out = migrate(`<p-toast></p-toast>`);
    expect(
      out.report.manual.some((m) => m.includes('NwToastService')),
    ).toBe(true);
  });
});
