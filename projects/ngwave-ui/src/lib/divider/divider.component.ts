import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type NwDividerLayout = 'horizontal' | 'vertical';
export type NwDividerType = 'solid' | 'dashed' | 'dotted';
export type NwDividerAlign = 'left' | 'center' | 'right' | 'top' | 'bottom';

const BORDER_STYLE: Record<NwDividerType, string> = {
  solid: 'border-solid',
  dashed: 'border-dashed',
  dotted: 'border-dotted',
};

const GROW: Record<NwDividerAlign, [number, number]> = {
  left: [1, 4],
  top: [1, 4],
  center: [1, 1],
  right: [4, 1],
  bottom: [4, 1],
};

@Component({
  selector: 'nw-divider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'separator' },
  template: `

    @if (layout() === 'vertical') {
      <div class="inline-flex flex-col items-center self-stretch mx-2" style="min-height: 1.5rem">
        <span
          class="w-0 border-l"
          [class]="borderStyle()"
          [style.flex-grow]="growBefore()"
        ></span>
        <span class="my-2 text-xs text-surface-500 empty:hidden"><ng-content /></span>
        <span
          class="w-0 border-l"
          [class]="borderStyle()"
          [style.flex-grow]="growAfter()"
        ></span>
      </div>
    } @else {
      <div class="flex items-center my-4">
        <span class="border-t" [class]="borderStyle()" [style.flex-grow]="growBefore()"></span>
        <span class="mx-3 text-xs text-surface-500 empty:hidden shrink-0"><ng-content /></span>
        <span class="border-t" [class]="borderStyle()" [style.flex-grow]="growAfter()"></span>
      </div>
    }
  `,
})
export class NwDividerComponent {
  readonly layout = input<NwDividerLayout>('horizontal');
  readonly type = input<NwDividerType>('solid');
  readonly align = input<NwDividerAlign>('center');

  protected readonly borderStyle = computed(
    () => `${BORDER_STYLE[this.type()]} border-surface-200`,
  );
  protected readonly growBefore = computed(() => GROW[this.align()][0]);
  protected readonly growAfter = computed(() => GROW[this.align()][1]);
}
