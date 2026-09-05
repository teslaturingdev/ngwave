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

export type NwToggleSize = 'small' | 'normal' | 'large';

const TRACK_SIZE: Record<NwToggleSize, string> = {
  small: 'h-4 w-7',
  normal: 'h-5 w-9',
  large: 'h-6 w-11',
};

const THUMB_SIZE: Record<NwToggleSize, string> = {
  small: 'h-3 w-3',
  normal: 'h-4 w-4',
  large: 'h-5 w-5',
};

const THUMB_TRAVEL: Record<NwToggleSize, string> = {
  small: 'translate-x-3',
  normal: 'translate-x-4',
  large: 'translate-x-5',
};

@Component({
  selector: 'nw-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NwToggleComponent),
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
        role="switch"
        [attr.aria-checked]="checked()"
        class="relative inline-flex shrink-0 items-center rounded-full transition-colors duration-150 ease-nw"
        [class]="trackClasses()"
      >
        <input
          type="checkbox"
          class="absolute inset-0 opacity-0"
          [class.cursor-pointer]="!isDisabled()"
          [checked]="checked()"
          [disabled]="isDisabled()"
          (change)="toggle()"
          (blur)="onTouched()"
        />
        <span
          class="inline-block transform rounded-full bg-surface-0 shadow-nw-sm transition-transform duration-150 ease-nw"
          [class]="thumbClasses()"
        ></span>
      </span>
      @if (label()) {
        <span class="text-sm text-surface-900 select-none">{{ label() }}</span>
      }
    </label>
  `,
})
export class NwToggleComponent implements ControlValueAccessor {
  readonly checked = model(false);
  readonly label = input('');
  readonly disabled = input(false);
  readonly size = input<NwToggleSize>('normal');

  private readonly formDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  private onChange: (v: boolean) => void = () => {};
  protected onTouched: () => void = () => {};

  protected readonly trackClasses = computed(
    () => `${TRACK_SIZE[this.size()]} ${this.checked() ? 'bg-nw-600' : 'bg-surface-300'}`,
  );

  protected readonly thumbClasses = computed(() => {
    const travel = this.checked() ? THUMB_TRAVEL[this.size()] : 'translate-x-0.5';
    return `${THUMB_SIZE[this.size()]} ${travel}`;
  });

  protected toggle(): void {
    if (this.isDisabled()) return;
    const next = !this.checked();
    this.checked.set(next);
    this.onChange(next);
    this.onTouched();
  }

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
