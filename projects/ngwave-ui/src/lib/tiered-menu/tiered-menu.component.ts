import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, signal, viewChild } from '@angular/core';
import { NwIconComponent, NwIconName } from '../icon';
import { NwOverlayPanelComponent } from '../overlay-panel';

export interface NwTieredMenuItem {
  label: string;
  icon?: NwIconName;
  items?: NwTieredMenuItem[];
  command?: () => void;
}

/** Vertical nested/cascading menu — submenus fly out to the side on hover. */
@Component({
  selector: 'nw-tiered-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  imports: [NgTemplateOutlet, NwIconComponent, NwOverlayPanelComponent],
  template: `
    @if (popup()) {
      <nw-overlay-panel #panel>
        <div class="min-w-44 -m-1">
          <ng-container [ngTemplateOutlet]="list" [ngTemplateOutletContext]="{ items: model() }" />
        </div>
      </nw-overlay-panel>
    } @else {
      <div class="min-w-44 rounded-nw-lg border border-surface-200 bg-surface-0 p-1 shadow-nw-sm">
        <ng-container [ngTemplateOutlet]="list" [ngTemplateOutletContext]="{ items: model() }" />
      </div>
    }

    <ng-template #list let-items="items">
      @for (item of items; track $index) {
        <div
          class="relative"
          (mouseenter)="hovered.set(item)"
          (mouseleave)="hovered.set(null)"
        >
          <button
            type="button"
            (click)="select(item)"
            class="flex w-full items-center gap-2.5 rounded-nw px-2.5 py-2 text-left text-sm text-surface-700 transition-colors hover:bg-surface-50 hover:text-surface-900"
          >
            @if (item.icon) {
              <nw-icon [name]="item.icon" [size]="15" class="text-surface-400" />
            }
            <span class="flex-1">{{ item.label }}</span>
            @if (item.items?.length) {
              <nw-icon name="chevron-right" [size]="14" class="text-surface-400" />
            }
          </button>

          @if (item.items?.length && hovered() === item) {
            <div
              class="absolute left-full top-0 z-50 min-w-44 rounded-nw-lg border border-surface-200 bg-surface-0 p-1 shadow-nw-lg animate-nw-fade-in"
            >
              <ng-container [ngTemplateOutlet]="list" [ngTemplateOutletContext]="{ items: item.items }" />
            </div>
          }
        </div>
      }
    </ng-template>
  `,
})
export class NwTieredMenuComponent {
  readonly model = input<NwTieredMenuItem[]>([]);
  readonly popup = input(false);

  protected readonly hovered = signal<NwTieredMenuItem | null>(null);
  private readonly panel = viewChild(NwOverlayPanelComponent);

  toggle(event: Event): void {
    this.panel()?.toggle(event);
  }

  protected select(item: NwTieredMenuItem): void {
    if (item.items?.length) return;
    item.command?.();
    this.panel()?.hide();
  }
}
