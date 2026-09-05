import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NwAvatarComponent, NwIconComponent, NwIconName } from '@ngwave/ui';

interface NavItem {
  label: string;
  icon: NwIconName;
  path?: string;
}

@Component({
  selector: 'app-admin-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, NwAvatarComponent, NwIconComponent],
  template: `
    <div class="min-h-full flex bg-surface-50">
      <!-- Sidebar -->
      <aside class="w-60 shrink-0 bg-surface-900 text-surface-0 flex flex-col">
        <div class="h-16 flex items-center gap-2 px-5 border-b border-white/10">
          <svg width="22" height="22" viewBox="0 0 40 40" aria-hidden="true" class="shrink-0">
            <path d="M17 10 L7 20 L17 30" stroke="rgb(129 140 248)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            <path d="M23 10 L33 20 L23 30" stroke="rgb(199 210 254)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
          </svg>
          <span class="font-semibold">Northwind</span>
        </div>
        <nav class="flex-1 px-3 py-4 space-y-1 text-sm">
          @for (item of navItems; track item.label) {
            @if (item.path) {
              <a
                [routerLink]="item.path"
                routerLinkActive="bg-white/10 text-white font-medium"
                class="flex items-center gap-2.5 px-3 py-2 rounded-nw text-white/60 hover:bg-white/5 hover:text-white/90"
              >
                <nw-icon [name]="item.icon" [size]="16" />
                {{ item.label }}
              </a>
            } @else {
              <a
                href="javascript:void(0)"
                class="flex items-center gap-2.5 px-3 py-2 rounded-nw text-white/60 hover:bg-white/5 hover:text-white/90"
              >
                <nw-icon [name]="item.icon" [size]="16" />
                {{ item.label }}
              </a>
            }
          }
        </nav>
        <div class="p-3 border-t border-white/10 flex items-center gap-2.5">
          <nw-avatar label="SP" size="normal" />
          <div class="min-w-0">
            <p class="text-sm font-medium truncate">Saravanan P.</p>
            <p class="text-xs text-white/50 truncate">Admin</p>
          </div>
        </div>
      </aside>

      <!-- Main -->
      <div class="flex-1 min-w-0 flex flex-col">
        <!-- Topbar -->
        <header class="h-16 shrink-0 flex items-center justify-between px-6 bg-surface-0 border-b border-surface-200">
          <div>
            <h1 class="font-semibold text-surface-900">{{ pageTitle() }}</h1>
            <p class="text-xs text-surface-500">{{ pageSubtitle() }}</p>
          </div>
          <div class="flex items-center gap-3">
            <div class="hidden sm:flex items-center h-9 w-56 px-3 rounded-nw border border-surface-200 bg-surface-50 text-sm text-surface-400">
              Search…
            </div>
            <button
              type="button"
              class="relative h-9 w-9 rounded-nw border border-surface-200 flex items-center justify-center text-surface-500 hover:bg-surface-100"
              aria-label="Notifications"
            >
              <nw-icon name="bell" [size]="18" />
              <span class="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-red-500"></span>
            </button>
            <nw-avatar label="SP" size="normal" />
          </div>
        </header>

        <!-- Content -->
        <main class="flex-1 overflow-auto p-6">
          <ng-content />
        </main>
      </div>
    </div>
  `,
})
export class AdminShellComponent {
  readonly pageTitle = input('Dashboard');
  readonly pageSubtitle = input('');

  protected readonly navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'layout-dashboard', path: '/admin-dashboard' },
    { label: 'Users', icon: 'users', path: '/admin-users' },
    { label: 'Files', icon: 'folder', path: '/admin-files' },
    { label: 'Analytics', icon: 'bar-chart' },
    { label: 'Settings', icon: 'settings' },
  ];
}
