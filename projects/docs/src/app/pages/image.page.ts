import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NwImageComponent } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-image-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwImageComponent,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Image</h1>
          <p class="mt-2 text-surface-600">An image with an optional click-to-zoom fullscreen preview overlay.</p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="preview" title="With preview" [code]="previewCode">
              <nw-image src="https://picsum.photos/seed/ngwave/320/200" alt="Sample" width="320px" [preview]="true" />
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
export class ImageDocPageComponent {
  protected readonly sections: TocSection[] = [{ id: 'preview', label: 'With preview' }];
  protected readonly previewCode = `<nw-image src="/photo.jpg" alt="Sample" [preview]="true" />`;

  protected readonly api: ApiRow[] = [
    { name: 'src', type: 'string', default: `''`, description: 'Image URL.' },
    { name: 'alt', type: 'string', default: `''`, description: 'Alt text.' },
    { name: 'width', type: 'string | null', default: 'null', description: 'CSS width.' },
    { name: 'height', type: 'string | null', default: 'null', description: 'CSS height.' },
    { name: 'preview', type: 'boolean', default: 'false', description: 'Opens a fullscreen zoom overlay on click.' },
  ];
}
