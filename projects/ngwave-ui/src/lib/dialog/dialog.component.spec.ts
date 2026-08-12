import { TestBed } from '@angular/core/testing';
import { NwDialogComponent } from './dialog.component';

describe('NwDialogComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NwDialogComponent],
    }).compileComponents();
  });

  async function create(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(NwDialogComponent);
    for (const [k, v] of Object.entries(inputs)) {
      fixture.componentRef.setInput(k, v);
    }
    await fixture.whenStable();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  it('is not rendered when hidden', async () => {
    const { el } = await create({ visible: false });
    expect(el.querySelector('[role="dialog"]')).toBeNull();
  });

  it('renders with a header when visible', async () => {
    const { el } = await create({ visible: true, header: 'Confirm' });
    const dialog = el.querySelector('[role="dialog"]');
    expect(dialog).toBeTruthy();
    expect(dialog?.textContent).toContain('Confirm');
  });

  it('closes via the close button', async () => {
    const { fixture, el } = await create({ visible: true, header: 'X' });
    (el.querySelector('[aria-label="Close"]') as HTMLElement).click();
    await fixture.whenStable();
    expect(fixture.componentInstance.visible()).toBe(false);
  });

  it('closes on mask click when dismissable', async () => {
    const { fixture, el } = await create({ visible: true });
    const mask = Array.from(el.querySelectorAll('div')).find((d) =>
      d.classList.contains('bg-surface-950/50'),
    ) as HTMLElement;
    expect(mask).toBeTruthy();
    mask.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.visible()).toBe(false);
  });

  it('does not close on mask click when dismissableMask is false', async () => {
    const { fixture, el } = await create({
      visible: true,
      dismissableMask: false,
    });
    const mask = Array.from(el.querySelectorAll('div')).find((d) =>
      d.classList.contains('bg-surface-950/50'),
    ) as HTMLElement;
    mask.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.visible()).toBe(true);
  });

  it('closes on Escape', async () => {
    const { fixture } = await create({ visible: true });
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await fixture.whenStable();
    expect(fixture.componentInstance.visible()).toBe(false);
  });

  it('renders a maximize button and toggles a full-screen panel', async () => {
    const { fixture, el } = await create({ visible: true, maximizable: true });
    const btn = el.querySelector('[aria-label="Maximize"]') as HTMLElement;
    expect(btn).toBeTruthy();
    btn.click();
    await fixture.whenStable();
    expect(el.querySelector('[aria-label="Restore"]')).toBeTruthy();
    expect(el.querySelector('[role="dialog"]')?.className).toContain('w-screen');
  });

  it('shows a resize handle only when resizable', async () => {
    const { el } = await create({ visible: true, resizable: true });
    expect(el.querySelector('.cursor-se-resize')).toBeTruthy();
  });

  it('emits shown when opened and hidden when closed', async () => {
    const fixture = TestBed.createComponent(NwDialogComponent);
    const shown: boolean[] = [];
    const hidden: boolean[] = [];
    fixture.componentInstance.shown.subscribe(() => shown.push(true));
    fixture.componentInstance.hidden.subscribe(() => hidden.push(true));
    fixture.componentRef.setInput('visible', true);
    await fixture.whenStable();
    await Promise.resolve();
    fixture.componentRef.setInput('visible', false);
    await fixture.whenStable();
    expect(shown.length).toBe(1);
    expect(hidden.length).toBe(1);
  });

  it('blocks body scroll while open and restores it on close', async () => {
    const { fixture } = await create({ visible: true, blockScroll: true });
    expect(document.body.style.overflow).toBe('hidden');
    fixture.componentRef.setInput('visible', false);
    await fixture.whenStable();
    expect(document.body.style.overflow).toBe('');
  });
});
