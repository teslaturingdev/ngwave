import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NwButtonComponent, NwCardComponent } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-card-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwCardComponent,
    NwButtonComponent,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Card</h1>
          <p class="mt-2 text-surface-600">
            A flexible content container with an optional header, subheader,
            and footer.
          </p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="basic" title="Basic" [code]="basicCode">
              <nw-card header="Plan: Indie" subheader="Billed monthly" class="w-72">
                <p class="text-sm text-surface-600">
                  Unlimited component migrations, priority support.
                </p>
              </nw-card>
            </docs-demo>

            <docs-demo id="footer" title="With a footer" [code]="footerCode">
              <nw-card header="Confirm" class="w-72">
                <p class="text-sm text-surface-600">Delete this project?</p>
                <ng-template nwCardFooter>
                  <div class="flex justify-end gap-2">
                    <nw-button variant="secondary" size="small" label="Cancel" />
                    <nw-button variant="danger" size="small" label="Delete" />
                  </div>
                </ng-template>
              </nw-card>
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
export class CardDocPageComponent {
  protected readonly sections: TocSection[] = [
    { id: 'basic', label: 'Basic' },
    { id: 'footer', label: 'With a footer' },
  ];

  protected readonly basicCode = `<nw-card header="Plan: Indie" subheader="Billed monthly">
  ...
</nw-card>`;
  protected readonly footerCode = `<nw-card header="Confirm">
  <p>Delete this project?</p>
  <ng-template nwCardFooter>
    <nw-button variant="danger" label="Delete" />
  </ng-template>
</nw-card>`;

  protected readonly api: ApiRow[] = [
    { name: 'header', type: 'string', default: `''`, description: 'Card title.' },
    { name: 'subheader', type: 'string', default: `''`, description: 'Secondary text under the title.' },
    { name: 'nwCardHeader', type: 'directive', default: '—', description: 'Custom header content, e.g. a cover image: <ng-template nwCardHeader>.' },
    { name: 'nwCardFooter', type: 'directive', default: '—', description: 'Footer content, e.g. actions: <ng-template nwCardFooter>.' },
  ];
}
