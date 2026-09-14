import { describe, expect, it } from 'vitest';
import { primengTagAliases, SUPPORTED_PRIMENG_TAGS } from './adapters.js';
import { migrate } from './migrate.js';

describe('primengTagAliases', () => {
  it('expands a camelCase compound tag to its lowercase and kebab-case aliases', () => {
    expect(primengTagAliases('p-radioButton')).toEqual([
      'p-radioButton',
      'p-radiobutton',
      'p-radio-button',
    ]);
  });

  it('returns a single-element array for a tag with no uppercase letters', () => {
    expect(primengTagAliases('p-table')).toEqual(['p-table']);
  });

  it('does not duplicate aliases that collide (e.g. two-letter-only casing)', () => {
    // 'p-tag' has no internal capital, so lower/kebab both equal the original.
    expect(primengTagAliases('p-tag')).toEqual(['p-tag']);
  });
});

describe('SUPPORTED_PRIMENG_TAGS includes casing aliases', () => {
  it('lists all three real primeng v19 selector spellings for radioButton', () => {
    expect(SUPPORTED_PRIMENG_TAGS).toContain('p-radioButton');
    expect(SUPPORTED_PRIMENG_TAGS).toContain('p-radiobutton');
    expect(SUPPORTED_PRIMENG_TAGS).toContain('p-radio-button');
  });

  it('lists all three real primeng v19 selector spellings for multiSelect', () => {
    expect(SUPPORTED_PRIMENG_TAGS).toContain('p-multiSelect');
    expect(SUPPORTED_PRIMENG_TAGS).toContain('p-multiselect');
    expect(SUPPORTED_PRIMENG_TAGS).toContain('p-multi-select');
  });
});

describe('migrate() recognizes alias-cased tags (real-world PrimeNG 19 usage)', () => {
  it('transforms <p-radiobutton> (all-lowercase, confirmed real primeng v19 alias)', () => {
    const result = migrate(`<p-radiobutton name="x" value="1"></p-radiobutton>`);
    expect(result.code).toContain('<nw-radio');
    expect(result.code).toContain('</nw-radio>');
    expect(result.code).not.toContain('p-radiobutton');
  });

  it('transforms <p-radio-button> (kebab-case alias)', () => {
    const result = migrate(`<p-radio-button name="x" value="1"></p-radio-button>`);
    expect(result.code).toContain('<nw-radio');
    expect(result.code).toContain('</nw-radio>');
  });

  it('transforms <p-inputnumber> (all-lowercase alias)', () => {
    const result = migrate(`<p-inputnumber [(ngModel)]="qty"></p-inputnumber>`);
    expect(result.code).toContain('<nw-input-number');
    expect(result.code).toContain('</nw-input-number>');
  });

  it('transforms <p-multiselect> as a multi-select dropdown (all-lowercase alias)', () => {
    const result = migrate(`<p-multiselect [options]="opts"></p-multiselect>`);
    expect(result.code).toContain('<nw-dropdown [multiple]="true"');
    expect(result.code).toContain('</nw-dropdown>');
  });

  it('still transforms the original camelCase spelling unchanged', () => {
    const result = migrate(`<p-radioButton name="x" value="1"></p-radioButton>`);
    expect(result.code).toContain('<nw-radio');
    expect(result.code).toContain('</nw-radio>');
  });

  it('handles a file mixing multiple casings of the same component', () => {
    const result = migrate(`
      <p-radioButton name="a" value="1"></p-radioButton>
      <p-radiobutton name="a" value="2"></p-radiobutton>
      <p-radio-button name="a" value="3"></p-radio-button>
    `);
    const matches = result.code.match(/<nw-radio\b/g) ?? [];
    expect(matches.length).toBe(3);
    expect(result.code).not.toMatch(/p-radio/i);
  });
});
