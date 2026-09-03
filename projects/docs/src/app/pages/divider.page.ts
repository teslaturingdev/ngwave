import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NwDividerComponent } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-divider-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwDividerComponent,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Divider</h1>
          <p class="mt-2 text-surface-600">
            A horizontal or vertical rule, optionally with a label.
          </p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="basic" title="Basic" [code]="basicCode">
              <div class="w-full">
                <p class="text-sm text-surface-600">Above</p>
                <nw-divider />
                <p class="text-sm text-surface-600">Below</p>
              </div>
            </docs-demo>

            <docs-demo id="label" title="With a label" [code]="labelCode">
              <div class="w-full">
                <nw-divider>OR</nw-divider>
              </div>
            </docs-demo>

            <docs-demo id="align" title="Align" [code]="alignCode">
              <div class="w-full space-y-4">
                <nw-divider align="left">Left</nw-divider>
                <nw-divider align="center">Center</nw-divider>
                <nw-divider align="right">Right</nw-divider>
              </div>
            </docs-demo>

            <docs-demo id="vertical" title="Vertical" [code]="verticalCode">
              <div class="flex h-16 items-center">
                <span class="text-sm text-surface-600">Left</span>
                <nw-divider layout="vertical" />
                <span class="text-sm text-surface-600">Right</span>
              </div>
            </docs-demo>

            <docs-demo id="type" title="Line type" [code]="typeCode">
              <div class="w-full space-y-4">
                <nw-divider type="solid" />
                <nw-divider type="dashed" />
                <nw-divider type="dotted" />
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
export class DividerDocPageComponent {
  protected readonly sections: TocSection[] = [
    { id: 'basic', label: 'Basic' },
    { id: 'label', label: 'With a label' },
    { id: 'align', label: 'Align' },
    { id: 'vertical', label: 'Vertical' },
    { id: 'type', label: 'Line type' },
  ];

  protected readonly basicCode = `<nw-divider />`;
  protected readonly labelCode = `<nw-divider>OR</nw-divider>`;
  protected readonly alignCode = `<nw-divider align="left">Left</nw-divider>
<nw-divider align="right">Right</nw-divider>`;
  protected readonly verticalCode = `<nw-divider layout="vertical" />`;
  protected readonly typeCode = `<nw-divider type="dashed" />
<nw-divider type="dotted" />`;

  protected readonly api: ApiRow[] = [
    { name: 'layout', type: `'horizontal' | 'vertical'`, default: `'horizontal'`, description: 'Orientation of the divider.' },
    { name: 'type', type: `'solid' | 'dashed' | 'dotted'`, default: `'solid'`, description: 'Line style.' },
    { name: 'align', type: `'left' | 'center' | 'right' | 'top' | 'bottom'`, default: `'center'`, description: 'Position of the projected label along the line.' },
  ];
}
