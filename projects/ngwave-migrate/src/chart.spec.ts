import { describe, expect, it } from 'vitest';
import { migrate } from './index';

describe('p-chart', () => {
  it('maps to nw-chart with type/data/options', () => {
    const out = migrate(
      `<p-chart type="bar" [data]="chartData" [options]="chartOptions"></p-chart>`,
    );
    expect(out.code).toContain('<nw-chart type="bar" [data]="chartData" [options]="chartOptions">');
    expect(out.code).toContain('</nw-chart>');
    expect(out.imports).toContain('NwChartComponent');
  });
});
