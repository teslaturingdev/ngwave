import { describe, expect, it } from 'vitest';
import { migrate } from './index';

describe('tabs adapter', () => {
  it('migrates p-tabView / p-tabPanel', () => {
    const out = migrate(
      `<p-tabView [(activeIndex)]="i"><p-tabPanel header="One">a</p-tabPanel></p-tabView>`,
    );
    expect(out.code).toContain('<nw-tabs [(activeIndex)]="i">');
    expect(out.code).toContain('<nw-tab header="One">');
    expect(out.code).toContain('</nw-tab>');
    expect(out.code).toContain('</nw-tabs>');
    expect(out.imports).toContain('NwTabsComponent');
    expect(out.imports).toContain('NwTabComponent');
  });
});

describe('checkbox adapter', () => {
  it('maps ngModel/label and drops binary', () => {
    const out = migrate(
      `<p-checkbox [(ngModel)]="agree" label="Agree" [binary]="true"></p-checkbox>`,
    );
    expect(out.code).toContain('<nw-checkbox');
    expect(out.code).toContain('[(checked)]="agree"');
    expect(out.code).toContain('label="Agree"');
    expect(out.code).not.toContain('binary');
    expect(out.imports).toContain('NwCheckboxComponent');
  });

  it('flags value (group) as manual', () => {
    const out = migrate(`<p-checkbox value="a" [(ngModel)]="list"></p-checkbox>`);
    expect(out.report.manual.some((m) => m.includes('nw-checkbox'))).toBe(true);
  });
});

describe('radio adapter', () => {
  it('maps value/ngModel and keeps name for grouping', () => {
    const out = migrate(
      `<p-radioButton name="g" value="a" [(ngModel)]="sel"></p-radioButton>`,
    );
    expect(out.code).toContain('<nw-radio');
    expect(out.code).toContain('value="a"');
    expect(out.code).toContain('[(selected)]="sel"');
    expect(out.code).toContain('name="g"');
    expect(out.imports).toContain('NwRadioComponent');
  });
});

describe('spinner / skeleton adapters', () => {
  it('migrates p-progressSpinner → nw-spinner', () => {
    const out = migrate(`<p-progressSpinner></p-progressSpinner>`);
    expect(out.code).toContain('<nw-spinner');
    expect(out.code).toContain('</nw-spinner>');
    expect(out.imports).toContain('NwSpinnerComponent');
  });

  it('maps spinner strokeWidth / animationDuration', () => {
    const out = migrate(
      `<p-progressSpinner strokeWidth="8" animationDuration="2s"></p-progressSpinner>`,
    );
    expect(out.code).toContain('strokeWidth="8"');
    expect(out.code).toContain('animationDuration="2s"');
  });

  it('migrates p-skeleton with width/height/shape', () => {
    const out = migrate(
      `<p-skeleton width="3rem" height="3rem" shape="circle"></p-skeleton>`,
    );
    expect(out.code).toContain('<nw-skeleton');
    expect(out.code).toContain('width="3rem"');
    expect(out.code).toContain('shape="circle"');
    expect(out.imports).toContain('NwSkeletonComponent');
  });
});
