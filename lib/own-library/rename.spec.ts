import { describe, expect, it } from 'vitest';
import { isValidPrefix, renamePrefix } from './rename';

describe('renamePrefix', () => {
  it('renames the selector', () => {
    expect(renamePrefix(`selector: 'nw-button',`, 'acme')).toBe(`selector: 'acme-button',`);
  });

  it('renames a host class', () => {
    expect(renamePrefix(`host: { class: 'nw-button-host' },`, 'acme')).toBe(
      `host: { class: 'acme-button-host' },`,
    );
  });

  it('renames Tailwind token classes embedded in a longer class string', () => {
    const input = 'bg-nw-600 text-white shadow-nw-sm hover:bg-nw-700 rounded-nw';
    expect(renamePrefix(input, 'acme')).toBe(
      'bg-acme-600 text-white shadow-acme-sm hover:bg-acme-700 rounded-acme',
    );
  });

  it('renames a bare Tailwind config key and a CSS variable', () => {
    expect(renamePrefix(`transitionTimingFunction: { nw: EASE, 'nw-bounce': BOUNCE }`, 'acme')).toBe(
      `transitionTimingFunction: { acme: EASE, 'acme-bounce': BOUNCE }`,
    );
    expect(renamePrefix('--nw-500: 99 102 241;', 'acme')).toBe('--acme-500: 99 102 241;');
  });

  it('renames every Nw<PascalCase> exported identifier', () => {
    const input = `export class NwButtonComponent {}\nexport type NwButtonVariant = 'a';\nexport type NwIconPosition = 'left';`;
    const out = renamePrefix(input, 'acme');
    expect(out).toContain('AcmeButtonComponent');
    expect(out).toContain('AcmeButtonVariant');
    expect(out).toContain('AcmeIconPosition');
  });

  it('leaves no nw-/Nw[A-Z] substring in fully renamed real-shaped source', () => {
    const input = `
      selector: 'nw-button',
      host: { class: 'nw-button-host' },
      styles: \`:host { display: inline-flex; }\`,
      export class NwButtonComponent {}
      const BASE = 'bg-nw-600 shadow-nw-sm rounded-nw focus-visible:ring-nw-500';
    `;
    const out = renamePrefix(input, 'acme');
    expect(out).not.toMatch(/\bnw\b/);
    expect(out).not.toMatch(/\bNw(?=[A-Z])/);
  });

  it('does not touch words that merely contain "nw" as a substring, not a standalone token', () => {
    expect(renamePrefix('onwards unwrap', 'acme')).toBe('onwards unwrap');
  });

  it('does not touch the brand name "NgWave" in comments (Nw is not a substring of NgWave)', () => {
    expect(renamePrefix('// Built for NgWave', 'acme')).toBe('// Built for NgWave');
  });

  it('normalizes a mixed-case prefix input consistently', () => {
    expect(renamePrefix(`selector: 'nw-button',`, 'ACME')).toBe(`selector: 'acme-button',`);
    expect(renamePrefix('export class NwButtonComponent {}', 'ACME')).toContain(
      'AcmeButtonComponent',
    );
  });
});

describe('isValidPrefix', () => {
  it('accepts lowercase letters, digits, and hyphens starting with a letter', () => {
    expect(isValidPrefix('acme')).toBe(true);
    expect(isValidPrefix('acme-2')).toBe(true);
  });

  it('rejects empty, uppercase, digit-starting, or too-short/long values', () => {
    expect(isValidPrefix('')).toBe(false);
    expect(isValidPrefix('a')).toBe(false);
    expect(isValidPrefix('Acme')).toBe(false);
    expect(isValidPrefix('2acme')).toBe(false);
    expect(isValidPrefix('a'.repeat(31))).toBe(false);
  });
});
