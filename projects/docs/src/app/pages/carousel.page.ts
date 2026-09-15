import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NwCarouselComponent, NwCarouselItemDirective } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-carousel-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwCarouselComponent,
    NwCarouselItemDirective,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Carousel</h1>
          <p class="mt-2 text-surface-600">Horizontal item carousel with prev/next navigation and page indicators.</p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="basic" title="Basic" [code]="basicCode">
              <nw-carousel [value]="items" [numVisible]="3" [numScroll]="3">
                <ng-template nwCarouselItem let-item>
                  <div class="rounded-nw border border-surface-200 p-6 text-center text-surface-900">{{ item }}</div>
                </ng-template>
              </nw-carousel>
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
export class CarouselDocPageComponent {
  protected readonly items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6'];

  protected readonly sections: TocSection[] = [{ id: 'basic', label: 'Basic' }];
  protected readonly basicCode = `<nw-carousel [value]="items" [numVisible]="3" [numScroll]="3">
  <ng-template nwCarouselItem let-item>
    <div class="card">{{ item }}</div>
  </ng-template>
</nw-carousel>`;

  protected readonly api: ApiRow[] = [
    { name: 'value', type: 'readonly T[]', default: '[]', description: 'Items to render.' },
    { name: 'numVisible', type: 'number', default: '1', description: 'Items shown at once.' },
    { name: 'numScroll', type: 'number', default: '1', description: 'Items advanced per navigation click.' },
    { name: 'circular', type: 'boolean', default: 'false', description: 'Wraps around at the start/end.' },
    { name: 'showIndicators', type: 'boolean', default: 'true', description: 'Shows page dot indicators.' },
    { name: 'showNavigators', type: 'boolean', default: 'true', description: 'Shows prev/next buttons.' },
  ];
}
