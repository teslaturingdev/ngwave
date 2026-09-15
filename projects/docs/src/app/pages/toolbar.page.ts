import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NwButtonComponent, NwToolbarComponent } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-toolbar-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwButtonComponent,
    NwToolbarComponent,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Toolbar</h1>
          <p class="mt-2 text-surface-600">
            Simple flex container with start/center/end content slots.
          </p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="basic" title="Basic" [code]="basicCode">
              <nw-toolbar>
                <span toolbarStart class="font-semibold text-surface-900">Projects</span>
                <nw-button toolbarEnd label="New" size="small" />
              </nw-toolbar>
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
export class ToolbarDocPageComponent {
  protected readonly sections: TocSection[] = [{ id: 'basic', label: 'Basic' }];

  protected readonly basicCode = `<nw-toolbar>
  <span toolbarStart>Projects</span>
  <nw-button toolbarEnd label="New" size="small" />
</nw-toolbar>`;

  protected readonly api: ApiRow[] = [
    { name: '[toolbarStart]', type: 'attribute selector', default: '—', description: 'Content projected into the left slot.' },
    { name: '[toolbarCenter]', type: 'attribute selector', default: '—', description: 'Content projected into the centered slot.' },
    { name: '[toolbarEnd]', type: 'attribute selector', default: '—', description: 'Content projected into the right slot.' },
  ];
}
