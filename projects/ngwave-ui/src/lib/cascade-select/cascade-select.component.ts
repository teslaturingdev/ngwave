import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  model,
  signal,
} from '@angular/core';

export interface NwCascadeOption<T = unknown> {
  label: string;
  value?: T;
  disabled?: boolean;
  children?: NwCascadeOption<T>[];
}

@Component({
  selector: 'nw-cascade-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-block relative',
    '(document:click)': 'onDocClick($event)',
    '(keydown.escape)': 'close()',
  },
  template: `
    <button
      type="button"
      [disabled]="disabled()"
      (click)="toggle()"
      class="flex items-center justify-between gap-2 min-w-48 h-10 px-3 rounded-nw border border-surface-300 bg-surface-0 text-sm text-left disabled:opacity-50 disabled:cursor-not-allowed hover:border-surface-400"
      [attr.aria-expanded]="open()"
      aria-haspopup="true"
    >
      <span class="truncate" [class.text-surface-400]="!selectedLabel()">{{
        selectedLabel() || placeholder()
      }}</span>
      <span class="flex items-center gap-1 shrink-0">
        @if (showClear() && selectedLabel() && !disabled()) {
          <span role="button" aria-label="Clear" class="text-surface-400 hover:text-surface-900" (click)="clear($event)"
            >✕</span
          >
        }
        <span class="text-surface-400">▾</span>
      </span>
    </button>
    @if (open()) {
      <div
        class="absolute mt-1 flex rounded-nw border border-surface-200 bg-surface-0 shadow-nw-lg z-20"
        (keydown)="onPanelKeydown($event)"
      >
        @for (col of columns(); track $index; let ci = $index) {
          <ul
            class="w-48 max-h-72 overflow-auto py-1"
            [class.border-l]="ci > 0"
            [class.border-surface-200]="ci > 0"
            role="menu"
          >
            @for (opt of col; track $index; let oi = $index) {
              <li role="none">
                <button
                  type="button"
                  role="menuitem"
                  [attr.tabindex]="isFocused(ci, oi) ? 0 : -1"
                  [attr.data-nw-cascade-col]="ci"
                  [attr.data-nw-cascade-idx]="oi"
                  [disabled]="opt.disabled ?? false"
                  (mouseenter)="onHover(opt, ci)"
                  (click)="onClick(opt, ci, oi)"
                  class="flex w-full items-center justify-between gap-2 px-3 py-2 text-sm text-left text-surface-800 hover:bg-surface-50 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:bg-surface-100"
                  [class]="isActive(opt, ci) ? 'bg-nw-50 text-nw-700 font-medium' : ''"
                >
                  <span class="truncate">{{ opt.label }}</span>
                  @if (opt.children?.length) {
                    <span class="text-surface-400 shrink-0">›</span>
                  }
                </button>
              </li>
            }
          </ul>
        }
      </div>
    }
  `,
})
export class NwCascadeSelectComponent<T = unknown> {
  private readonly hostEl = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  readonly options = input<NwCascadeOption<T>[]>([]);
  readonly disabled = input(false);
  readonly placeholder = input('Select');
  readonly showClear = input(false);
  readonly value = model<T | undefined>(undefined);

  protected readonly open = signal(false);
  protected readonly activePath = signal<NwCascadeOption<T>[]>([]);
  protected readonly selectedPath = signal<NwCascadeOption<T>[]>([]);
  protected readonly focusPos = signal<[number, number]>([0, 0]);

  protected readonly selectedLabel = computed(() =>
    this.selectedPath()
      .map((p) => p.label)
      .join(' / '),
  );

  protected readonly columns = computed(() => {
    const cols: NwCascadeOption<T>[][] = [this.options()];
    for (const node of this.activePath()) {
      if (node.children?.length) cols.push(node.children);
    }
    return cols;
  });

  protected isActive(opt: NwCascadeOption<T>, ci: number): boolean {
    return this.activePath()[ci] === opt;
  }

  protected isFocused(ci: number, oi: number): boolean {
    const [fc, fi] = this.focusPos();
    return fc === ci && fi === oi;
  }

  protected toggle(): void {
    this.disabled() || (this.open() ? this.close() : this.openPanel());
  }

  protected openPanel(): void {
    this.open.set(true);
    this.activePath.set([...this.selectedPath()]);
    this.focusPos.set([0, 0]);
  }

  protected close(): void {
    this.open.set(false);
    this.activePath.set([]);
  }

  protected onHover(opt: NwCascadeOption<T>, ci: number): void {
    if (opt.disabled) return;
    const path = this.activePath().slice(0, ci);
    path.push(opt);
    this.activePath.set(path);
  }

  protected onClick(opt: NwCascadeOption<T>, ci: number, oi: number): void {
    if (opt.disabled) return;
    const path = this.activePath().slice(0, ci);
    path.push(opt);
    this.activePath.set(path);
    this.focusPos.set([ci, oi]);
    if (!opt.children?.length) {
      this.value.set(opt.value);
      this.selectedPath.set(path);
      this.close();
    }
  }

  protected clear(event: Event): void {
    event.stopPropagation();
    this.value.set(undefined);
    this.selectedPath.set([]);
  }

  protected onPanelKeydown(event: KeyboardEvent): void {
    const cols = this.columns();
    const [ci, oi] = this.focusPos();
    const col = cols[ci] ?? [];

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.moveFocus(ci, Math.min(oi + 1, col.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.moveFocus(ci, Math.max(oi - 1, 0));
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      const opt = col[oi];
      if (opt?.children?.length) {
        this.onHover(opt, ci);
        this.moveFocus(ci + 1, 0);
      }
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      if (ci > 0) {
        this.activePath.set(this.activePath().slice(0, ci - 1));
        this.moveFocus(ci - 1, 0);
      }
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const opt = col[oi];
      if (opt) this.onClick(opt, ci, oi);
    }
  }

  private moveFocus(ci: number, oi: number): void {
    this.focusPos.set([ci, oi]);
    queueMicrotask(() => {
      this.hostEl
        .querySelector<HTMLElement>(`[data-nw-cascade-col="${ci}"][data-nw-cascade-idx="${oi}"]`)
        ?.focus();
    });
  }

  protected onDocClick(event: Event): void {
    if (this.open() && !this.hostEl.contains(event.target as Node)) {
      this.close();
    }
  }
}
