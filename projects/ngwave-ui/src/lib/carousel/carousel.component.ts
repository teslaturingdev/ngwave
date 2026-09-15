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

/** Item template: `<ng-template nwCarouselItem let-item>`. */
@Directive({ selector: '[nwCarouselItem]' })
export class NwCarouselItemDirective {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}

/** Horizontal item carousel with prev/next navigation and page indicators. */
@Component({
  selector: 'nw-carousel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  imports: [NgTemplateOutlet],
  template: `
    <div class="relative">
      <div class="flex items-center gap-2">
        @if (showNavigators()) {
          <button
            type="button"
            class="h-8 w-8 shrink-0 inline-flex items-center justify-center rounded-nw border border-surface-300 bg-surface-0 text-surface-700 hover:bg-surface-100 disabled:opacity-40 disabled:cursor-not-allowed"
            [disabled]="!circular() && firstIndex() === 0"
            (click)="prev()"
          >
            ‹
          </button>
        }

        <div class="flex-1 overflow-hidden">
          <div
            class="flex transition-transform duration-300 ease-nw"
            [style.transform]="'translateX(' + -(firstIndex() * (100 / numVisible())) + '%)'"
          >
            @for (item of value(); track $index) {
              <div class="shrink-0 px-2" [style.width.%]="100 / numVisible()">
                <ng-container
                  [ngTemplateOutlet]="itemTemplate()?.template ?? null"
                  [ngTemplateOutletContext]="{ $implicit: item, index: $index }"
                />
              </div>
            }
          </div>
        </div>

        @if (showNavigators()) {
          <button
            type="button"
            class="h-8 w-8 shrink-0 inline-flex items-center justify-center rounded-nw border border-surface-300 bg-surface-0 text-surface-700 hover:bg-surface-100 disabled:opacity-40 disabled:cursor-not-allowed"
            [disabled]="!circular() && firstIndex() >= maxFirstIndex()"
            (click)="next()"
          >
            ›
          </button>
        }
      </div>

      @if (showIndicators() && indicatorCount() > 1) {
        <div class="mt-3 flex justify-center gap-1.5">
          @for (i of indicatorRange(); track i) {
            <button
              type="button"
              class="h-2 w-2 rounded-full"
              [class.bg-nw-500]="i === activeIndicator()"
              [class.bg-surface-200]="i !== activeIndicator()"
              (click)="goToIndicator(i)"
            ></button>
          }
        </div>
      }
    </div>
  `,
})
export class NwCarouselComponent<T = unknown> {
  readonly value = input<readonly T[]>([]);
  readonly numVisible = input(1);
  readonly numScroll = input(1);
  readonly circular = input(false);
  readonly showIndicators = input(true);
  readonly showNavigators = input(true);

  protected readonly itemTemplate = contentChild(NwCarouselItemDirective);
  protected readonly firstIndex = signal(0);

  protected readonly maxFirstIndex = computed(() =>
    Math.max(0, this.value().length - this.numVisible()),
  );

  protected readonly indicatorCount = computed(() =>
    Math.max(1, Math.ceil(this.value().length / this.numScroll())),
  );
  protected readonly indicatorRange = computed(() =>
    Array.from({ length: this.indicatorCount() }, (_, i) => i),
  );
  protected readonly activeIndicator = computed(() =>
    Math.round(this.firstIndex() / this.numScroll()),
  );

  protected next(): void {
    const max = this.maxFirstIndex();
    const nextIndex = this.firstIndex() + this.numScroll();
    if (nextIndex > max) {
      this.firstIndex.set(this.circular() ? 0 : max);
    } else {
      this.firstIndex.set(nextIndex);
    }
  }

  protected prev(): void {
    const prevIndex = this.firstIndex() - this.numScroll();
    if (prevIndex < 0) {
      this.firstIndex.set(this.circular() ? this.maxFirstIndex() : 0);
    } else {
      this.firstIndex.set(prevIndex);
    }
  }

  protected goToIndicator(i: number): void {
    this.firstIndex.set(Math.min(i * this.numScroll(), this.maxFirstIndex()));
  }
}
