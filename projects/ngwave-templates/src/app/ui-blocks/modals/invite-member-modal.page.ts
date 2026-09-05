import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  NwButtonComponent,
  NwDialogComponent,
  NwDropdownComponent,
  NwInputTextComponent,
  NwTagComponent,
} from '@ngwave/ui';
import { BlockPreviewShellComponent } from '../block-preview-shell.component';

interface RoleOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-invite-member-modal-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BlockPreviewShellComponent,
    NwButtonComponent,
    NwDialogComponent,
    NwDropdownComponent,
    NwInputTextComponent,
    NwTagComponent,
  ],
  template: `
    <app-block-preview-shell title="Invite Member Modal" maxWidth="max-w-sm">
      <div class="flex justify-center">
        <nw-button variant="primary" label="+ Invite member" (click)="visible.set(true)" />
      </div>

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

          <div class="flex flex-wrap gap-1.5">
            @for (email of pendingEmails(); track email) {
              <nw-tag [value]="email" severity="secondary" [rounded]="true" />
            }
          </div>
        </div>

        <div nwDialogFooter class="flex justify-end gap-2">
          <nw-button variant="text" label="Cancel" (click)="visible.set(false)" />
          <nw-button variant="primary" label="Send invite" (click)="sendInvite()" [disabled]="!email()" />
        </div>
      </nw-dialog>
    </app-block-preview-shell>
  `,
})
export class InviteMemberModalBlockPageComponent {
  protected readonly visible = signal(false);
  protected readonly email = signal('');
  protected readonly role = signal('member');
  protected readonly pendingEmails = signal<string[]>(['marcus@ngwave.dev', 'priya@ngwave.dev']);

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
