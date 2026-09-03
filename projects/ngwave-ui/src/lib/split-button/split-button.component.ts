import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { NwButtonSize, NwButtonVariant } from '../button/button.component';

export interface NwSplitButtonItem {
  label: string;
  icon?: string;
  disabled?: boolean;
  command?: () => void;
}

const PRIMARY_VARIANTS: Record<NwButtonVariant, string> = {
  primary: 'bg-nw-600 text-white hover:bg-nw-700',
  secondary: 'bg-surface-100 text-surface-900 hover:bg-surface-200',
  success: 'bg-green-600 text-white hover:bg-green-700',
  info: 'bg-sky-600 text-white hover:bg-sky-700',
  warn: 'bg-amber-500 text-white hover:bg-amber-600',
  help: 'bg-purple-600 text-white hover:bg-purple-700',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  contrast: 'bg-surface-900 text-surface-0 hover:bg-surface-800',
  outlined: 'border border-nw-600 text-nw-600 hover:bg-nw-50',
  text: 'text-nw-600 hover:bg-nw-50',
  link: 'text-nw-600 hover:bg-nw-50',
  raised: 'bg-nw-600 text-white hover:bg-nw-700 shadow-nw-md',
};

const MENU_VARIANTS: Record<NwButtonVariant, string> = {
  primary: 'bg-nw-600 text-white hover:bg-nw-700 border-l border-nw-700/40',
  secondary: 'bg-surface-100 text-surface-900 hover:bg-surface-200 border-l border-surface-300',
  success: 'bg-green-600 text-white hover:bg-green-700 border-l border-green-700/40',
  info: 'bg-sky-600 text-white hover:bg-sky-700 border-l border-sky-700/40',
  warn: 'bg-amber-500 text-white hover:bg-amber-600 border-l border-amber-600/40',
  help: 'bg-purple-600 text-white hover:bg-purple-700 border-l border-purple-700/40',
  danger: 'bg-red-600 text-white hover:bg-red-700 border-l border-red-700/40',
  contrast: 'bg-surface-900 text-surface-0 hover:bg-surface-800 border-l border-surface-700',
  outlined: 'border border-nw-600 border-l-0 text-nw-600 hover:bg-nw-50',
  text: 'text-nw-600 hover:bg-nw-50',
  link: 'text-nw-600 hover:bg-nw-50',
  raised: 'bg-nw-600 text-white hover:bg-nw-700 border-l border-nw-700/40 shadow-nw-md',
};

const HEIGHT: Record<NwButtonSize, string> = {
  small: 'h-8',
  normal: 'h-10',
  large: 'h-12',
};

const MENU_WIDTH: Record<NwButtonSize, string> = {
  small: 'w-8',
  normal: 'w-9',
  large: 'w-10',
};

@Component({
  selector: 'nw-split-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-flex relative',
    '(document:click)': 'onDocClick($event)',
  },
  template: `
    <div class="inline-flex rounded-nw" [class.shadow-nw-sm]="variant() !== 'text' && variant() !== 'link'">
      <button
        type="button"
        [disabled]="disabled()"
        (click)="clicked.emit()"
        class="inline-flex items-center gap-2 px-4 text-sm font-medium rounded-l-nw disabled:opacity-50 disabled:cursor-not-allowed"
        [class]="primaryButtonClass()"
      >
        @if (icon() && iconPosition() === 'left') {
          <span [class]="icon()" aria-hidden="true"></span>
        }
        {{ label() }}
        @if (icon() && iconPosition() === 'right') {
          <span [class]="icon()" aria-hidden="true"></span>
        }
      </button>
      <button
        type="button"
        [disabled]="disabled()"
        (click)="open.set(!open())"
        aria-label="More options"
        [attr.aria-expanded]="open()"
        class="inline-flex items-center justify-center rounded-r-nw disabled:opacity-50 disabled:cursor-not-allowed"
        [class]="menuButtonClass()"
      >
        {{ dropdownIcon() }}
      </button>
    </div>
    @if (open()) {
      <div
        class="absolute right-0 top-full mt-1 min-w-40 rounded-nw border border-surface-200 bg-surface-0 shadow-nw-lg py-1 z-20"
      >
        @for (item of items(); track $index) {
          <button
            type="button"
            [disabled]="item.disabled ?? false"
            (click)="selectItem(item)"
            class="flex w-full items-center gap-2 px-3 py-2 text-sm text-left text-surface-800 hover:bg-surface-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            @if (item.icon) {
              <span [class]="item.icon" aria-hidden="true"></span>
            }
            {{ item.label }}
          </button>
        }
      </div>
    }
  `,
})
export class NwSplitButtonComponent {
  private readonly hostEl = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  readonly label = input('');
  readonly icon = input('');
  readonly iconPosition = input<'left' | 'right'>('left');
  readonly disabled = input(false);
  readonly variant = input<NwButtonVariant>('primary');
  readonly size = input<NwButtonSize>('normal');
  readonly dropdownIcon = input('▾');
  readonly items = input<NwSplitButtonItem[]>([], { alias: 'model' });

  readonly clicked = output<void>();

  protected readonly open = signal(false);

  protected primaryButtonClass(): string {
    return `${HEIGHT[this.size()]} ${PRIMARY_VARIANTS[this.variant()]}`;
  }

  protected menuButtonClass(): string {
    return `${HEIGHT[this.size()]} ${MENU_WIDTH[this.size()]} ${MENU_VARIANTS[this.variant()]}`;
  }

  protected selectItem(item: NwSplitButtonItem): void {
    if (item.disabled) return;
    item.command?.();
    this.open.set(false);
  }

  protected onDocClick(event: Event): void {
    if (this.open() && !this.hostEl.contains(event.target as Node)) {
      this.open.set(false);
    }
  }
}
