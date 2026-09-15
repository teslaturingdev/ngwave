import { describe, expect, it } from 'vitest';
import { migrate } from './index';

describe('p-stepper (v19 compositional API)', () => {
  it('extracts p-step-list/p-step headers into nw-steps [items], leaves panel bodies in place', () => {
    const out = migrate(
      `<p-stepper value="0">
  <p-step-list>
    <p-step value="0">Account</p-step>
    <p-step value="1">Billing</p-step>
  </p-step-list>
  <p-step-panels>
    <p-step-panel value="0">Account content</p-step-panel>
    <p-step-panel value="1">Billing content</p-step-panel>
  </p-step-panels>
</p-stepper>`,
    );
    expect(out.code).toContain(
      `<nw-steps [items]="[{ label: 'Account' }, { label: 'Billing' }]" activeIndex="0" />`,
    );
    expect(out.code).toContain('Account content');
    expect(out.code).toContain('Billing content');
    expect(out.code).not.toContain('p-stepper');
    expect(out.code).not.toContain('p-step-list');
    expect(out.code).not.toContain('p-step-panel');
    expect(out.imports).toContain('NwStepsComponent');
  });

  it('does not conflate with the legacy p-steps adapter used elsewhere in the same file', () => {
    const out = migrate(
      `<p-steps [model]="items"></p-steps>
<p-stepper value="0"><p-step-list><p-step value="0">New</p-step></p-step-list><p-step-panels><p-step-panel value="0">content</p-step-panel></p-step-panels></p-stepper>`,
    );
    expect(out.code).toContain('<nw-steps');
    expect(out.code).toContain(`[items]="[{ label: 'New' }]"`);
  });

  it('flags a bound [value] as a manual note instead of guessing an index', () => {
    const out = migrate(
      `<p-stepper [value]="active"><p-step-list><p-step value="0">A</p-step></p-step-list><p-step-panels><p-step-panel value="0">a</p-step-panel></p-step-panels></p-stepper>`,
    );
    expect(out.report.manual.some((m) => m.includes('[value]'))).toBe(true);
    expect(out.code).toContain(`<nw-steps [items]="[{ label: 'A' }]" />`);
  });

  it('notes that panel visibility needs manual wiring since nw-steps is indicator-only', () => {
    const out = migrate(
      `<p-stepper value="0"><p-step-list><p-step value="0">A</p-step></p-step-list><p-step-panels><p-step-panel value="0">a</p-step-panel></p-step-panels></p-stepper>`,
    );
    expect(out.report.mapped.some((m) => m.includes('indicator-only'))).toBe(true);
  });
});
