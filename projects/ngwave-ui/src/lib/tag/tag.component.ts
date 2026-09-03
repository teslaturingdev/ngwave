import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type NwTagSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

const SEVERITY: Record<NwTagSeverity, string> = {
  success: 'bg-green-100 text-green-700',
  info: 'bg-sky-100 text-sky-700',
  warn: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  secondary: 'bg-surface-100 text-surface-700',
  contrast: 'bg-surface-900 text-surface-0',
};

@Component({
  selector: 'nw-tag',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex' },
  template: `
    <span
      class="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium leading-5"
      [class]="classes()"
    >
      @if (icon()) {
        <span [class]="icon()" aria-hidden="true"></span>
      }
      @if (value()) {
        {{ value() }}
      } @else {
        <ng-content />
      }
    </span>
  `,
})
export class NwTagComponent {
  readonly value = input('');
  readonly severity = input<NwTagSeverity>('secondary');
  readonly icon = input('');
  readonly rounded = input(false);

  protected readonly classes = computed(
    () =>
      `${SEVERITY[this.severity()]} ${this.rounded() ? 'rounded-full' : 'rounded-nw'}`,
  );
}
