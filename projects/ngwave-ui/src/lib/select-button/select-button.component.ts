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

interface NormOption {
  label: string;
  value: unknown;
  disabled: boolean;
}

/** Single- or multi-select segmented button group. */
@Component({
  selector: 'nw-select-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NwSelectButtonComponent),
      multi: true,
    },
  ],
  template: `
    <div
      role="group"
      class="inline-flex rounded-nw border border-surface-200 overflow-hidden"
      [class.opacity-50]="isDisabled()"
    >
      @for (o of normOptions(); track $index; let first = $first) {
        <button
          type="button"
          [disabled]="isDisabled() || o.disabled"
          (click)="select(o)"
          class="px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed"
          [class]="btnClass(o, first)"
        >
          {{ o.label }}
        </button>
      }
    </div>
  `,
})
export class NwSelectButtonComponent implements ControlValueAccessor {
  readonly options = input<unknown[]>([]);
  readonly optionLabel = input('label');
  readonly optionValue = input('value');
  readonly multiple = input(false);
  readonly disabled = input(false);
  readonly value = model<unknown>(null);

  private readonly formDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  protected readonly normOptions = computed<NormOption[]>(() =>
    this.options().map((raw) => this.norm(raw)),
  );

  private onChange: (v: unknown) => void = () => {};
  private onTouched: () => void = () => {};

  private norm(raw: unknown): NormOption {
    if (raw !== null && typeof raw === 'object') {
      const o = raw as Record<string, unknown>;
      return {
        label: String(o[this.optionLabel()] ?? ''),
        value: this.optionValue() && this.optionValue() in o ? o[this.optionValue()] : raw,
        disabled: !!o['disabled'],
      };
    }
    return { label: String(raw), value: raw, disabled: false };
  }

  protected isSelected(o: NormOption): boolean {
    const v = this.value();
    return this.multiple() && Array.isArray(v) ? v.includes(o.value) : v === o.value;
  }

  protected btnClass(o: NormOption, first: boolean): string {
    const border = first ? '' : 'border-l border-surface-200';
    return this.isSelected(o)
      ? `${border} bg-nw-600 text-white`
      : `${border} bg-surface-0 text-surface-700 hover:bg-surface-50`;
  }

  protected select(o: NormOption): void {
    if (this.isDisabled() || o.disabled) return;
    let next: unknown;
    if (this.multiple()) {
      const current = Array.isArray(this.value()) ? [...(this.value() as unknown[])] : [];
      const idx = current.indexOf(o.value);
      if (idx >= 0) current.splice(idx, 1);
      else current.push(o.value);
      next = current;
    } else {
      next = this.value() === o.value ? null : o.value;
    }
    this.value.set(next);
    this.onChange(next);
    this.onTouched();
  }

  writeValue(v: unknown): void {
    this.value.set(v);
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
