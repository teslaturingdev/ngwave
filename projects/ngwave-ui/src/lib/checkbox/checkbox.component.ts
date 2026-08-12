import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type NwCheckboxSize = 'small' | 'normal' | 'large';

const BOX_SIZE: Record<NwCheckboxSize, string> = {
  small: 'h-4 w-4 text-[10px]',
  normal: 'h-5 w-5 text-xs',
  large: 'h-6 w-6 text-sm',
};

@Component({
  selector: 'nw-checkbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NwCheckboxComponent),
      multi: true,
    },
  ],
  template: `
    <label
      class="inline-flex items-center gap-2"
      [class.cursor-pointer]="!isDisabled() && !readonly()"
      [class.opacity-50]="isDisabled()"
      [class.cursor-not-allowed]="isDisabled()"
    >
      <span
        class="relative inline-flex items-center justify-center rounded-nw border transition-[background-color,border-color,box-shadow] duration-150 ease-nw"
        [class]="boxClasses()"
      >
        <input
          type="checkbox"
          class="absolute inset-0 opacity-0"
          [class.cursor-pointer]="!isDisabled() && !readonly()"
          [attr.id]="inputId() || null"
          [attr.name]="name() || null"
          [attr.aria-invalid]="invalid() ? 'true' : null"
          [checked]="checked()"
          [indeterminate]="indeterminate()"
          [disabled]="isDisabled()"
          (change)="toggle()"
          (blur)="onTouched()"
        />
        @if (indeterminate()) {
          <span aria-hidden="true" class="leading-none animate-nw-check">–</span>
        } @else if (checked()) {
          <span aria-hidden="true" class="leading-none animate-nw-check">✓</span>
        }
      </span>
      @if (label()) {
        <span class="text-sm text-surface-900 select-none">{{ label() }}</span>
      }
    </label>
  `,
})
export class NwCheckboxComponent implements ControlValueAccessor {
  readonly checked = model(false);
  readonly label = input('');
  readonly disabled = input(false);
  readonly indeterminate = input(false);
  readonly size = input<NwCheckboxSize>('normal');
  readonly invalid = input(false);
  readonly readonly = input(false);
  readonly inputId = input('');
  readonly name = input('');

  readonly onChangeEvent = output<boolean>();

  private readonly formDisabled = signal(false);
  protected readonly isDisabled = computed(
    () => this.disabled() || this.formDisabled(),
  );

  private onChange: (v: boolean) => void = () => {};
  protected onTouched: () => void = () => {};

  protected readonly boxClasses = computed(() => {
    const on = this.checked() || this.indeterminate();
    const border = this.invalid()
      ? 'border-red-500'
      : on
        ? 'border-nw-600'
        : 'border-surface-300';
    const fill = on ? 'bg-nw-600 text-white' : 'bg-surface-0 text-transparent';
    return `${BOX_SIZE[this.size()]} ${border} ${fill}`;
  });

  protected toggle(): void {
    if (this.isDisabled() || this.readonly()) return;
    const next = !this.checked();
    this.checked.set(next);
    this.onChange(next);
    this.onTouched();
    this.onChangeEvent.emit(next);
  }

  // ControlValueAccessor
  writeValue(value: boolean): void {
    this.checked.set(!!value);
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
