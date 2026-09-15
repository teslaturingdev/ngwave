import { describe, expect, it } from 'vitest';
import { migrate } from './index';

describe('select-button adapter', () => {
  it('migrates p-selectButton with options/multiple', () => {
    const out = migrate(
      `<p-selectButton [options]="sizes" [(ngModel)]="size" [multiple]="true"></p-selectButton>`,
    );
    expect(out.code).toContain('<nw-select-button');
    expect(out.code).toContain('[options]="sizes"');
    expect(out.code).toContain('[multiple]="true"');
    expect(out.code).toContain('</nw-select-button>');
    expect(out.imports).toContain('NwSelectButtonComponent');
  });

  it('recognizes the lowercase alias (real PrimeNG v19 usage: p-selectbutton)', () => {
    const out = migrate(`<p-selectbutton [options]="sizes"></p-selectbutton>`);
    expect(out.code).toContain('<nw-select-button');
    expect(out.code).not.toContain('p-selectbutton');
  });

  it('recognizes the kebab-case alias (p-select-button)', () => {
    const out = migrate(`<p-select-button [options]="sizes"></p-select-button>`);
    expect(out.code).toContain('<nw-select-button');
  });

  it('flags optionDisabled as unsupported rather than emitting a broken binding', () => {
    const out = migrate(`<p-selectButton [options]="sizes" optionDisabled="inactive"></p-selectButton>`);
    expect(out.report.unsupported.some((m) => m.includes('optionDisabled'))).toBe(true);
    expect(out.code).not.toContain('optionDisabled');
  });
});
