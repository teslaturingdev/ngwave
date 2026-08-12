import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NwSkeletonComponent, NwSpinnerComponent } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-spinner-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwSpinnerComponent,
    NwSkeletonComponent,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Spinner &amp; Skeleton</h1>
          <p class="mt-2 text-surface-600">
            Loading indicators — a spinner for actions and skeletons for content
            placeholders.
          </p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="spinner" title="Spinner" [code]="spinnerCode">
              <nw-spinner [size]="20" />
              <nw-spinner [size]="32" />
              <nw-spinner [size]="48" />
            </docs-demo>

            <docs-demo id="spinner-variants" title="Colors & stroke" [code]="variantsCode">
              <nw-spinner variant="primary" />
              <nw-spinner variant="success" />
              <nw-spinner variant="warn" />
              <nw-spinner variant="danger" />
              <nw-spinner [strokeWidth]="2" />
              <nw-spinner [strokeWidth]="6" animationDuration="1.6s" />
            </docs-demo>

            <docs-demo id="skeleton" title="Skeleton" [code]="skeletonCode">
              <div class="flex items-center gap-3 w-full">
                <nw-skeleton width="3rem" height="3rem" shape="circle" />
                <div class="flex-1 space-y-2">
                  <nw-skeleton width="60%" height="0.75rem" />
                  <nw-skeleton width="90%" height="0.75rem" />
                </div>
              </div>
            </docs-demo>

            <docs-demo id="card" title="Card placeholder" [code]="cardCode">
              <div class="w-64 space-y-3">
                <nw-skeleton width="100%" height="8rem" />
                <nw-skeleton width="70%" height="1rem" />
                <nw-skeleton width="40%" height="0.75rem" />
              </div>
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
export class SpinnerDocPageComponent {
  protected readonly sections: TocSection[] = [
    { id: 'spinner', label: 'Spinner' },
    { id: 'spinner-variants', label: 'Colors & stroke' },
    { id: 'skeleton', label: 'Skeleton' },
    { id: 'card', label: 'Card placeholder' },
  ];

  protected readonly spinnerCode = `<nw-spinner [size]="32" />`;
  protected readonly variantsCode = `<nw-spinner variant="success" />
<nw-spinner [strokeWidth]="2" />
<nw-spinner [strokeWidth]="6" animationDuration="1.6s" />`;
  protected readonly skeletonCode = `<nw-skeleton width="3rem" height="3rem" shape="circle" />
<nw-skeleton width="60%" height="0.75rem" />`;
  protected readonly cardCode = `<nw-skeleton width="100%" height="8rem" />
<nw-skeleton width="70%" height="1rem" />`;

  protected readonly api: ApiRow[] = [
    { name: 'size (nw-spinner)', type: 'number', default: '24', description: 'Diameter in pixels.' },
    { name: 'variant (nw-spinner)', type: `'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'current'`, default: `'primary'`, description: 'Stroke color; use "current" to inherit text color.' },
    { name: 'strokeWidth (nw-spinner)', type: 'number', default: '4', description: 'Ring thickness.' },
    { name: 'animationDuration (nw-spinner)', type: 'string', default: `'0.9s'`, description: 'Spin cycle duration.' },
    { name: 'width (nw-skeleton)', type: 'string', default: `'100%'`, description: 'CSS width.' },
    { name: 'height (nw-skeleton)', type: 'string', default: `'1rem'`, description: 'CSS height.' },
    { name: 'shape (nw-skeleton)', type: `'rect' | 'circle'`, default: `'rect'`, description: 'Placeholder shape.' },
  ];
}
