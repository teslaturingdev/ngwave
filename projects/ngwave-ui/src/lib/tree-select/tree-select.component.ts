import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { NwChipComponent } from '../chip/chip.component';
import { NwTreeComponent, NwTreeNode, NwTreeSelectionMode } from '../tree/tree.component';

export type NwTreeSelectDisplay = 'comma' | 'chip';

@Component({
  selector: 'nw-tree-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-block relative',
    '(document:click)': 'onDocClick($event)',
  },
  imports: [NwTreeComponent, NwChipComponent],
  template: `
    <button
      type="button"
      [disabled]="disabled()"
      (click)="toggle()"
      class="flex items-center justify-between gap-2 min-w-48 min-h-10 px-3 py-1.5 rounded-nw border border-surface-300 bg-surface-0 text-sm text-left disabled:opacity-50 disabled:cursor-not-allowed hover:border-surface-400"
      [attr.aria-expanded]="open()"
    >
      @if (display() === 'chip' && selectedNodes().length) {
        <span class="flex flex-1 flex-wrap gap-1 py-0.5">
          @for (n of selectedNodes(); track $index) {
            <nw-chip
              [label]="n.label ?? ''"
              [removable]="true"
              (removed)="unselect(n)"
              (click)="$event.stopPropagation()"
            />
          }
        </span>
      } @else {
        <span class="truncate" [class.text-surface-400]="!selectedNodes().length">{{
          displayLabel()
        }}</span>
      }
      <span class="flex items-center gap-1 shrink-0">
        @if (showClear() && selectedNodes().length && !disabled()) {
          <span
            role="button"
            aria-label="Clear"
            class="text-surface-400 hover:text-surface-900"
            (click)="clear($event)"
            >✕</span
          >
        }
        <span class="text-surface-400">▾</span>
      </span>
    </button>
    @if (open()) {
      <div
        class="absolute mt-1 min-w-64 max-h-80 overflow-auto rounded-nw border border-surface-200 bg-surface-0 shadow-nw-lg p-2 z-20"
      >
        <nw-tree
          [nodes]="nodes()"
          [selectionMode]="selectionMode()"
          [selection]="selection()"
          [filter]="filterProp()"
          [filterPlaceholder]="filterPlaceholder()"
          [emptyMessage]="emptyMessage()"
          (selectionChange)="onTreeSelectionChange($event)"
        />
      </div>
    }
  `,
})
export class NwTreeSelectComponent {
  private readonly hostEl = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  readonly nodes = input<NwTreeNode[]>([]);
  readonly selectionMode = input<Exclude<NwTreeSelectionMode, null>>('single');
  readonly disabled = input(false);
  readonly placeholder = input('Select');
  readonly showClear = input(false);
  readonly display = input<NwTreeSelectDisplay>('comma');
  readonly filterProp = input(false, { alias: 'filter' });
  readonly filterPlaceholder = input('Search');
  readonly emptyMessage = input('No records found');
  readonly selection = model<NwTreeNode | NwTreeNode[] | null>(null);

  readonly onShow = output<void>();
  readonly onHide = output<void>();
  readonly onClear = output<void>();

  protected readonly open = signal(false);

  protected readonly selectedNodes = computed(() => {
    const sel = this.selection();
    return Array.isArray(sel) ? sel : sel ? [sel] : [];
  });

  protected readonly displayLabel = computed(() => {
    const nodes = this.selectedNodes();
    if (!nodes.length) return this.placeholder();
    return nodes.map((n) => n.label).join(', ');
  });

  protected toggle(): void {
    this.open.set(!this.open());
    if (this.open()) {
      this.onShow.emit();
    } else {
      this.onHide.emit();
    }
  }

  protected onTreeSelectionChange(sel: NwTreeNode | NwTreeNode[] | null): void {
    this.selection.set(sel);
    if (this.selectionMode() === 'single') {
      this.open.set(false);
      this.onHide.emit();
    }
  }

  protected unselect(node: NwTreeNode): void {
    const sel = this.selection();
    if (Array.isArray(sel)) {
      this.selection.set(sel.filter((n) => n !== node));
    } else if (sel === node) {
      this.selection.set(null);
    }
  }

  protected clear(event: Event): void {
    event.stopPropagation();
    this.selection.set(this.selectionMode() === 'single' ? null : []);
    this.onClear.emit();
  }

  protected onDocClick(event: Event): void {
    if (!this.open()) return;
    if (!this.hostEl.contains(event.target as Node)) {
      this.open.set(false);
      this.onHide.emit();
    }
  }
}
