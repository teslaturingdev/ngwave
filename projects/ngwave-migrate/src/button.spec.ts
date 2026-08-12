import { describe, expect, it } from 'vitest';
import { migrate } from './index';

const code = (attrs: string) =>
  migrate(`<p-button ${attrs}></p-button>`).code;

describe('button adapter — attribute map', () => {
  const cases: [string, string][] = [
    ['label="Save"', 'label="Save"'],
    ['icon="pi pi-check"', 'icon="pi pi-check"'],
    ['iconPos="right"', 'iconPosition="right"'],
    ['[disabled]="d"', '[disabled]="d"'],
    ['[loading]="l"', '[loading]="l"'],
    ['severity="secondary"', 'variant="secondary"'],
    ['size="small"', 'size="small"'],
    ['(onClick)="go()"', '(click)="go()"'],
    ['styleClass="foo"', 'class="foo"'],
    ['[outlined]="true"', 'variant="outlined"'],
    ['[text]="true"', 'variant="text"'],
    ['[raised]="true"', 'variant="raised"'],
    ['[rounded]="true"', '[rounded]="true"'],
    [`[badge]="'8'"`, `[badge]="'8'"`],
    [`[badgeSeverity]="'danger'"`, `[badgeVariant]="'danger'"`],
    ['type="submit"', 'type="submit"'],
  ];

  for (const [input, expected] of cases) {
    it(`${input} → ${expected}`, () => {
      const out = code(input);
      expect(out).toContain('<nw-button');
      expect(out).toContain(expected);
      expect(out).not.toContain('<p-button');
    });
  }

  it('adds the NwButtonComponent import', () => {
    expect(migrate(`<p-button label="Save"></p-button>`).imports).toContain(
      'NwButtonComponent',
    );
  });

  it('renames the closing tag', () => {
    expect(code('label="Save"')).toContain('</nw-button>');
  });

  it('de-duplicates conflicting variant sources (severity + outlined)', () => {
    const out = migrate(`<p-button severity="secondary" [outlined]="true"></p-button>`);
    const matches = out.code.match(/variant=/g) ?? [];
    expect(matches.length).toBe(1);
    expect(out.code).toContain('variant="outlined"');
    expect(out.report.manual.some((m) => m.includes('variant'))).toBe(true);
  });

  it('migrates the pButton attribute directive on a native button', () => {
    const out = migrate(`<button pButton label="Save" (onClick)="go()">Save</button>`);
    expect(out.code).toBe(
      `<nw-button label="Save" (click)="go()">Save</nw-button>`,
    );
    expect(out.imports).toContain('NwButtonComponent');
  });
});
