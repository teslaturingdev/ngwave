import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { NwButtonComponent } from '../button';
import { NwConfirmationService } from '../dialog';
import { NwIconComponent } from '../icon';

/**
 * Small popup confirm anchored near the triggering element — lighter-weight
 * than `<nw-confirm-dialog>` (non-modal). Pass `target: event.currentTarget`
 * to `NwConfirmationService.confirm()` for positioning. Drop once per app.
 */
@Component({
  selector: 'nw-confirm-popup',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  imports: [NwButtonComponent, NwIconComponent],
  template: `
    @if (request(); as r) {
      <div
        class="fixed z-50 w-72 rounded-nw-lg border border-surface-200 bg-surface-0 p-4 shadow-nw-lg animate-nw-scale-in"
        [style.top.px]="top()"
        [style.left.px]="left()"
      >
        <div class="flex items-start gap-2.5">
          <span class="mt-0.5 text-amber-600">
            <nw-icon name="alert-triangle" [size]="17" />
          </span>
          <p class="text-sm text-surface-700">{{ r.message }}</p>
        </div>
        <div class="mt-3 flex justify-end gap-2">
          <nw-button variant="text" size="small" [label]="r.rejectLabel || 'Cancel'" (click)="reject()" />
          <nw-button variant="danger" size="small" [label]="r.acceptLabel || 'Yes'" (click)="accept()" />
        </div>
      </div>
    }
  `,
})
export class NwConfirmPopupComponent {
  private readonly service = inject(NwConfirmationService);
  protected readonly request = computed(() => this.service.current());

  protected readonly top = signal(0);
  protected readonly left = signal(0);

  constructor() {
    // Position next to the request's target, if one was passed.
    effect(() => {
      const target = this.request()?.target;
      if (target instanceof HTMLElement) {
        const rect = target.getBoundingClientRect();
        this.top.set(rect.bottom + 8);
        this.left.set(Math.max(8, rect.left));
      }
    });
  }

  protected accept(): void {
    this.service.accept();
  }

  protected reject(): void {
    this.service.reject();
  }
}
