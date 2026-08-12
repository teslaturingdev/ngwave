import { TestBed } from '@angular/core/testing';
import { NwInputNumberComponent } from './input-number.component';

describe('NwInputNumberComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NwInputNumberComponent],
    }).compileComponents();
  });

  async function create(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(NwInputNumberComponent);
    for (const [k, v] of Object.entries(inputs)) {
      fixture.componentRef.setInput(k, v);
    }
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const input = () => el.querySelector('input') as HTMLInputElement;
    return { fixture, el, input };
  }

  it('parses typed input into a number', async () => {
    const { fixture, input } = await create();
    input().dispatchEvent(new Event('focus'));
    input().value = '42';
    input().dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(fixture.componentInstance.value()).toBe(42);
  });

  it('increments and decrements with the stepper', async () => {
    const { fixture, el } = await create({ showButtons: true, value: 5, step: 2 });
    const inc = el.querySelector('[aria-label="Increment"]') as HTMLElement;
    inc.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.value()).toBe(7);
  });

  it('clamps to min/max on blur', async () => {
    const { fixture, input } = await create({ min: 0, max: 10, value: 50 });
    input().dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    expect(fixture.componentInstance.value()).toBe(10);
  });

  it('formats currency when not focused', async () => {
    const { input } = await create({
      mode: 'currency',
      currency: 'USD',
      locale: 'en-US',
      value: 1234.5,
    });
    expect(input().value).toContain('$');
    expect(input().value).toContain('1,234');
  });
});
