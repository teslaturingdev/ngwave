import { describe, expect, it } from 'vitest';
import { migrate } from './index';

describe('p-badge', () => {
  it('maps to nw-badge with value/severity', () => {
    const out = migrate(`<p-badge value="2" severity="danger"></p-badge>`);
    expect(out.code).toContain('<nw-badge value="2" severity="danger">');
    expect(out.code).toContain('</nw-badge>');
    expect(out.imports).toContain('NwBadgeComponent');
  });
});

describe('p-overlaybadge', () => {
  it('maps to nw-overlay-badge, preserving projected content', () => {
    const out = migrate(
      `<p-overlaybadge value="4" severity="danger"><i class="pi pi-bell"></i></p-overlaybadge>`,
    );
    expect(out.code).toContain('<nw-overlay-badge value="4" severity="danger">');
    expect(out.code).toContain('<i class="pi pi-bell"></i>');
    expect(out.code).toContain('</nw-overlay-badge>');
    expect(out.imports).toContain('NwOverlayBadgeComponent');
  });
});

describe('pBadge attribute directive', () => {
  it('strips the directive and flags a manual wrap', () => {
    const out = migrate(`<button pButton label="Emails" pBadge value="8"></button>`);
    expect(out.code).not.toContain('pBadge');
    expect(out.report.manual.some((m) => m.includes('nw-overlay-badge'))).toBe(true);
  });
});
