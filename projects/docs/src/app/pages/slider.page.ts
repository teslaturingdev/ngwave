import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NwSliderComponent } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-slider-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwSliderComponent,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Slider</h1>
          <p class="mt-2 text-surface-600">
            A numeric range control — single value or dual-handle range, horizontal or vertical.
          </p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="basic" title="Basic" [code]="basicCode">
              <div class="w-64">
                <nw-slider [(value)]="value" />
                <span class="text-sm text-surface-600">value = {{ value() }}</span>
              </div>
            </docs-demo>

            <docs-demo id="range" title="Range (dual handle)" [code]="rangeCode">
              <div class="w-64">
                <nw-slider [range]="true" [(rangeValue)]="rangeVal" />
                <span class="text-sm text-surface-600">range = [{{ rangeVal()[0] }}, {{ rangeVal()[1] }}]</span>
              </div>
            </docs-demo>

            <docs-demo id="vertical" title="Vertical" [code]="verticalCode">
              <div class="flex gap-8 h-48 items-center">
                <nw-slider orientation="vertical" [(value)]="value" />
                <nw-slider orientation="vertical" [range]="true" [(rangeValue)]="rangeVal" />
              </div>
            </docs-demo>

            <docs-demo id="step" title="Min, max & step" [code]="stepCode">
              <div class="w-64">
                <nw-slider [min]="0" [max]="10" [step]="0.5" />
              </div>
            </docs-demo>

            <docs-demo id="disabled" title="Disabled" [code]="disabledCode">
              <div class="w-64">
                <nw-slider [value]="40" [disabled]="true" />
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
export class SliderDocPageComponent {
  protected readonly value = signal(50);
  protected readonly rangeVal = signal<[number, number]>([20, 80]);

  protected readonly sections: TocSection[] = [
    { id: 'basic', label: 'Basic' },
    { id: 'range', label: 'Range (dual handle)' },
    { id: 'vertical', label: 'Vertical' },
    { id: 'step', label: 'Min, max & step' },
    { id: 'disabled', label: 'Disabled' },
  ];

  protected readonly basicCode = `<nw-slider [(value)]="value" />`;
  protected readonly rangeCode = `<nw-slider [range]="true" [(rangeValue)]="rangeVal" />`;
  protected readonly verticalCode = `<nw-slider orientation="vertical" [(value)]="value" />`;
  protected readonly stepCode = `<nw-slider [min]="0" [max]="10" [step]="0.5" />`;
  protected readonly disabledCode = `<nw-slider [value]="40" [disabled]="true" />`;

  protected readonly api: ApiRow[] = [
    { name: 'value', type: 'number', default: '0', description: 'Two-way bound value in single mode. Also a ControlValueAccessor.' },
    { name: 'rangeValue', type: '[number, number]', default: '[20, 80]', description: 'Two-way bound value in range mode.' },
    { name: 'range', type: 'boolean', default: 'false', description: 'Enables dual-handle range mode.' },
    { name: 'orientation', type: `'horizontal' | 'vertical'`, default: `'horizontal'`, description: 'Slider direction.' },
    { name: 'animate', type: 'boolean', default: 'false', description: 'Animates the thumb/track on non-drag (keyboard/click) changes.' },
    { name: 'min / max / step', type: 'number', default: '0 / 100 / 1', description: 'Range bounds and increment.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the slider.' },
    { name: 'onSlideEnd', type: 'output<number | [number, number]>', default: '—', description: 'Fires once when a drag/keyboard interaction finishes.' },
    { name: 'Keyboard', type: '—', default: '—', description: '←/→/↑/↓ step, PageUp/PageDown by 10×step, Home/End jump to min/max.' },
  ];
}
