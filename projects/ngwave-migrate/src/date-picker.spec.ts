import { describe, expect, it } from 'vitest';
import { migrate } from './index';

describe('date picker adapter', () => {
  it('migrates p-datePicker tag', () => {
    const out = migrate(`<p-datePicker [(ngModel)]="date" placeholder="Pick"></p-datePicker>`);
    expect(out.code).toContain('<nw-date-picker');
    expect(out.code).toContain('</nw-date-picker>');
    expect(out.imports).toContain('NwDatePickerComponent');
  });

  it('migrates the legacy p-calendar tag onto the same target', () => {
    const out = migrate(`<p-calendar [(ngModel)]="date"></p-calendar>`);
    expect(out.code).toContain('<nw-date-picker');
    expect(out.code).toContain('</nw-date-picker>');
    expect(out.imports).toContain('NwDatePickerComponent');
  });

  it('flags multi-select and time features as unsupported', () => {
    const out = migrate(`<p-datePicker selectionMode="range" [showTime]="true"></p-datePicker>`);
    expect(out.report.unsupported.some((m) => m.includes('selectionMode'))).toBe(true);
    expect(out.report.unsupported.some((m) => m.includes('showTime'))).toBe(true);
  });

  it('flags showButtonBar as manual', () => {
    const out = migrate(`<p-datePicker [showButtonBar]="true"></p-datePicker>`);
    expect(out.report.manual.some((m) => m.includes('showButtonBar'))).toBe(true);
  });
});
