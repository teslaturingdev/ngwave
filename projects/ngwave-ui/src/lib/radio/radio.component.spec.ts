import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NwRadioComponent } from './radio.component';

describe('NwRadioComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NwRadioComponent],
    }).compileComponents();
  });

  async function create(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(NwRadioComponent);
    fixture.componentRef.setInput('value', 'a');
    for (const [k, v] of Object.entries(inputs)) {
      fixture.componentRef.setInput(k, v);
    }
    await fixture.whenStable();
    const input = () =>
      fixture.nativeElement.querySelector('input') as HTMLInputElement;
    return { fixture, input };
  }

  it('selects its value on change', async () => {
    const { fixture, input } = await create();
    input().click();
    await fixture.whenStable();
    expect(fixture.componentInstance.selected()).toBe('a');
  });

  it('is checked when selected matches its value', async () => {
    const { fixture, input } = await create({ selected: 'a' });
    expect(input().checked).toBe(true);
    void fixture;
  });

  it('is not checked when selected differs', async () => {
    const { input } = await create({ selected: 'b' });
    expect(input().checked).toBe(false);
  });

  it('drives a shared form control across a group', async () => {
    @Component({
      imports: [ReactiveFormsModule, NwRadioComponent],
      template: `
        <nw-radio [formControl]="ctrl" [value]="'a'" name="g" />
        <nw-radio [formControl]="ctrl" [value]="'b'" name="g" />
      `,
    })
    class Host {
      ctrl = new FormControl<string>('a');
    }
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const inputs = fixture.nativeElement.querySelectorAll(
      'input',
    ) as NodeListOf<HTMLInputElement>;

    expect(inputs[0].checked).toBe(true);
    inputs[1].click();
    await fixture.whenStable();
    expect(fixture.componentInstance.ctrl.value).toBe('b');
    expect(inputs[1].checked).toBe(true);
  });
});
