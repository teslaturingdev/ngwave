import { describe, expect, it } from 'vitest';
import { migrate } from './index';

describe('progress-bar adapter', () => {
  it('migrates p-progressBar with value/mode', () => {
    const out = migrate(`<p-progressBar [value]="60" mode="determinate"></p-progressBar>`);
    expect(out.code).toContain('<nw-progress-bar');
    expect(out.code).toContain('[value]="60"');
    expect(out.code).toContain('mode="determinate"');
    expect(out.code).toContain('</nw-progress-bar>');
    expect(out.imports).toContain('NwProgressBarComponent');
  });

  it('recognizes the lowercase casing alias (p-progressbar)', () => {
    const out = migrate(`<p-progressbar [value]="60"></p-progressbar>`);
    expect(out.code).toContain('<nw-progress-bar');
    expect(out.code).not.toContain('p-progressbar');
  });
});
