import { describe, expect, it } from 'vitest';
import { migrate } from './index';

const code = (attrs: string) =>
  migrate(`<p-dropdown ${attrs}></p-dropdown>`).code;

describe('dropdown adapter — attribute map', () => {
  const cases: [string, string][] = [
    ['[options]="opts"', '[options]="opts"'],
    ['[(ngModel)]="val"', '[(value)]="val"'],
    ['placeholder="Pick"', 'placeholder="Pick"'],
    ['[filter]="true"', '[filter]="true"'],
    ['[showClear]="true"', '[clearable]="true"'],
    ['[disabled]="d"', '[disabled]="d"'],
    ['(onChange)="c()"', '(valueChange)="c()"'],
  ];

  for (const [input, expected] of cases) {
    it(`${input} → ${expected}`, () => {
      const out = code(input);
      expect(out).toContain('<nw-dropdown');
      expect(out).toContain(expected);
      expect(out).not.toContain('<p-dropdown');
    });
  }

  it('adds the import and renames the closing tag', () => {
    const out = migrate(`<p-dropdown [options]="o"></p-dropdown>`);
    expect(out.imports).toContain('NwDropdownComponent');
    expect(out.code).toContain('</nw-dropdown>');
  });

  it('also migrates p-select', () => {
    const out = migrate(`<p-select [options]="o" [(ngModel)]="v"></p-select>`);
    expect(out.code).toContain('<nw-dropdown');
    expect(out.code).toContain('[(value)]="v"');
    expect(out.code).toContain('</nw-dropdown>');
  });

  it('maps optionLabel / optionValue for raw objects', () => {
    const out = migrate(
      `<p-dropdown [options]="o" optionLabel="name" optionValue="id"></p-dropdown>`,
    );
    expect(out.code).toContain('optionLabel="name"');
    expect(out.code).toContain('optionValue="id"');
  });

  it('migrates p-multiSelect to a multiple nw-dropdown', () => {
    const out = migrate(
      `<p-multiSelect [options]="o" [(ngModel)]="v" optionLabel="name"></p-multiSelect>`,
    );
    expect(out.code).toContain('<nw-dropdown [multiple]="true"');
    expect(out.code).toContain('[(value)]="v"');
    expect(out.code).toContain('optionLabel="name"');
    expect(out.code).toContain('</nw-dropdown>');
  });
});
