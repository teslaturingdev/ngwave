import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  forwardRef,
  input,
  model,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type NwInputSize = 'small' | 'normal' | 'large';
export type NwInputTextType =
  | 'text'
  | 'email'
  | 'password'
  | 'search'
  | 'tel'
  | 'url';

export const INPUT_SIZES: Record<NwInputSize, string> = {
  small: 'h-8 text-sm',
  normal: 'h-10 text-sm',
  large: 'h-12 text-base',
};

@Component({
  selector: 'nw-input-text',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex', '[class.w-full]': 'fluid()' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NwInputTextComponent),
      multi: true,
    },
  ],
  template: `
    <div class="relative inline-flex items-center" [class.w-full]="fluid()">
      @if (iconLeft()) {
        <span
          class="absolute left-3 text-surface-400 pointer-events-none"
          [class]="iconLeft()"
          aria-hidden="true"
        ></span>
      }
      <input
        [type]="type()"
        class="w-full rounded-nw border bg-surface-0 text-surface-900 shadow-nw-sm transition-[border-color,box-shadow] duration-150 ease-nw placeholder:text-surface-400 hover:border-surface-400 focus:outline-none focus:border-nw-500 focus:ring-4 focus:ring-nw-500/15 disabled:opacity-50 disabled:cursor-not-allowed"
        [class]="fieldClasses()"
        [attr.id]="inputId() || null"
        [attr.name]="name() || null"
        [attr.placeholder]="placeholder() || null"
        [attr.autocomplete]="autocomplete() || null"
        [attr.maxlength]="maxlength() ?? null"
        [attr.aria-invalid]="invalid() ? 'true' : null"
        [value]="value()"
        [disabled]="isDisabled()"
        [readOnly]="readonly()"
        (input)="onInput($event)"
        (blur)="onTouched()"
      />
      @if (clearable() && value() && !isDisabled() && !readonly()) {
        <button
          type="button"
          (click)="clear()"
          aria-label="Clear"
          class="absolute right-2 h-6 w-6 rounded-nw text-surface-400 hover:bg-surface-100"
        >
          ✕
        </button>
      } @else if (iconRight()) {
        <span
          class="absolute right-3 text-surface-400 pointer-events-none"
          [class]="iconRight()"
          aria-hidden="true"
        ></span>
      }
    </div>
  `,
})
export class NwInputTextComponent implements ControlValueAccessor {
  readonly value = model('');
  readonly type = input<NwInputTextType>('text');
  readonly placeholder = input('');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly size = input<NwInputSize>('normal');
  readonly clearable = input(false, { transform: booleanAttribute });
  readonly fluid = input(false, { transform: booleanAttribute });
  readonly iconLeft = input('');
  readonly iconRight = input('');
  readonly inputId = input('');
  readonly name = input('');
  readonly autocomplete = input('');
  readonly maxlength = input<number | null>(null);

  private readonly formDisabled = signal(false);
  protected readonly isDisabled = computed(
    () => this.disabled() || this.formDisabled(),
  );

  private onChange: (v: string) => void = () => {};
  protected onTouched: () => void = () => {};

  protected readonly fieldClasses = computed(() => {
    const border = this.invalid() ? 'border-red-500' : 'border-surface-300';
    const padL = this.iconLeft() ? 'pl-9' : 'pl-3';
    const padR = this.iconRight() || this.clearable() ? 'pr-9' : 'pr-3';
    return `${INPUT_SIZES[this.size()]} ${border} ${padL} ${padR}`;
  });

  protected onInput(event: Event): void {
    const v = (event.target as HTMLInputElement).value;
    this.value.set(v);
    this.onChange(v);
  }

  protected clear(): void {
    this.value.set('');
    this.onChange('');
    this.onTouched();
  }

  writeValue(value: string): void {
    this.value.set(value ?? '');
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
