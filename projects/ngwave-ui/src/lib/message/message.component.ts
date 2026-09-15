import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';

export type NwMessageSeverity = 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast';

const CONTAINER: Record<NwMessageSeverity, string> = {
  success: 'bg-green-50 text-green-800',
  info: 'bg-sky-50 text-sky-800',
  warn: 'bg-amber-50 text-amber-800',
  error: 'bg-red-50 text-red-800',
  secondary: 'bg-surface-100 text-surface-700',
  contrast: 'bg-surface-900 text-surface-0',
};

const ICON_COLOR: Record<NwMessageSeverity, string> = {
  success: 'text-green-500',
  info: 'text-sky-500',
  warn: 'text-amber-500',
  error: 'text-red-500',
  secondary: 'text-surface-500',
  contrast: 'text-surface-0',
};

const ICON: Record<NwMessageSeverity, string> = {
  success: '✓',
  info: 'ℹ',
  warn: '⚠',
  error: '✕',
  secondary: '•',
  contrast: '•',
};

/**
 * A lightweight, single-line inline status message — e.g. form field
 * validation feedback. Unlike nw-alert (a bordered block callout) or
 * nw-toast (a transient, auto-dismissing overlay notification), nw-message
 * stays inline in the document flow next to the thing it describes.
 */
@Component({
  selector: 'nw-message',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-block' },
  template: `
    @if (visible()) {
      <div
        role="alert"
        class="inline-flex items-center gap-1.5 rounded-nw px-2.5 py-1 text-sm"
        [class]="containerClasses()"
      >
        <span class="shrink-0" [class]="ICON_COLOR[severity()]" aria-hidden="true">{{
          ICON[severity()]
        }}</span>
        <span>{{ text() }}<ng-content /></span>
        @if (closable()) {
          <button
            type="button"
            (click)="close()"
            aria-label="Dismiss"
            class="shrink-0 opacity-60 hover:opacity-100"
          >
            ✕
          </button>
        }
      </div>
    }
  `,
})
export class NwMessageComponent {
  readonly severity = input<NwMessageSeverity>('info');
  readonly text = input('');
  readonly closable = input(false);
  readonly life = input<number | null>(null);

  readonly closed = output<void>();

  protected readonly visible = signal(true);
  protected readonly ICON = ICON;
  protected readonly ICON_COLOR = ICON_COLOR;
  protected readonly containerClasses = computed(() => CONTAINER[this.severity()]);

  private timeoutStarted = false;

  constructor() {
    effect(() => {
      const life = this.life();
      if (life && life > 0 && !this.timeoutStarted) {
        this.timeoutStarted = true;
        setTimeout(() => this.close(), life);
      }
    });
  }

  protected close(): void {
    this.visible.set(false);
    this.closed.emit();
  }
}
