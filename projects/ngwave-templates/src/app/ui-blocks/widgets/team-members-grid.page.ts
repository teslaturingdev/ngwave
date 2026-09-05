import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NwAvatarComponent, NwIconComponent, NwTagComponent } from '@ngwave/ui';
import { BlockPreviewShellComponent } from '../block-preview-shell.component';

interface TeamMember {
  name: string;
  role: string;
  initials: string;
  status: 'Active' | 'Away' | 'Invited';
}

@Component({
  selector: 'app-team-members-grid-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BlockPreviewShellComponent, NwAvatarComponent, NwIconComponent, NwTagComponent],
  template: `
    <app-block-preview-shell title="Team Members Grid" maxWidth="max-w-4xl">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        @for (m of members; track m.name) {
          <div
            class="relative flex items-center gap-3 rounded-nw-lg border border-surface-200 bg-surface-0 p-4 hover:shadow-nw-sm transition-shadow"
          >
            <nw-avatar [label]="m.initials" size="large" />
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-semibold text-surface-900">{{ m.name }}</p>
              <p class="truncate text-xs text-surface-500">{{ m.role }}</p>
              <nw-tag
                class="mt-1.5"
                [value]="m.status"
                [severity]="m.status === 'Active' ? 'success' : m.status === 'Away' ? 'warn' : 'secondary'"
                [rounded]="true"
              />
            </div>
            <button
              type="button"
              class="absolute top-2 right-2 h-7 w-7 rounded-nw text-surface-400 hover:bg-surface-100 hover:text-surface-700"
              aria-label="Member options"
            >
              <nw-icon name="more-horizontal" [size]="16" />
            </button>
          </div>
        }
      </div>
    </app-block-preview-shell>
  `,
})
export class TeamMembersGridBlockPageComponent {
  protected readonly members: TeamMember[] = [
    { name: 'Aisha Khan', role: 'Product Designer', initials: 'AK', status: 'Active' },
    { name: 'Marcus Chen', role: 'Frontend Engineer', initials: 'MC', status: 'Active' },
    { name: 'Priya Nair', role: 'Engineering Manager', initials: 'PN', status: 'Away' },
    { name: 'Daniel Ortiz', role: 'Backend Engineer', initials: 'DO', status: 'Active' },
    { name: 'Sofia Rossi', role: 'Customer Success', initials: 'SR', status: 'Invited' },
    { name: 'Ken Watanabe', role: 'QA Engineer', initials: 'KW', status: 'Active' },
  ];
}
