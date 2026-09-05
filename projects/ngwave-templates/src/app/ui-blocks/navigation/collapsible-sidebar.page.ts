import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NwAvatarComponent, NwCardComponent, NwDividerComponent, NwTagComponent } from '@ngwave/ui';

interface NavItem {
  icon: string;
  label: string;
  active?: boolean;
  badge?: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

interface StatCard {
  label: string;
  value: string;
  delta: string;
  trend: 'up' | 'down';
}

const GROUPS: NavGroup[] = [
  {
    label: 'Main',
    items: [
      { icon: '⌂', label: 'Overview', active: true },
      { icon: '📊', label: 'Analytics' },
      { icon: '📁', label: 'Projects', badge: '12' },
    ],
  },
  {
    label: 'Workspace',
    items: [
      { icon: '👥', label: 'Team' },
      { icon: '💬', label: 'Messages', badge: '3' },
      { icon: '🔔', label: 'Notifications' },
    ],
  },
  {
    label: 'Preferences',
    items: [
      { icon: '⚙', label: 'Settings' },
      { icon: '❔', label: 'Help & support' },
    ],
  },
];

const STATS: StatCard[] = [
  { label: 'Active projects', value: '12', delta: '2 this week', trend: 'up' },
  { label: 'Open tasks', value: '48', delta: '6.1%', trend: 'down' },
  { label: 'Team members', value: '9', delta: '1 new', trend: 'up' },
];

@Component({
  selector: 'app-collapsible-sidebar-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NwAvatarComponent, NwCardComponent, NwDividerComponent, NwTagComponent],
  template: `
    <div class="flex flex-col min-h-full bg-surface-50">
    <div class="border-b border-surface-200 bg-surface-0 px-6 py-2">
      <a routerLink="/ui-blocks" class="text-sm text-surface-500 hover:text-surface-900">← All UI Blocks</a>
    </div>
    <div class="flex flex-1 min-h-0">
      <aside
        class="flex flex-col border-r border-surface-200 bg-surface-0 py-4 transition-[width] duration-200 ease-nw"
        [class]="collapsed() ? 'w-[76px]' : 'w-64'"
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

        <nav class="mt-6 flex-1 space-y-5 px-3 overflow-y-auto">
          @for (group of groups; track group.label) {
            <div>
              @if (!collapsed()) {
                <p class="px-2.5 pb-1.5 text-[11px] font-semibold uppercase tracking-wide text-surface-400">
                  {{ group.label }}
                </p>
              }
              <div class="space-y-0.5">
                @for (item of group.items; track item.label) {
                  <button
                    type="button"
                    class="relative flex w-full items-center gap-3 rounded-nw px-2.5 py-2 text-sm font-medium transition-colors"
                    [class]="
                      item.active
                        ? 'bg-nw-50 text-nw-700'
                        : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
                    "
                    [class.justify-center]="collapsed()"
                    [attr.title]="collapsed() ? item.label : null"
                  >
                    @if (item.active) {
                      <span class="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-nw-600"></span>
                    }
                    <span class="w-5 shrink-0 text-center text-base">{{ item.icon }}</span>
                    @if (!collapsed()) {
                      <span class="flex-1 text-left truncate">{{ item.label }}</span>
                      @if (item.badge) {
                        <span
                          class="rounded-full bg-nw-600 px-1.5 py-0.5 text-[10px] font-semibold text-white"
                          >{{ item.badge }}</span
                        >
                      }
                    } @else if (item.badge) {
                      <span
                        class="absolute top-1 right-1.5 h-1.5 w-1.5 rounded-full bg-nw-600"
                      ></span>
                    }
                  </button>
                }
              </div>
            </div>
          }
        </nav>

        <div class="px-3">
          <nw-divider />
        </div>

        <div class="px-3">
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

      <main class="flex-1 overflow-y-auto p-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-lg font-semibold text-surface-900">Overview</h1>
            <p class="mt-1 text-sm text-surface-500">
              Toggle "Collapse" in the sidebar footer — labels hide and only icons remain.
            </p>
          </div>
          <nw-tag value="Icon-only when collapsed" severity="info" [rounded]="true" />
        </div>

        <div class="mt-6 grid gap-4 sm:grid-cols-3">
          @for (s of stats; track s.label) {
            <div class="rounded-nw-lg border border-surface-200 bg-surface-0 p-4">
              <p class="text-xs font-medium uppercase tracking-wide text-surface-400">{{ s.label }}</p>
              <p class="mt-1.5 text-2xl font-bold text-surface-900">{{ s.value }}</p>
              <p class="mt-1 text-xs font-medium" [class]="s.trend === 'up' ? 'text-green-600' : 'text-red-600'">
                {{ s.trend === 'up' ? '↗' : '↘' }} {{ s.delta }}
              </p>
            </div>
          }
        </div>

        <nw-card header="Recent projects" class="mt-6 block">
          <div class="divide-y divide-surface-100">
            @for (p of projects; track p.name) {
              <div class="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div class="flex items-center gap-3">
                  <span
                    class="inline-flex h-8 w-8 items-center justify-center rounded-nw bg-nw-50 text-nw-600 text-sm"
                    >{{ p.icon }}</span
                  >
                  <p class="text-sm font-medium text-surface-900">{{ p.name }}</p>
                </div>
                <nw-tag [value]="p.status" [severity]="p.status === 'On track' ? 'success' : 'warn'" [rounded]="true" />
              </div>
            }
          </div>
        </nw-card>
      </main>
    </div>
    </div>
  `,
})
export class CollapsibleSidebarBlockPageComponent {
  protected readonly collapsed = signal(false);
  protected readonly groups = GROUPS;
  protected readonly stats = STATS;

  protected readonly projects = [
    { icon: '📈', name: 'Q3 Growth Strategy', status: 'On track' },
    { icon: '🎨', name: 'Design System v2', status: 'At risk' },
    { icon: '🔌', name: 'API Migration', status: 'On track' },
  ];
}
