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
import { INPUT_SIZES, NwInputSize } from '../input';

type Strength = 'empty' | 'weak' | 'fair' | 'strong';

const STRENGTH_PERCENT: Record<Strength, number> = { empty: 0, weak: 33, fair: 66, strong: 100 };
const STRENGTH_LABEL: Record<Strength, string> = { empty: '', weak: 'Weak', fair: 'Fair', strong: 'Strong' };
const STRENGTH_BAR: Record<Strength, string> = {
  empty: 'bg-surface-200',
  weak: 'bg-red-500',
  fair: 'bg-amber-500',
  strong: 'bg-green-500',
};

/** Password input with a show/hide toggle and an optional strength meter. */
@Component({
  selector: 'nw-password',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex', '[class.w-full]': 'fluid()' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NwPasswordComponent),
      multi: true,
    },
  ],
  template: `
    <div class="w-full" [class.w-full]="fluid()">
      <div class="relative">
        <input
          [type]="visible() ? 'text' : 'password'"
          class="w-full rounded-nw border bg-surface-0 pr-9 text-surface-900 shadow-nw-sm transition-[border-color,box-shadow] duration-150 ease-nw placeholder:text-surface-400 hover:border-surface-400 focus:outline-none focus:border-nw-500 focus:ring-4 focus:ring-nw-500/15 disabled:opacity-50 disabled:cursor-not-allowed"
          [class]="fieldClasses()"
          [attr.placeholder]="placeholder() || null"
          [value]="value()"
          [disabled]="isDisabled()"
          (input)="onInput($event)"
          (blur)="onTouched()"
        />
        <button
          type="button"
          (click)="visible.set(!visible())"
          class="absolute right-2 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
          [attr.aria-label]="visible() ? 'Hide password' : 'Show password'"
        >
          {{ visible() ? '🙈' : '👁' }}
        </button>
      </div>

      @if (feedback()) {
        <div class="mt-2 flex items-center gap-2">
          <div class="flex-1 h-1.5 rounded-full bg-surface-100 overflow-hidden">
            <div
              class="h-full rounded-full transition-all"
              [class]="strengthBarClass()"
              [style.width.%]="strengthPercent()"
            ></div>
          </div>
          <span class="text-xs shrink-0 text-surface-500">{{ strengthLabel() }}</span>
        </div>
      }
    </div>
  `,
})
export class NwPasswordComponent implements ControlValueAccessor {
  readonly value = model('');
  readonly placeholder = input('');
  readonly disabled = input(false);
  readonly size = input<NwInputSize>('normal');
  readonly fluid = input(false);
  /** Shows the strength meter below the field. */
  readonly feedback = input(false);

  protected readonly visible = signal(false);
  private readonly formDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  protected readonly fieldClasses = computed(() => `${INPUT_SIZES[this.size()]} px-3`);

  protected readonly strength = computed<Strength>(() => {
    const len = this.value().length;
    if (len === 0) return 'empty';
    if (len < 6) return 'weak';
    if (len < 10) return 'fair';
    return 'strong';
  });
  protected readonly strengthPercent = computed(() => STRENGTH_PERCENT[this.strength()]);
  protected readonly strengthLabel = computed(() => STRENGTH_LABEL[this.strength()]);
  protected readonly strengthBarClass = computed(() => STRENGTH_BAR[this.strength()]);

  private onChange: (v: string) => void = () => {};
  protected onTouched: () => void = () => {};

  protected onInput(event: Event): void {
    const next = (event.target as HTMLInputElement).value;
    this.value.set(next);
    this.onChange(next);
  }

  writeValue(v: string): void {
    this.value.set(v ?? '');
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
