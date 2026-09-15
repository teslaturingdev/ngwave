import { describe, expect, it } from 'vitest';
import { migrate } from './index';

describe('p-timeline', () => {
  it('maps to nw-timeline with value/align', () => {
    const out = migrate(`<p-timeline [value]="events" align="alternate"></p-timeline>`);
    expect(out.code).toContain('<nw-timeline [value]="events" align="alternate">');
    expect(out.code).toContain('</nw-timeline>');
    expect(out.imports).toContain('NwTimelineComponent');
  });

  it('flags layout as manual (vertical-only)', () => {
    const out = migrate(`<p-timeline [value]="events" layout="horizontal"></p-timeline>`);
    expect(out.report.manual.some((m) => m.includes('vertical'))).toBe(true);
  });

  it('flags pTemplate content/opposite/marker as manual', () => {
    const out = migrate(
      `<p-timeline [value]="events"><ng-template pTemplate="content" let-e>{{e.status}}</ng-template></p-timeline>`,
    );
    expect(out.report.manual.some((m) => m.includes('[value]'))).toBe(true);
  });
});
