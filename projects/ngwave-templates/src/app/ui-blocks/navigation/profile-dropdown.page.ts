import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { NwAvatarComponent, NwOverlayPanelComponent, NwTagComponent } from '@ngwave/ui';
import { BlockPreviewShellComponent } from '../block-preview-shell.component';

interface MenuLink {
  icon: string;
  label: string;
  danger?: boolean;
}

@Component({
  selector: 'app-profile-dropdown-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BlockPreviewShellComponent, NwAvatarComponent, NwOverlayPanelComponent, NwTagComponent],
  template: `
    <app-block-preview-shell title="Profile Dropdown" maxWidth="max-w-sm">
      <div class="flex justify-center">
        <button
          type="button"
          (click)="panel().toggle($event)"
          class="flex items-center gap-2 rounded-nw border border-surface-200 bg-surface-0 py-1.5 pl-1.5 pr-3 hover:bg-surface-50"
        >
          <nw-avatar label="AK" size="normal" />
          <span class="text-sm font-medium text-surface-900">Aisha Khan</span>
          <span class="text-xs text-surface-400">▾</span>
        </button>
      </div>

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

      <p class="mt-6 text-center text-sm text-surface-400">Click the profile button to preview</p>
    </app-block-preview-shell>
  `,
})
export class ProfileDropdownBlockPageComponent {
  protected readonly panel = viewChild.required(NwOverlayPanelComponent);

  protected readonly links: MenuLink[] = [
    { icon: '👤', label: 'Your profile' },
    { icon: '⚙', label: 'Settings' },
    { icon: '💳', label: 'Billing' },
    { icon: '❔', label: 'Help & support' },
    { icon: '⎋', label: 'Sign out', danger: true },
  ];
}
