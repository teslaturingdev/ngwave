import { TestBed } from '@angular/core/testing';
import { NwToastComponent } from './toast.component';
import { NwToastService } from './toast.service';

describe('NwToast', () => {
  let service: NwToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NwToastComponent],
    }).compileComponents();
    service = TestBed.inject(NwToastService);
    service.clear();
  });

  async function create() {
    const fixture = TestBed.createComponent(NwToastComponent);
    await fixture.whenStable();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  const toasts = (el: HTMLElement) =>
    Array.from(el.querySelectorAll('[role="alert"]'));

  it('renders a toast added via the service', async () => {
    const { fixture, el } = await create();
    service.show({ severity: 'success', summary: 'Saved', detail: 'All good', life: 0 });
    await fixture.whenStable();
    expect(toasts(el).length).toBe(1);
    expect(toasts(el)[0].textContent).toContain('Saved');
    expect(toasts(el)[0].textContent).toContain('All good');
  });

  it('dismisses a toast via its close button', async () => {
    const { fixture, el } = await create();
    service.show({ severity: 'error', summary: 'Oops', life: 0 });
    await fixture.whenStable();
    (el.querySelector('[aria-label="Dismiss"]') as HTMLElement).click();
    await fixture.whenStable();
    expect(toasts(el).length).toBe(0);
  });

  it('auto-dismisses after life elapses', async () => {
    const { fixture, el } = await create();
    service.show({ severity: 'info', summary: 'Bye', life: 20 });
    await fixture.whenStable();
    expect(toasts(el).length).toBe(1);
    await new Promise((r) => setTimeout(r, 50));
    await fixture.whenStable();
    expect(toasts(el).length).toBe(0);
  });

  it('only renders messages matching the outlet key', async () => {
    const fixture = TestBed.createComponent(NwToastComponent);
    fixture.componentRef.setInput('key', 'panel');
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    service.show({ severity: 'info', summary: 'Global', life: 0 });
    service.show({ severity: 'info', summary: 'Scoped', key: 'panel', life: 0 });
    await fixture.whenStable();

    expect(toasts(el).length).toBe(1);
    expect(toasts(el)[0].textContent).toContain('Scoped');
  });

  it('hides the close button when closable is false', async () => {
    const { fixture, el } = await create();
    service.show({ severity: 'info', summary: 'x', closable: false, life: 0 });
    await fixture.whenStable();
    expect(el.querySelector('[aria-label="Dismiss"]')).toBeNull();
  });

  it('sticky messages ignore life and stay put', async () => {
    const { fixture, el } = await create();
    service.show({ severity: 'warn', summary: 'stay', sticky: true, life: 10 });
    await fixture.whenStable();
    await new Promise((r) => setTimeout(r, 40));
    await fixture.whenStable();
    expect(toasts(el).length).toBe(1);
  });
});
