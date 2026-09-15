import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NwTimelineComponent, NwTimelineEvent } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-timeline-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwTimelineComponent,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Timeline</h1>
          <p class="mt-2 text-surface-600">
            A vertical sequence of dated events, each with a marker and connecting line.
          </p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="basic" title="Basic" [code]="basicCode">
              <nw-timeline [value]="events" class="max-w-sm" />
            </docs-demo>

            <docs-demo id="colors" title="Custom marker colors & icons" [code]="colorsCode">
              <nw-timeline [value]="coloredEvents" class="max-w-sm" />
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
export class TimelineDocPageComponent {
  protected readonly sections: TocSection[] = [
    { id: 'basic', label: 'Basic' },
    { id: 'colors', label: 'Custom marker colors & icons' },
  ];

  protected readonly events: NwTimelineEvent[] = [
    { date: 'Mar 1', content: 'Order placed' },
    { date: 'Mar 2', content: 'Processing started' },
    { date: 'Mar 4', content: 'Shipped' },
    { date: 'Mar 6', content: 'Delivered' },
  ];

  protected readonly coloredEvents: NwTimelineEvent[] = [
    { date: 'Mar 1', content: 'Order placed', icon: 'check', color: '#22c55e' },
    { date: 'Mar 2', content: 'Processing started', icon: 'clock', color: '#f59e0b' },
    { date: 'Mar 4', content: 'Shipped', icon: 'package', color: 'var(--nw-600)' },
  ];

  protected readonly basicCode = `protected readonly events: NwTimelineEvent[] = [
  { date: 'Mar 1', content: 'Order placed' },
  { date: 'Mar 2', content: 'Processing started' },
  { date: 'Mar 4', content: 'Shipped' },
];`;
  protected readonly colorsCode = `{ date: 'Mar 1', content: 'Order placed', icon: 'check', color: '#22c55e' }`;

  protected readonly api: ApiRow[] = [
    { name: 'value', type: 'NwTimelineEvent[]', default: '[]', description: 'Ordered list of { content?, date?, icon?, color? } events.' },
    { name: 'align', type: `'left' | 'right' | 'alternate'`, default: `'left'`, description: 'Side the content renders on.' },
  ];
}
