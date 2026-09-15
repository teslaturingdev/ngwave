import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

/** Image with an optional click-to-zoom fullscreen preview overlay. */
@Component({
  selector: 'nw-image',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-block' },
  template: `
    <img
      [src]="src()"
      [attr.alt]="alt() || null"
      [style.width]="width()"
      [style.height]="height()"
      class="block max-w-full rounded-nw"
      [class.cursor-zoom-in]="preview()"
      (click)="preview() && open.set(true)"
    />

    @if (open()) {
      <div
        class="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 p-8"
        (click)="open.set(false)"
      >
        <button
          type="button"
          class="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/10 text-white hover:bg-white/20"
          (click)="open.set(false)"
          aria-label="Close"
        >
          ✕
        </button>
        <img [src]="src()" [attr.alt]="alt() || null" class="max-h-full max-w-full rounded-nw" (click)="$event.stopPropagation()" />
      </div>
    }
  `,
})
export class NwImageComponent {
  readonly src = input('');
  readonly alt = input('');
  readonly width = input<string | null>(null);
  readonly height = input<string | null>(null);
  readonly preview = input(false);

  protected readonly open = signal(false);
}
