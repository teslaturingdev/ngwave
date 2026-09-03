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

@Component({
  selector: 'nw-rating',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex', role: 'radiogroup' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NwRatingComponent),
      multi: true,
    },
  ],
  template: `
    <div class="inline-flex items-center gap-1">
      @for (i of stars(); track i) {
        <button
          type="button"
          [disabled]="isDisabled() || readonly()"
          (click)="select(i)"
          [attr.aria-label]="i + ' star' + (i === 1 ? '' : 's')"
          [attr.aria-pressed]="i <= value()"
          class="text-xl leading-none disabled:cursor-not-allowed transition-colors"
          [class]="i <= value() ? 'text-amber-400 ' + onIcon() : 'text-surface-300 ' + offIcon()"
        >
          @if (!onIcon() && !offIcon()) {
            {{ i <= value() ? '★' : '☆' }}
          }
        </button>
      }
    </div>
  `,
})
export class NwRatingComponent implements ControlValueAccessor {
  readonly value = model(0);
  readonly count = input(5);
  readonly disabled = input(false);
  readonly readonly = input(false);
  readonly cancel = input(true);
  /** Icon class for a filled star, e.g. "pi pi-star-fill". Falls back to a text glyph when unset. */
  readonly onIcon = input('');
  /** Icon class for an empty star. Falls back to a text glyph when unset. */
  readonly offIcon = input('');

  private readonly formDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  private onChange: (v: number) => void = () => {};

  protected readonly stars = computed(() => Array.from({ length: this.count() }, (_, i) => i + 1));

  protected select(i: number): void {
    if (this.isDisabled() || this.readonly()) return;
    const next = this.cancel() && this.value() === i ? 0 : i;
    this.value.set(next);
    this.onChange(next);
  }

  writeValue(value: number): void {
    this.value.set(value ?? 0);
  }
  registerOnChange(fn: (v: number) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(): void {}
  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }
}
