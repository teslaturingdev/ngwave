import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { NwIconComponent, NwIconName } from '../icon';

export interface NwPanelMenuItem {
  label: string;
  icon?: NwIconName;
  items?: NwPanelMenuItem[];
  command?: () => void;
}

/** Collapsible nested nav tree — click an item with children to expand/collapse it in place. */
@Component({
  selector: 'nw-panel-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  imports: [NgTemplateOutlet, NwIconComponent],
  template: `
    <div class="rounded-nw-lg border border-surface-200 bg-surface-0 p-1">
      <ng-container [ngTemplateOutlet]="list" [ngTemplateOutletContext]="{ items: model(), depth: 0 }" />
    </div>

    <ng-template #list let-items="items" let-depth="depth">
      @for (item of items; track $index) {
        <div>
          <button
            type="button"
            (click)="toggle(item)"
            class="flex w-full items-center gap-2.5 rounded-nw px-2.5 py-2 text-left text-sm text-surface-700 transition-colors hover:bg-surface-50 hover:text-surface-900"
            [style.padding-left.px]="10 + depth * 16"
          >
            @if (item.icon) {
              <nw-icon [name]="item.icon" [size]="15" class="text-surface-400" />
            }
            <span class="flex-1">{{ item.label }}</span>
            @if (item.items?.length) {
              <nw-icon
                name="chevron-down"
                [size]="14"
                class="text-surface-400 transition-transform"
                [class.rotate-180]="isExpanded(item)"
              />
            }
          </button>

          @if (item.items?.length && isExpanded(item)) {
            <ng-container
              [ngTemplateOutlet]="list"
              [ngTemplateOutletContext]="{ items: item.items, depth: depth + 1 }"
            />
          }
        </div>
      }
    </ng-template>
  `,
})
export class NwPanelMenuComponent {
  readonly model = input<NwPanelMenuItem[]>([]);

  private readonly expanded = signal<Set<NwPanelMenuItem>>(new Set());

  protected isExpanded(item: NwPanelMenuItem): boolean {
    return this.expanded().has(item);
  }

  protected toggle(item: NwPanelMenuItem): void {
    if (item.items?.length) {
      const next = new Set(this.expanded());
      next.has(item) ? next.delete(item) : next.add(item);
      this.expanded.set(next);
      return;
    }
    item.command?.();
  }
}
