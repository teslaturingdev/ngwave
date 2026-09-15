import { describe, expect, it } from 'vitest';
import { migrate } from './index';

describe('menu adapter', () => {
  it('migrates p-menu with model/popup', () => {
    const out = migrate(
      `<p-menu #ref [model]="items" [popup]="true"></p-menu>`,
    );
    expect(out.code).toContain('<nw-menu');
    expect(out.code).toContain('[model]="items"');
    expect(out.code).toContain('[popup]="true"');
    expect(out.code).toContain('</nw-menu>');
    expect(out.imports).toContain('NwMenuComponent');
  });

  it('renames styleClass to class', () => {
    const out = migrate(`<p-menu [model]="items" styleClass="w-64"></p-menu>`);
    expect(out.code).toContain('class="w-64"');
  });
});
