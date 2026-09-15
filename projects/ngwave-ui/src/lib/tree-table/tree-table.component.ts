import { ChangeDetectionStrategy, Component, computed, input, model, signal } from '@angular/core';

export interface NwTreeTableNode<T = Record<string, unknown>> {
  data: T;
  children?: NwTreeTableNode<T>[];
  key?: string;
}

export interface NwTreeTableColumn {
  field: string;
  header: string;
  width?: string;
}

interface FlatRow {
  node: NwTreeTableNode;
  level: number;
  hasChildren: boolean;
}

/** Hybrid of nw-tree and nw-data-table — hierarchical rows rendered as a table. */
@Component({
  selector: 'nw-tree-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div class="overflow-x-auto rounded-nw-lg border border-surface-200">
      <table class="w-full text-left text-sm">
        <thead>
          <tr class="border-b border-surface-200 bg-surface-50 text-xs uppercase tracking-wide text-surface-500">
            @if (selectionMode() === 'checkbox') {
              <th class="w-10 px-3 py-2.5"></th>
            }
            @for (col of columns(); track col.field) {
              <th class="px-3 py-2.5" [style.width]="col.width">{{ col.header }}</th>
            }
          </tr>
        </thead>
        <tbody class="divide-y divide-surface-100">
          @for (row of flatRows(); track row.node) {
            <tr class="hover:bg-surface-50">
              @if (selectionMode() === 'checkbox') {
                <td class="px-3 py-2.5">
                  <input
                    type="checkbox"
                    [checked]="isSelected(row.node)"
                    (change)="toggleSelect(row.node)"
                    class="h-4 w-4 rounded border-surface-300 text-nw-600 focus:ring-nw-500"
                  />
                </td>
              }
              @for (col of columns(); track col.field; let first = $first) {
                <td class="px-3 py-2.5 text-surface-700">
                  @if (first) {
                    <span class="flex items-center gap-1.5" [style.padding-left.px]="row.level * 20">
                      @if (row.hasChildren) {
                        <button
                          type="button"
                          (click)="toggleExpand(row.node)"
                          class="inline-flex h-5 w-5 items-center justify-center rounded-nw text-surface-400 hover:bg-surface-100 hover:text-surface-700"
                        >
                          {{ isExpanded(row.node) ? '▾' : '▸' }}
                        </button>
                      } @else {
                        <span class="inline-block h-5 w-5"></span>
                      }
                      <span class="text-surface-900">{{ row.node.data[col.field] }}</span>
                    </span>
                  } @else {
                    {{ row.node.data[col.field] }}
                  }
                </td>
              }
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class NwTreeTableComponent {
  readonly value = input<NwTreeTableNode[]>([]);
  readonly columns = input<NwTreeTableColumn[]>([]);
  readonly selectionMode = input<'checkbox' | null>(null);
  readonly selection = model<NwTreeTableNode[]>([]);

  /** Tracked internally rather than mutating the input nodes' `expanded` field. */
  private readonly expandedNodes = signal<Set<NwTreeTableNode>>(new Set());

  protected readonly flatRows = computed<FlatRow[]>(() => {
    const expanded = this.expandedNodes();
    const out: FlatRow[] = [];
    const walk = (nodes: NwTreeTableNode[], level: number) => {
      for (const node of nodes) {
        const hasChildren = !!node.children?.length;
        out.push({ node, level, hasChildren });
        if (hasChildren && expanded.has(node)) walk(node.children!, level + 1);
      }
    };
    walk(this.value(), 0);
    return out;
  });

  protected isExpanded(node: NwTreeTableNode): boolean {
    return this.expandedNodes().has(node);
  }

  protected isSelected(node: NwTreeTableNode): boolean {
    return this.selection().includes(node);
  }

  protected toggleSelect(node: NwTreeTableNode): void {
    const current = this.selection();
    this.selection.set(
      current.includes(node) ? current.filter((n) => n !== node) : [...current, node],
    );
  }

  protected toggleExpand(node: NwTreeTableNode): void {
    const next = new Set(this.expandedNodes());
    next.has(node) ? next.delete(node) : next.add(node);
    this.expandedNodes.set(next);
  }
}
