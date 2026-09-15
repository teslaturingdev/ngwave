import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type NwBadgeSeverity =
  | 'success'
  | 'info'
  | 'warn'
  | 'danger'
  | 'secondary'
  | 'contrast';
export type NwBadgeSize = 'small' | 'normal' | 'large';

const SEVERITY_BG: Record<NwBadgeSeverity, string> = {
  success: 'bg-green-500',
  info: 'bg-sky-500',
  warn: 'bg-amber-500',
  danger: 'bg-red-500',
  secondary: 'bg-surface-400',
  contrast: 'bg-surface-900',
};

const SEVERITY_TEXT: Record<NwBadgeSeverity, string> = {
  success: 'text-white',
  info: 'text-white',
  warn: 'text-white',
  danger: 'text-white',
  secondary: 'text-white',
  contrast: 'text-surface-0',
};

const SIZE: Record<NwBadgeSize, string> = {
  small: 'min-w-4 h-4 text-[10px] px-1',
  normal: 'min-w-5 h-5 text-xs px-1.5',
  large: 'min-w-6 h-6 text-sm px-2',
};

const DOT_SIZE: Record<NwBadgeSize, string> = {
  small: 'h-1.5 w-1.5',
  normal: 'h-2 w-2',
  large: 'h-2.5 w-2.5',
};

/**
 * Small numeric/text/dot indicator. Renders as a dot when `value` is empty,
 * matching PrimeNG's Badge (with no value) vs OverlayBadge/pBadge behavior.
 */
@Component({
  selector: 'nw-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex' },
  template: `
    @if (isDot()) {
      <span class="inline-block rounded-full" [class]="dotClasses()" aria-hidden="true"></span>
    } @else {
      <span
        class="inline-flex items-center justify-center rounded-full font-medium leading-none"
        [class]="valueClasses()"
        >{{ value() }}</span
      >
    }
  `,
})
export class NwBadgeComponent {
  readonly value = input<string | number | null>('');
  readonly severity = input<NwBadgeSeverity>('secondary');
  readonly size = input<NwBadgeSize>('normal');

  protected readonly isDot = computed(
    () => this.value() === '' || this.value() === null || this.value() === undefined,
  );
  protected readonly dotClasses = computed(
    () => `${DOT_SIZE[this.size()]} ${SEVERITY_BG[this.severity()]}`,
  );
  protected readonly valueClasses = computed(
    () => `${SIZE[this.size()]} ${SEVERITY_BG[this.severity()]} ${SEVERITY_TEXT[this.severity()]}`,
  );
}

/**
 * Positions an `nw-badge` at the top-right corner of projected content
 * (an icon, avatar, button, ...) — PrimeNG's OverlayBadge / pBadge.
 */
@Component({
  selector: 'nw-overlay-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'relative inline-flex' },
  imports: [NwBadgeComponent],
  template: `
    <ng-content />
    <nw-badge
      [value]="value()"
      [severity]="severity()"
      [size]="size()"
      class="absolute -top-1.5 -right-1.5"
    />
  `,
})
export class NwOverlayBadgeComponent {
  readonly value = input<string | number | null>('');
  readonly severity = input<NwBadgeSeverity>('danger');
  readonly size = input<NwBadgeSize>('small');
}
