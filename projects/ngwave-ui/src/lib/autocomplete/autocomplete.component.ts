import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  TemplateRef,
  booleanAttribute,
  computed,
  contentChild,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/** Custom suggestion item: `<ng-template nwAutocompleteItem let-item>…</ng-template>`. */
@Directive({ selector: '[nwAutocompleteItem]' })
export class NwAutocompleteItemDirective {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}

@Component({
  selector: 'nw-autocomplete',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-block relative',
    '[class.w-full]': 'fluid()',
    '(document:click)': 'onDocumentClick($event)',
  },
  imports: [NgTemplateOutlet],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NwAutocompleteComponent),
      multi: true,
    },
  ],
  template: `
    <div
      #box
      class="flex flex-wrap items-center gap-1 rounded-nw border bg-surface-0 px-2 min-h-10 shadow-nw-sm transition-[border-color,box-shadow] duration-150 ease-nw hover:border-surface-400 focus-within:border-nw-500 focus-within:ring-4 focus-within:ring-nw-500/15"
      [class]="borderClass()"
      [class.opacity-50]="isDisabled()"
      [class.cursor-not-allowed]="isDisabled()"
    >
      @if (multiple()) {
        @for (chip of chips(); track $index) {
          <span
            class="inline-flex items-center gap-1 rounded-nw bg-nw-100 text-nw-800 text-sm px-2 py-0.5"
          >
            {{ chip.label }}
            @if (!isDisabled() && !readonly()) {
              <button
                type="button"
                (click)="removeAt(chip.index)"
                aria-label="Remove"
                class="text-nw-500 hover:text-nw-700"
              >
                ✕
              </button>
            }
          </span>
        }
      }
      <input
        #field
        class="flex-1 min-w-24 bg-transparent py-2 text-sm text-surface-900 placeholder:text-surface-400 focus:outline-none"
        [attr.id]="inputId() || null"
        [attr.name]="name() || null"
        [attr.placeholder]="placeholderText()"
        [attr.aria-invalid]="invalid() ? 'true' : null"
        role="combobox"
        [attr.aria-expanded]="open()"
        autocomplete="off"
        [value]="query()"
        [disabled]="isDisabled()"
        [readOnly]="readonly()"
        (input)="onInput($event)"
        (focus)="onFocus()"
        (keydown)="onKeydown($event)"
        (blur)="onBlur()"
      />
      @if (loading()) {
        <span class="text-surface-400 text-sm" aria-hidden="true">⏳</span>
      } @else if (clearable() && hasValue() && !isDisabled() && !readonly()) {
        <button
          type="button"
          (click)="clear()"
          aria-label="Clear"
          class="text-surface-400 hover:text-surface-600"
        >
          ✕
        </button>
      }
      @if (dropdown()) {
        <button
          type="button"
          (click)="toggleDropdown()"
          [disabled]="isDisabled() || readonly()"
          aria-label="Show suggestions"
          class="text-surface-500 hover:text-surface-700 px-1"
        >
          ▾
        </button>
      }
    </div>

    @if (open()) {
      <div
        class="absolute z-50 mt-1.5 w-full min-w-full rounded-nw border border-surface-200 bg-surface-0 shadow-nw-lg ring-1 ring-surface-900/5 max-h-64 overflow-auto py-1 origin-top animate-nw-slide-down"
        role="listbox"
      >
        @if (loading()) {
          <div class="px-3 py-2 text-sm text-surface-500">Loading…</div>
        } @else if (suggestions().length === 0) {
          <div class="px-3 py-2 text-sm text-surface-500">
            {{ emptyMessage() }}
          </div>
        } @else {
          @for (s of suggestions(); track $index; let i = $index) {
            <div
              role="option"
              [attr.aria-selected]="i === highlighted()"
              (mousedown)="selectItem(s, $event)"
              (mouseenter)="highlighted.set(i)"
              class="px-3 py-2 text-sm cursor-pointer flex items-center gap-2"
              [class.bg-nw-50]="i === highlighted()"
              [class.text-nw-800]="i === highlighted()"
              [class.text-surface-700]="i !== highlighted()"
            >
              @if (itemTemplate(); as tpl) {
                <ng-container
                  [ngTemplateOutlet]="tpl.template"
                  [ngTemplateOutletContext]="{ $implicit: s }"
                />
              } @else {
                {{ labelOf(s) }}
              }
            </div>
          }
        }
      </div>
    }
  `,
})
export class NwAutocompleteComponent implements ControlValueAccessor {
  /** Selected value: the item (or string) in single mode, an array in multiple mode. */
  readonly value = model<unknown>(null);
  /** Current suggestion list — update this in response to (complete). */
  readonly suggestions = input<unknown[]>([]);
  readonly optionLabel = input('');
  readonly multiple = input(false, { transform: booleanAttribute });
  readonly dropdown = input(false, { transform: booleanAttribute });
  readonly minLength = input(1);
  readonly delay = input(300);
  readonly forceSelection = input(false, { transform: booleanAttribute });
  readonly clearable = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly placeholder = input('');
  readonly emptyMessage = input('No results found');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly fluid = input(false, { transform: booleanAttribute });
  readonly inputId = input('');
  readonly name = input('');

  /** Emitted (debounced) with the typed query so the parent can filter/fetch. */
  readonly complete = output<string>();

  protected readonly itemTemplate = contentChild(NwAutocompleteItemDirective);

  protected readonly query = signal('');
  protected readonly open = signal(false);
  protected readonly highlighted = signal(0);

  private readonly hostEl = inject<ElementRef<HTMLElement>>(ElementRef)
    .nativeElement;
  private readonly formDisabled = signal(false);
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  protected readonly isDisabled = computed(
    () => this.disabled() || this.formDisabled(),
  );
  protected readonly borderClass = computed(() =>
    this.invalid() ? 'border-red-500' : 'border-surface-300',
  );

  private onChange: (v: unknown) => void = () => {};
  protected onTouched: () => void = () => {};

  protected labelOf(item: unknown): string {
    const key = this.optionLabel();
    if (key && item && typeof item === 'object') {
      return String((item as Record<string, unknown>)[key] ?? '');
    }
    return item == null ? '' : String(item);
  }

  protected readonly chips = computed(() => {
    const v = this.value();
    if (!this.multiple() || !Array.isArray(v)) return [];
    return v.map((item, index) => ({ label: this.labelOf(item), index }));
  });

  protected readonly hasValue = computed(() => {
    const v = this.value();
    if (this.multiple()) return Array.isArray(v) && v.length > 0;
    return v != null && v !== '';
  });

  protected placeholderText(): string {
    if (this.multiple() && this.hasValue()) return '';
    return this.placeholder();
  }

  protected onInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    this.query.set(raw);
    if (!this.multiple()) {
      // Single mode reflects the typed text as the model until a pick is made.
      this.value.set(raw);
      this.onChange(raw);
    }
    this.scheduleComplete(raw);
  }

  private scheduleComplete(q: string): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    if (q.length < this.minLength()) {
      this.open.set(false);
      return;
    }
    this.debounceTimer = setTimeout(() => {
      this.highlighted.set(0);
      this.open.set(true);
      this.complete.emit(q);
    }, this.delay());
  }

  protected onFocus(): void {
    if (this.dropdown() && this.suggestions().length) this.open.set(true);
  }

  protected toggleDropdown(): void {
    if (this.isDisabled() || this.readonly()) return;
    if (this.open()) {
      this.open.set(false);
    } else {
      this.highlighted.set(0);
      this.open.set(true);
      this.complete.emit(this.query());
    }
  }

  protected onKeydown(event: KeyboardEvent): void {
    const items = this.suggestions();
    switch (event.key) {
      case 'ArrowDown':
        if (!this.open() && items.length) this.open.set(true);
        this.highlighted.update((h) => Math.min(h + 1, items.length - 1));
        event.preventDefault();
        break;
      case 'ArrowUp':
        this.highlighted.update((h) => Math.max(h - 1, 0));
        event.preventDefault();
        break;
      case 'Enter':
        if (this.open() && items[this.highlighted()] !== undefined) {
          this.selectItem(items[this.highlighted()], event);
        }
        break;
      case 'Escape':
        this.open.set(false);
        break;
      case 'Backspace':
        if (this.multiple() && this.query() === '') this.removeLast();
        break;
    }
  }

  protected selectItem(item: unknown, event: Event): void {
    event.preventDefault();
    if (this.multiple()) {
      const current = Array.isArray(this.value()) ? [...(this.value() as unknown[])] : [];
      current.push(item);
      this.value.set(current);
      this.onChange(current);
      this.query.set('');
    } else {
      this.value.set(item);
      this.onChange(item);
      this.query.set(this.labelOf(item));
    }
    this.open.set(false);
    this.onTouched();
  }

  protected removeAt(index: number): void {
    if (!Array.isArray(this.value())) return;
    const next = (this.value() as unknown[]).filter((_, i) => i !== index);
    this.value.set(next);
    this.onChange(next);
  }

  private removeLast(): void {
    if (!Array.isArray(this.value()) || (this.value() as unknown[]).length === 0)
      return;
    const next = (this.value() as unknown[]).slice(0, -1);
    this.value.set(next);
    this.onChange(next);
  }

  protected clear(): void {
    this.query.set('');
    this.value.set(this.multiple() ? [] : null);
    this.onChange(this.value());
    this.open.set(false);
    this.onTouched();
  }

  protected onBlur(): void {
    this.onTouched();
    if (this.forceSelection() && !this.multiple()) {
      const match = this.suggestions().some(
        (s) => this.labelOf(s) === this.query(),
      );
      if (!match) {
        this.query.set('');
        this.value.set(null);
        this.onChange(null);
      }
    }
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (!this.hostEl.contains(event.target as Node)) {
      this.open.set(false);
    }
  }

  writeValue(value: unknown): void {
    this.value.set(value ?? (this.multiple() ? [] : null));
    if (!this.multiple()) {
      this.query.set(value == null ? '' : this.labelOf(value));
    }
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
