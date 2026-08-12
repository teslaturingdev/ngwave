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

export type NwRadioSize = 'small' | 'normal' | 'large';

const OUTER: Record<NwRadioSize, string> = {
  small: 'h-4 w-4',
  normal: 'h-5 w-5',
  large: 'h-6 w-6',
};
const INNER: Record<NwRadioSize, string> = {
  small: 'h-1.5 w-1.5',
  normal: 'h-2 w-2',
  large: 'h-2.5 w-2.5',
};

@Component({
  selector: 'nw-radio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NwRadioComponent),
      multi: true,
    },
  ],
  template: `
    <label
      class="inline-flex items-center gap-2"
      [class.cursor-pointer]="!isDisabled()"
      [class.opacity-50]="isDisabled()"
      [class.cursor-not-allowed]="isDisabled()"
    >
      <span
        class="relative inline-flex items-center justify-center rounded-full border transition-[background-color,border-color,box-shadow] duration-150 ease-nw"
        [class]="outerClasses()"
      >
        <input
          type="radio"
          class="absolute inset-0 opacity-0"
          [class.cursor-pointer]="!isDisabled()"
          [attr.id]="inputId() || null"
          [attr.name]="name() || null"
          [attr.aria-invalid]="invalid() ? 'true' : null"
          [checked]="checked()"
          [disabled]="isDisabled()"
          (change)="select()"
          (blur)="onTouched()"
        />
        @if (checked()) {
          <span class="rounded-full bg-nw-600 animate-nw-pop" [class]="inner()"></span>
        }
      </span>
      @if (label()) {
        <span class="text-sm text-surface-900 select-none">{{ label() }}</span>
      }
    </label>
  `,
})
export class NwRadioComponent implements ControlValueAccessor {
  /** This radio's option value. */
  readonly value = input<unknown>(null);
  /** Two-way bound group selection; bind the same signal on each radio. */
  readonly selected = model<unknown>(null);
  readonly label = input('');
  readonly disabled = input(false);
  readonly size = input<NwRadioSize>('normal');
  readonly invalid = input(false);
  readonly inputId = input('');
  readonly name = input('');

  private readonly formDisabled = signal(false);
  protected readonly isDisabled = computed(
    () => this.disabled() || this.formDisabled(),
  );

  protected readonly checked = computed(() => this.selected() === this.value());
  protected readonly inner = computed(() => INNER[this.size()]);
  protected readonly outerClasses = computed(() => {
    const on = this.checked();
    const border = this.invalid()
      ? 'border-red-500'
      : on
        ? 'border-nw-600'
        : 'border-surface-300';
    return `${OUTER[this.size()]} bg-surface-0 ${border}`;
  });

  private onChange: (v: unknown) => void = () => {};
  protected onTouched: () => void = () => {};

  protected select(): void {
    if (this.isDisabled()) return;
    this.selected.set(this.value());
    this.onChange(this.value());
    this.onTouched();
  }

  // ControlValueAccessor
  writeValue(value: unknown): void {
    this.selected.set(value);
  }
  registerOnChange(fn: (v: unknown) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }
}
