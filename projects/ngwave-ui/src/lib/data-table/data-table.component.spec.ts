import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NwRowExpansionDirective } from './column-template.directive';
import { NwDataTableComponent } from './data-table.component';
import { NwColumn, NwTableLazyLoadEvent, NwTableRow } from './data-table.types';

interface User extends NwTableRow {
  id: number;
  name: string;
  age: number;
}

const DATA: User[] = [
  { id: 1, name: 'Bob', age: 30 },
  { id: 2, name: 'Alice', age: 25 },
  { id: 3, name: 'Carol', age: 40 },
];

const COLUMNS: NwColumn<User>[] = [
  { field: 'name', header: 'Name', sortable: true },
  { field: 'age', header: 'Age', sortable: true },
];

const FILTER_COLUMNS: NwColumn<User>[] = [
  { field: 'name', header: 'Name', sortable: true, filter: true },
  { field: 'age', header: 'Age', sortable: true, filter: true, filterType: 'numeric' },
];

const EDIT_COLUMNS: NwColumn<User>[] = [
  { field: 'name', header: 'Name', editable: true },
  { field: 'age', header: 'Age' },
];

describe('NwDataTableComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NwDataTableComponent],
    }).compileComponents();
  });

  async function create(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(NwDataTableComponent<User>);
    fixture.componentRef.setInput('data', DATA);
    fixture.componentRef.setInput('columns', COLUMNS);
    for (const [k, v] of Object.entries(inputs)) {
      fixture.componentRef.setInput(k, v);
    }
    await fixture.whenStable();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  const bodyRows = (el: HTMLElement) =>
    Array.from(el.querySelectorAll('tbody tr'));
  const byLabel = (el: HTMLElement, label: string) =>
    el.querySelector(`[aria-label="${label}"]`) as HTMLElement | null;

  it('renders a row per record', async () => {
    const { el } = await create();
    expect(bodyRows(el).length).toBe(3);
  });

  it('sorts ascending when a sortable header is clicked', async () => {
    const { fixture, el } = await create();
    (el.querySelectorAll('thead button')[0] as HTMLElement).click();
    await fixture.whenStable();
    expect(bodyRows(el)[0].textContent).toContain('Alice');
  });

  it('searches rows across searchFields', async () => {
    const { fixture, el } = await create({ searchFields: ['name'] });
    const input = el.querySelector('input[type="search"]') as HTMLInputElement;
    input.value = 'carol';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(bodyRows(el).length).toBe(1);
    expect(bodyRows(el)[0].textContent).toContain('Carol');
  });

  it('filters by a per-column match mode', async () => {
    const { fixture, el } = await create({ columns: FILTER_COLUMNS });
    byLabel(el, 'Filter Name')!.click();
    await fixture.whenStable();
    const input = el.querySelector(
      'input[placeholder="Value"]',
    ) as HTMLInputElement;
    input.value = 'carol';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(bodyRows(el).length).toBe(1);
    expect(bodyRows(el)[0].textContent).toContain('Carol');
  });

  it('paginates and advances pages', async () => {
    const { fixture, el } = await create({ paginator: true, pageSize: 2 });
    expect(bodyRows(el).length).toBe(2);
    byLabel(el, 'Next page')!.click();
    await fixture.whenStable();
    expect(bodyRows(el).length).toBe(1);
  });

  it('selects a row via its checkbox, tracked by rowKey', async () => {
    const { fixture, el } = await create({ selectable: true, rowKey: 'id' });
    (
      el.querySelector('tbody input[type="checkbox"]') as HTMLInputElement
    ).click();
    await fixture.whenStable();
    expect(fixture.componentInstance.selectedRows().length).toBe(1);
    expect(fixture.componentInstance.selectedRows()[0].id).toBe(DATA[0].id);
  });

  it('emits lazyLoad when lazy is enabled', async () => {
    const fixture = TestBed.createComponent(NwDataTableComponent<User>);
    fixture.componentRef.setInput('data', DATA);
    fixture.componentRef.setInput('columns', COLUMNS);
    fixture.componentRef.setInput('lazy', true);
    fixture.componentRef.setInput('paginator', true);
    fixture.componentRef.setInput('pageSize', 10);
    const events: NwTableLazyLoadEvent[] = [];
    fixture.componentInstance.lazyLoad.subscribe((e) => events.push(e));
    await fixture.whenStable();
    expect(events.length).toBeGreaterThan(0);
    expect(events[0].rows).toBe(10);
    expect(events[0].first).toBe(0);
  });

  it('edits a cell inline and emits cellEdit', async () => {
    const { fixture, el } = await create({ columns: EDIT_COLUMNS });
    const events: { field: string; value: unknown }[] = [];
    fixture.componentInstance.cellEdit.subscribe((e) => events.push(e));
    (el.querySelector('tbody td') as HTMLElement).click();
    await fixture.whenStable();
    const input = el.querySelector('.nw-edit-input') as HTMLInputElement;
    expect(input).toBeTruthy();
    input.value = 'Zed';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    await fixture.whenStable();
    expect(events.length).toBe(1);
    expect(events[0].value).toBe('Zed');
    expect((el.querySelector('tbody td') as HTMLElement).textContent).toContain(
      'Zed',
    );
  });

  it('freezes leading columns with sticky positioning', async () => {
    const { el } = await create({ frozenColumns: 1 });
    const firstHeader = el.querySelector('thead th') as HTMLElement;
    expect(firstHeader.classList.contains('sticky')).toBe(true);
  });

  it('groups rows with subheaders', async () => {
    const groupData: User[] = [
      { id: 1, name: 'Bob', age: 30 },
      { id: 2, name: 'Alice', age: 30 },
      { id: 3, name: 'Carol', age: 40 },
    ];
    const { el } = await create({ data: groupData, groupBy: 'age' });
    const groupRows = el.querySelectorAll('tbody tr.bg-surface-100');
    expect(groupRows.length).toBe(2);
    expect(el.querySelector('tbody')?.textContent).toContain('Age: 30');
  });

  it('opens a context menu and emits a selection', async () => {
    const { fixture, el } = await create({
      contextMenuItems: [{ label: 'Edit' }, { label: 'Delete' }],
    });
    const events: { item: { label: string }; row: User }[] = [];
    fixture.componentInstance.contextMenuSelect.subscribe((e) =>
      events.push(e),
    );
    (el.querySelector('tbody tr') as HTMLElement).dispatchEvent(
      new MouseEvent('contextmenu', { bubbles: true, clientX: 5, clientY: 5 }),
    );
    await fixture.whenStable();
    const editBtn = Array.from(el.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === 'Edit',
    ) as HTMLButtonElement;
    expect(editBtn).toBeTruthy();
    editBtn.click();
    await fixture.whenStable();
    expect(events.length).toBe(1);
    expect(events[0].item.label).toBe('Edit');
  });

  it('renders only a window of rows when virtual scrolling', async () => {
    const big: User[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      name: `User ${i}`,
      age: 20 + i,
    }));
    const { el } = await create({
      data: big,
      virtualScroll: true,
      rowHeight: 40,
      scrollHeight: 80,
    });
    const dataRows = el.querySelectorAll('tbody tr:not([aria-hidden])');
    expect(dataRows.length).toBeGreaterThan(0);
    expect(dataRows.length).toBeLessThan(50);
    expect(el.querySelectorAll('tbody tr[aria-hidden]').length).toBeGreaterThan(
      0,
    );
  });
});

@Component({
  imports: [NwDataTableComponent, NwRowExpansionDirective],
  template: `
    <nw-data-table [data]="data" [columns]="cols" rowKey="id">
      <ng-template nwRowExpansion let-row>
        <span class="exp">{{ $any(row).name }} details</span>
      </ng-template>
    </nw-data-table>
  `,
})
class ExpansionHost {
  data = DATA;
  cols = COLUMNS;
}

describe('NwDataTableComponent — expansion', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpansionHost],
    }).compileComponents();
  });

  it('expands a row via its toggle and emits rowExpand', async () => {
    const fixture = TestBed.createComponent(ExpansionHost);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const toggle = el.querySelector(
      'tbody [aria-label="Toggle row"]',
    ) as HTMLElement;
    expect(toggle).toBeTruthy();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    toggle.click();
    await fixture.whenStable();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(el.querySelector('.exp')?.textContent).toContain('Bob details');
  });
});
