import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  TemplateRef,
  contentChild,
  inject,
  input,
  model,
  signal,
} from '@angular/core';

/** Item template: `<ng-template nwOrderListItem let-item>`. */
@Directive({ selector: '[nwOrderListItem]' })
export class NwOrderListItemDirective {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}

/** Reorderable single list: select an item, then move it up/down/top/bottom. */
@Component({
  selector: 'nw-order-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  imports: [NgTemplateOutlet],
  template: `
    <div class="flex gap-3 items-start">
      <div class="flex flex-col gap-2 pt-1">
        <button type="button" [class]="btnClass" [disabled]="!canMove()" (click)="moveTop()">⤒</button>
        <button type="button" [class]="btnClass" [disabled]="!canMoveUp()" (click)="moveUp()">↑</button>
        <button type="button" [class]="btnClass" [disabled]="!canMoveDown()" (click)="moveDown()">↓</button>
        <button type="button" [class]="btnClass" [disabled]="!canMove()" (click)="moveBottom()">⤓</button>
      </div>

      <div class="flex-1 rounded-nw border border-surface-200">
        @if (header()) {
          <div class="px-3 py-2 border-b border-surface-200 text-sm font-medium text-surface-700">
            {{ header() }}
          </div>
        }
        <ul class="max-h-80 overflow-auto divide-y divide-surface-100" role="listbox">
          @for (item of value(); track $index) {
            <li
              role="option"
              (click)="select(item)"
              class="px-3 py-2 text-sm cursor-pointer hover:bg-surface-50"
              [class.bg-nw-50]="selected() === item"
              [attr.aria-selected]="selected() === item"
            >
              <ng-container
                [ngTemplateOutlet]="itemTemplate()?.template ?? null"
                [ngTemplateOutletContext]="{ $implicit: item }"
              />
            </li>
          } @empty {
            <li class="px-3 py-4 text-sm text-surface-500">{{ emptyMessage() }}</li>
          }
        </ul>
      </div>
    </div>
  `,
})
export class NwOrderListComponent<T = unknown> {
  protected readonly btnClass =
    'h-8 w-8 inline-flex items-center justify-center rounded-nw border border-surface-300 bg-surface-0 text-surface-700 hover:bg-surface-100 disabled:opacity-40 disabled:cursor-not-allowed';

  readonly value = model<T[]>([]);
  readonly header = input('');
  readonly emptyMessage = input('No items');

  protected readonly itemTemplate = contentChild(NwOrderListItemDirective);
  protected readonly selected = signal<T | null>(null);

  protected readonly canMove = () => this.selected() !== null;
  protected readonly canMoveUp = () => {
    const s = this.selected();
    return s !== null && this.value().indexOf(s) > 0;
  };
  protected readonly canMoveDown = () => {
    const s = this.selected();
    if (s === null) return false;
    const i = this.value().indexOf(s);
    return i >= 0 && i < this.value().length - 1;
  };

  protected select(item: T): void {
    this.selected.set(this.selected() === item ? null : item);
  }

  private swap(from: number, to: number): void {
    const list = [...this.value()];
    if (to < 0 || to >= list.length) return;
    [list[from], list[to]] = [list[to], list[from]];
    this.value.set(list);
  }

  protected moveUp(): void {
    const s = this.selected();
    if (s === null) return;
    const i = this.value().indexOf(s);
    if (i > 0) this.swap(i, i - 1);
  }

  protected moveDown(): void {
    const s = this.selected();
    if (s === null) return;
    const i = this.value().indexOf(s);
    if (i >= 0 && i < this.value().length - 1) this.swap(i, i + 1);
  }

  protected moveTop(): void {
    const s = this.selected();
    if (s === null) return;
    const list = this.value().filter((i) => i !== s);
    this.value.set([s, ...list]);
  }

  protected moveBottom(): void {
    const s = this.selected();
    if (s === null) return;
    const list = this.value().filter((i) => i !== s);
    this.value.set([...list, s]);
  }
}
