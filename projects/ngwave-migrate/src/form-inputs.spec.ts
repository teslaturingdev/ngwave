import { describe, expect, it } from 'vitest';
import { migrate } from './index';

describe('input[pInputText] adapter', () => {
  it('converts a void input directive into nw-input-text', () => {
    const out = migrate(`<input pInputText [(ngModel)]="name" placeholder="Name" />`);
    expect(out.code).toContain('<nw-input-text');
    expect(out.code).toContain('[(value)]="name"');
    expect(out.code).toContain('placeholder="Name"');
    expect(out.code).toContain('</nw-input-text>');
    expect(out.code).not.toContain('pInputText');
    expect(out.imports).toContain('NwInputTextComponent');
  });

  it('handles an input without a self-closing slash', () => {
    const out = migrate(`<input pInputText [(ngModel)]="q">`);
    expect(out.code).toContain('<nw-input-text [(value)]="q"></nw-input-text>');
  });
});

describe('p-inputNumber adapter', () => {
  it('maps numeric props', () => {
    const out = migrate(
      `<p-inputNumber [(ngModel)]="qty" [min]="0" [max]="10" [showButtons]="true" mode="currency" currency="USD"></p-inputNumber>`,
    );
    expect(out.code).toContain('<nw-input-number');
    expect(out.code).toContain('[(value)]="qty"');
    expect(out.code).toContain('[min]="0"');
    expect(out.code).toContain('[showButtons]="true"');
    expect(out.code).toContain('mode="currency"');
    expect(out.code).toContain('</nw-input-number>');
    expect(out.imports).toContain('NwInputNumberComponent');
  });
});

describe('textarea[pInputTextarea] adapter', () => {
  it('renames textarea and maps rows/autoResize', () => {
    const out = migrate(
      `<textarea pInputTextarea [(ngModel)]="bio" [rows]="4" [autoResize]="true"></textarea>`,
    );
    expect(out.code).toContain('<nw-textarea');
    expect(out.code).toContain('[(value)]="bio"');
    expect(out.code).toContain('[rows]="4"');
    expect(out.code).toContain('[autoResize]="true"');
    expect(out.code).toContain('</nw-textarea>');
    expect(out.imports).toContain('NwTextareaComponent');
  });
});

describe('p-autoComplete adapter', () => {
  it('maps suggestions/field/multiple and closes the tag', () => {
    const out = migrate(
      `<p-autoComplete [(ngModel)]="sel" [suggestions]="items" field="name" [multiple]="true" [dropdown]="true"></p-autoComplete>`,
    );
    expect(out.code).toContain('<nw-autocomplete');
    expect(out.code).toContain('[(value)]="sel"');
    expect(out.code).toContain('[suggestions]="items"');
    expect(out.code).toContain('optionLabel="name"');
    expect(out.code).toContain('[multiple]="true"');
    expect(out.code).toContain('</nw-autocomplete>');
    expect(out.imports).toContain('NwAutocompleteComponent');
  });

  it('rewrites completeMethod to (complete) and flags the handler change', () => {
    const out = migrate(
      `<p-autoComplete [suggestions]="items" (completeMethod)="search($event)"></p-autoComplete>`,
    );
    expect(out.code).toContain('(complete)="search($event)"');
    expect(out.report.manual.some((m) => m.includes('query string'))).toBe(true);
  });
});
