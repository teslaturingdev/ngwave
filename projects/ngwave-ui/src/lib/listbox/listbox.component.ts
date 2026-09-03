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

export interface NwListboxOption<T = unknown> {
  label: string;
  value: T;
  disabled?: boolean;
}

export interface NwListboxOptionGroup<T = unknown> {
  label: string;
  items: NwListboxOption<T>[];
}

export type NwListboxEntry<T = unknown> = NwListboxOption<T> | NwListboxOptionGroup<T>;

function isGroup<T>(entry: NwListboxEntry<T>): entry is NwListboxOptionGroup<T> {
  return (entry as NwListboxOptionGroup<T>).items !== undefined;
}

@Component({
  selector: 'nw-listbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NwListboxComponent),
      multi: true,
    },
  ],
  template: `
    @if (filterProp()) {
      <input
        type="text"
        [value]="filterText()"
        (input)="filterText.set($any($event.target).value)"
        [placeholder]="filterPlaceholder()"
        class="w-full h-9 px-3 mb-2 rounded-nw border border-surface-300 bg-surface-0 text-sm focus:outline-none focus:ring-2 focus:ring-nw-500"
      />
    }
    <div
      class="rounded-nw border border-surface-200 bg-surface-0 max-h-64 overflow-auto"
      [class.opacity-50]="isDisabled()"
      [class.pointer-events-none]="isDisabled()"
      role="listbox"
      [attr.aria-multiselectable]="multiple()"
    >
      @if (multiple() && checkbox() && showToggleAll() && flatVisible().length) {
        <button
          type="button"
          (click)="toggleAll()"
          class="flex w-full items-center gap-2 px-3 py-2 text-sm text-left border-b border-surface-100 hover:bg-surface-50 font-medium"
        >
          <span
            class="h-4 w-4 rounded-nw border flex items-center justify-center text-[10px] shrink-0"
            [class]="allSelectedClass()"
          >
            @if (allSelected()) {
              ✓
            } @else if (someSelected()) {
              −
            }
          </span>
          Select all
        </button>
      }

      @if (flatVisible().length === 0) {
        <p class="px-3 py-4 text-sm text-surface-500">
          {{ filterText().trim() ? emptyFilterMessage() : emptyMessage() }}
        </p>
      }

      @for (entry of visibleEntries(); track $index) {
        @if (isGroupEntry(entry)) {
          <div class="px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-wide text-surface-400">
            {{ entry.label }}
          </div>
          @for (opt of groupItems(entry); track $index) {
            <button
              type="button"
              role="option"
              [attr.aria-selected]="isSelected(opt.value)"
              [disabled]="isDisabled() || (opt.disabled ?? false)"
              (click)="select(opt.value, $event)"
              class="flex w-full items-center gap-2 px-3 py-2 text-sm text-left disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-50"
              [class]="rowClass(opt.value)"
            >
              @if (multiple() && checkbox()) {
                <span
                  class="h-4 w-4 rounded-nw border flex items-center justify-center text-[10px] shrink-0"
                  [class]="isSelected(opt.value) ? 'bg-nw-600 border-nw-600 text-white' : 'border-surface-300'"
                >
                  @if (isSelected(opt.value)) {
                    ✓
                  }
                </span>
              }
              <span class="truncate">{{ opt.label }}</span>
            </button>
          }
        } @else {
          <button
            type="button"
            role="option"
            [attr.aria-selected]="isSelected(entry.value)"
            [disabled]="isDisabled() || (entry.disabled ?? false)"
            (click)="select(entry.value, $event)"
            class="flex w-full items-center gap-2 px-3 py-2 text-sm text-left disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-50"
            [class]="rowClass(entry.value)"
          >
            @if (multiple() && checkbox()) {
              <span
                class="h-4 w-4 rounded-nw border flex items-center justify-center text-[10px] shrink-0"
                [class]="isSelected(entry.value) ? 'bg-nw-600 border-nw-600 text-white' : 'border-surface-300'"
              >
                @if (isSelected(entry.value)) {
                  ✓
                }
              </span>
            }
            <span class="truncate">{{ entry.label }}</span>
          </button>
        }
      }
    </div>
  `,
})
export class NwListboxComponent<T = unknown> implements ControlValueAccessor {
  readonly options = input<NwListboxEntry<T>[]>([]);
  readonly multiple = input(false);
  readonly checkbox = input(false);
  readonly showToggleAll = input(true);
  readonly metaKeySelection = input(true);
  readonly disabled = input(false);
  readonly filterProp = input(false, { alias: 'filter' });
  readonly filterPlaceholder = input('Search');
  readonly emptyMessage = input('No options');
  readonly emptyFilterMessage = input('No results found');
  readonly selection = model<T | T[] | null>(null);

  protected readonly filterText = signal('');
  private readonly formDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  private onChange: (v: T | T[] | null) => void = () => {};

  protected readonly visibleEntries = computed(() => {
    const text = this.filterText().trim().toLowerCase();
    if (!text) return this.options();
    return this.options()
      .map((entry) => {
        if (isGroup(entry)) {
          const items = entry.items.filter((o) => o.label.toLowerCase().includes(text));
          return items.length ? { ...entry, items } : null;
        }
        return entry.label.toLowerCase().includes(text) ? entry : null;
      })
      .filter((e): e is NwListboxEntry<T> => e !== null);
  });

  protected readonly flatVisible = computed(() =>
    this.visibleEntries().flatMap((e) => (isGroup(e) ? e.items : [e])),
  );

  protected isGroupEntry(entry: NwListboxEntry<T>): entry is NwListboxOptionGroup<T> {
    return isGroup(entry);
  }

  protected groupItems(entry: NwListboxOptionGroup<T>): NwListboxOption<T>[] {
    return entry.items;
  }

  protected isSelected(v: T): boolean {
    const sel = this.selection();
    return this.multiple() ? Array.isArray(sel) && sel.includes(v) : sel === v;
  }

  protected rowClass(v: T): string {
    return this.isSelected(v) ? 'bg-nw-50 text-nw-700 font-medium' : 'text-surface-800';
  }

  protected readonly allSelected = computed(() => {
    const opts = this.flatVisible().filter((o) => !o.disabled);
    return opts.length > 0 && opts.every((o) => this.isSelected(o.value));
  });

  protected readonly someSelected = computed(() => {
    const opts = this.flatVisible().filter((o) => !o.disabled);
    return opts.some((o) => this.isSelected(o.value)) && !this.allSelected();
  });

  protected readonly allSelectedClass = computed(() => {
    if (this.allSelected()) return 'bg-nw-600 border-nw-600 text-white';
    if (this.someSelected()) return 'bg-nw-100 border-nw-400 text-nw-700';
    return 'border-surface-300';
  });

  protected toggleAll(): void {
    if (this.isDisabled()) return;
    const opts = this.flatVisible().filter((o) => !o.disabled);
    const next = this.allSelected() ? [] : opts.map((o) => o.value);
    this.selection.set(next);
    this.onChange(next);
  }

  protected select(v: T, event: MouseEvent): void {
    if (this.isDisabled()) return;
    let next: T | T[] | null;
    if (this.multiple()) {
      const cur = Array.isArray(this.selection()) ? [...(this.selection() as T[])] : [];
      const isMetaClick = event.ctrlKey || event.metaKey || event.shiftKey;
      if (this.checkbox() || !this.metaKeySelection() || isMetaClick) {
        const i = cur.indexOf(v);
        i >= 0 ? cur.splice(i, 1) : cur.push(v);
        next = cur;
      } else {
        next = [v];
      }
    } else {
      next = v;
    }
    this.selection.set(next);
    this.onChange(next);
  }

  writeValue(value: T | T[] | null): void {
    this.selection.set(value);
  }
  registerOnChange(fn: (v: T | T[] | null) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(): void {}
  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }
}
