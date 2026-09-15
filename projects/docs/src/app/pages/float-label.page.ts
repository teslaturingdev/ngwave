import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NwFloatLabelComponent } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-float-label-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwFloatLabelComponent,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Float Label</h1>
          <p class="mt-2 text-surface-600">
            Wraps a form control so its label floats above the field once it has a value or is focused.
          </p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="basic" title="Basic" [code]="basicCode">
              <div class="w-full max-w-xs">
                <nw-float-label label="Email">
                  <input
                    class="peer w-full rounded-nw border bg-surface-0 px-3 py-2 text-surface-900 shadow-nw-sm focus:outline-none focus:border-nw-500 focus:ring-4 focus:ring-nw-500/15"
                    placeholder=" "
                  />
                </nw-float-label>
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
export class FloatLabelDocPageComponent {
  protected readonly sections: TocSection[] = [{ id: 'basic', label: 'Basic' }];

  protected readonly basicCode = `<nw-float-label label="Email">
  <input class="peer" placeholder=" " />
</nw-float-label>`;

  protected readonly api: ApiRow[] = [
    { name: 'label', type: 'string', default: `''`, description: 'Floating label text.' },
  ];
}
