import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  NwAvatarComponent,
  NwButtonComponent,
  NwDialogComponent,
  NwDropdownComponent,
  NwIconComponent,
  NwInputTextComponent,
  NwTagComponent,
} from '@ngwave/ui';

interface RoleOption {
  label: string;
  value: string;
}

interface Member {
  name: string;
  email: string;
  initials: string;
  role: string;
  status: 'Active' | 'Invited';
}

const MEMBERS: Member[] = [
  { name: 'Aisha Khan', email: 'aisha@ngwave.dev', initials: 'AK', role: 'Admin', status: 'Active' },
  { name: 'Marcus Chen', email: 'marcus@ngwave.dev', initials: 'MC', role: 'Member', status: 'Active' },
  { name: 'Priya Nair', email: 'priya@ngwave.dev', initials: 'PN', role: 'Member', status: 'Invited' },
  { name: 'Daniel Ortiz', email: 'daniel@ngwave.dev', initials: 'DO', role: 'Member', status: 'Active' },
];

@Component({
  selector: 'app-invite-member-modal-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    NwAvatarComponent,
    NwButtonComponent,
    NwDialogComponent,
    NwDropdownComponent,
    NwIconComponent,
    NwInputTextComponent,
    NwTagComponent,
  ],
  template: `
    <div class="min-h-full bg-surface-50">
      <div class="border-b border-surface-200 bg-surface-0 px-6 py-2">
        <a routerLink="/ui-blocks" class="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-900">
          <nw-icon name="arrow-left" [size]="15" />
          All UI Blocks
        </a>
      </div>

      <main class="max-w-3xl mx-auto px-6 py-10">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-lg font-semibold text-surface-900">Team members</h1>
            <p class="mt-1 text-sm text-surface-500">{{ members().length }} people in this workspace.</p>
          </div>
          <nw-button variant="primary" (click)="visible.set(true)">
            <span class="inline-flex items-center gap-1.5">
              <nw-icon name="plus" [size]="16" />
              Invite member
            </span>
          </nw-button>
        </div>

        <div class="mt-6 rounded-nw-lg border border-surface-200 bg-surface-0 divide-y divide-surface-100">
          @for (m of members(); track m.email) {
            <div class="flex items-center gap-3 px-4 py-3.5">
              <nw-avatar [label]="m.initials" size="normal" />
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-medium text-surface-900">{{ m.name }}</p>
                <p class="truncate text-xs text-surface-500">{{ m.email }}</p>
              </div>
              <span class="text-xs text-surface-500">{{ m.role }}</span>
              <nw-tag
                [value]="m.status"
                [severity]="m.status === 'Active' ? 'success' : 'secondary'"
                [rounded]="true"
              />
            </div>
          }
        </div>
      </main>

      <nw-dialog [(visible)]="visible" header="Invite team member" width="28rem">
        <p class="text-sm text-surface-500">
          Invite a new member to your workspace. They'll receive an email with a link to join.
        </p>

        <div class="mt-4 space-y-4">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-surface-700">Email address</label>
            <nw-input-text
              [(value)]="email"
              type="email"
              placeholder="teammate&#64;company.com"
              [fluid]="true"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-surface-700">Role</label>
            <nw-dropdown
              [(value)]="role"
              [options]="roles"
              optionLabel="label"
              optionValue="value"
              class="block w-full"
            />
          </div>

          @if (pendingEmails().length > 0) {
            <div>
              <p class="mb-1.5 text-xs font-medium text-surface-500">Pending invites</p>
              <div class="flex flex-wrap gap-1.5">
                @for (email of pendingEmails(); track email) {
                  <nw-tag [value]="email" severity="secondary" [rounded]="true" />
                }
              </div>
            </div>
          }
        </div>

        <div nwDialogFooter class="flex justify-end gap-2">
          <nw-button variant="text" label="Cancel" (click)="visible.set(false)" />
          <nw-button variant="primary" label="Send invite" (click)="sendInvite()" [disabled]="!email()" />
        </div>
      </nw-dialog>
    </div>
  `,
})
export class InviteMemberModalBlockPageComponent {
  protected readonly visible = signal(false);
  protected readonly email = signal('');
  protected readonly role = signal('member');
  protected readonly pendingEmails = signal<string[]>([]);
  protected readonly members = signal<Member[]>(MEMBERS);

  protected readonly roles: RoleOption[] = [
    { label: 'Admin', value: 'admin' },
    { label: 'Member', value: 'member' },
    { label: 'Viewer', value: 'viewer' },
  ];

  protected sendInvite(): void {
    if (!this.email()) return;
    this.pendingEmails.update((list) => [...list, this.email()]);
    this.email.set('');
    this.visible.set(false);
  }
}
