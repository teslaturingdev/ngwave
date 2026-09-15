import { describe, expect, it } from 'vitest';
import { migrate } from './index';

describe('confirm-dialog adapter', () => {
  it('renames p-confirmDialog', () => {
    const out = migrate(`<p-confirmDialog styleClass="mb-4"></p-confirmDialog>`);
    expect(out.code).toContain('<nw-confirm-dialog');
    expect(out.code).toContain('class="mb-4"');
    expect(out.code).toContain('</nw-confirm-dialog>');
    expect(out.imports).toContain('NwConfirmDialogComponent');
  });

  it('recognizes the lowercase alias (p-confirmdialog)', () => {
    const out = migrate(`<p-confirmdialog></p-confirmdialog>`);
    expect(out.code).toContain('<nw-confirm-dialog');
    expect(out.code).not.toContain('p-confirmdialog');
  });
});
