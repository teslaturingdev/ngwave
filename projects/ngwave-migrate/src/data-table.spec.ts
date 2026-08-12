import { describe, expect, it } from 'vitest';
import { migrate } from './index';

const code = (attrs: string) => migrate(`<p-table ${attrs}></p-table>`).code;
const run = (attrs: string) => migrate(`<p-table ${attrs}></p-table>`);

describe('data-table adapter — attribute map', () => {
  const cases: [string, string][] = [
    // Data & display
    ['[value]="rows"', '[data]="rows"'],
    ['[columns]="cols"', '[columns]="cols"'],
    ['[rows]="10"', '[pageSize]="10"'],
    ['[first]="0"', '[pageIndex]="0"'],
    ['[totalRecords]="t"', '[totalRecords]="t"'],
    ['[loading]="l"', '[loading]="l"'],
    ['[rowHover]="true"', '[rowHover]="true"'],
    ['[showGridlines]="true"', '[gridlines]="true"'],
    ['[stripedRows]="true"', '[striped]="true"'],
    ['dataKey="id"', 'rowKey="id"'],
    ['emptyMessage="None"', 'emptyMessage="None"'],
    // Sorting
    ['[sortField]="f"', '[sortField]="f"'],
    ['[sortOrder]="1"', '[sortOrder]="1"'],
    ['sortMode="multiple"', '[multiSort]="true"'],
    ['[multiSortMeta]="m"', '[multiSortMeta]="m"'],
    ['(onSort)="s()"', '(sortChange)="s()"'],
    // Pagination
    ['[paginator]="true"', '[paginator]="true"'],
    ['[rowsPerPageOptions]="[5,10]"', '[pageSizeOptions]="[5,10]"'],
    ['paginatorPosition="bottom"', 'paginatorPosition="bottom"'],
    ['(onPage)="p()"', '(pageChange)="p()"'],
    // Selection
    ['selectionMode="single"', '[selectable]="true"'],
    ['[(selection)]="sel"', '[(selectedRows)]="sel"'],
    ['[selectAll]="a"', '[selectAll]="a"'],
    ['(onRowSelect)="rs()"', '(rowSelect)="rs()"'],
    ['(onRowUnselect)="ru()"', '(rowUnselect)="ru()"'],
    ['(onSelectAllChange)="sa()"', '(selectAllChange)="sa()"'],
    // Filtering
    ['[filters]="f"', '[filters]="f"'],
    ['filterMode="and"', 'filterMode="and"'],
    ['[globalFilterFields]="g"', '[searchFields]="g"'],
    ['(onFilter)="fl()"', '(filterChange)="fl()"'],
    // Row expansion
    ['[(expandedRowKeys)]="e"', '[(expandedRows)]="e"'],
    ['rowExpandMode="single"', 'expandMode="single"'],
    ['(onRowExpand)="re()"', '(rowExpand)="re()"'],
    ['(onRowCollapse)="rc()"', '(rowCollapse)="rc()"'],
    // Lazy loading
    ['[lazy]="true"', '[lazy]="true"'],
    ['(onLazyLoad)="ll()"', '(lazyLoad)="ll()"'],
    ['[lazyLoadOnInit]="true"', '[lazyLoadOnInit]="true"'],
    // Reordering
    ['[reorderableColumns]="true"', '[reorderableColumns]="true"'],
    ['[reorderableRows]="true"', '[reorderableRows]="true"'],
    ['(onColReorder)="cr()"', '(columnReorder)="cr()"'],
    ['(onRowReorder)="rr()"', '(rowReorder)="rr()"'],
    // Scroll & size
    ['[scrollable]="true"', '[scrollable]="true"'],
    ['scrollHeight="400px"', 'scrollHeight="400px"'],
    ['[virtualScroll]="true"', '[virtualScroll]="true"'],
    ['[virtualScrollItemSize]="40"', '[rowHeight]="40"'],
    ['[resizableColumns]="true"', '[resizableColumns]="true"'],
    ['columnResizeMode="expand"', 'resizeMode="expand"'],
    // State
    ['stateKey="k"', 'stateKey="k"'],
    ['stateStorage="local"', 'stateStorage="local"'],
    ['(onStateSave)="ss()"', '(stateSave)="ss()"'],
    ['(onStateRestore)="sr()"', '(stateRestore)="sr()"'],
  ];

  for (const [input, expected] of cases) {
    it(`${input} → ${expected}`, () => {
      const out = code(input);
      expect(out).toContain('<nw-data-table');
      expect(out).toContain(expected);
      expect(out).not.toContain('<p-table');
    });
  }

  it('adds the NwDataTableComponent import and renames the closing tag', () => {
    const out = run('[value]="rows"');
    expect(out.imports).toContain('NwDataTableComponent');
    expect(out.code).toContain('</nw-data-table>');
  });
});

describe('data-table adapter — unsupported features', () => {
  const unsupported = [
    'frozenColumns',
    'frozenValue',
    'editMode',
    'rowGroupMode',
    'groupRowsBy',
  ];
  for (const name of unsupported) {
    it(`flags ${name} as unsupported and drops it`, () => {
      const out = run(`[${name}]="x"`);
      expect(out.report.unsupported.length).toBeGreaterThan(0);
      expect(out.code).not.toContain(name);
    });
  }
});

describe('data-table adapter — special cases', () => {
  it('drops sortMode="single" as the default (reported as mapped)', () => {
    const out = run('sortMode="single"');
    expect(out.code).not.toContain('sortMode');
    expect(out.code).not.toContain('multiSort');
    expect(out.report.mapped.some((m) => m.includes('single'))).toBe(true);
  });

  it('converts bare paginator to a binding', () => {
    expect(code('paginator')).toContain('[paginator]="true"');
  });

  it('passes through unknown attributes unchanged', () => {
    expect(code('class="my-table"')).toContain('class="my-table"');
  });
});

describe('data-table adapter — column templates flagged manual', () => {
  it('flags header/body/footer/caption templates', () => {
    const src = `<p-table [value]="rows">
      <ng-template pTemplate="caption">Products</ng-template>
      <ng-template pTemplate="header"><tr><th>Name</th></tr></ng-template>
      <ng-template pTemplate="body" let-row><tr><td>{{row.name}}</td></tr></ng-template>
      <ng-template pTemplate="footer">Total</ng-template>
    </p-table>`;
    const { report } = migrate(src);
    expect(report.manual.length).toBe(4);
    expect(report.manual.some((m) => m.includes('[columns]'))).toBe(true);
    expect(report.manual.some((m) => m.includes('[footerColumns]'))).toBe(true);
    expect(report.manual.some((m) => m.includes('[caption]'))).toBe(true);
  });
});
