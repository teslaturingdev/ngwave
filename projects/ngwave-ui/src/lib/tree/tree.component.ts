import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';

export interface NwTreeNode<T = unknown> {
  label?: string;
  data?: T;
  icon?: string;
  expandedIcon?: string;
  collapsedIcon?: string;
  children?: NwTreeNode<T>[];
  leaf?: boolean;
  expanded?: boolean;
  key?: string;
  /** When false, this node cannot be selected/checked (still visible/expandable). */
  selectable?: boolean;
  styleClass?: string;
}

export type NwTreeSelectionMode = 'single' | 'multiple' | 'checkbox' | null;

interface NodeCtx {
  $implicit: NwTreeNode;
  path: NwTreeNode[];
  level: number;
}

@Component({
  selector: 'nw-tree',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  imports: [NgTemplateOutlet],
  template: `
    @if (filterProp()) {
      <div class="mb-2 relative">
        <input
          type="text"
          [value]="filterText()"
          (input)="filterText.set($any($event.target).value)"
          [placeholder]="filterPlaceholder()"
          class="w-full h-9 pl-3 pr-8 rounded-nw border border-surface-300 bg-surface-0 text-sm focus:outline-none focus:ring-2 focus:ring-nw-500"
        />
        <span class="absolute right-2 top-1/2 -translate-y-1/2 text-surface-400 text-xs">⌕</span>
      </div>
    }

    @if (loading()) {
      <div class="flex items-center gap-2 text-sm text-surface-500 py-4">
        <span class="animate-spin inline-block">◐</span>
        Loading...
      </div>
    } @else if (nodes().length === 0) {
      <p class="text-sm text-surface-500 py-4">{{ emptyMessage() }}</p>
    } @else {
      <ul class="text-sm" role="tree" (keydown)="onKeydown($event)">
        @for (node of nodes(); track $index) {
          <ng-container
            [ngTemplateOutlet]="nodeTpl"
            [ngTemplateOutletContext]="{ $implicit: node, path: [node], level: 0 }"
          />
        }
      </ul>
    }

    <ng-template #nodeTpl let-node let-path="path" let-level="level">
      @if (isVisible(node)) {
        <li role="treeitem" [attr.aria-selected]="isChecked(node) || isSelected(node)" [attr.aria-expanded]="node.children?.length ? isExpanded(node) : null">
          <div
            #row
            [attr.tabindex]="isFocused(node) ? 0 : -1"
            [attr.data-nw-tree-node]="true"
            class="flex items-center gap-1.5 py-1 px-1 rounded-nw hover:bg-surface-50 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-nw-500"
            [class.bg-nw-50]="isSelected(node)"
            (click)="onNodeClick(node, path, $event)"
            (focus)="focusedNode.set(node)"
          >
            @if (node.children?.length) {
              <button
                type="button"
                (click)="toggleExpand(node, $event)"
                tabindex="-1"
                class="w-4 h-4 flex items-center justify-center text-surface-500 shrink-0"
              >
                <span class="transition-transform inline-block" [class.rotate-90]="isExpanded(node)"
                  >▸</span
                >
              </button>
            } @else {
              <span class="w-4 h-4 shrink-0"></span>
            }
            @if (selectionMode() === 'checkbox') {
              <span
                role="checkbox"
                [attr.aria-checked]="isChecked(node) ? 'true' : isPartial(node) ? 'mixed' : 'false'"
                class="h-3.5 w-3.5 rounded-nw border flex items-center justify-center text-[9px] shrink-0"
                [class]="checkboxClass(node)"
              >
                @if (isChecked(node)) {
                  ✓
                } @else if (isPartial(node)) {
                  −
                }
              </span>
            } @else if (selectionMode() === 'multiple') {
              <span
                class="h-3.5 w-3.5 rounded-nw border flex items-center justify-center text-[9px] shrink-0"
                [class]="isSelected(node) ? 'bg-nw-600 border-nw-600 text-white' : 'border-surface-300'"
              >
                @if (isSelected(node)) {
                  ✓
                }
              </span>
            }
            @if (node.icon) {
              <span [class]="node.icon" aria-hidden="true"></span>
            } @else if (node.children?.length && (node.expandedIcon || node.collapsedIcon)) {
              <span
                [class]="isExpanded(node) ? node.expandedIcon : node.collapsedIcon"
                aria-hidden="true"
              ></span>
            }
            <span class="truncate" [class.opacity-50]="node.selectable === false">{{
              node.label
            }}</span>
          </div>
          @if (node.children?.length && isExpanded(node)) {
            <ul class="pl-5" role="group">
              @for (child of node.children; track $index) {
                <ng-container
                  [ngTemplateOutlet]="nodeTpl"
                  [ngTemplateOutletContext]="{
                    $implicit: child,
                    path: [...path, child],
                    level: level + 1,
                  }"
                />
              }
            </ul>
          }
        </li>
      }
    </ng-template>
  `,
})
export class NwTreeComponent {
  private readonly hostEl = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  readonly nodes = input<NwTreeNode[]>([]);
  readonly selectionMode = input<NwTreeSelectionMode>(null);
  readonly selection = model<NwTreeNode | NwTreeNode[] | null>(null);
  readonly metaKeySelection = input(true);
  readonly loading = input(false);
  readonly emptyMessage = input('No records found');
  readonly filterProp = input(false, { alias: 'filter' });
  readonly filterPlaceholder = input('Search');

  readonly nodeSelect = output<NwTreeNode>();
  readonly nodeUnselect = output<NwTreeNode>();
  readonly nodeExpand = output<NwTreeNode>();
  readonly nodeCollapse = output<NwTreeNode>();
  readonly filtered = output<NwTreeNode[]>();

  protected readonly filterText = signal('');
  protected readonly expandedSet = signal<Set<NwTreeNode>>(new Set());
  protected readonly collapsedSet = signal<Set<NwTreeNode>>(new Set());
  protected readonly partialSet = signal<Set<NwTreeNode>>(new Set());
  protected readonly focusedNode = signal<NwTreeNode | null>(null);

  private readonly checkedSet = computed(() => {
    const sel = this.selection();
    return new Set(Array.isArray(sel) ? sel : sel ? [sel] : []);
  });

  private readonly matchedSet = computed(() => {
    const text = this.filterText().trim().toLowerCase();
    const matched = new Set<NwTreeNode>();
    if (!this.filterProp() || !text) return matched;
    const visit = (node: NwTreeNode): boolean => {
      const selfMatch = (node.label ?? '').toLowerCase().includes(text);
      let childMatch = false;
      for (const child of node.children ?? []) {
        if (visit(child)) childMatch = true;
      }
      if (selfMatch || childMatch) {
        matched.add(node);
        return true;
      }
      return false;
    };
    for (const root of this.nodes()) visit(root);
    return matched;
  });

  private readonly visibleFlatList = computed(() => {
    const list: NwTreeNode[] = [];
    const walk = (nodes: NwTreeNode[]) => {
      for (const node of nodes) {
        if (!this.isVisible(node)) continue;
        list.push(node);
        if (node.children?.length && this.isExpanded(node)) walk(node.children);
      }
    };
    walk(this.nodes());
    return list;
  });

  constructor() {
    effect(() => {
      const isFiltering = this.filterProp() && this.filterText().trim();
      if (isFiltering) this.filtered.emit([...this.matchedSet()]);
    });
    effect(() => {
      const list = this.visibleFlatList();
      if (list.length && !this.focusedNode()) this.focusedNode.set(list[0]);
    });
  }

  protected isVisible(node: NwTreeNode): boolean {
    if (!this.filterProp() || !this.filterText().trim()) return true;
    return this.matchedSet().has(node);
  }

  protected isExpanded(node: NwTreeNode): boolean {
    if (this.filterProp() && this.filterText().trim()) return true;
    if (this.collapsedSet().has(node)) return false;
    if (this.expandedSet().has(node)) return true;
    return !!node.expanded;
  }

  protected isFocused(node: NwTreeNode): boolean {
    return this.focusedNode() === node;
  }

  protected toggleExpand(node: NwTreeNode, event: Event): void {
    event.stopPropagation();
    if (this.isExpanded(node)) {
      const exp = new Set(this.expandedSet());
      exp.delete(node);
      this.expandedSet.set(exp);
      const col = new Set(this.collapsedSet());
      col.add(node);
      this.collapsedSet.set(col);
      this.nodeCollapse.emit(node);
    } else {
      const exp = new Set(this.expandedSet());
      exp.add(node);
      this.expandedSet.set(exp);
      const col = new Set(this.collapsedSet());
      col.delete(node);
      this.collapsedSet.set(col);
      this.nodeExpand.emit(node);
    }
  }

  protected isSelected(node: NwTreeNode): boolean {
    if (this.selectionMode() === 'checkbox') return this.isChecked(node);
    const sel = this.selection();
    return this.selectionMode() === 'multiple'
      ? Array.isArray(sel) && sel.includes(node)
      : sel === node;
  }

  protected isChecked(node: NwTreeNode): boolean {
    return this.checkedSet().has(node);
  }

  protected isPartial(node: NwTreeNode): boolean {
    return this.partialSet().has(node) && !this.isChecked(node);
  }

  protected checkboxClass(node: NwTreeNode): string {
    if (this.isChecked(node)) return 'bg-nw-600 border-nw-600 text-white';
    if (this.isPartial(node)) return 'bg-nw-100 border-nw-400 text-nw-700';
    return 'border-surface-300';
  }

  protected onNodeClick(node: NwTreeNode, path: NwTreeNode[], event: MouseEvent): void {
    this.focusedNode.set(node);
    const mode = this.selectionMode();
    if (!mode || node.selectable === false) return;

    if (mode === 'checkbox') {
      this.toggleCheckbox(node, path);
      return;
    }
    if (mode === 'single') {
      this.selection.set(node);
      this.nodeSelect.emit(node);
      return;
    }
    // multiple
    const cur = Array.isArray(this.selection()) ? [...(this.selection() as NwTreeNode[])] : [];
    const isMetaClick = event.ctrlKey || event.metaKey || event.shiftKey;
    if (this.metaKeySelection() && !isMetaClick) {
      this.selection.set([node]);
      this.nodeSelect.emit(node);
      return;
    }
    const i = cur.indexOf(node);
    if (i >= 0) {
      cur.splice(i, 1);
      this.selection.set(cur);
      this.nodeUnselect.emit(node);
    } else {
      cur.push(node);
      this.selection.set(cur);
      this.nodeSelect.emit(node);
    }
  }

  private toggleCheckbox(node: NwTreeNode, path: NwTreeNode[]): void {
    const nextChecked = !this.isChecked(node);
    const checked = new Set(this.checkedSet());
    const partial = new Set(this.partialSet());

    const applyDown = (n: NwTreeNode) => {
      if (n.selectable === false) return;
      nextChecked ? checked.add(n) : checked.delete(n);
      partial.delete(n);
      n.children?.forEach(applyDown);
    };
    applyDown(node);

    const ancestors = path.slice(0, -1);
    for (let i = ancestors.length - 1; i >= 0; i--) {
      const parent = ancestors[i];
      const kids = (parent.children ?? []).filter((k) => k.selectable !== false);
      const checkedCount = kids.filter((k) => checked.has(k)).length;
      const anyPartial = kids.some((k) => partial.has(k));
      if (kids.length > 0 && checkedCount === kids.length && !anyPartial) {
        checked.add(parent);
        partial.delete(parent);
      } else if (checkedCount > 0 || anyPartial) {
        checked.delete(parent);
        partial.add(parent);
      } else {
        checked.delete(parent);
        partial.delete(parent);
      }
    }

    this.partialSet.set(partial);
    this.selection.set([...checked]);
    nextChecked ? this.nodeSelect.emit(node) : this.nodeUnselect.emit(node);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const list = this.visibleFlatList();
    const current = this.focusedNode();
    const idx = current ? list.indexOf(current) : -1;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.moveFocus(list[Math.min(idx + 1, list.length - 1)]);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.moveFocus(list[Math.max(idx - 1, 0)]);
    } else if (event.key === 'ArrowRight' && current) {
      event.preventDefault();
      if (current.children?.length && !this.isExpanded(current)) {
        this.toggleExpand(current, event);
      } else if (current.children?.length) {
        this.moveFocus(current.children[0]);
      }
    } else if (event.key === 'ArrowLeft' && current) {
      event.preventDefault();
      if (current.children?.length && this.isExpanded(current)) {
        this.toggleExpand(current, event);
      } else {
        const parent = this.findParent(current);
        if (parent) this.moveFocus(parent);
      }
    } else if ((event.key === 'Enter' || event.key === ' ') && current) {
      event.preventDefault();
      this.onNodeClick(current, this.findPath(current), event as unknown as MouseEvent);
    }
  }

  private moveFocus(node: NwTreeNode | undefined): void {
    if (!node) return;
    this.focusedNode.set(node);
    queueMicrotask(() => {
      const rows = this.hostEl.querySelectorAll<HTMLElement>('[data-nw-tree-node]');
      const list = this.visibleFlatList();
      const idx = list.indexOf(node);
      rows[idx]?.focus();
    });
  }

  private findParent(target: NwTreeNode): NwTreeNode | null {
    const search = (nodes: NwTreeNode[]): NwTreeNode | null => {
      for (const n of nodes) {
        if (n.children?.includes(target)) return n;
        if (n.children) {
          const found = search(n.children);
          if (found) return found;
        }
      }
      return null;
    };
    return search(this.nodes());
  }

  private findPath(target: NwTreeNode): NwTreeNode[] {
    const search = (nodes: NwTreeNode[], path: NwTreeNode[]): NwTreeNode[] | null => {
      for (const n of nodes) {
        const next = [...path, n];
        if (n === target) return next;
        if (n.children) {
          const found = search(n.children, next);
          if (found) return found;
        }
      }
      return null;
    };
    return search(this.nodes(), []) ?? [target];
  }
}
