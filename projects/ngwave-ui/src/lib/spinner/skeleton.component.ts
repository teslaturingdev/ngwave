import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'nw-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div
      class="relative overflow-hidden bg-surface-200"
      [style.width]="width()"
      [style.height]="height()"
      [class.rounded-full]="shape() === 'circle'"
      [class.rounded-nw]="shape() !== 'circle' && rounded()"
    >
      <div
        class="absolute inset-0 -translate-x-full animate-nw-shimmer bg-gradient-to-r from-transparent via-surface-0/60 to-transparent"
      ></div>
    </div>
  `,
})
export class NwSkeletonComponent {
  readonly width = input('100%');
  readonly height = input('1rem');
  readonly shape = input<'rect' | 'circle'>('rect');
  readonly rounded = input(true);
}
