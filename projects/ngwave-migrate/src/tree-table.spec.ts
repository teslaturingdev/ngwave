import { describe, expect, it } from 'vitest';
import { migrate } from './index';

describe('tree-table adapter', () => {
  it('migrates p-treeTable with value/columns', () => {
    const out = migrate(`<p-treeTable [value]="nodes" [columns]="cols"></p-treeTable>`);
    expect(out.code).toContain('<nw-tree-table');
    expect(out.code).toContain('[value]="nodes"');
    expect(out.code).toContain('[columns]="cols"');
    expect(out.code).toContain('</nw-tree-table>');
    expect(out.imports).toContain('NwTreeTableComponent');
  });

  it('strips p-treeTableToggler with a manual note (handled automatically)', () => {
    const out = migrate(`<p-treeTableToggler></p-treeTableToggler>`);
    expect(out.code).not.toContain('p-treeTableToggler');
    expect(out.report.manual.some((m) => m.includes('automatically'))).toBe(true);
  });

  it('strips p-treeTableCheckbox with a manual note (handled automatically)', () => {
    const out = migrate(`<p-treeTableCheckbox></p-treeTableCheckbox>`);
    expect(out.code).not.toContain('p-treeTableCheckbox');
  });
});
