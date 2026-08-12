import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NwInputTextComponent } from './input-text.component';

describe('NwInputTextComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NwInputTextComponent],
    }).compileComponents();
  });

  async function create(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(NwInputTextComponent);
    for (const [k, v] of Object.entries(inputs)) {
      fixture.componentRef.setInput(k, v);
    }
    await fixture.whenStable();
    const input = () =>
      fixture.nativeElement.querySelector('input') as HTMLInputElement;
    return { fixture, input };
  }

  it('reflects typing into the value model', async () => {
    const { fixture, input } = await create();
    input().value = 'hello';
    input().dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(fixture.componentInstance.value()).toBe('hello');
  });

  it('shows a clear button that empties the value', async () => {
    const { fixture, input } = await create({ clearable: true, value: 'x' });
    const clear = fixture.nativeElement.querySelector(
      '[aria-label="Clear"]',
    ) as HTMLElement;
    expect(clear).toBeTruthy();
    clear.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.value()).toBe('');
    void input;
  });

  it('works as a form control', async () => {
    @Component({
      imports: [ReactiveFormsModule, NwInputTextComponent],
      template: `<nw-input-text [formControl]="ctrl" />`,
    })
    class Host {
      ctrl = new FormControl('');
    }
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const el = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    el.value = 'abc';
    el.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(fixture.componentInstance.ctrl.value).toBe('abc');

    fixture.componentInstance.ctrl.disable();
    await fixture.whenStable();
    expect(el.disabled).toBe(true);
  });
});
