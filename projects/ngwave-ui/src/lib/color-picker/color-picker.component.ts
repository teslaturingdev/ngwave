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

/** Hex color swatch that opens the browser's native color picker on click. */
@Component({
  selector: 'nw-color-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-block' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NwColorPickerComponent),
      multi: true,
    },
  ],
  template: `
    <input
      type="color"
      class="h-8 w-8 p-0.5 rounded-nw border border-surface-300 bg-surface-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      [value]="value()"
      [disabled]="isDisabled()"
      (input)="onInput($event)"
      (blur)="onTouched()"
    />
  `,
})
export class NwColorPickerComponent implements ControlValueAccessor {
  readonly value = model('#ffffff');
  readonly disabled = input(false);

  private readonly formDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  private onChange: (v: string) => void = () => {};
  protected onTouched: () => void = () => {};

  protected onInput(event: Event): void {
    const next = (event.target as HTMLInputElement).value;
    this.value.set(next);
    this.onChange(next);
  }

  writeValue(v: string): void {
    this.value.set(v ?? '#ffffff');
  }
  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }
}
