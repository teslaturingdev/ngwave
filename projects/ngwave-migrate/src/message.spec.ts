import { describe, expect, it } from 'vitest';
import { migrate } from './index';

describe('p-message', () => {
  it('maps to nw-message with severity/text', () => {
    const out = migrate(`<p-message severity="error" text="Required field"></p-message>`);
    expect(out.code).toContain('<nw-message severity="error" text="Required field">');
    expect(out.code).toContain('</nw-message>');
    expect(out.imports).toContain('NwMessageComponent');
  });

  it('preserves projected content', () => {
    const out = migrate(`<p-message severity="info">Some <b>rich</b> content</p-message>`);
    expect(out.code).toContain('<nw-message severity="info">Some <b>rich</b> content</nw-message>');
  });

  it('flags a custom icon as manual', () => {
    const out = migrate(`<p-message severity="warn" icon="pi pi-star"></p-message>`);
    expect(out.report.manual.some((m) => m.includes('icon'))).toBe(true);
  });
});
