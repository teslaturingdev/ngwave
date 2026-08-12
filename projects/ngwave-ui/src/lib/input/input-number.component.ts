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
import { INPUT_SIZES, NwInputSize } from './input-text.component';

export type NwInputNumberMode = 'decimal' | 'currency';
export type NwButtonLayout = 'stacked' | 'horizontal';

@Component({
  selector: 'nw-input-number',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex', '[class.w-full]': 'fluid()' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NwInputNumberComponent),
      multi: true,
    },
  ],
  template: `
    <div class="inline-flex items-stretch" [class.w-full]="fluid()">
      @if (showButtons() && buttonLayout() === 'horizontal') {
        <button
          type="button"
          (click)="spin(-1)"
          [disabled]="isDisabled() || readonly()"
          aria-label="Decrement"
          [class]="hBtn() + ' rounded-l-nw border-r-0'"
        >
          −
        </button>
      }

      <div class="relative flex-1">
        <input
          inputmode="decimal"
          class="w-full border bg-surface-0 text-surface-900 shadow-nw-sm transition-[border-color,box-shadow] duration-150 ease-nw placeholder:text-surface-400 hover:border-surface-400 focus:outline-none focus:border-nw-500 focus:ring-4 focus:ring-nw-500/15 disabled:opacity-50 disabled:cursor-not-allowed"
          [class]="fieldClasses()"
          [attr.id]="inputId() || null"
          [attr.name]="name() || null"
          [attr.placeholder]="placeholder() || null"
          [attr.aria-invalid]="invalid() ? 'true' : null"
          [value]="display()"
          [disabled]="isDisabled()"
          [readOnly]="readonly()"
          (focus)="onFocus()"
          (input)="onInput($event)"
          (blur)="onBlur()"
          (keydown.arrowup)="spin(1); $event.preventDefault()"
          (keydown.arrowdown)="spin(-1); $event.preventDefault()"
        />
      </div>

      @if (showButtons() && buttonLayout() === 'horizontal') {
        <button
          type="button"
          (click)="spin(1)"
          [disabled]="isDisabled() || readonly()"
          aria-label="Increment"
          [class]="hBtn() + ' rounded-r-nw border-l-0'"
        >
          +
        </button>
      } @else if (showButtons()) {
        <div class="flex flex-col">
          <button
            type="button"
            (click)="spin(1)"
            [disabled]="isDisabled() || readonly()"
            aria-label="Increment"
            class="flex-1 px-2 border border-l-0 border-surface-300 rounded-tr-nw text-surface-600 hover:bg-surface-100 disabled:opacity-50"
          >
            ▲
          </button>
          <button
            type="button"
            (click)="spin(-1)"
            [disabled]="isDisabled() || readonly()"
            aria-label="Decrement"
            class="flex-1 px-2 border border-l-0 border-t-0 border-surface-300 rounded-br-nw text-surface-600 hover:bg-surface-100 disabled:opacity-50"
          >
            ▼
          </button>
        </div>
      }
    </div>
  `,
})
export class NwInputNumberComponent implements ControlValueAccessor {
  readonly value = model<number | null>(null);
  readonly min = input<number | null>(null);
  readonly max = input<number | null>(null);
  readonly step = input(1);
  readonly showButtons = input(false);
  readonly buttonLayout = input<NwButtonLayout>('stacked');
  readonly mode = input<NwInputNumberMode>('decimal');
  readonly currency = input('USD');
  readonly locale = input<string | undefined>(undefined);
  readonly minFractionDigits = input<number | null>(null);
  readonly maxFractionDigits = input<number | null>(null);
  readonly useGrouping = input(true);
  readonly prefix = input('');
  readonly suffix = input('');
  readonly placeholder = input('');
  readonly disabled = input(false);
  readonly readonly = input(false);
  readonly invalid = input(false);
  readonly size = input<NwInputSize>('normal');
  readonly fluid = input(false);
  readonly inputId = input('');
  readonly name = input('');

  private readonly focused = signal(false);
  private readonly editText = signal('');
  private readonly formDisabled = signal(false);
  protected readonly isDisabled = computed(
    () => this.disabled() || this.formDisabled(),
  );

  private onChange: (v: number | null) => void = () => {};
  protected onTouched: () => void = () => {};

  protected readonly fieldClasses = computed(() => {
    const border = this.invalid() ? 'border-red-500' : 'border-surface-300';
    const rounded =
      this.showButtons() && this.buttonLayout() === 'stacked'
        ? 'rounded-l-nw'
        : this.showButtons()
          ? 'rounded-none'
          : 'rounded-nw';
    return `${INPUT_SIZES[this.size()]} ${border} ${rounded} px-3 text-right`;
  });

  protected hBtn(): string {
    return 'px-3 border border-surface-300 text-surface-600 hover:bg-surface-100 disabled:opacity-50';
  }

  protected readonly display = computed(() => {
    if (this.focused()) return this.editText();
    return this.format(this.value());
  });

  private format(v: number | null): string {
    if (v == null || Number.isNaN(v)) return '';
    const opts: Intl.NumberFormatOptions = { useGrouping: this.useGrouping() };
    if (this.mode() === 'currency') {
      opts.style = 'currency';
      opts.currency = this.currency();
    }
    if (this.minFractionDigits() != null)
      opts.minimumFractionDigits = this.minFractionDigits()!;
    if (this.maxFractionDigits() != null)
      opts.maximumFractionDigits = this.maxFractionDigits()!;
    const body = new Intl.NumberFormat(this.locale(), opts).format(v);
    return `${this.prefix()}${body}${this.suffix()}`;
  }

  private parse(raw: string): number | null {
    const cleaned = raw.replace(/[^0-9.\-]/g, '');
    if (cleaned === '' || cleaned === '-' || cleaned === '.') return null;
    const n = Number(cleaned);
    return Number.isNaN(n) ? null : n;
  }

  private clamp(v: number): number {
    const lo = this.min();
    const hi = this.max();
    if (lo != null && v < lo) return lo;
    if (hi != null && v > hi) return hi;
    return v;
  }

  protected onFocus(): void {
    this.focused.set(true);
    const v = this.value();
    this.editText.set(v == null ? '' : String(v));
  }

  protected onInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    this.editText.set(raw);
    const parsed = this.parse(raw);
    this.value.set(parsed);
    this.onChange(parsed);
  }

  protected onBlur(): void {
    this.focused.set(false);
    const v = this.value();
    if (v != null) {
      const clamped = this.clamp(v);
      if (clamped !== v) {
        this.value.set(clamped);
        this.onChange(clamped);
      }
    }
    this.onTouched();
  }

  protected spin(dir: number): void {
    if (this.isDisabled() || this.readonly()) return;
    const base = this.value() ?? 0;
    const next = this.clamp(base + dir * this.step());
    this.value.set(next);
    this.onChange(next);
    if (this.focused()) this.editText.set(String(next));
  }

  writeValue(value: number | null): void {
    this.value.set(value ?? null);
  }
  registerOnChange(fn: (v: number | null) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }
}
