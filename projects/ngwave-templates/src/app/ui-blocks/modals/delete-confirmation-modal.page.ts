import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NwButtonComponent, NwDialogComponent, NwInputTextComponent } from '@ngwave/ui';
import { BlockPreviewShellComponent } from '../block-preview-shell.component';

@Component({
  selector: 'app-delete-confirmation-modal-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BlockPreviewShellComponent, NwButtonComponent, NwDialogComponent, NwInputTextComponent],
  template: `
    <app-block-preview-shell title="Delete Confirmation Dialog" maxWidth="max-w-sm">
      <div class="flex justify-center">
        <nw-button variant="danger" label="Delete project" (click)="open()" />
      </div>

      <nw-dialog [(visible)]="visible" width="26rem">
        <div class="-mt-2 flex flex-col items-center text-center">
          <span
            class="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-2xl text-red-600"
            >⚠</span
          >
          <h3 class="mt-4 text-lg font-semibold text-surface-900">Delete "Q3 Growth Strategy"?</h3>
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
            (click)="visible.set(false)"
          />
        </div>
      </nw-dialog>
    </app-block-preview-shell>
  `,
})
export class DeleteConfirmationModalBlockPageComponent {
  protected readonly visible = signal(false);
  protected readonly confirmText = signal('');

  protected open(): void {
    this.confirmText.set('');
    this.visible.set(true);
  }
}
