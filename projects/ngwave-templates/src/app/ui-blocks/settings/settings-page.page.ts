import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  NwAvatarComponent,
  NwButtonComponent,
  NwCardComponent,
  NwCheckboxComponent,
  NwInputTextComponent,
  NwTextareaComponent,
  NwToggleComponent,
} from '@ngwave/ui';

type SettingsTab = 'profile' | 'account' | 'notifications' | 'billing' | 'security';

interface TabItem {
  id: SettingsTab;
  label: string;
  icon: string;
}

const TABS: TabItem[] = [
  { id: 'profile', label: 'Profile', icon: '👤' },
  { id: 'account', label: 'Account', icon: '⚙' },
  { id: 'notifications', label: 'Notifications', icon: '🔔' },
  { id: 'billing', label: 'Billing', icon: '💳' },
  { id: 'security', label: 'Security', icon: '🔒' },
];

@Component({
  selector: 'app-settings-page-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    NwAvatarComponent,
    NwButtonComponent,
    NwCardComponent,
    NwCheckboxComponent,
    NwInputTextComponent,
    NwTextareaComponent,
    NwToggleComponent,
  ],
  template: `
    <div class="min-h-full bg-surface-50">
      <header class="border-b border-surface-200 bg-surface-0 px-6 py-4">
        <a routerLink="/ui-blocks" class="text-sm text-surface-500 hover:text-surface-900">← All UI Blocks</a>
        <h1 class="mt-2 text-xl font-semibold text-surface-900">Settings</h1>
      </header>

      <div class="mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8 px-6 py-8">
        <nav class="space-y-1">
          @for (tab of tabs; track tab.id) {
            <button
              type="button"
              (click)="activeTab.set(tab.id)"
              class="flex w-full items-center gap-3 rounded-nw px-3 py-2 text-sm font-medium transition-colors"
              [class]="
                activeTab() === tab.id
                  ? 'bg-nw-50 text-nw-700'
                  : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
              "
            >
              <span class="w-5 text-center">{{ tab.icon }}</span>
              {{ tab.label }}
            </button>
          }
        </nav>

        <div>
          @switch (activeTab()) {
            @case ('profile') {
              <nw-card header="Profile">
                <div class="flex items-center gap-4">
                  <nw-avatar label="AK" size="xlarge" />
                  <div>
                    <nw-button variant="secondary" size="small" label="Change photo" />
                    <p class="mt-1.5 text-xs text-surface-400">JPG, PNG. Max 2MB.</p>
                  </div>
                </div>

                <div class="mt-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-surface-700">Full name</label>
                    <nw-input-text [(value)]="fullName" [fluid]="true" />
                  </div>
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-surface-700">Email</label>
                    <nw-input-text [(value)]="email" type="email" [fluid]="true" />
                  </div>
                </div>

                <div class="mt-4">
                  <label class="mb-1.5 block text-sm font-medium text-surface-700">Bio</label>
                  <nw-textarea [(value)]="bio" [rows]="3" [fluid]="true" placeholder="Tell us about yourself…" />
                </div>

                <div class="mt-6 flex justify-end">
                  <nw-button variant="primary" label="Save changes" />
                </div>
              </nw-card>
            }
            @case ('notifications') {
              <nw-card header="Notification preferences">
                <div class="divide-y divide-surface-100">
                  @for (n of notificationRows; track n.label) {
                    <div class="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                      <div>
                        <p class="text-sm font-medium text-surface-900">{{ n.label }}</p>
                        <p class="text-xs text-surface-500">{{ n.description }}</p>
                      </div>
                      <nw-toggle [checked]="n.enabled" />
                    </div>
                  }
                </div>
              </nw-card>
            }
            @case ('billing') {
              <nw-card header="Billing">
                <div class="flex items-center justify-between rounded-nw-lg border border-surface-200 p-4">
                  <div>
                    <p class="text-sm font-semibold text-surface-900">Team plan</p>
                    <p class="text-xs text-surface-500">&#36;49 / month · Renews Oct 12, 2026</p>
                  </div>
                  <nw-button variant="secondary" size="small" label="Manage plan" />
                </div>
                <div class="mt-4 flex items-center justify-between rounded-nw-lg border border-surface-200 p-4">
                  <div class="flex items-center gap-3">
                    <span class="text-lg">💳</span>
                    <p class="text-sm text-surface-700">Visa ending in 4242</p>
                  </div>
                  <nw-button variant="text" size="small" label="Update" />
                </div>
              </nw-card>
            }
            @case ('security') {
              <nw-card header="Security">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-surface-700">Current password</label>
                  <nw-input-text type="password" [fluid]="true" />
                </div>
                <div class="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-surface-700">New password</label>
                    <nw-input-text type="password" [fluid]="true" />
                  </div>
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-surface-700">Confirm password</label>
                    <nw-input-text type="password" [fluid]="true" />
                  </div>
                </div>
                <div class="mt-5 flex items-center justify-between rounded-nw-lg border border-surface-200 p-4">
                  <div>
                    <p class="text-sm font-medium text-surface-900">Two-factor authentication</p>
                    <p class="text-xs text-surface-500">Add an extra layer of security to your account.</p>
                  </div>
                  <nw-checkbox label="Enabled" [checked]="true" />
                </div>
                <div class="mt-6 flex justify-end">
                  <nw-button variant="primary" label="Update password" />
                </div>
              </nw-card>
            }
            @default {
              <nw-card header="Account">
                <p class="text-sm text-surface-500">Account-level settings would appear here.</p>
              </nw-card>
            }
          }
        </div>
      </div>
    </div>
  `,
})
export class SettingsPageBlockPageComponent {
  protected readonly tabs = TABS;
  protected readonly activeTab = signal<SettingsTab>('profile');

  protected readonly fullName = signal('Aisha Khan');
  protected readonly email = signal('aisha@ngwave.dev');
  protected readonly bio = signal('Product designer building delightful admin experiences.');

  protected readonly notificationRows = [
    { label: 'Email notifications', description: 'Receive updates via email.', enabled: true },
    { label: 'Push notifications', description: 'Get notified on your devices.', enabled: true },
    { label: 'Weekly digest', description: 'A summary of activity every Monday.', enabled: false },
    { label: 'Product announcements', description: 'New features and improvements.', enabled: true },
  ];
}
