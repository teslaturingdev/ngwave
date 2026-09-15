import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  NwGalleriaComponent,
  NwGalleriaItemDirective,
  NwGalleriaThumbnailDirective,
} from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-galleria-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwGalleriaComponent,
    NwGalleriaItemDirective,
    NwGalleriaThumbnailDirective,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Galleria</h1>
          <p class="mt-2 text-surface-600">A main-image viewer with prev/next navigation and a thumbnail strip.</p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="basic" title="Basic" [code]="basicCode">
              <div class="max-w-md">
                <nw-galleria [value]="images">
                  <ng-template nwGalleriaItem let-item>
                    <img [src]="item" class="block w-full h-64 object-cover" />
                  </ng-template>
                  <ng-template nwGalleriaThumbnail let-item>
                    <img [src]="item" class="block h-14 w-20 object-cover" />
                  </ng-template>
                </nw-galleria>
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
export class GalleriaDocPageComponent {
  protected readonly images = [
    'https://picsum.photos/seed/ngwave1/600/400',
    'https://picsum.photos/seed/ngwave2/600/400',
    'https://picsum.photos/seed/ngwave3/600/400',
  ];

  protected readonly sections: TocSection[] = [{ id: 'basic', label: 'Basic' }];
  protected readonly basicCode = `<nw-galleria [value]="images">
  <ng-template nwGalleriaItem let-item>
    <img [src]="item" />
  </ng-template>
  <ng-template nwGalleriaThumbnail let-item>
    <img [src]="item" />
  </ng-template>
</nw-galleria>`;

  protected readonly api: ApiRow[] = [
    { name: 'value', type: 'readonly T[]', default: '[]', description: 'Items to render.' },
    { name: 'activeIndex', type: 'number', default: '0', description: 'Bindable active item index (model).' },
    { name: 'showThumbnails', type: 'boolean', default: 'true', description: 'Shows the thumbnail strip.' },
    { name: 'circular', type: 'boolean', default: 'false', description: 'Wraps around at the start/end.' },
  ];
}
