import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  model,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/** A button that toggles a pressed/active boolean state. */
@Component({
  selector: 'nw-toggle-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NwToggleButtonComponent),
      multi: true,
    },
  ],
  template: `
    <button
      type="button"
      role="switch"
      [attr.aria-pressed]="value()"
      [disabled]="isDisabled()"
      (click)="toggle()"
      class="rounded-nw border px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
      [class]="btnClass()"
    >
      {{ value() ? onLabel() : offLabel() }}
    </button>
  `,
})
export class NwToggleButtonComponent implements ControlValueAccessor {
  readonly onLabel = input('Yes');
  readonly offLabel = input('No');
  readonly disabled = input(false);
  readonly value = model(false);

  private readonly formDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  protected readonly btnClass = computed(() =>
    this.value()
      ? 'border-nw-600 bg-nw-600 text-white'
      : 'border-surface-200 bg-surface-0 text-surface-700 hover:bg-surface-50',
  );

  private onChange: (v: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  protected toggle(): void {
    if (this.isDisabled()) return;
    const next = !this.value();
    this.value.set(next);
    this.onChange(next);
    this.onTouched();
  }

  writeValue(v: boolean): void {
    this.value.set(!!v);
  }
  registerOnChange(fn: (v: boolean) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }
}
