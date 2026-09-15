import { describe, expect, it } from 'vitest';
import { migrate } from './index';

describe('p-inputgroup / p-inputgroup-addon', () => {
  it('maps both to their nw- equivalents, preserving the inner input', () => {
    const out = migrate(
      `<p-inputgroup><p-inputgroup-addon>$</p-inputgroup-addon><input pInputText [(ngModel)]="price" /></p-inputgroup>`,
    );
    expect(out.code).toContain('<nw-input-group>');
    expect(out.code).toContain('<nw-input-group-addon>$</nw-input-group-addon>');
    expect(out.code).toContain('<nw-input-text');
    expect(out.code).toContain('</nw-input-group>');
    expect(out.imports).toContain('NwInputGroupComponent');
    expect(out.imports).toContain('NwInputGroupAddonComponent');
  });
});
