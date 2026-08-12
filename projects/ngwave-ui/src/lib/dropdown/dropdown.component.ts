import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  TemplateRef,
  computed,
  contentChild,
  forwardRef,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

export type NwDropdownDisplay = 'comma' | 'chip';

interface NormOption {
  label: string;
  value: unknown;
  disabled: boolean;
  raw: unknown;
}
type DisplayItem =
  | { type: 'group'; label: string }
  | { type: 'option'; option: NormOption };

/** Custom option template: `<ng-template nwDropdownOption let-option>`. */
@Directive({ selector: '[nwDropdownOption]' })
export class NwDropdownOptionDirective {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}
/** Custom selected-value template: `<ng-template nwDropdownSelected let-value>`. */
@Directive({ selector: '[nwDropdownSelected]' })
export class NwDropdownSelectedDirective {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}

@Component({
  selector: 'nw-dropdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  host: {
    class: 'nw-dropdown-host block',
    '(keydown)': 'onKeydown($event)',
    '(document:click)': 'onDocumentClick($event)',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NwDropdownComponent),
      multi: true,
    },
  ],
  template: `
    <div class="relative">
      <button
        type="button"
        [disabled]="isDisabled()"
        (click)="toggle()"
        (blur)="onTouched()"
        [attr.aria-expanded]="open()"
        role="combobox"
        class="w-full min-h-10 px-3 py-1 inline-flex items-center gap-2 rounded-nw border border-surface-300 bg-surface-0 text-left text-sm text-surface-900 shadow-nw-sm transition-[border-color,box-shadow] duration-150 ease-nw hover:border-surface-400 focus-visible:outline-none focus-visible:border-nw-500 focus-visible:ring-4 focus-visible:ring-nw-500/15 disabled:opacity-50 disabled:cursor-not-allowed"
        [class.border-nw-500]="open()"
        [class.ring-4]="open()"
        [class.ring-nw-500/15]="open()"
      >
        <span class="flex-1 min-w-0 flex flex-wrap items-center gap-1">
          @if (!hasValue()) {
            <span class="text-surface-400">{{ placeholder() }}</span>
          } @else if (selectedTemplate(); as tpl) {
            <ng-container
              [ngTemplateOutlet]="tpl.template"
              [ngTemplateOutletContext]="{ $implicit: value() }"
            />
          } @else if (multiple() && display() === 'chip') {
            @for (o of selectedOptions(); track o.value) {
              <span
                class="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-full bg-surface-100 text-xs"
              >
                {{ o.label }}
                <span
                  role="button"
                  aria-label="Remove"
                  (click)="removeChip(o, $event)"
                  class="text-surface-400 hover:text-surface-700"
                  >✕</span
                >
              </span>
            }
          } @else {
            <span class="truncate">{{ displayLabel() }}</span>
          }
        </span>
        @if (clearable() && hasValue() && !isDisabled()) {
          <span
            role="button"
            aria-label="Clear"
            (click)="clear($event)"
            class="text-surface-400 hover:text-surface-700"
            >✕</span
          >
        }
        <svg
          class="h-4 w-4 text-surface-400 shrink-0 transition-transform"
          [class.rotate-180]="open()"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      @if (open()) {
        <div
          class="absolute z-50 mt-1.5 w-full max-h-72 overflow-auto rounded-nw border border-surface-200 bg-surface-0 shadow-nw-lg ring-1 ring-surface-900/5 origin-top animate-nw-slide-down"
        >
          @if (filter()) {
            <div class="p-2 border-b border-surface-200">
              <input
                type="search"
                [value]="filterText()"
                (input)="onFilter($event)"
                (click)="$event.stopPropagation()"
                [placeholder]="filterPlaceholder()"
                class="nw-dd-filter w-full h-8 px-2 rounded-nw border border-surface-300 bg-surface-0 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nw-500"
              />
            </div>
          }
          @if (loading()) {
            <div class="px-3 py-6 flex items-center justify-center">
              <svg
                class="animate-spin h-5 w-5 text-nw-600"
                viewBox="0 0 24 24"
                fill="none"
                aria-label="Loading"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.4 0 0 5.4 0 12h4z"></path>
              </svg>
            </div>
          } @else {
            <ul class="py-1" role="listbox">
              @for (item of displayItems(); track $index) {
                @if (item.type === 'group') {
                  <li class="px-3 py-1 text-xs font-semibold uppercase tracking-wide text-surface-400">
                    {{ item.label }}
                  </li>
                } @else {
                  <li
                    role="option"
                    (click)="select(item.option)"
                    (mouseenter)="highlighted.set(item.option.value)"
                    [attr.aria-selected]="isSelected(item.option)"
                    [class]="optionClass(item.option)"
                  >
                    @if (multiple()) {
                      <input
                        type="checkbox"
                        class="h-4 w-4 accent-nw-600 pointer-events-none"
                        [checked]="isSelected(item.option)"
                      />
                    }
                    @if (optionTemplate(); as tpl) {
                      <ng-container
                        [ngTemplateOutlet]="tpl.template"
                        [ngTemplateOutletContext]="{ $implicit: item.option.raw }"
                      />
                    } @else {
                      <span class="flex-1">{{ item.option.label }}</span>
                    }
                    @if (!multiple() && isSelected(item.option)) {
                      <span class="text-nw-600">✓</span>
                    }
                  </li>
                }
              } @empty {
                <li class="px-3 py-2 text-sm text-surface-400">{{ emptyMessage() }}</li>
              }
            </ul>
          }
        </div>
      }
    </div>
  `,
})
export class NwDropdownComponent implements ControlValueAccessor {
  private readonly doc = inject(DOCUMENT);
  private readonly hostEl = inject<ElementRef<HTMLElement>>(ElementRef)
    .nativeElement;

  readonly options = input<unknown[]>([]);
  readonly optionLabel = input('label');
  readonly optionValue = input('value');
  readonly optionDisabled = input('disabled');
  readonly optionGroupLabel = input('label');
  readonly optionGroupChildren = input('items');
  readonly group = input(false);

  readonly value = model<unknown>(null);
  readonly placeholder = input('Select');
  readonly multiple = input(false);
  readonly filter = input(false);
  readonly disabled = input(false);
  readonly clearable = input(false);
  readonly loading = input(false);
  readonly display = input<NwDropdownDisplay>('comma');
  readonly emptyMessage = input('No results');
  readonly filterPlaceholder = input('Search…');

  protected readonly optionTemplate = contentChild(NwDropdownOptionDirective);
  protected readonly selectedTemplate = contentChild(
    NwDropdownSelectedDirective,
  );

  protected readonly open = signal(false);
  protected readonly filterText = signal('');
  protected readonly highlighted = signal<unknown>(undefined);
  private readonly formDisabled = signal(false);
  private typeBuffer = '';
  private typeTimer: ReturnType<typeof setTimeout> | undefined;

  protected onChange: (v: unknown) => void = () => {};
  protected onTouched: () => void = () => {};

  private readonly flatOptions = computed<NormOption[]>(() => {
    const out: NormOption[] = [];
    for (const raw of this.options()) {
      if (this.group() && this.isObj(raw)) {
        const items =
          (raw as Record<string, unknown>)[this.optionGroupChildren()] ?? [];
        if (Array.isArray(items)) {
          for (const o of items) out.push(this.norm(o));
        }
      } else {
        out.push(this.norm(raw));
      }
    }
    return out;
  });

  protected readonly displayItems = computed<DisplayItem[]>(() => {
    const q = this.filterText().trim().toLowerCase();
    const match = (o: NormOption) => !q || o.label.toLowerCase().includes(q);
    const items: DisplayItem[] = [];
    if (this.group()) {
      for (const raw of this.options()) {
        if (!this.isObj(raw)) continue;
        const g = raw as Record<string, unknown>;
        const children = (g[this.optionGroupChildren()] as unknown[]) ?? [];
        const matched = children.map((c) => this.norm(c)).filter(match);
        if (matched.length) {
          items.push({ type: 'group', label: String(g[this.optionGroupLabel()] ?? '') });
          for (const o of matched) items.push({ type: 'option', option: o });
        }
      }
    } else {
      for (const o of this.flatOptions()) {
        if (match(o)) items.push({ type: 'option', option: o });
      }
    }
    return items;
  });

  private readonly optionItems = computed<NormOption[]>(() =>
    this.displayItems()
      .filter((i): i is { type: 'option'; option: NormOption } => i.type === 'option')
      .map((i) => i.option),
  );

  protected readonly selectedValues = computed<unknown[]>(() => {
    const v = this.value();
    if (this.multiple()) return Array.isArray(v) ? v : [];
    return v == null ? [] : [v];
  });

  protected readonly selectedOptions = computed<NormOption[]>(() =>
    this.flatOptions().filter((o) => this.selectedValues().includes(o.value)),
  );

  protected isDisabled(): boolean {
    return this.disabled() || this.formDisabled();
  }

  // ---- ControlValueAccessor ----
  writeValue(v: unknown): void {
    this.value.set(v);
  }
  registerOnChange(fn: (v: unknown) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
  }

  // ---- Normalisation ----
  private isObj(o: unknown): o is Record<string, unknown> {
    return o !== null && typeof o === 'object';
  }
  private norm(raw: unknown): NormOption {
    if (!this.isObj(raw)) {
      return { label: String(raw), value: raw, disabled: false, raw };
    }
    const o = raw as Record<string, unknown>;
    const label = String(o[this.optionLabel()] ?? '');
    const value =
      this.optionValue() && this.optionValue() in o ? o[this.optionValue()] : raw;
    const disabled = !!o[this.optionDisabled()];
    return { label, value, disabled, raw };
  }

  // ---- Display ----
  protected hasValue(): boolean {
    return this.selectedValues().length > 0;
  }
  protected displayLabel(): string {
    const labels = this.selectedOptions().map((o) => o.label);
    if (labels.length === 0) return this.placeholder();
    return this.multiple()
      ? labels.length <= 2
        ? labels.join(', ')
        : `${labels.length} selected`
      : labels[0];
  }
  protected isSelected(o: NormOption): boolean {
    return this.selectedValues().includes(o.value);
  }
  protected optionClass(o: NormOption): string {
    const base =
      'px-3 py-1.5 text-sm cursor-pointer flex items-center gap-2 nw-dd-option';
    const state = o.disabled
      ? ' opacity-40 pointer-events-none'
      : this.highlighted() === o.value
        ? ' bg-surface-100'
        : '';
    const sel = this.isSelected(o) ? ' bg-nw-50 text-nw-700' : '';
    return base + state + sel;
  }

  // ---- Interaction ----
  protected toggle(): void {
    if (this.isDisabled()) return;
    this.open.update((o) => !o);
    if (this.open()) {
      const first = this.selectedValues()[0] ?? this.optionItems()[0]?.value;
      this.highlighted.set(first);
      this.focusFilter();
    }
  }
  protected close(): void {
    this.open.set(false);
    this.filterText.set('');
  }
  protected onDocumentClick(event: MouseEvent): void {
    if (this.open() && !this.hostEl.contains(event.target as Node)) {
      this.close();
    }
  }
  protected select(o: NormOption): void {
    if (o.disabled) return;
    if (this.multiple()) {
      const cur = this.selectedValues();
      const next = cur.includes(o.value)
        ? cur.filter((v) => v !== o.value)
        : [...cur, o.value];
      this.setValue(next);
    } else {
      this.setValue(o.value);
      this.close();
    }
  }
  protected removeChip(o: NormOption, event: Event): void {
    event.stopPropagation();
    this.setValue(this.selectedValues().filter((v) => v !== o.value));
  }
  protected clear(event: Event): void {
    event.stopPropagation();
    this.setValue(this.multiple() ? [] : null);
  }
  private setValue(v: unknown): void {
    this.value.set(v);
    this.onChange(v);
  }
  protected onFilter(event: Event): void {
    this.filterText.set((event.target as HTMLInputElement).value);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      if (this.open()) this.close();
      return;
    }
    if (!this.open()) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        this.toggle();
      }
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.move(1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.move(-1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      this.highlightAt(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      this.highlightAt(this.optionItems().length - 1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const o = this.optionItems().find((x) => x.value === this.highlighted());
      if (o) this.select(o);
    } else if (event.key.length === 1 && !this.filter()) {
      this.typeAhead(event.key);
    }
  }
  private move(dir: number): void {
    const list = this.optionItems();
    const cur = list.findIndex((o) => o.value === this.highlighted());
    let i = cur;
    for (let step = 0; step < list.length; step++) {
      i = (i + dir + list.length) % list.length;
      if (!list[i].disabled) {
        this.highlighted.set(list[i].value);
        this.scrollHighlight();
        return;
      }
    }
  }
  private highlightAt(i: number): void {
    const o = this.optionItems()[i];
    if (o) {
      this.highlighted.set(o.value);
      this.scrollHighlight();
    }
  }
  private typeAhead(ch: string): void {
    clearTimeout(this.typeTimer);
    this.typeBuffer += ch.toLowerCase();
    this.typeTimer = setTimeout(() => (this.typeBuffer = ''), 500);
    const o = this.optionItems().find((x) =>
      x.label.toLowerCase().startsWith(this.typeBuffer),
    );
    if (o) {
      this.highlighted.set(o.value);
      this.scrollHighlight();
    }
  }
  private scrollHighlight(): void {
    queueMicrotask(() => {
      const el = this.hostEl.querySelector(
        '.nw-dd-option.bg-surface-100',
      ) as HTMLElement | null;
      if (typeof el?.scrollIntoView === 'function') {
        el.scrollIntoView({ block: 'nearest' });
      }
    });
  }
  private focusFilter(): void {
    if (!this.filter()) return;
    queueMicrotask(() => {
      (this.hostEl.querySelector('.nw-dd-filter') as HTMLInputElement)?.focus();
    });
  }
}
