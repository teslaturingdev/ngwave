import { describe, expect, it } from 'vitest';
import { migrate } from './index';

describe('knob adapter', () => {
  it('migrates p-knob tag', () => {
    const out = migrate(`<p-knob [(ngModel)]="volume" [min]="0" [max]="100"></p-knob>`);
    expect(out.code).toContain('<nw-knob');
    expect(out.imports).toContain('NwKnobComponent');
  });

  it('flags per-instance color inputs as unsupported', () => {
    const out = migrate(`<p-knob valueColor="orange" rangeColor="gray"></p-knob>`);
    expect(out.report.unsupported.some((m) => m.includes('valueColor'))).toBe(true);
    expect(out.report.unsupported.some((m) => m.includes('rangeColor'))).toBe(true);
  });
});
