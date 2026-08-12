import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import {
  NwToastMessage,
  NwToastService,
  NwToastSeverity,
} from './toast.service';

export type NwToastPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center';

const POSITIONS: Record<NwToastPosition, string> = {
  'top-right': 'top-4 right-4 items-end',
  'top-left': 'top-4 left-4 items-start',
  'bottom-right': 'bottom-4 right-4 items-end',
  'bottom-left': 'bottom-4 left-4 items-start',
  'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
};

const DOT: Record<NwToastSeverity, string> = {
  success: 'bg-green-500',
  info: 'bg-sky-500',
  warn: 'bg-amber-500',
  error: 'bg-red-500',
  secondary: 'bg-surface-400',
  contrast: 'bg-surface-900',
};

const BORDER: Record<NwToastSeverity, string> = {
  success: 'border-l-green-500',
  info: 'border-l-sky-500',
  warn: 'border-l-amber-500',
  error: 'border-l-red-500',
  secondary: 'border-l-surface-400',
  contrast: 'border-l-surface-900',
};

const ICON: Record<NwToastSeverity, string> = {
  success: '✓',
  info: 'ℹ',
  warn: '⚠',
  error: '✕',
  secondary: '•',
  contrast: '●',
};

@Component({
  selector: 'nw-toast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="fixed z-50 flex flex-col gap-2 pointer-events-none"
      [class]="containerClass()"
    >
      @for (t of visible(); track t.id) {
        <div
          role="alert"
          class="pointer-events-auto w-80 max-w-[90vw] p-3 rounded-nw border border-surface-200 border-l-4 bg-surface-0 shadow-nw-lg ring-1 ring-surface-900/5 flex items-start gap-3"
          [class]="border[t.severity] + ' ' + itemAnim()"
        >
          <span
            class="mt-0.5 h-5 w-5 shrink-0 rounded-full flex items-center justify-center text-white text-xs"
            [class]="dot[t.severity]"
            aria-hidden="true"
            >{{ t.icon ?? icon[t.severity] }}</span
          >
          <div class="flex-1 min-w-0">
            <div class="text-sm font-semibold text-surface-900">
              {{ t.summary }}
            </div>
            @if (t.detail) {
              <div class="text-sm text-surface-600">{{ t.detail }}</div>
            }
          </div>
          @if (t.closable !== false) {
            <button
              type="button"
              (click)="service.remove(t.id)"
              aria-label="Dismiss"
              class="h-6 w-6 rounded-nw text-surface-400 hover:bg-surface-100 shrink-0"
            >
              ✕
            </button>
          }
        </div>
      }
    </div>
  `,
})
export class NwToastComponent {
  protected readonly service = inject(NwToastService);
  readonly position = input<NwToastPosition>('top-right');
  /** Only render messages whose `key` matches this outlet (default: unkeyed). */
  readonly key = input<string>('');

  protected readonly dot = DOT;
  protected readonly border = BORDER;
  protected readonly icon = ICON;

  protected readonly containerClass = computed(() => POSITIONS[this.position()]);

  protected readonly itemAnim = computed(() => {
    const pos = this.position();
    if (pos.endsWith('-left')) return 'animate-nw-slide-in-left';
    if (pos.endsWith('-right')) return 'animate-nw-slide-in-right';
    return pos.startsWith('top') ? 'animate-nw-slide-down' : 'animate-nw-slide-up';
  });

  protected readonly visible = computed<NwToastMessage[]>(() => {
    const k = this.key();
    return this.service.messages().filter((m) => (m.key ?? '') === k);
  });
}
