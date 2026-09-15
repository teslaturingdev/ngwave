import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  afterNextRender,
  inject,
  input,
  signal,
} from '@angular/core';
import { NwIconComponent, NwIconName } from '../icon';

export interface NwContextMenuItem {
  label?: string;
  icon?: NwIconName;
  disabled?: boolean;
  separator?: boolean;
  command?: () => void;
}

/**
 * Right-click-triggered popup menu. Wire it to a target's (contextmenu)
 * event yourself: `<div (contextmenu)="menu.show($event)">`.
 */
@Component({
  selector: 'nw-context-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  imports: [NwIconComponent],
  template: `
    @if (visible()) {
      <div
        #panel
        class="fixed z-50 min-w-44 rounded-nw-lg border border-surface-200 bg-surface-0 p-1 shadow-nw-lg animate-nw-scale-in"
        [style.top.px]="top()"
        [style.left.px]="left()"
      >
        @for (item of model(); track $index) {
          @if (item.separator) {
            <div class="my-1 h-px bg-surface-100"></div>
          } @else {
            <button
              type="button"
              [disabled]="item.disabled ?? false"
              (click)="select(item)"
              class="flex w-full items-center gap-2.5 rounded-nw px-2.5 py-2 text-left text-sm text-surface-700 transition-colors hover:bg-surface-50 hover:text-surface-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              @if (item.icon) {
                <nw-icon [name]="item.icon" [size]="15" class="text-surface-400" />
              }
              {{ item.label }}
            </button>
          }
        }
      </div>
    }
  `,
})
export class NwContextMenuComponent {
  private readonly doc = inject(DOCUMENT);
  private readonly injector = inject(Injector);

  readonly model = input<NwContextMenuItem[]>([]);

  protected readonly visible = signal(false);
  protected readonly top = signal(0);
  protected readonly left = signal(0);

  private readonly docClickHandler = () => this.hide();

  show(event: MouseEvent): void {
    event.preventDefault();
    this.top.set(event.clientY);
    this.left.set(event.clientX);
    this.visible.set(true);
    afterNextRender(
      () => this.doc.addEventListener('click', this.docClickHandler, { once: true }),
      { injector: this.injector },
    );
  }

  hide(): void {
    this.visible.set(false);
  }

  protected select(item: NwContextMenuItem): void {
    if (item.disabled) return;
    item.command?.();
    this.hide();
  }
}
