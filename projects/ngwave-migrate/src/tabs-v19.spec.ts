import { describe, expect, it } from 'vitest';
import { migrate } from './index';

describe('p-tabs (v19 compositional API)', () => {
  it('restructures p-tablist/p-tab + p-tabpanels/p-tabpanel into nw-tabs/nw-tab pairs', () => {
    const out = migrate(
      `<p-tabs value="0">
  <p-tablist>
    <p-tab value="0">Details</p-tab>
    <p-tab value="1">Billing</p-tab>
  </p-tablist>
  <p-tabpanels>
    <p-tabpanel value="0">Details content</p-tabpanel>
    <p-tabpanel value="1">Billing content</p-tabpanel>
  </p-tabpanels>
</p-tabs>`,
    );
    expect(out.code).toContain('<nw-tabs activeIndex="0">');
    expect(out.code).toContain('<nw-tab header="Details">Details content</nw-tab>');
    expect(out.code).toContain('<nw-tab header="Billing">Billing content</nw-tab>');
    expect(out.code).not.toContain('p-tabs');
    expect(out.code).not.toContain('p-tablist');
    expect(out.code).not.toContain('p-tabpanel');
    expect(out.imports).toContain('NwTabsComponent');
    expect(out.imports).toContain('NwTabComponent');
  });

  it('does not conflate with the legacy p-tabView/p-tabPanel API used elsewhere in the same file', () => {
    const out = migrate(
      `<p-tabView><p-tabPanel header="Old">Old content</p-tabPanel></p-tabView>
<p-tabs value="0"><p-tablist><p-tab value="0">New</p-tab></p-tablist><p-tabpanels><p-tabpanel value="0">New content</p-tabpanel></p-tabpanels></p-tabs>`,
    );
    expect(out.code).toContain('<nw-tab header="Old">Old content</nw-tab>');
    expect(out.code).toContain('<nw-tab header="New">New content</nw-tab>');
  });

  it('flags a bound [value] as a manual note instead of guessing an index', () => {
    const out = migrate(
      `<p-tabs [value]="active"><p-tablist><p-tab value="0">A</p-tab></p-tablist><p-tabpanels><p-tabpanel value="0">a</p-tabpanel></p-tabpanels></p-tabs>`,
    );
    expect(out.report.manual.some((m) => m.includes('[value]'))).toBe(true);
    expect(out.code).toContain('<nw-tabs>');
  });
});
