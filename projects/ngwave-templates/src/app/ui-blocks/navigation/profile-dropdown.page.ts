import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NwAvatarComponent, NwCardComponent, NwOverlayPanelComponent, NwTagComponent } from '@ngwave/ui';

interface MenuLink {
  icon: string;
  label: string;
  danger?: boolean;
}

interface StatCard {
  label: string;
  value: string;
  delta: string;
  trend: 'up' | 'down';
}

const NAV_LINKS = ['Dashboard', 'Projects', 'Team', 'Reports'];
const STATS: StatCard[] = [
  { label: 'Revenue', value: '$94.2K', delta: '9.4%', trend: 'up' },
  { label: 'Active users', value: '1,284', delta: '6.1%', trend: 'up' },
  { label: 'Churn', value: '2.1%', delta: '0.4%', trend: 'down' },
];

@Component({
  selector: 'app-profile-dropdown-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NwAvatarComponent, NwCardComponent, NwOverlayPanelComponent, NwTagComponent],
  template: `
    <div class="min-h-full bg-surface-50">
      <div class="border-b border-surface-100 bg-surface-0 px-6 py-2">
        <a routerLink="/ui-blocks" class="text-sm text-surface-500 hover:text-surface-900">← All UI Blocks</a>
      </div>
      <header class="flex items-center gap-6 border-b border-surface-200 bg-surface-0 px-6 h-16">
        <div class="flex items-center gap-2 shrink-0">
          <span
            class="inline-flex h-8 w-8 items-center justify-center rounded-nw bg-nw-600 text-sm font-bold text-white"
            >N</span
          >
          <span class="font-semibold text-surface-900">Workspace</span>
        </div>

        <nav class="hidden md:flex items-center gap-1">
          @for (link of navLinks; track link; let first = $first) {
            <a
              href="javascript:void(0)"
              class="rounded-nw px-3 py-1.5 text-sm font-medium"
              [class]="first ? 'bg-nw-50 text-nw-700' : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'"
              >{{ link }}</a
            >
          }
        </nav>

        <div class="ml-auto flex items-center gap-3">
          <button
            type="button"
            class="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-surface-500 hover:bg-surface-100"
            aria-label="Notifications"
          >
            🔔
            <span class="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-red-500"></span>
          </button>

          <button
            type="button"
            (click)="panel().toggle($event)"
            class="flex items-center gap-2 rounded-nw py-1 pl-1 pr-2 hover:bg-surface-100"
          >
            <nw-avatar label="AK" size="normal" />
            <span class="hidden sm:inline text-sm font-medium text-surface-900">Aisha Khan</span>
            <span class="text-xs text-surface-400">▾</span>
          </button>
        </div>
      </header>

      <nw-overlay-panel>
        <div class="w-64">
          <div class="flex items-center gap-3 border-b border-surface-100 pb-3">
            <nw-avatar label="AK" size="large" />
            <div class="min-w-0">
              <p class="truncate text-sm font-semibold text-surface-900">Aisha Khan</p>
              <p class="truncate text-xs text-surface-500">aisha&#64;ngwave.dev</p>
            </div>
          </div>

          <div class="flex items-center justify-between py-3 border-b border-surface-100">
            <span class="text-xs text-surface-500">Current plan</span>
            <nw-tag value="Team" severity="info" [rounded]="true" />
          </div>

          <nav class="py-2">
            @for (link of links; track link.label) {
              <button
                type="button"
                class="flex w-full items-center gap-3 rounded-nw px-2 py-2 text-left text-sm hover:bg-surface-50"
                [class]="link.danger ? 'text-red-600' : 'text-surface-700'"
              >
                <span class="w-4 text-center">{{ link.icon }}</span>
                {{ link.label }}
              </button>
            }
          </nav>
        </div>
      </nw-overlay-panel>

      <main class="max-w-5xl mx-auto px-6 py-10">
        <h1 class="text-lg font-semibold text-surface-900">Dashboard</h1>
        <p class="mt-1 text-sm text-surface-500">Click the profile button top-right to preview the dropdown.</p>

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

        <nw-card header="Team activity" class="mt-6 block">
          <div class="divide-y divide-surface-100">
            @for (a of activity; track a.text) {
              <div class="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <nw-avatar [label]="a.initials" size="normal" />
                <p class="text-sm text-surface-700">{{ a.text }}</p>
                <span class="ml-auto text-xs text-surface-400">{{ a.time }}</span>
              </div>
            }
          </div>
        </nw-card>
      </main>
    </div>
  `,
})
export class ProfileDropdownBlockPageComponent {
  protected readonly panel = viewChild.required(NwOverlayPanelComponent);
  protected readonly navLinks = NAV_LINKS;
  protected readonly stats = STATS;

  protected readonly links: MenuLink[] = [
    { icon: '👤', label: 'Your profile' },
    { icon: '⚙', label: 'Settings' },
    { icon: '💳', label: 'Billing' },
    { icon: '❔', label: 'Help & support' },
    { icon: '⎋', label: 'Sign out', danger: true },
  ];

  protected readonly activity = [
    { initials: 'MC', text: 'Marcus Chen merged "Fix auth redirect loop"', time: '12m' },
    { initials: 'PN', text: 'Priya Nair commented on Q3 Growth Strategy', time: '1h' },
    { initials: 'DO', text: 'Daniel Ortiz deployed api-prod-2', time: '3h' },
  ];
}
