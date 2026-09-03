import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NwStepItem, NwStepsComponent } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-steps-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwStepsComponent,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Steps</h1>
          <p class="mt-2 text-surface-600">A horizontal progress indicator for wizards.</p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="basic" title="Basic" [code]="basicCode">
              <nw-steps [items]="items" [activeIndex]="active()" class="w-full" />
            </docs-demo>

            <docs-demo id="clickable" title="Clickable" [code]="clickableCode">
              <nw-steps [items]="items" [(activeIndex)]="active" [readonly]="false" class="w-full" />
            </docs-demo>

            <docs-demo id="command" title="Per-step command" [code]="commandCode">
              <nw-steps [items]="commandItems" [(activeIndex)]="active" [readonly]="false" class="w-full" />
              <p class="text-xs text-surface-500 mt-2">log = {{ log() }}</p>
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
export class StepsDocPageComponent {
  protected readonly active = signal(1);
  protected readonly log = signal('');

  protected readonly items: NwStepItem[] = [
    { label: 'Account' },
    { label: 'Details' },
    { label: 'Review' },
    { label: 'Done' },
  ];

  protected readonly commandItems: NwStepItem[] = [
    { label: 'Account', command: () => this.log.set('Account step clicked') },
    { label: 'Details', command: () => this.log.set('Details step clicked') },
    { label: 'Review', command: () => this.log.set('Review step clicked') },
  ];

  protected readonly sections: TocSection[] = [
    { id: 'basic', label: 'Basic' },
    { id: 'clickable', label: 'Clickable' },
    { id: 'command', label: 'Per-step command' },
  ];

  protected readonly basicCode = `<nw-steps [items]="items" [activeIndex]="1" />`;
  protected readonly clickableCode = `<nw-steps [items]="items" [(activeIndex)]="active" [readonly]="false" />`;
  protected readonly commandCode = `<nw-steps
  [items]="[{ label: 'Account', command: () => onAccount() }]"
  [(activeIndex)]="active"
  [readonly]="false"
/>`;

  protected readonly api: ApiRow[] = [
    { name: 'items', type: 'NwStepItem[]', default: '[]', description: '{ label, icon?, disabled?, command? }[]' },
    { name: 'activeIndex', type: 'number', default: '0', description: 'Two-way bound current step index.' },
    { name: 'readonly', type: 'boolean', default: 'true', description: 'When true, steps are display-only (not clickable, commands do not fire).' },
  ];
}
