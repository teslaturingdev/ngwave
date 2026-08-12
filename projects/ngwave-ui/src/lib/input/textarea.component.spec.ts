import { TestBed } from '@angular/core/testing';
import { NwTextareaComponent } from './textarea.component';

describe('NwTextareaComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NwTextareaComponent],
    }).compileComponents();
  });

  async function create(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(NwTextareaComponent);
    for (const [k, v] of Object.entries(inputs)) {
      fixture.componentRef.setInput(k, v);
    }
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    return { fixture, el, ta: () => el.querySelector('textarea') as HTMLTextAreaElement };
  }

  it('reflects typing into the value model', async () => {
    const { fixture, ta } = await create();
    ta().value = 'note';
    ta().dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(fixture.componentInstance.value()).toBe('note');
  });

  it('shows a character counter when maxlength is set', async () => {
    const { el } = await create({ maxlength: 100, value: 'abc' });
    expect(el.textContent).toContain('3 / 100');
  });
});
