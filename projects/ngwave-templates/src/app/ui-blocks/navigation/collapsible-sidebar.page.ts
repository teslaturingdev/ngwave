import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NwAvatarComponent } from '@ngwave/ui';

interface NavItem {
  icon: string;
  label: string;
  active?: boolean;
  badge?: string;
}

@Component({
  selector: 'app-collapsible-sidebar-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NwAvatarComponent],
  template: `
    <div class="flex min-h-full bg-surface-50">
      <aside
        class="flex flex-col border-r border-surface-200 bg-surface-0 py-4 transition-[width] duration-200 ease-nw"
        [class]="collapsed() ? 'w-[72px]' : 'w-64'"
      >
        <div class="flex items-center gap-2 px-4" [class.justify-center]="collapsed()">
          <span
            class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-nw bg-nw-600 text-sm font-bold text-white"
            >N</span
          >
          @if (!collapsed()) {
            <span class="text-sm font-semibold text-surface-900">NgWave</span>
          }
        </div>

        <nav class="mt-6 flex-1 space-y-1 px-3">
          @for (item of items; track item.label) {
            <button
              type="button"
              class="flex w-full items-center gap-3 rounded-nw px-2.5 py-2 text-sm font-medium transition-colors"
              [class]="
                item.active
                  ? 'bg-nw-50 text-nw-700'
                  : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
              "
              [class.justify-center]="collapsed()"
              [attr.title]="collapsed() ? item.label : null"
            >
              <span class="w-5 shrink-0 text-center text-base">{{ item.icon }}</span>
              @if (!collapsed()) {
                <span class="flex-1 text-left truncate">{{ item.label }}</span>
                @if (item.badge) {
                  <span
                    class="rounded-full bg-nw-600 px-1.5 py-0.5 text-[10px] font-semibold text-white"
                    >{{ item.badge }}</span
                  >
                }
              }
            </button>
          }
        </nav>

        <div class="border-t border-surface-100 px-3 pt-3">
          <button
            type="button"
            (click)="collapsed.set(!collapsed())"
            class="flex w-full items-center gap-3 rounded-nw px-2.5 py-2 text-sm text-surface-500 hover:bg-surface-50"
            [class.justify-center]="collapsed()"
          >
            <span class="w-5 text-center">{{ collapsed() ? '»' : '«' }}</span>
            @if (!collapsed()) {
              <span>Collapse</span>
            }
          </button>
          <div
            class="mt-2 flex items-center gap-2 rounded-nw px-1 py-2"
            [class.justify-center]="collapsed()"
          >
            <nw-avatar label="AK" size="normal" />
            @if (!collapsed()) {
              <div class="min-w-0">
                <p class="truncate text-xs font-medium text-surface-900">Aisha Khan</p>
                <p class="truncate text-[11px] text-surface-500">Admin</p>
              </div>
            }
          </div>
        </div>
      </aside>

      <main class="flex-1 p-8">
        <h1 class="text-lg font-semibold text-surface-900">Dashboard</h1>
        <p class="mt-1 text-sm text-surface-500">
          Toggle the collapse button in the sidebar footer to preview both states.
        </p>
        <div class="mt-6 h-40 rounded-nw-lg border border-dashed border-surface-200"></div>
      </main>
    </div>
  `,
})
export class CollapsibleSidebarBlockPageComponent {
  protected readonly collapsed = signal(false);

  protected readonly items: NavItem[] = [
    { icon: '⌂', label: 'Overview', active: true },
    { icon: '📊', label: 'Analytics' },
    { icon: '👥', label: 'Team' },
    { icon: '📁', label: 'Projects', badge: '12' },
    { icon: '💬', label: 'Messages', badge: '3' },
    { icon: '⚙', label: 'Settings' },
  ];
}
