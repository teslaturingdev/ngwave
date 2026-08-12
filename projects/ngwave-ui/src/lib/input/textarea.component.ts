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
  selector: 'nw-textarea',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex flex-col', '[class.w-full]': 'fluid()' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NwTextareaComponent),
      multi: true,
    },
  ],
  template: `
    <textarea
      #ta
      class="w-full rounded-nw border bg-surface-0 text-surface-900 text-sm px-3 py-2 shadow-nw-sm transition-[border-color,box-shadow] duration-150 ease-nw placeholder:text-surface-400 hover:border-surface-400 focus:outline-none focus:border-nw-500 focus:ring-4 focus:ring-nw-500/15 disabled:opacity-50 disabled:cursor-not-allowed"
      [class]="borderClass()"
      [class.resize-none]="autoResize()"
      [attr.id]="inputId() || null"
      [attr.name]="name() || null"
      [attr.placeholder]="placeholder() || null"
      [attr.maxlength]="maxlength() ?? null"
      [attr.aria-invalid]="invalid() ? 'true' : null"
      [rows]="rows()"
      [value]="value()"
      [disabled]="isDisabled()"
      [readOnly]="readonly()"
      (input)="onInput($event, ta)"
      (blur)="onTouched()"
    ></textarea>
    @if (maxlength() != null) {
      <span class="mt-1 self-end text-xs text-surface-400"
        >{{ value().length }} / {{ maxlength() }}</span
      >
    }
  `,
})
export class NwTextareaComponent implements ControlValueAccessor {
  readonly value = model('');
  readonly placeholder = input('');
  readonly rows = input(3);
  readonly disabled = input(false);
  readonly readonly = input(false);
  readonly invalid = input(false);
  readonly autoResize = input(false);
  readonly maxlength = input<number | null>(null);
  readonly fluid = input(false);
  readonly inputId = input('');
  readonly name = input('');

  private readonly formDisabled = signal(false);
  protected readonly isDisabled = computed(
    () => this.disabled() || this.formDisabled(),
  );
  protected readonly borderClass = computed(() =>
    this.invalid() ? 'border-red-500' : 'border-surface-300',
  );

  private onChange: (v: string) => void = () => {};
  protected onTouched: () => void = () => {};

  protected onInput(event: Event, ta: HTMLTextAreaElement): void {
    const v = (event.target as HTMLTextAreaElement).value;
    this.value.set(v);
    this.onChange(v);
    if (this.autoResize()) {
      ta.style.height = 'auto';
      ta.style.height = `${ta.scrollHeight}px`;
    }
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
