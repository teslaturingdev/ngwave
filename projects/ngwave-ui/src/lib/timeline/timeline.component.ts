import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NwIconComponent, NwIconName } from '../icon';

export type NwTimelineAlign = 'left' | 'right' | 'alternate';

export interface NwTimelineEvent {
  content?: string;
  date?: string;
  icon?: NwIconName;
  /** CSS color for the marker (e.g. a hex value or `var(--nw-600)`). */
  color?: string;
}

/**
 * A vertical sequence of dated events, each with a marker and connecting
 * line — activity feeds, order status, changelogs.
 */
@Component({
  selector: 'nw-timeline',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  imports: [NwIconComponent],
  template: `
    <ol class="relative">
      @for (event of value(); track $index; let last = $last, let i = $index) {
        <li
          class="relative flex gap-4"
          [class.pb-6]="!last"
          [class]="align() === 'alternate' && i % 2 === 1 ? 'flex-row-reverse text-right' : ''"
        >
          <div class="flex flex-col items-center">
            <span
              class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white shadow-nw-sm ring-4 ring-surface-0"
              [style.background]="event.color || 'var(--nw-600)'"
            >
              @if (event.icon) {
                <nw-icon [name]="event.icon" [size]="13" />
              }
            </span>
            @if (!last) {
              <span class="w-px flex-1 bg-surface-200"></span>
            }
          </div>
          <div class="min-w-0 flex-1 pb-2 pt-0.5">
            @if (event.date) {
              <div class="text-xs font-medium text-surface-400">{{ event.date }}</div>
            }
            @if (event.content) {
              <div class="mt-0.5 text-sm text-surface-700">{{ event.content }}</div>
            }
          </div>
        </li>
      }
    </ol>
  `,
})
export class NwTimelineComponent {
  readonly value = input<NwTimelineEvent[]>([]);
  readonly align = input<NwTimelineAlign>('left');
}
