import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Determinate or indeterminate linear progress bar. */
@Component({
  selector: 'nw-progress-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div
      role="progressbar"
      [attr.aria-valuenow]="mode() === 'determinate' ? value() : null"
      aria-valuemin="0"
      aria-valuemax="100"
      class="relative h-2.5 w-full overflow-hidden rounded-full bg-surface-100"
    >
      @if (mode() === 'determinate') {
        <div
          class="h-full rounded-full bg-nw-600 transition-[width] duration-300 ease-nw"
          [style.width.%]="clamped()"
        ></div>
        @if (showValue()) {
          <span class="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-surface-700">
            {{ clamped() }}%
          </span>
        }
      } @else {
        <div class="h-full w-full rounded-full bg-nw-600 animate-pulse"></div>
      }
    </div>
  `,
})
export class NwProgressBarComponent {
  readonly value = input(0);
  readonly mode = input<'determinate' | 'indeterminate'>('determinate');
  readonly showValue = input(false);

  protected readonly clamped = computed(() => Math.max(0, Math.min(100, this.value())));
}
