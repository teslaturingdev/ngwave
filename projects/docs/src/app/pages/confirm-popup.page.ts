import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NwButtonComponent, NwConfirmPopupComponent, NwConfirmationService } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-confirm-popup-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwButtonComponent,
    NwConfirmPopupComponent,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Confirm Popup</h1>
          <p class="mt-2 text-surface-600">
            Small popup confirm anchored near the triggering element — non-modal, lighter-weight
            than Confirm Dialog. Shares NwConfirmationService with nw-confirm-dialog; use one or
            the other.
          </p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="basic" title="Basic" [code]="basicCode">
              <nw-button variant="danger" label="Delete" (click)="onDelete($event)" />
              <nw-confirm-popup />
            </docs-demo>
          </div>

          <div api>
            <docs-api-table [rows]="api" />
          </div>
        </docs-tabs>
      </article>

      <docs-toc [sections]="sections" />
    </div>
  `,
})
export class ConfirmPopupDocPageComponent {
  private readonly confirmationService = inject(NwConfirmationService);
  protected readonly sections: TocSection[] = [{ id: 'basic', label: 'Basic' }];

  protected onDelete(event: Event): void {
    this.confirmationService.confirm({
      target: event.currentTarget,
      message: 'Are you sure you want to delete this item?',
      accept: () => {},
    });
  }

  protected readonly basicCode = `constructor(private confirmationService: NwConfirmationService) {}

onDelete(event: Event) {
  this.confirmationService.confirm({
    target: event.currentTarget,
    message: 'Are you sure you want to delete this item?',
    accept: () => { /* ... */ },
  });
}`;

  protected readonly api: ApiRow[] = [
    { name: '(place once)', type: '<nw-confirm-popup />', default: '—', description: 'Renders whatever NwConfirmationService.confirm() was last called with.' },
    { name: 'NwConfirmationService.confirm(req)', type: 'method', default: '—', description: 'req: { message, header?, target?, acceptLabel?, rejectLabel?, accept?, reject? }.' },
  ];
}
