import { describe, expect, it } from 'vitest';
import { migrate } from './index';

describe('toolbar adapter', () => {
  it('migrates p-toolbar tag', () => {
    const out = migrate(`<p-toolbar styleClass="mb-4"><div>content</div></p-toolbar>`);
    expect(out.code).toContain('<nw-toolbar');
    expect(out.code).toContain('class="mb-4"');
    expect(out.code).toContain('</nw-toolbar>');
    expect(out.imports).toContain('NwToolbarComponent');
  });

  it('notes pTemplate start/center/end needs restructuring to content projection', () => {
    const out = migrate(
      `<p-toolbar><ng-template pTemplate="start">Left</ng-template></p-toolbar>`,
    );
    expect(out.report.manual.some((m) => m.includes('toolbarStart'))).toBe(true);
  });
});
