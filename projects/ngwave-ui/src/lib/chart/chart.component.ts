import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  InputSignal,
  OnDestroy,
  afterNextRender,
  effect,
  input,
  viewChild,
} from '@angular/core';
import {
  Chart,
  ChartConfiguration,
  ChartData,
  ChartOptions,
  ChartType,
  registerables,
} from 'chart.js';

Chart.register(...registerables);

/**
 * Thin wrapper around Chart.js — bar/line/pie/doughnut/radar/polarArea/scatter,
 * anything the underlying library supports via `type`.
 */
@Component({
  selector: 'nw-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `<canvas #canvas [attr.height]="height()"></canvas>`,
})
export class NwChartComponent implements OnDestroy {
  readonly type = input<ChartType>('bar');
  readonly data = input.required<ChartData>();
  readonly options: InputSignal<ChartOptions | undefined> = input<ChartOptions | undefined>(
    undefined,
  );
  readonly height = input<number | null>(null);

  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private chart: Chart | null = null;

  constructor() {
    let firstRun = true;
    afterNextRender(() => {
      firstRun = false;
      this.renderChart();
    });

    // Re-render whenever type/data/options change (Chart.js's config type
    // union makes in-place mutation awkward to type; recreating is simpler
    // and cheap enough for a component-level chart).
    effect(() => {
      this.type();
      this.data();
      this.options();
      if (firstRun) return;
      this.renderChart();
    });
  }

  private renderChart(): void {
    this.chart?.destroy();
    this.chart = new Chart(this.canvasRef().nativeElement, {
      type: this.type(),
      data: this.data(),
      options: this.options() ?? {},
    } as ChartConfiguration);
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
    this.chart = null;
  }
}
