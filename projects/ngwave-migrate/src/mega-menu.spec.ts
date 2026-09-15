import { describe, expect, it } from 'vitest';
import { migrate } from './index';

describe('mega-menu adapter', () => {
  it('renames the tag', () => {
    const out = migrate(`<p-megaMenu styleClass="mb-4"></p-megaMenu>`);
    expect(out.code).toContain('<nw-mega-menu');
    expect(out.code).toContain('class="mb-4"');
    expect(out.code).toContain('</nw-mega-menu>');
    expect(out.imports).toContain('NwMegaMenuComponent');
  });

  it('flags [model] as needing manual restructuring (PrimeNG nests MegaMenuItem[][], NgWave uses a flatter column shape)', () => {
    const out = migrate(`<p-megaMenu [model]="items"></p-megaMenu>`);
    expect(out.report.manual.some((m) => m.includes('restructure'))).toBe(true);
  });
});
