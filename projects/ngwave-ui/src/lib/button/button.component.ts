import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

export type NwButtonVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warn'
  | 'help'
  | 'danger'
  | 'contrast'
  | 'outlined'
  | 'text'
  | 'link'
  | 'raised';
export type NwButtonSize = 'small' | 'normal' | 'large';
export type NwButtonType = 'button' | 'submit' | 'reset';
export type NwIconPosition = 'left' | 'right';

const BASE =
  'relative inline-flex items-center justify-center gap-2 font-medium ' +
  'transition-[color,background-color,border-color,box-shadow,transform] duration-150 ease-nw ' +
  'active:scale-[0.97] select-none focus-visible:outline-none focus-visible:ring-2 ' +
  'focus-visible:ring-nw-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0 ' +
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';

const SIZES: Record<NwButtonSize, string> = {
  small: 'h-8 px-3 text-sm',
  normal: 'h-10 px-4 text-sm',
  large: 'h-12 px-6 text-base',
};

const ICON_SIZES: Record<NwButtonSize, string> = {
  small: 'h-8 w-8 text-sm',
  normal: 'h-10 w-10 text-sm',
  large: 'h-12 w-12 text-base',
};

const VARIANTS: Record<NwButtonVariant, string> = {
  primary:
    'bg-nw-600 text-white shadow-nw-sm hover:bg-nw-700 hover:shadow-nw-md active:bg-nw-800',
  secondary:
    'bg-surface-100 text-surface-900 hover:bg-surface-200 shadow-nw-sm',
  success: 'bg-green-600 text-white shadow-nw-sm hover:bg-green-700 hover:shadow-nw-md',
  info: 'bg-sky-600 text-white shadow-nw-sm hover:bg-sky-700 hover:shadow-nw-md',
  warn: 'bg-amber-500 text-white shadow-nw-sm hover:bg-amber-600 hover:shadow-nw-md',
  help: 'bg-purple-600 text-white shadow-nw-sm hover:bg-purple-700 hover:shadow-nw-md',
  danger: 'bg-red-600 text-white shadow-nw-sm hover:bg-red-700 hover:shadow-nw-md',
  contrast: 'bg-surface-900 text-surface-0 hover:bg-surface-800 shadow-nw-sm',
  outlined:
    'border border-nw-600 text-nw-600 hover:bg-nw-50 active:bg-nw-100',
  text: 'text-nw-600 hover:bg-nw-50 active:bg-nw-100',
  link: 'text-nw-600 underline-offset-4 hover:underline',
  raised:
    'bg-nw-600 text-white shadow-nw-md hover:bg-nw-700 hover:shadow-nw-lg hover:-translate-y-0.5 active:translate-y-0 active:bg-nw-800',
};

@Component({
  selector: 'nw-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'nw-button-host' },
  styles: `:host { display: inline-flex; }`,
  template: `
    <button
      [type]="type()"
      [class]="classes()"
      [disabled]="disabled() || loading()"
      [attr.aria-busy]="loading() ? 'true' : null"
      [attr.aria-label]="ariaLabel() || null"
    >
      @if (loading()) {
        <svg
          class="animate-spin h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-90"
            fill="currentColor"
            d="M4 12a8 8 0 0 1 8-8V0C5.4 0 0 5.4 0 12h4z"
          ></path>
        </svg>
      } @else if (icon() && iconPosition() === 'left') {
        <span [class]="icon()" aria-hidden="true"></span>
      }

      @if (label()) {
        <span>{{ label() }}</span>
      } @else {
        <ng-content />
      }

      @if (!loading() && icon() && iconPosition() === 'right') {
        <span [class]="icon()" aria-hidden="true"></span>
      }

      @if (badge()) {
        <span [class]="badgeClasses()">{{ badge() }}</span>
      }
    </button>
  `,
})
export class NwButtonComponent {
  readonly variant = input<NwButtonVariant>('primary');
  readonly size = input<NwButtonSize>('normal');
  readonly type = input<NwButtonType>('button');
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly icon = input<string>('');
  readonly iconPosition = input<NwIconPosition>('left');
  readonly label = input<string>('');
  readonly rounded = input(false);
  readonly badge = input<string>('');
  readonly badgeVariant = input<NwButtonVariant>('secondary');
  readonly fluid = input(false);
  readonly iconOnly = input(false);
  readonly ariaLabel = input<string>('');

  protected readonly classes = computed(() => {
    const sizing = this.iconOnly()
      ? ICON_SIZES[this.size()]
      : SIZES[this.size()];
    return (
      `${BASE} ${sizing} ${VARIANTS[this.variant()]} ` +
      `${this.rounded() ? 'rounded-full' : 'rounded-nw'} ` +
      `${this.fluid() ? 'w-full' : ''}`
    );
  });

  protected readonly badgeClasses = computed(
    () =>
      'ml-1 inline-flex items-center justify-center min-w-5 h-5 px-1 text-xs rounded-full ' +
      (VARIANTS[this.badgeVariant()] ?? VARIANTS.secondary),
  );
}
