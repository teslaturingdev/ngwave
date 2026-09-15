import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NwButtonComponent, NwTooltipDirective } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-tooltip-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwButtonComponent,
    NwTooltipDirective,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Tooltip</h1>
          <p class="mt-2 text-surface-600">
            Hover/focus tooltip directive — apply [nwTooltip] to any element.
          </p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="basic" title="Basic" [code]="basicCode">
              <nw-button label="Hover me" nwTooltip="Saves your changes" />
            </docs-demo>

            <docs-demo id="position" title="Position" [code]="positionCode">
              <nw-button label="Bottom" nwTooltip="Below the button" tooltipPosition="bottom" />
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
export class TooltipDocPageComponent {
  protected readonly sections: TocSection[] = [
    { id: 'basic', label: 'Basic' },
    { id: 'position', label: 'Position' },
  ];

  protected readonly basicCode = `<button nwTooltip="Saves your changes">Hover me</button>`;
  protected readonly positionCode = `<button nwTooltip="Below the button" tooltipPosition="bottom">Bottom</button>`;

  protected readonly api: ApiRow[] = [
    { name: 'nwTooltip', type: 'string', default: `''`, description: 'Tooltip text. No tooltip is shown when empty.' },
    { name: 'tooltipPosition', type: `'top' | 'bottom' | 'left' | 'right'`, default: `'top'`, description: 'Which side of the host the tooltip appears on.' },
  ];
}
