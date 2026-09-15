import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NwPickListComponent, NwPickListItemDirective } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-pick-list-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwPickListComponent,
    NwPickListItemDirective,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Pick List</h1>
          <p class="mt-2 text-surface-600">Move items between two lists with per-item or bulk transfer buttons.</p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="basic" title="Basic" [code]="basicCode">
              <nw-pick-list [(source)]="source" [(target)]="target" sourceHeader="Available" targetHeader="Chosen">
                <ng-template nwPickListItem let-item>
                  <span>{{ item }}</span>
                </ng-template>
              </nw-pick-list>
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
export class PickListDocPageComponent {
  protected source = ['Angular', 'React', 'Vue', 'Svelte'];
  protected target: string[] = [];

  protected readonly sections: TocSection[] = [{ id: 'basic', label: 'Basic' }];

  protected readonly basicCode = `<nw-pick-list [(source)]="source" [(target)]="target" sourceHeader="Available" targetHeader="Chosen">
  <ng-template nwPickListItem let-item>
    <span>{{ item }}</span>
  </ng-template>
</nw-pick-list>`;

  protected readonly api: ApiRow[] = [
    { name: 'source', type: 'T[]', default: '[]', description: 'Bindable source-list items (model).' },
    { name: 'target', type: 'T[]', default: '[]', description: 'Bindable target-list items (model).' },
    { name: 'sourceHeader', type: 'string', default: `''`, description: 'Source list header text.' },
    { name: 'targetHeader', type: 'string', default: `''`, description: 'Target list header text.' },
    { name: 'emptyMessage', type: 'string', default: `'No items'`, description: 'Shown when a list is empty.' },
  ];
}
