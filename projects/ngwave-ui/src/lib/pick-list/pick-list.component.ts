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

/** Item template: `<ng-template nwPickListItem let-item>`. */
@Directive({ selector: '[nwPickListItem]' })
export class NwPickListItemDirective {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}

/** Two-list transfer picker: move items between a source and a target list. */
@Component({
  selector: 'nw-pick-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  imports: [NgTemplateOutlet],
  template: `
    <div class="grid grid-cols-[1fr_auto_1fr] gap-3 items-start">
      <div class="rounded-nw border border-surface-200">
        @if (sourceHeader()) {
          <div class="px-3 py-2 border-b border-surface-200 text-sm font-medium text-surface-700">
            {{ sourceHeader() }}
          </div>
        }
        <ul class="max-h-72 overflow-auto divide-y divide-surface-100" role="listbox">
          @for (item of source(); track $index) {
            <li
              role="option"
              (click)="toggle(sourceSelected, item)"
              class="px-3 py-2 text-sm cursor-pointer hover:bg-surface-50"
              [class.bg-nw-50]="sourceSelected().has(item)"
              [attr.aria-selected]="sourceSelected().has(item)"
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

      <div class="flex flex-col gap-2 pt-1">
        <button type="button" [class]="pickListBtnClass" [disabled]="!sourceSelected().size" (click)="moveToTarget()">›</button>
        <button type="button" [class]="pickListBtnClass" [disabled]="!source().length" (click)="moveAllToTarget()">»</button>
        <button type="button" [class]="pickListBtnClass" [disabled]="!targetSelected().size" (click)="moveToSource()">‹</button>
        <button type="button" [class]="pickListBtnClass" [disabled]="!target().length" (click)="moveAllToSource()">«</button>
      </div>

      <div class="rounded-nw border border-surface-200">
        @if (targetHeader()) {
          <div class="px-3 py-2 border-b border-surface-200 text-sm font-medium text-surface-700">
            {{ targetHeader() }}
          </div>
        }
        <ul class="max-h-72 overflow-auto divide-y divide-surface-100" role="listbox">
          @for (item of target(); track $index) {
            <li
              role="option"
              (click)="toggle(targetSelected, item)"
              class="px-3 py-2 text-sm cursor-pointer hover:bg-surface-50"
              [class.bg-nw-50]="targetSelected().has(item)"
              [attr.aria-selected]="targetSelected().has(item)"
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
export class NwPickListComponent<T = unknown> {
  protected readonly pickListBtnClass =
    'h-8 w-8 inline-flex items-center justify-center rounded-nw border border-surface-300 bg-surface-0 text-surface-700 hover:bg-surface-100 disabled:opacity-40 disabled:cursor-not-allowed';

  readonly source = model<T[]>([]);
  readonly target = model<T[]>([]);
  readonly sourceHeader = input('');
  readonly targetHeader = input('');
  readonly emptyMessage = input('No items');

  protected readonly itemTemplate = contentChild(NwPickListItemDirective);

  protected readonly sourceSelected = signal<Set<T>>(new Set());
  protected readonly targetSelected = signal<Set<T>>(new Set());

  protected toggle(sel: typeof this.sourceSelected, item: T): void {
    const next = new Set(sel());
    if (next.has(item)) next.delete(item);
    else next.add(item);
    sel.set(next);
  }

  protected moveToTarget(): void {
    const picked = this.sourceSelected();
    if (!picked.size) return;
    this.target.set([...this.target(), ...this.source().filter((i) => picked.has(i))]);
    this.source.set(this.source().filter((i) => !picked.has(i)));
    this.sourceSelected.set(new Set());
  }

  protected moveAllToTarget(): void {
    this.target.set([...this.target(), ...this.source()]);
    this.source.set([]);
    this.sourceSelected.set(new Set());
  }

  protected moveToSource(): void {
    const picked = this.targetSelected();
    if (!picked.size) return;
    this.source.set([...this.source(), ...this.target().filter((i) => picked.has(i))]);
    this.target.set(this.target().filter((i) => !picked.has(i)));
    this.targetSelected.set(new Set());
  }

  protected moveAllToSource(): void {
    this.source.set([...this.source(), ...this.target()]);
    this.target.set([]);
    this.targetSelected.set(new Set());
  }
}
