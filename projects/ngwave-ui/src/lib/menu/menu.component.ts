import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, viewChild } from '@angular/core';
import { NwIconComponent, NwIconName } from '../icon';
import { NwOverlayPanelComponent } from '../overlay-panel';

export interface NwMenuModelItem {
  label?: string;
  icon?: NwIconName;
  disabled?: boolean;
  separator?: boolean;
  command?: () => void;
}

/**
 * Popup or inline item menu. In popup mode ([popup]="true"), wraps
 * nw-overlay-panel for positioning/dismiss — call menu.toggle($event) from
 * a trigger element, matching PrimeNG's p-menu #ref="toggle($event)" API.
 */
@Component({
  selector: 'nw-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  imports: [NgTemplateOutlet, NwIconComponent, NwOverlayPanelComponent],
  template: `
    @if (popup()) {
      <nw-overlay-panel #panel>
        <nav class="min-w-40 -m-1">
          <ng-container [ngTemplateOutlet]="items" />
        </nav>
      </nw-overlay-panel>
    } @else {
      <nav class="min-w-40 rounded-nw-lg border border-surface-200 bg-surface-0 shadow-nw-sm p-1">
        <ng-container [ngTemplateOutlet]="items" />
      </nav>
    }

    <ng-template #items>
      @for (item of model(); track $index) {
        @if (item.separator) {
          <div class="my-1 h-px bg-surface-100"></div>
        } @else {
          <button
            type="button"
            [disabled]="item.disabled ?? false"
            (click)="select(item)"
            class="flex w-full items-center gap-2.5 rounded-nw px-3 py-2 text-left text-sm text-surface-700 transition-colors hover:bg-surface-50 hover:text-surface-900 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
          >
            @if (item.icon) {
              <nw-icon [name]="item.icon" [size]="16" class="text-surface-400" />
            }
            {{ item.label }}
          </button>
        }
      }
    </ng-template>
  `,
})
export class NwMenuComponent {
  readonly model = input<NwMenuModelItem[]>([]);
  readonly popup = input(false);

  private readonly panel = viewChild(NwOverlayPanelComponent);

  toggle(event: Event): void {
    this.panel()?.toggle(event);
  }

  show(event: Event): void {
    this.panel()?.show(event);
  }

  hide(): void {
    this.panel()?.hide();
  }

  protected select(item: NwMenuModelItem): void {
    if (item.disabled) return;
    item.command?.();
    if (this.popup()) this.hide();
  }
}
