import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NwButtonComponent, NwDialogComponent, NwIconComponent, NwIconName, NwInputTextComponent, NwTagComponent } from '@ngwave/ui';

interface Project {
  icon: NwIconName;
  name: string;
  status: 'On track' | 'At risk';
  updated: string;
}

const PROJECTS: Project[] = [
  { icon: 'trending-up', name: 'Q3 Growth Strategy', status: 'On track', updated: '2h ago' },
  { icon: 'palette', name: 'Design System v2', status: 'At risk', updated: '1d ago' },
  { icon: 'plug', name: 'API Migration', status: 'On track', updated: '3d ago' },
  { icon: 'package', name: 'Legacy Data Cleanup', status: 'At risk', updated: '1w ago' },
];

@Component({
  selector: 'app-delete-confirmation-modal-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NwButtonComponent, NwDialogComponent, NwIconComponent, NwInputTextComponent, NwTagComponent],
  template: `
    <div class="min-h-full bg-surface-50">
      <div class="border-b border-surface-200 bg-surface-0 px-6 py-2">
        <a routerLink="/ui-blocks" class="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-900">
          <nw-icon name="arrow-left" [size]="15" />
          All UI Blocks
        </a>
      </div>

      <main class="max-w-3xl mx-auto px-6 py-10">
        <h1 class="text-lg font-semibold text-surface-900">Projects</h1>
        <p class="mt-1 text-sm text-surface-500">
          Click the delete icon on any project to preview the confirmation dialog.
        </p>

        <div class="mt-6 rounded-nw-lg border border-surface-200 bg-surface-0 divide-y divide-surface-100">
          @for (p of projects(); track p.name) {
            <div class="flex items-center gap-3 px-4 py-3.5">
              <span
                class="inline-flex h-9 w-9 items-center justify-center rounded-nw bg-nw-50 text-nw-600"
              >
                <nw-icon [name]="p.icon" [size]="16" />
              </span>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-medium text-surface-900">{{ p.name }}</p>
                <p class="truncate text-xs text-surface-500">Updated {{ p.updated }}</p>
              </div>
              <nw-tag [value]="p.status" [severity]="p.status === 'On track' ? 'success' : 'warn'" [rounded]="true" />
              <button
                type="button"
                (click)="open(p)"
                class="inline-flex h-8 w-8 items-center justify-center rounded-nw text-surface-400 hover:bg-red-50 hover:text-red-600"
                aria-label="Delete project"
              >
                <nw-icon name="trash" [size]="16" />
              </button>
            </div>
          }
        </div>
      </main>

      <nw-dialog [(visible)]="visible" width="26rem">
        <div class="-mt-2 flex flex-col items-center text-center">
          <span
            class="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600"
          >
            <nw-icon name="alert-triangle" [size]="22" />
          </span>
          <h3 class="mt-4 text-lg font-semibold text-surface-900">Delete "{{ target()?.name }}"?</h3>
          <p class="mt-2 text-sm text-surface-500">
            This action cannot be undone. This will permanently delete the project and remove all
            associated files and comments.
          </p>

          <div class="mt-5 w-full text-left">
            <label class="mb-1.5 block text-sm font-medium text-surface-700">
              Type <span class="font-semibold">delete</span> to confirm
            </label>
            <nw-input-text [(value)]="confirmText" placeholder="delete" [fluid]="true" />
          </div>
        </div>

        <div nwDialogFooter class="flex justify-end gap-2">
          <nw-button variant="text" label="Cancel" (click)="visible.set(false)" />
          <nw-button
            variant="danger"
            label="Delete permanently"
            [disabled]="confirmText().toLowerCase() !== 'delete'"
            (click)="confirmDelete()"
          />
        </div>
      </nw-dialog>
    </div>
  `,
})
export class DeleteConfirmationModalBlockPageComponent {
  protected readonly visible = signal(false);
  protected readonly confirmText = signal('');
  protected readonly target = signal<Project | null>(null);
  protected readonly projects = signal<Project[]>(PROJECTS);

  protected open(project: Project): void {
    this.target.set(project);
    this.confirmText.set('');
    this.visible.set(true);
  }

  protected confirmDelete(): void {
    const target = this.target();
    if (target) {
      this.projects.update((list) => list.filter((p) => p !== target));
    }
    this.visible.set(false);
  }
}
