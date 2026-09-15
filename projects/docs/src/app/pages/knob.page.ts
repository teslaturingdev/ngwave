import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NwKnobComponent } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-knob-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwKnobComponent,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Knob</h1>
          <p class="mt-2 text-surface-600">A circular drag-to-set numeric dial.</p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="basic" title="Basic" [code]="basicCode">
              <nw-knob [(value)]="volume" [min]="0" [max]="100" />
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
export class KnobDocPageComponent {
  protected volume = 40;

  protected readonly sections: TocSection[] = [{ id: 'basic', label: 'Basic' }];
  protected readonly basicCode = `<nw-knob [(value)]="volume" [min]="0" [max]="100" />`;

  protected readonly api: ApiRow[] = [
    { name: 'value', type: 'number', default: '0', description: 'Bindable numeric value (model).' },
    { name: 'min', type: 'number', default: '0', description: 'Minimum value.' },
    { name: 'max', type: 'number', default: '100', description: 'Maximum value.' },
    { name: 'step', type: 'number', default: '1', description: 'Value rounding increment.' },
    { name: 'size', type: 'number', default: '100', description: 'Diameter in pixels.' },
    { name: 'strokeWidth', type: 'number', default: '8', description: 'Ring thickness.' },
    { name: 'showValue', type: 'boolean', default: 'true', description: 'Shows the numeric value in the center.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables dragging.' },
    { name: 'readonly', type: 'boolean', default: 'false', description: 'Displays the value without allowing dragging.' },
  ];
}
