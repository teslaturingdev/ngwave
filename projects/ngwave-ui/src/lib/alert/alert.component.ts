import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

export type NwAlertSeverity = 'success' | 'info' | 'warn' | 'danger';

const CONTAINER: Record<NwAlertSeverity, string> = {
  success: 'bg-green-50 border-green-200 text-green-800',
  info: 'bg-sky-50 border-sky-200 text-sky-800',
  warn: 'bg-amber-50 border-amber-200 text-amber-800',
  danger: 'bg-red-50 border-red-200 text-red-800',
};

const ICON_COLOR: Record<NwAlertSeverity, string> = {
  success: 'text-green-500',
  info: 'text-sky-500',
  warn: 'text-amber-500',
  danger: 'text-red-500',
};

const ICON: Record<NwAlertSeverity, string> = {
  success: '✓',
  info: 'ℹ',
  warn: '⚠',
  danger: '✕',
};

@Component({
  selector: 'nw-alert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    @if (visible()) {
      <div role="alert" class="flex items-start gap-3 rounded-nw border p-3.5 text-sm" [class]="CONTAINER[severity()]">
        <span class="mt-0.5 shrink-0" [class]="ICON_COLOR[severity()]" aria-hidden="true">{{
          ICON[severity()]
        }}</span>
        <div class="flex-1 min-w-0">
          @if (heading()) {
            <p class="font-medium">{{ heading() }}</p>
          }
          <div [class.mt-1]="heading()">
            <ng-content />
          </div>
        </div>
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
export class NwAlertComponent {
  readonly severity = input<NwAlertSeverity>('info');
  readonly heading = input('');
  readonly closable = input(false);

  readonly closed = output<void>();

  protected readonly visible = signal(true);
  protected readonly CONTAINER = CONTAINER;
  protected readonly ICON_COLOR = ICON_COLOR;
  protected readonly ICON = ICON;

  protected close(): void {
    this.visible.set(false);
    this.closed.emit();
  }
}
