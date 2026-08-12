import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NwCheckboxComponent } from './checkbox.component';

describe('NwCheckboxComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NwCheckboxComponent],
    }).compileComponents();
  });

  async function create(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(NwCheckboxComponent);
    for (const [k, v] of Object.entries(inputs)) {
      fixture.componentRef.setInput(k, v);
    }
    await fixture.whenStable();
    const input = () =>
      fixture.nativeElement.querySelector('input') as HTMLInputElement;
    return { fixture, input };
  }

  it('renders a label', async () => {
    const { fixture } = await create({ label: 'Accept' });
    expect(fixture.nativeElement.textContent).toContain('Accept');
  });

  it('toggles checked on change', async () => {
    const { fixture, input } = await create();
    input().click();
    await fixture.whenStable();
    expect(fixture.componentInstance.checked()).toBe(true);
  });

  it('reflects the indeterminate input', async () => {
    const { input } = await create({ indeterminate: true });
    expect(input().indeterminate).toBe(true);
  });

  it('is disabled when disabled is set', async () => {
    const { input } = await create({ disabled: true });
    expect(input().disabled).toBe(true);
  });

  it('works as a form control (writeValue + onChange)', async () => {
    @Component({
      imports: [ReactiveFormsModule, NwCheckboxComponent],
      template: `<nw-checkbox [formControl]="ctrl" />`,
    })
    class Host {
      ctrl = new FormControl(false);
    }
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const box = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    box.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.ctrl.value).toBe(true);

    fixture.componentInstance.ctrl.setValue(false);
    await fixture.whenStable();
    expect(box.checked).toBe(false);

    fixture.componentInstance.ctrl.disable();
    await fixture.whenStable();
    expect(box.disabled).toBe(true);
  });
});
