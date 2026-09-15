import { describe, expect, it } from 'vitest';
import { migrate } from './index';

describe('toggle-button adapter', () => {
  it('migrates p-toggleButton with onLabel/offLabel', () => {
    const out = migrate(
      `<p-toggleButton [(ngModel)]="checked" onLabel="On" offLabel="Off"></p-toggleButton>`,
    );
    expect(out.code).toContain('<nw-toggle-button');
    expect(out.code).toContain('onLabel="On"');
    expect(out.code).toContain('offLabel="Off"');
    expect(out.code).toContain('</nw-toggle-button>');
    expect(out.imports).toContain('NwToggleButtonComponent');
  });

  it('recognizes the lowercase alias (p-togglebutton)', () => {
    const out = migrate(`<p-togglebutton></p-togglebutton>`);
    expect(out.code).toContain('<nw-toggle-button');
    expect(out.code).not.toContain('p-togglebutton');
  });
});
