import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { NwIconComponent, NwIconName } from '../icon';

export interface NwMenuBarItem {
  label: string;
  icon?: NwIconName;
  items?: NwMenuBarItem[];
  command?: () => void;
}

/** Horizontal top-nav menu with a flat or nested [model] items array. */
@Component({
  selector: 'nw-menubar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  imports: [NwIconComponent],
  template: `
    <nav class="flex items-center gap-1 rounded-nw-lg border border-surface-200 bg-surface-0 px-2 py-1.5">
      @for (item of model(); track $index; let i = $index) {
        <div class="relative" (mouseenter)="open.set(i)" (mouseleave)="open.set(null)">
          <button
            type="button"
            (click)="select(item)"
            class="flex items-center gap-1.5 rounded-nw px-3 py-1.5 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-50 hover:text-surface-900"
          >
            @if (item.icon) {
              <nw-icon [name]="item.icon" [size]="15" />
            }
            {{ item.label }}
            @if (item.items?.length) {
              <nw-icon name="chevron-down" [size]="13" class="text-surface-400" />
            }
          </button>

          @if (item.items?.length && open() === i) {
            <div
              class="absolute left-0 top-full z-50 mt-1 min-w-44 rounded-nw-lg border border-surface-200 bg-surface-0 p-1 shadow-nw-lg animate-nw-fade-in"
            >
              @for (sub of item.items; track $index) {
                <button
                  type="button"
                  (click)="selectSub(sub)"
                  class="flex w-full items-center gap-2 rounded-nw px-2.5 py-2 text-left text-sm text-surface-600 transition-colors hover:bg-surface-50 hover:text-surface-900"
                >
                  @if (sub.icon) {
                    <nw-icon [name]="sub.icon" [size]="14" class="text-surface-400" />
                  }
                  {{ sub.label }}
                </button>
              }
            </div>
          }
        </div>
      }
    </nav>
  `,
})
export class NwMenuBarComponent {
  readonly model = input<NwMenuBarItem[]>([]);
  protected readonly open = signal<number | null>(null);

  protected select(item: NwMenuBarItem): void {
    item.command?.();
  }

  protected selectSub(sub: NwMenuBarItem): void {
    sub.command?.();
    this.open.set(null);
  }
}
