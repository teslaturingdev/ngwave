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
  model,
} from '@angular/core';

/** Main-view item template: `<ng-template nwGalleriaItem let-item>`. */
@Directive({ selector: '[nwGalleriaItem]' })
export class NwGalleriaItemDirective {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}

/** Thumbnail item template: `<ng-template nwGalleriaThumbnail let-item>`. */
@Directive({ selector: '[nwGalleriaThumbnail]' })
export class NwGalleriaThumbnailDirective {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}

/** Main-image viewer with prev/next navigation and a thumbnail strip. */
@Component({
  selector: 'nw-galleria',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  imports: [NgTemplateOutlet],
  template: `
    <div class="relative rounded-nw border border-surface-200 bg-surface-50 overflow-hidden">
      @if (active(); as item) {
        <ng-container
          [ngTemplateOutlet]="itemTemplate()?.template ?? null"
          [ngTemplateOutletContext]="{ $implicit: item, index: activeIndex() }"
        />
      }

      @if (value().length > 1) {
        <button
          type="button"
          class="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 inline-flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60"
          [disabled]="!circular() && activeIndex() === 0"
          (click)="prev()"
        >
          ‹
        </button>
        <button
          type="button"
          class="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 inline-flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60"
          [disabled]="!circular() && activeIndex() === value().length - 1"
          (click)="next()"
        >
          ›
        </button>
      }
    </div>

    @if (showThumbnails() && value().length > 1) {
      <div class="mt-2 flex gap-2 overflow-x-auto">
        @for (item of value(); track $index) {
          <button
            type="button"
            class="shrink-0 rounded-nw overflow-hidden border-2"
            [class.border-nw-500]="$index === activeIndex()"
            [class.border-transparent]="$index !== activeIndex()"
            (click)="activeIndex.set($index)"
          >
            <ng-container
              [ngTemplateOutlet]="thumbnailTemplate()?.template ?? itemTemplate()?.template ?? null"
              [ngTemplateOutletContext]="{ $implicit: item, index: $index }"
            />
          </button>
        }
      </div>
    }
  `,
})
export class NwGalleriaComponent<T = unknown> {
  readonly value = input<readonly T[]>([]);
  readonly activeIndex = model(0);
  readonly showThumbnails = input(true);
  readonly circular = input(false);

  protected readonly itemTemplate = contentChild(NwGalleriaItemDirective);
  protected readonly thumbnailTemplate = contentChild(NwGalleriaThumbnailDirective);

  protected readonly active = computed<T | undefined>(() => this.value()[this.activeIndex()]);

  protected next(): void {
    const last = this.value().length - 1;
    const i = this.activeIndex();
    this.activeIndex.set(i >= last ? (this.circular() ? 0 : last) : i + 1);
  }

  protected prev(): void {
    const last = this.value().length - 1;
    const i = this.activeIndex();
    this.activeIndex.set(i <= 0 ? (this.circular() ? last : 0) : i - 1);
  }
}
