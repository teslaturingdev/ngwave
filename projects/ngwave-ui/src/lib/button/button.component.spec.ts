import { TestBed } from '@angular/core/testing';
import { NwButtonComponent } from './button.component';

describe('NwButtonComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NwButtonComponent],
    }).compileComponents();
  });

  function create() {
    const fixture = TestBed.createComponent(NwButtonComponent);
    const button = () =>
      fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    return { fixture, button };
  }

  it('creates and renders a native button', async () => {
    const { fixture, button } = create();
    await fixture.whenStable();
    expect(button()).toBeTruthy();
  });

  it('applies variant and size classes', async () => {
    const { fixture, button } = create();
    fixture.componentRef.setInput('variant', 'outlined');
    fixture.componentRef.setInput('size', 'large');
    await fixture.whenStable();
    expect(button().className).toContain('h-12');
    expect(button().className).toContain('border');
  });

  it('renders the label input', async () => {
    const { fixture, button } = create();
    fixture.componentRef.setInput('label', 'Save');
    await fixture.whenStable();
    expect(button().textContent).toContain('Save');
  });

  it('renders a rounded pill when rounded is set', async () => {
    const { fixture, button } = create();
    fixture.componentRef.setInput('rounded', true);
    await fixture.whenStable();
    expect(button().className).toContain('rounded-full');
  });

  it('renders a badge', async () => {
    const { fixture, button } = create();
    fixture.componentRef.setInput('badge', '8');
    await fixture.whenStable();
    expect(button().textContent).toContain('8');
  });

  it('disables and marks aria-busy while loading', async () => {
    const { fixture, button } = create();
    fixture.componentRef.setInput('loading', true);
    await fixture.whenStable();
    expect(button().disabled).toBe(true);
    expect(button().getAttribute('aria-busy')).toBe('true');
    expect(button().querySelector('svg')).toBeTruthy();
  });

  it('is disabled when disabled input is set', async () => {
    const { fixture, button } = create();
    fixture.componentRef.setInput('disabled', true);
    await fixture.whenStable();
    expect(button().disabled).toBe(true);
  });
});
