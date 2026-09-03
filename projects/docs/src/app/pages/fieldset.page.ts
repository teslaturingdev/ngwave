import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NwFieldsetComponent } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-fieldset-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwFieldsetComponent,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Fieldset</h1>
          <p class="mt-2 text-surface-600">
            Groups related form content under a labelled, optionally
            collapsible border.
          </p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="basic" title="Basic" [code]="basicCode">
              <nw-fieldset legend="Shipping address" class="w-full">
                <p class="text-sm text-surface-600">Form fields go here.</p>
              </nw-fieldset>
            </docs-demo>

            <docs-demo id="toggleable" title="Toggleable" [code]="toggleableCode">
              <nw-fieldset
                legend="Advanced options"
                [toggleable]="true"
                [(collapsed)]="collapsed"
                class="w-full"
              >
                <p class="text-sm text-surface-600">Advanced content, collapsible.</p>
              </nw-fieldset>
            </docs-demo>

            <docs-demo id="custom-header" title="Custom legend content" [code]="customHeaderCode">
              <nw-fieldset class="w-full">
                <ng-template nwFieldsetHeader>
                  <span class="inline-flex items-center gap-1.5">
                    <span class="h-2 w-2 rounded-full bg-green-500"></span>
                    Status: Active
                  </span>
                </ng-template>
                <p class="text-sm text-surface-600">Fieldset content.</p>
              </nw-fieldset>
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
export class FieldsetDocPageComponent {
  protected readonly collapsed = signal(false);

  protected readonly sections: TocSection[] = [
    { id: 'basic', label: 'Basic' },
    { id: 'toggleable', label: 'Toggleable' },
    { id: 'custom-header', label: 'Custom legend content' },
  ];

  protected readonly basicCode = `<nw-fieldset legend="Shipping address">
  ...
</nw-fieldset>`;
  protected readonly toggleableCode = `<nw-fieldset legend="Advanced options" [toggleable]="true" [(collapsed)]="collapsed">
  ...
</nw-fieldset>`;
  protected readonly customHeaderCode = `<nw-fieldset>
  <ng-template nwFieldsetHeader>
    <span>Status: Active</span>
  </ng-template>
  ...
</nw-fieldset>`;

  protected readonly api: ApiRow[] = [
    { name: 'legend', type: 'string', default: `''`, description: 'Fieldset legend text.' },
    { name: 'toggleable', type: 'boolean', default: 'false', description: 'Shows a collapse/expand toggle in the legend.' },
    { name: 'collapsed', type: 'boolean', default: 'false', description: 'Two-way bound collapsed state.' },
    { name: 'nwFieldsetHeader', type: 'directive', default: '—', description: 'Custom legend content: <ng-template nwFieldsetHeader>.' },
  ];
}
