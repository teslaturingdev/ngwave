import { describe, expect, it } from 'vitest';
import { migrate } from './index';

describe('password adapter', () => {
  it('migrates p-password tag', () => {
    const out = migrate(`<p-password [(ngModel)]="pw" [feedback]="true" styleClass="mb-2"></p-password>`);
    expect(out.code).toContain('<nw-password');
    expect(out.code).toContain('class="mb-2"');
    expect(out.code).toContain('</nw-password>');
    expect(out.imports).toContain('NwPasswordComponent');
  });

  it('flags toggleMask as manual', () => {
    const out = migrate(`<p-password [toggleMask]="false"></p-password>`);
    expect(out.report.manual.some((m) => m.includes('toggleMask'))).toBe(true);
  });

  it('flags custom strength regex/labels as unsupported', () => {
    const out = migrate(`<p-password [mediumRegex]="'.{6,}'" weakLabel="Too simple"></p-password>`);
    expect(out.report.unsupported.some((m) => m.includes('mediumRegex'))).toBe(true);
    expect(out.report.unsupported.some((m) => m.includes('weakLabel'))).toBe(true);
  });
});
