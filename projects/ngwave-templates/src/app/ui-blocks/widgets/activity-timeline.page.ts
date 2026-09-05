import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NwCardComponent, NwIconComponent, NwIconName } from '@ngwave/ui';
import { BlockPreviewShellComponent } from '../block-preview-shell.component';

interface TimelineEvent {
  icon: NwIconName;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  time: string;
}

@Component({
  selector: 'app-activity-timeline-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BlockPreviewShellComponent, NwCardComponent, NwIconComponent],
  template: `
    <app-block-preview-shell title="Activity Timeline" maxWidth="max-w-lg">
      <nw-card header="Recent activity">
        <ol class="relative">
          @for (e of events; track e.title; let last = $last) {
            <li class="relative flex gap-4 pb-8 last:pb-0">
              @if (!last) {
                <span class="absolute left-4 top-9 bottom-0 w-px bg-surface-200" aria-hidden="true"></span>
              }
              <span
                class="relative z-10 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-4 ring-surface-0"
                [class]="e.iconBg + ' ' + e.iconColor"
              >
                <nw-icon [name]="e.icon" [size]="15" />
              </span>
              <div class="flex-1 pt-0.5">
                <div class="flex items-center justify-between gap-3">
                  <p class="text-sm font-medium text-surface-900">{{ e.title }}</p>
                  <span class="shrink-0 text-xs text-surface-400">{{ e.time }}</span>
                </div>
                <p class="mt-0.5 text-sm text-surface-500">{{ e.description }}</p>
              </div>
            </li>
          }
        </ol>
      </nw-card>
    </app-block-preview-shell>
  `,
})
export class ActivityTimelineBlockPageComponent {
  protected readonly events: TimelineEvent[] = [
    { icon: 'check', iconBg: 'bg-green-100', iconColor: 'text-green-700', title: 'Invoice #1042 paid', description: 'Payment of $2,400 received from Northwind Traders.', time: '10:42 AM' },
    { icon: 'edit', iconBg: 'bg-sky-100', iconColor: 'text-sky-700', title: 'Proposal updated', description: 'Priya edited the "Q3 Expansion" proposal.', time: '9:15 AM' },
    { icon: 'user', iconBg: 'bg-nw-100', iconColor: 'text-nw-700', title: 'New team member', description: 'Daniel Ortiz joined the Growth team.', time: 'Yesterday' },
    { icon: 'alert-triangle', iconBg: 'bg-amber-100', iconColor: 'text-amber-700', title: 'Server warning', description: 'CPU usage crossed 85% on api-prod-2.', time: 'Yesterday' },
    { icon: 'layout-dashboard', iconBg: 'bg-surface-100', iconColor: 'text-surface-600', title: 'Sprint 14 started', description: 'A new two-week sprint cycle has begun.', time: 'Mon' },
  ];
}
