import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NwButtonComponent } from '../button';
import { NwDialogComponent } from './dialog.component';
import { NwConfirmationService } from './confirmation.service';

@Component({
  selector: 'nw-confirm-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NwDialogComponent, NwButtonComponent],
  template: `
    <nw-dialog
      [visible]="open()"
      (visibleChange)="onVisibleChange($event)"
      [header]="current()?.header ?? 'Confirm'"
      [modal]="true"
      [dismissableMask]="false"
      width="26rem"
    >
      <div class="flex items-start gap-3">
        @if (current()?.icon; as icon) {
          <span class="text-2xl leading-none" aria-hidden="true">{{ icon }}</span>
        }
        <p class="text-surface-700 pt-0.5">{{ current()?.message }}</p>
      </div>
      <ng-template nwDialogFooter>
        <div class="flex justify-end gap-2">
          <nw-button
            [variant]="current()?.rejectVariant ?? 'text'"
            [label]="current()?.rejectLabel ?? 'Cancel'"
            (click)="svc.reject()"
          />
          <nw-button
            [variant]="current()?.acceptVariant ?? 'primary'"
            [label]="current()?.acceptLabel ?? 'Confirm'"
            (click)="svc.accept()"
          />
        </div>
      </ng-template>
    </nw-dialog>
  `,
})
export class NwConfirmDialogComponent {
  protected readonly svc = inject(NwConfirmationService);
  protected readonly current = this.svc.current;
  protected readonly open = computed(() => this.current() !== null);

  protected onVisibleChange(v: boolean): void {
    if (!v && this.open()) this.svc.reject();
  }
}
