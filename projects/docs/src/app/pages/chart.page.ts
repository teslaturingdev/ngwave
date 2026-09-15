import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NwChartComponent } from '@ngwave/ui';
import type { ChartData } from 'chart.js';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-chart-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwChartComponent,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Chart</h1>
          <p class="mt-2 text-surface-600">
            A thin wrapper around Chart.js — bar, line, pie, doughnut, radar, and more.
          </p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="bar" title="Bar" [code]="barCode">
              <nw-chart type="bar" [data]="barData" [height]="220" class="max-w-md" />
            </docs-demo>

            <docs-demo id="line" title="Line" [code]="lineCode">
              <nw-chart type="line" [data]="lineData" [height]="220" class="max-w-md" />
            </docs-demo>

            <docs-demo id="doughnut" title="Doughnut" [code]="doughnutCode">
              <nw-chart type="doughnut" [data]="doughnutData" [height]="220" class="max-w-xs" />
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
export class ChartDocPageComponent {
  protected readonly sections: TocSection[] = [
    { id: 'bar', label: 'Bar' },
    { id: 'line', label: 'Line' },
    { id: 'doughnut', label: 'Doughnut' },
  ];

  protected readonly barData: ChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    datasets: [{ label: 'Sales', data: [12, 19, 8, 15], backgroundColor: '#6366f1' }],
  };

  protected readonly lineData: ChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [{ label: 'Visitors', data: [30, 45, 28, 60, 50], borderColor: '#6366f1', tension: 0.3 }],
  };

  protected readonly doughnutData: ChartData = {
    labels: ['Direct', 'Referral', 'Social'],
    datasets: [{ data: [45, 30, 25], backgroundColor: ['#6366f1', '#22c55e', '#f59e0b'] }],
  };

  protected readonly barCode = `<nw-chart type="bar" [data]="barData" [height]="220" />`;
  protected readonly lineCode = `<nw-chart type="line" [data]="lineData" [height]="220" />`;
  protected readonly doughnutCode = `<nw-chart type="doughnut" [data]="doughnutData" [height]="220" />`;

  protected readonly api: ApiRow[] = [
    { name: 'type', type: 'ChartType', default: `'bar'`, description: "Chart.js chart type ('bar', 'line', 'pie', 'doughnut', 'radar', ...)." },
    { name: 'data', type: 'ChartData', default: '—', description: 'Required. Chart.js dataset config.' },
    { name: 'options', type: 'ChartOptions', default: 'undefined', description: 'Chart.js options object.' },
    { name: 'height', type: 'number | null', default: 'null', description: 'Canvas height in pixels.' },
  ];
}
