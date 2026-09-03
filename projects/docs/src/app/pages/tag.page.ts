import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NwTagComponent } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-tag-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwTagComponent,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Tag</h1>
          <p class="mt-2 text-surface-600">
            A small status label, color-coded by severity.
          </p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="severity" title="Severity" [code]="severityCode">
              <nw-tag value="Success" severity="success" />
              <nw-tag value="Info" severity="info" />
              <nw-tag value="Warn" severity="warn" />
              <nw-tag value="Danger" severity="danger" />
              <nw-tag value="Secondary" severity="secondary" />
              <nw-tag value="Contrast" severity="contrast" />
            </docs-demo>

            <docs-demo id="icon" title="Icon & rounded" [code]="iconCode">
              <nw-tag value="Verified" severity="success" icon="pi pi-check" />
              <nw-tag value="New" severity="info" [rounded]="true" />
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
export class TagDocPageComponent {
  protected readonly sections: TocSection[] = [
    { id: 'severity', label: 'Severity' },
    { id: 'icon', label: 'Icon & rounded' },
  ];

  protected readonly severityCode = `<nw-tag value="Success" severity="success" />
<nw-tag value="Danger" severity="danger" />`;
  protected readonly iconCode = `<nw-tag value="Verified" severity="success" icon="pi pi-check" />
<nw-tag value="New" severity="info" [rounded]="true" />`;

  protected readonly api: ApiRow[] = [
    { name: 'value', type: 'string', default: `''`, description: 'Tag text. Falls back to projected content when empty.' },
    { name: 'severity', type: `'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'`, default: `'secondary'`, description: 'Color scheme.' },
    { name: 'icon', type: 'string', default: `''`, description: 'Icon class shown before the value.' },
    { name: 'rounded', type: 'boolean', default: 'false', description: 'Fully rounded (pill) shape.' },
  ];
}
