import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NwProgressBarComponent } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-progress-bar-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwProgressBarComponent,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Progress Bar</h1>
          <p class="mt-2 text-surface-600">Determinate or indeterminate linear progress indicator.</p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="determinate" title="Determinate" [code]="determinateCode">
              <div class="w-full max-w-sm space-y-3">
                <nw-progress-bar [value]="45" />
                <nw-progress-bar [value]="75" [showValue]="true" />
              </div>
            </docs-demo>

            <docs-demo id="indeterminate" title="Indeterminate" [code]="indeterminateCode">
              <div class="w-full max-w-sm">
                <nw-progress-bar mode="indeterminate" />
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
export class ProgressBarDocPageComponent {
  protected readonly sections: TocSection[] = [
    { id: 'determinate', label: 'Determinate' },
    { id: 'indeterminate', label: 'Indeterminate' },
  ];

  protected readonly determinateCode = `<nw-progress-bar [value]="45" />
<nw-progress-bar [value]="75" [showValue]="true" />`;
  protected readonly indeterminateCode = `<nw-progress-bar mode="indeterminate" />`;

  protected readonly api: ApiRow[] = [
    { name: 'value', type: 'number', default: '0', description: 'Percent complete (0–100), determinate mode only.' },
    { name: 'mode', type: `'determinate' | 'indeterminate'`, default: `'determinate'`, description: 'Progress display mode.' },
    { name: 'showValue', type: 'boolean', default: 'false', description: 'Overlays the percentage as text.' },
  ];
}
