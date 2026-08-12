import { TestBed } from '@angular/core/testing';
import { NwAutocompleteComponent } from './autocomplete.component';

const tick = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe('NwAutocompleteComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NwAutocompleteComponent],
    }).compileComponents();
  });

  async function create(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(NwAutocompleteComponent);
    fixture.componentRef.setInput('delay', 0);
    for (const [k, v] of Object.entries(inputs)) {
      fixture.componentRef.setInput(k, v);
    }
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    return { fixture, el, input: () => el.querySelector('input') as HTMLInputElement };
  }

  it('emits (complete) with the query after the debounce', async () => {
    const { fixture, input } = await create();
    const emitted: string[] = [];
    fixture.componentInstance.complete.subscribe((q) => emitted.push(q));

    input().value = 'ap';
    input().dispatchEvent(new Event('input'));
    await tick(5);
    await fixture.whenStable();

    expect(emitted).toContain('ap');
  });

  it('selecting a suggestion sets the value and closes the panel', async () => {
    const { fixture, input, el } = await create({
      suggestions: ['Apple', 'Apricot'],
    });
    input().value = 'ap';
    input().dispatchEvent(new Event('input'));
    await tick(5);
    await fixture.whenStable();

    const option = el.querySelector('[role="option"]') as HTMLElement;
    option.dispatchEvent(new MouseEvent('mousedown'));
    await fixture.whenStable();

    expect(fixture.componentInstance.value()).toBe('Apple');
    expect(el.querySelector('[role="listbox"]')).toBeNull();
  });

  it('renders chips and appends in multiple mode', async () => {
    const { fixture, input, el } = await create({
      multiple: true,
      suggestions: ['Apple', 'Apricot'],
    });
    input().value = 'ap';
    input().dispatchEvent(new Event('input'));
    await tick(5);
    await fixture.whenStable();

    (el.querySelector('[role="option"]') as HTMLElement).dispatchEvent(
      new MouseEvent('mousedown'),
    );
    await fixture.whenStable();

    expect(Array.isArray(fixture.componentInstance.value())).toBe(true);
    expect((fixture.componentInstance.value() as unknown[]).length).toBe(1);
    expect(el.textContent).toContain('Apple');
  });

  it('reads labels from objects via optionLabel', async () => {
    const { fixture, input, el } = await create({
      optionLabel: 'name',
      suggestions: [{ name: 'Ada' }, { name: 'Alan' }],
    });
    input().value = 'a';
    input().dispatchEvent(new Event('input'));
    await tick(5);
    await fixture.whenStable();

    expect(el.querySelector('[role="option"]')?.textContent).toContain('Ada');
    (el.querySelector('[role="option"]') as HTMLElement).dispatchEvent(
      new MouseEvent('mousedown'),
    );
    await fixture.whenStable();
    expect(fixture.componentInstance.value()).toEqual({ name: 'Ada' });
  });
});
