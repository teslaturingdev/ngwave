import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  forwardRef,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

interface DayCell {
  date: Date;
  otherMonth: boolean;
}

function sameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

/**
 * Single-date picker: a text field (read-only — pick from the panel rather
 * than typing a date) that opens a month calendar on click.
 */
@Component({
  selector: 'nw-date-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-block relative',
    '[class.w-full]': 'fluid()',
    '(document:click)': 'onDocumentClick($event)',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NwDatePickerComponent),
      multi: true,
    },
  ],
  template: `
    <div class="relative" [class.w-full]="fluid()">
      <input
        type="text"
        readonly
        class="w-full h-10 px-3 rounded-nw border border-surface-300 bg-surface-0 text-sm text-surface-900 shadow-nw-sm cursor-pointer transition-[border-color,box-shadow] duration-150 ease-nw hover:border-surface-400 focus:outline-none focus:border-nw-500 focus:ring-4 focus:ring-nw-500/15 disabled:opacity-50 disabled:cursor-not-allowed"
        [class.pr-9]="showIcon()"
        [value]="displayValue()"
        [attr.placeholder]="placeholder() || null"
        [disabled]="isDisabled()"
        (click)="toggle()"
        (blur)="onTouched()"
      />
      @if (showIcon()) {
        <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-surface-400">📅</span>
      }
    </div>

    @if (open() || inline()) {
      <div
        class="z-50 w-72 rounded-nw border border-surface-200 bg-surface-0 p-3 shadow-nw-lg"
        [class.absolute]="!inline()"
        [class.mt-1]="!inline()"
      >
        <div class="flex items-center justify-between mb-2">
          <button type="button" class="h-7 w-7 rounded-nw hover:bg-surface-100 text-surface-600" (click)="prevMonth()">‹</button>
          <span class="text-sm font-medium text-surface-900">{{ monthLabel() }}</span>
          <button type="button" class="h-7 w-7 rounded-nw hover:bg-surface-100 text-surface-600" (click)="nextMonth()">›</button>
        </div>

        <div class="grid grid-cols-7 gap-0.5 text-center">
          @for (w of weekdays; track w) {
            <span class="text-xs font-medium text-surface-400 py-1">{{ w }}</span>
          }
          @for (cell of dayCells(); track cell.date.getTime()) {
            <button
              type="button"
              class="h-8 w-8 mx-auto flex items-center justify-center rounded-nw text-sm hover:bg-surface-100 disabled:opacity-30 disabled:cursor-not-allowed"
              [class.text-surface-300]="cell.otherMonth"
              [class.bg-nw-500]="isSelected(cell.date)"
              [class.text-white]="isSelected(cell.date)"
              [disabled]="isOutOfRange(cell.date)"
              (click)="selectDay(cell.date)"
            >
              {{ cell.date.getDate() }}
            </button>
          }
        </div>

        @if (showToday() || showClear()) {
          <div class="mt-2 pt-2 border-t border-surface-100 flex justify-between">
            @if (showToday()) {
              <button type="button" class="text-xs text-nw-600 hover:underline" (click)="selectToday()">Today</button>
            }
            @if (showClear()) {
              <button type="button" class="text-xs text-surface-500 hover:underline" (click)="clear()">Clear</button>
            }
          </div>
        }
      </div>
    }
  `,
})
export class NwDatePickerComponent implements ControlValueAccessor {
  private readonly hostEl = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  readonly value = model<Date | null>(null);
  readonly placeholder = input('');
  readonly dateFormat = input('mm/dd/yy');
  readonly minDate = input<Date | null>(null);
  readonly maxDate = input<Date | null>(null);
  readonly disabled = input(false);
  readonly fluid = input(false);
  readonly showIcon = input(true);
  readonly inline = input(false);
  readonly showToday = input(true);
  readonly showClear = input(false);

  protected readonly weekdays = WEEKDAYS;
  protected readonly open = signal(false);
  protected readonly viewDate = signal(startOfMonth(new Date()));
  private readonly formDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  private onChange: (v: Date | null) => void = () => {};
  protected onTouched: () => void = () => {};

  protected readonly monthLabel = computed(
    () => `${MONTHS[this.viewDate().getMonth()]} ${this.viewDate().getFullYear()}`,
  );

  protected readonly dayCells = computed<DayCell[]>(() => {
    const first = this.viewDate();
    const gridStart = new Date(first.getFullYear(), first.getMonth(), 1 - first.getDay());
    return Array.from({ length: 42 }, (_, i) => {
      const date = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
      return { date, otherMonth: date.getMonth() !== first.getMonth() };
    });
  });

  protected readonly displayValue = computed(() => this.format(this.value()));

  protected isSelected(date: Date): boolean {
    return sameDay(date, this.value());
  }

  protected isOutOfRange(date: Date): boolean {
    const min = this.minDate();
    const max = this.maxDate();
    if (min && date < new Date(min.getFullYear(), min.getMonth(), min.getDate())) return true;
    if (max && date > new Date(max.getFullYear(), max.getMonth(), max.getDate())) return true;
    return false;
  }

  protected toggle(): void {
    if (this.isDisabled()) return;
    if (!this.open()) this.viewDate.set(startOfMonth(this.value() ?? new Date()));
    this.open.set(!this.open());
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (this.open() && !this.hostEl.contains(event.target as Node)) {
      this.open.set(false);
      this.onTouched();
    }
  }

  protected prevMonth(): void {
    const d = this.viewDate();
    this.viewDate.set(new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  protected nextMonth(): void {
    const d = this.viewDate();
    this.viewDate.set(new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  protected selectDay(date: Date): void {
    if (this.isOutOfRange(date)) return;
    this.value.set(date);
    this.onChange(date);
    if (!this.inline()) this.open.set(false);
  }

  protected selectToday(): void {
    this.selectDay(new Date());
  }

  protected clear(): void {
    this.value.set(null);
    this.onChange(null);
  }

  private format(date: Date | null): string {
    if (!date) return '';
    return this.dateFormat()
      .replace('yyyy', String(date.getFullYear()))
      .replace('yy', pad(date.getFullYear() % 100))
      .replace('mm', pad(date.getMonth() + 1))
      .replace('dd', pad(date.getDate()));
  }

  writeValue(v: Date | string | null): void {
    this.value.set(v ? new Date(v) : null);
  }
  registerOnChange(fn: (v: Date | null) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }
}
