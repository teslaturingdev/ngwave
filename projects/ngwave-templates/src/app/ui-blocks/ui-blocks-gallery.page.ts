import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NwIconComponent, NwIconName } from '@ngwave/ui';

interface BlockEntry {
  slug: string;
  title: string;
  description: string;
  icon: NwIconName;
}

interface BlockCategory {
  name: string;
  blocks: BlockEntry[];
}

@Component({
  selector: 'app-ui-blocks-gallery',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NwIconComponent],
  template: `
    <div class="min-h-full flex flex-col bg-surface-0">
      <header
        class="sticky top-0 z-10 flex items-center justify-between px-6 h-14 border-b border-surface-200 bg-surface-0/90 backdrop-blur"
      >
        <div class="flex items-center gap-2">
          <a routerLink="/" class="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 40 40" aria-hidden="true" class="shrink-0">
              <path
                d="M17 10 L7 20 L17 30"
                style="stroke: rgb(var(--nw-600))"
                stroke-width="4.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                fill="none"
              />
              <path
                d="M23 10 L33 20 L23 30"
                style="stroke: rgb(var(--nw-400))"
                stroke-width="4.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                fill="none"
              />
            </svg>
            <span class="font-semibold text-surface-900">NgWave Templates</span>
          </a>
        </div>
        <a routerLink="/" class="inline-flex items-center gap-1.5 text-sm text-surface-600 hover:text-surface-900">
          <nw-icon name="arrow-left" [size]="15" />
          All templates
        </a>
      </header>

      <section class="border-b border-surface-200 bg-surface-50">
        <div class="max-w-6xl mx-auto px-6 pt-16 pb-14 text-center">
          <span
            class="inline-flex items-center gap-1.5 rounded-full bg-nw-50 text-nw-700 text-xs font-medium px-3 py-1 ring-1 ring-nw-100"
          >
            <nw-icon name="sparkles" [size]="13" />
            {{ totalBlocks() }} ready-to-use blocks
          </span>
          <h1 class="mt-5 text-4xl sm:text-5xl font-bold tracking-tight text-surface-900">
            UI Blocks for admin panels and forms
          </h1>
          <p class="mt-4 text-lg text-surface-600 max-w-2xl mx-auto">
            Copy-paste sections built entirely from @ngwave/ui — login screens,
            dashboards widgets, search, settings, and more.
          </p>
        </div>
      </section>

      <main class="flex-1 max-w-6xl w-full mx-auto px-6 py-14">
        @for (cat of categories; track cat.name) {
          <div class="mb-14">
            <h2 class="text-lg font-semibold text-surface-900 mb-5">{{ cat.name }}</h2>
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              @for (b of cat.blocks; track b.slug) {
                <a
                  [routerLink]="'/ui-blocks/' + b.slug"
                  class="group flex items-start gap-3.5 rounded-nw-lg border border-surface-200 bg-surface-0 p-4 shadow-nw-sm hover:shadow-nw-lg hover:-translate-y-0.5 transition-all"
                >
                  <span
                    class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-nw bg-nw-50 text-nw-600"
                  >
                    <nw-icon [name]="b.icon" [size]="19" />
                  </span>
                  <div class="min-w-0">
                    <h3 class="font-medium text-surface-900 group-hover:text-nw-600 transition-colors">
                      {{ b.title }}
                    </h3>
                    <p class="mt-0.5 text-sm text-surface-500">{{ b.description }}</p>
                  </div>
                </a>
              }
            </div>
          </div>
        }
      </main>

      <footer class="border-t border-surface-200 px-6 py-6 text-center text-xs text-surface-400">
        Built entirely with
        <a href="https://ngwave.dev" class="underline hover:text-surface-600">@ngwave/ui</a>.
      </footer>
    </div>
  `,
})
export class UiBlocksGalleryPageComponent {
  protected readonly categories: BlockCategory[] = [
    {
      name: 'Auth & Access',
      blocks: [
        { slug: 'login', title: 'Login', description: 'Sign-in form with remember me.', icon: 'key' },
        { slug: 'signup', title: 'Signup', description: 'Registration with password strength.', icon: 'edit' },
        { slug: 'forgot-password', title: 'Forgot Password', description: 'Email-based reset request.', icon: 'mail' },
        { slug: 'reset-password', title: 'Reset Password', description: 'New password + confirmation.', icon: 'lock' },
        { slug: 'otp-verification', title: 'OTP Verification', description: 'Six-digit code confirmation.', icon: 'hash' },
      ],
    },
    {
      name: 'Errors & Empty States',
      blocks: [
        { slug: '404', title: '404 Page', description: 'Page not found screen.', icon: 'alert-triangle' },
        { slug: 'maintenance', title: 'Maintenance Page', description: 'Scheduled downtime notice.', icon: 'wrench' },
        { slug: 'empty-state', title: 'Empty State', description: 'No data placeholder pattern.', icon: 'circle-dashed' },
      ],
    },
    {
      name: 'Dashboard Widgets',
      blocks: [
        { slug: 'stat-cards', title: 'Stat Cards Row', description: 'KPI metrics with trend badges.', icon: 'bar-chart' },
        { slug: 'notification-panel', title: 'Notification Panel', description: 'Dropdown notification center.', icon: 'bell' },
        { slug: 'activity-timeline', title: 'Activity Timeline', description: 'Vertical event feed.', icon: 'clock' },
        { slug: 'onboarding-checklist', title: 'Onboarding Checklist', description: 'Setup progress widget.', icon: 'list-checks' },
        { slug: 'team-members-grid', title: 'Team Members Grid', description: 'Avatar-based member cards.', icon: 'users' },
      ],
    },
    {
      name: 'Search',
      blocks: [
        { slug: 'search-autocomplete', title: 'Search with Filters', description: 'Autocomplete + advanced filters.', icon: 'search' },
        { slug: 'search-results', title: 'Search Results Page', description: 'Full results page with facets.', icon: 'file-text' },
      ],
    },
    {
      name: 'Navigation',
      blocks: [
        { slug: 'profile-dropdown', title: 'Profile Dropdown', description: 'Account menu from the navbar.', icon: 'chevron-down' },
        { slug: 'collapsible-sidebar', title: 'Collapsible Sidebar', description: 'Icon-only collapse toggle.', icon: 'layout-dashboard' },
        { slug: 'command-palette', title: 'Command Palette', description: 'Cmd+K quick launcher.', icon: 'command' },
        { slug: 'table-toolbar', title: 'Table Toolbar', description: 'Search, filters & bulk actions.', icon: 'table' },
      ],
    },
    {
      name: 'Pricing',
      blocks: [
        { slug: 'pricing-section', title: 'Pricing Plan Section', description: 'Standalone tiered pricing block.', icon: 'dollar-sign' },
      ],
    },
    {
      name: 'Modals',
      blocks: [
        { slug: 'invite-member-modal', title: 'Invite Member Modal', description: 'Add-a-teammate dialog.', icon: 'plus' },
        { slug: 'delete-confirmation', title: 'Delete Confirmation', description: 'Destructive action guard.', icon: 'trash' },
      ],
    },
    {
      name: 'Settings',
      blocks: [
        { slug: 'settings-page', title: 'Settings Page Layout', description: 'Tabbed settings sections.', icon: 'settings' },
      ],
    },
  ];

  protected totalBlocks(): number {
    return this.categories.reduce((sum, c) => sum + c.blocks.length, 0);
  }
}
