import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { NwOverlayPanelComponent } from '@ngwave/ui';
import { BlockPreviewShellComponent } from '../block-preview-shell.component';

interface NotificationItem {
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  time: string;
}

@Component({
  selector: 'app-notification-panel-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BlockPreviewShellComponent, NwOverlayPanelComponent],
  template: `
    <app-block-preview-shell title="Notification Dropdown Panel" maxWidth="max-w-sm">
      <div class="flex justify-center">
        <button
          type="button"
          (click)="panel().toggle($event)"
          class="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-surface-200 bg-surface-0 text-lg text-surface-600 hover:bg-surface-50"
          aria-label="Notifications"
        >
          🔔
          <span
            class="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-surface-0"
          ></span>
        </button>
      </div>

      <nw-overlay-panel>
        <div class="w-80">
          <div class="flex items-center justify-between px-1 pb-3">
            <h3 class="font-semibold text-surface-900">Notifications</h3>
            <button type="button" class="text-xs font-medium text-nw-600 hover:text-nw-700">
              Mark all read
            </button>
          </div>

          <div class="grid grid-cols-3 gap-2 pb-3">
            <div class="rounded-nw bg-surface-50 py-2 text-center">
              <p class="text-sm font-bold text-surface-900">7</p>
              <p class="text-[11px] text-surface-500">Today</p>
            </div>
            <div class="rounded-nw bg-surface-50 py-2 text-center">
              <p class="text-sm font-bold text-surface-900">23</p>
              <p class="text-[11px] text-surface-500">This week</p>
            </div>
            <div class="rounded-nw bg-surface-50 py-2 text-center">
              <p class="text-sm font-bold text-surface-900">3</p>
              <p class="text-[11px] text-surface-500">Approvals</p>
            </div>
          </div>

          <div class="max-h-80 overflow-y-auto -mx-1">
            @for (n of notifications; track n.title) {
              <div class="flex gap-3 rounded-nw px-1 py-2.5 hover:bg-surface-50">
                <span
                  class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm"
                  [class]="n.iconBg + ' ' + n.iconColor"
                  >{{ n.icon }}</span
                >
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-medium text-surface-900">{{ n.title }}</p>
                  <p class="text-xs text-surface-500 line-clamp-1">{{ n.description }}</p>
                </div>
                <span class="shrink-0 text-[11px] text-surface-400">{{ n.time }}</span>
              </div>
            }
          </div>

          <div class="mt-2 border-t border-surface-100 pt-3 text-center">
            <button type="button" class="text-sm font-medium text-nw-600 hover:text-nw-700">
              Open notification center →
            </button>
          </div>
        </div>
      </nw-overlay-panel>

      <p class="mt-6 text-center text-sm text-surface-400">Click the bell to preview the panel</p>
    </app-block-preview-shell>
  `,
})
export class NotificationPanelBlockPageComponent {
  protected readonly panel = viewChild.required(NwOverlayPanelComponent);

  protected readonly notifications: NotificationItem[] = [
    { icon: '✓', iconBg: 'bg-green-100', iconColor: 'text-green-700', title: 'Deployment succeeded', description: 'ngwave-templates was deployed to production.', time: '2m' },
    { icon: '💬', iconBg: 'bg-sky-100', iconColor: 'text-sky-700', title: 'New comment', description: 'Aisha commented on "Q3 roadmap review".', time: '18m' },
    { icon: '⚠', iconBg: 'bg-amber-100', iconColor: 'text-amber-700', title: 'Approval needed', description: 'A refund request is waiting on your review.', time: '1h' },
    { icon: '👥', iconBg: 'bg-nw-100', iconColor: 'text-nw-700', title: 'Team invite accepted', description: 'Marcus joined the Design workspace.', time: '3h' },
    { icon: '📦', iconBg: 'bg-surface-100', iconColor: 'text-surface-600', title: 'Weekly report ready', description: 'Your analytics summary for last week is ready.', time: '1d' },
  ];
}
