import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  TemplateRef,
  computed,
  contentChild,
  inject,
  input,
  signal,
} from '@angular/core';

/** Item template: `<ng-template nwDataViewItem let-item let-index="index">`. */
@Directive({ selector: '[nwDataViewItem]' })
export class NwDataViewItemDirective {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}

export type NwDataViewLayout = 'list' | 'grid';

/**
 * Renders a collection with a caller-provided item template, in either a
 * stacked list or a responsive grid, with optional client-side paging.
 */
@Component({
  selector: 'nw-data-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  imports: [NgTemplateOutlet],
  template: `
    <ng-content select="[dataViewHeader]" />

    @if (value().length === 0) {
      <div class="py-10 text-center text-sm text-surface-500">{{ emptyMessage() }}</div>
    } @else {
      <div [class]="containerClass()">
        @for (item of pageItems(); track $index) {
          <ng-container
            [ngTemplateOutlet]="itemTemplate()?.template ?? null"
            [ngTemplateOutletContext]="{ $implicit: item, index: firstIndex() + $index }"
          />
        }
      </div>
    }

    @if (paginator() && totalPages() > 1) {
      <div class="mt-4 flex items-center justify-center gap-2">
        <button
          type="button"
          class="h-8 w-8 inline-flex items-center justify-center rounded-nw border border-surface-300 text-sm text-surface-700 hover:bg-surface-100 disabled:opacity-40 disabled:cursor-not-allowed"
          [disabled]="pageIndex() === 0"
          (click)="setPage(pageIndex() - 1)"
        >
          ‹
        </button>
        <span class="text-sm text-surface-600">{{ pageIndex() + 1 }} / {{ totalPages() }}</span>
        <button
          type="button"
          class="h-8 w-8 inline-flex items-center justify-center rounded-nw border border-surface-300 text-sm text-surface-700 hover:bg-surface-100 disabled:opacity-40 disabled:cursor-not-allowed"
          [disabled]="pageIndex() >= totalPages() - 1"
          (click)="setPage(pageIndex() + 1)"
        >
          ›
        </button>
      </div>
    }

    <ng-content select="[dataViewFooter]" />
  `,
})
export class NwDataViewComponent<T = unknown> {
  readonly value = input<readonly T[]>([]);
  readonly layout = input<NwDataViewLayout>('list');
  /** Items per page; 0 disables paging even when `paginator` is true. */
  readonly rows = input(0);
  readonly paginator = input(false);
  readonly emptyMessage = input('No records found.');
  readonly gridClass = input('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4');
  readonly listClass = input('flex flex-col divide-y divide-surface-200');

  protected readonly itemTemplate = contentChild(NwDataViewItemDirective);

  protected readonly pageIndex = signal(0);

  protected readonly containerClass = computed(() =>
    this.layout() === 'grid' ? this.gridClass() : this.listClass(),
  );

  protected readonly totalPages = computed(() => {
    const rows = this.rows();
    if (!this.paginator() || rows <= 0) return 1;
    return Math.max(1, Math.ceil(this.value().length / rows));
  });

  protected readonly firstIndex = computed(() => {
    const rows = this.rows();
    if (!this.paginator() || rows <= 0) return 0;
    const clamped = Math.min(this.pageIndex(), this.totalPages() - 1);
    return clamped * rows;
  });

  protected readonly pageItems = computed(() => {
    const rows = this.rows();
    const all = this.value();
    if (!this.paginator() || rows <= 0) return all;
    return all.slice(this.firstIndex(), this.firstIndex() + rows);
  });

  protected setPage(page: number): void {
    this.pageIndex.set(Math.min(Math.max(0, page), this.totalPages() - 1));
  }
}
