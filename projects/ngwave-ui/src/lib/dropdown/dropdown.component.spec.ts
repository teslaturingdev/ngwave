import { TestBed } from '@angular/core/testing';
import { NwDropdownComponent } from './dropdown.component';
import { NwOption } from './dropdown.types';

const OPTIONS: NwOption[] = [
  { label: 'Apple', value: 'a' },
  { label: 'Banana', value: 'b' },
  { label: 'Cherry', value: 'c' },
];

describe('NwDropdownComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NwDropdownComponent],
    }).compileComponents();
  });

  async function create(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(NwDropdownComponent);
    fixture.componentRef.setInput('options', OPTIONS);
    for (const [k, v] of Object.entries(inputs)) {
      fixture.componentRef.setInput(k, v);
    }
    await fixture.whenStable();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  const trigger = (el: HTMLElement) =>
    el.querySelector('button') as HTMLButtonElement;
  const optionEls = (el: HTMLElement) =>
    Array.from(el.querySelectorAll('ul li'));
  const optionByText = (el: HTMLElement, text: string) =>
    optionEls(el).find((li) => li.textContent?.trim() === text) as HTMLElement;

  it('shows the placeholder when empty', async () => {
    const { el } = await create({ placeholder: 'Pick one' });
    expect(trigger(el).textContent).toContain('Pick one');
  });

  it('opens and lists options', async () => {
    const { fixture, el } = await create();
    trigger(el).click();
    await fixture.whenStable();
    expect(optionEls(el).length).toBe(3);
  });

  it('closes on an outside document click', async () => {
    const { fixture, el } = await create();
    trigger(el).click();
    await fixture.whenStable();
    expect(el.querySelector('ul')).not.toBeNull();

    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await fixture.whenStable();
    expect(el.querySelector('ul')).toBeNull();
  });

  it('selects a single option and closes', async () => {
    const { fixture, el } = await create();
    trigger(el).click();
    await fixture.whenStable();
    optionByText(el, 'Banana').click();
    await fixture.whenStable();
    expect(fixture.componentInstance.value()).toBe('b');
    expect(trigger(el).textContent).toContain('Banana');
    expect(el.querySelector('ul')).toBeNull();
  });

  it('supports multiple selection', async () => {
    const { fixture, el } = await create({ multiple: true });
    trigger(el).click();
    await fixture.whenStable();
    optionByText(el, 'Apple').click();
    optionByText(el, 'Cherry').click();
    await fixture.whenStable();
    expect(fixture.componentInstance.value()).toEqual(['a', 'c']);
  });

  it('filters options', async () => {
    const { fixture, el } = await create({ filter: true });
    trigger(el).click();
    await fixture.whenStable();
    const search = el.querySelector(
      'input[type="search"]',
    ) as HTMLInputElement;
    search.value = 'ch';
    search.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(optionEls(el).length).toBe(1);
    expect(optionEls(el)[0].textContent).toContain('Cherry');
  });

  it('clears the value', async () => {
    const { fixture, el } = await create({ clearable: true });
    fixture.componentRef.setInput('value', 'a');
    await fixture.whenStable();
    (el.querySelector('[aria-label="Clear"]') as HTMLElement).click();
    await fixture.whenStable();
    expect(fixture.componentInstance.value()).toBeNull();
  });

  it('resolves raw objects via optionLabel / optionValue', async () => {
    const raw = [
      { name: 'Alpha', id: 1 },
      { name: 'Beta', id: 2 },
    ];
    const { fixture, el } = await create({
      options: raw,
      optionLabel: 'name',
      optionValue: 'id',
    });
    trigger(el).click();
    await fixture.whenStable();
    expect(optionByText(el, 'Beta')).toBeTruthy();
    optionByText(el, 'Beta').click();
    await fixture.whenStable();
    expect(fixture.componentInstance.value()).toBe(2);
  });

  it('selects the highlighted option with the keyboard', async () => {
    const { fixture, el } = await create();
    trigger(el).click();
    await fixture.whenStable();
    const host = el.querySelector('.nw-dropdown-host') ?? el;
    host.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    host.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await fixture.whenStable();
    expect(fixture.componentInstance.value()).toBeTruthy();
  });

  it('integrates with forms via ControlValueAccessor', async () => {
    const { fixture, el } = await create();
    const cmp = fixture.componentInstance;
    let changed: unknown;
    cmp.registerOnChange((v) => (changed = v));
    cmp.writeValue('a');
    await fixture.whenStable();
    expect(cmp.value()).toBe('a');
    trigger(el).click();
    await fixture.whenStable();
    optionByText(el, 'Banana').click();
    await fixture.whenStable();
    expect(changed).toBe('b');
  });
});
