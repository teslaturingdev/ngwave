import { describe, expect, it } from 'vitest';
import { migrate } from './index';

describe('tooltip directive', () => {
  it('renames plain pTooltip="..." to nwTooltip="..."', () => {
    const out = migrate(`<button pTooltip="Save changes">Save</button>`);
    expect(out.code).toContain('nwTooltip="Save changes"');
    expect(out.code).not.toContain('pTooltip');
    expect(out.imports).toContain('NwTooltipDirective');
  });

  it('renames bound [pTooltip]="expr" to [nwTooltip]="expr"', () => {
    const out = migrate(`<button [pTooltip]="tipText">Save</button>`);
    expect(out.code).toContain('[nwTooltip]="tipText"');
    expect(out.code).not.toContain('pTooltip');
  });

  it('leaves tooltipPosition attribute name unchanged', () => {
    const out = migrate(`<button pTooltip="Save" tooltipPosition="bottom">Save</button>`);
    expect(out.code).toContain('tooltipPosition="bottom"');
  });
});
