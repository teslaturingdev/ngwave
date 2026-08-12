import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

export type NwSpinnerVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warn'
  | 'danger'
  | 'current';

const COLORS: Record<NwSpinnerVariant, string> = {
  primary: 'text-nw-600',
  secondary: 'text-surface-500',
  success: 'text-green-600',
  info: 'text-sky-600',
  warn: 'text-amber-500',
  danger: 'text-red-600',
  current: 'text-current',
};

@Component({
  selector: 'nw-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex' },
  template: `
    <svg
      class="animate-spin"
      [class]="colorClass()"
      [style.width.px]="size()"
      [style.height.px]="size()"
      [style.animationDuration]="animationDuration()"
      viewBox="0 0 24 24"
      fill="none"
      role="status"
      [attr.aria-label]="label()"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        [attr.stroke-width]="strokeWidth()"
      ></circle>
      <path
        class="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8V0C5.4 0 0 5.4 0 12h4z"
      ></path>
    </svg>
  `,
})
export class NwSpinnerComponent {
  readonly size = input(24);
  readonly label = input('Loading');
  readonly variant = input<NwSpinnerVariant>('primary');
  readonly strokeWidth = input(4);
  readonly animationDuration = input('0.9s');

  protected readonly colorClass = computed(() => COLORS[this.variant()]);
}
