import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NwSplitterComponent, NwSplitterPanelComponent } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-splitter-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwSplitterComponent,
    NwSplitterPanelComponent,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Splitter</h1>
          <p class="mt-2 text-surface-600">Resizable panes with a draggable divider.</p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="basic" title="Horizontal" [code]="basicCode">
              <nw-splitter class="h-40 w-full rounded-nw border border-surface-200">
                <nw-splitter-panel class="p-4 bg-surface-50">Left</nw-splitter-panel>
                <nw-splitter-panel class="p-4">Right</nw-splitter-panel>
              </nw-splitter>
            </docs-demo>

            <docs-demo id="sizes" title="Initial & minimum size" [code]="sizesCode">
              <nw-splitter class="h-40 w-full rounded-nw border border-surface-200">
                <nw-splitter-panel [size]="20" [minSize]="10" class="p-4 bg-surface-50">
                  20%, min 10%
                </nw-splitter-panel>
                <nw-splitter-panel [size]="80" [minSize]="30" class="p-4">80%, min 30%</nw-splitter-panel>
              </nw-splitter>
            </docs-demo>

            <docs-demo id="vertical" title="Vertical" [code]="verticalCode">
              <nw-splitter orientation="vertical" class="h-56 w-full rounded-nw border border-surface-200">
                <nw-splitter-panel class="p-4 bg-surface-50">Top</nw-splitter-panel>
                <nw-splitter-panel class="p-4">Bottom</nw-splitter-panel>
              </nw-splitter>
            </docs-demo>

            <docs-demo id="three" title="Three panes, thick gutter" [code]="threeCode">
              <nw-splitter [gutterSize]="10" class="h-40 w-full rounded-nw border border-surface-200">
                <nw-splitter-panel class="p-4 bg-surface-50">A</nw-splitter-panel>
                <nw-splitter-panel class="p-4">B</nw-splitter-panel>
                <nw-splitter-panel class="p-4 bg-surface-50">C</nw-splitter-panel>
              </nw-splitter>
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
export class SplitterDocPageComponent {
  protected readonly sections: TocSection[] = [
    { id: 'basic', label: 'Horizontal' },
    { id: 'sizes', label: 'Initial & minimum size' },
    { id: 'vertical', label: 'Vertical' },
    { id: 'three', label: 'Three panes, thick gutter' },
  ];

  protected readonly basicCode = `<nw-splitter>
  <nw-splitter-panel>Left</nw-splitter-panel>
  <nw-splitter-panel>Right</nw-splitter-panel>
</nw-splitter>`;
  protected readonly sizesCode = `<nw-splitter>
  <nw-splitter-panel [size]="20" [minSize]="10">...</nw-splitter-panel>
  <nw-splitter-panel [size]="80" [minSize]="30">...</nw-splitter-panel>
</nw-splitter>`;
  protected readonly verticalCode = `<nw-splitter orientation="vertical">
  <nw-splitter-panel>Top</nw-splitter-panel>
  <nw-splitter-panel>Bottom</nw-splitter-panel>
</nw-splitter>`;
  protected readonly threeCode = `<nw-splitter [gutterSize]="10">
  <nw-splitter-panel>A</nw-splitter-panel>
  <nw-splitter-panel>B</nw-splitter-panel>
  <nw-splitter-panel>C</nw-splitter-panel>
</nw-splitter>`;

  protected readonly api: ApiRow[] = [
    { name: 'orientation (nw-splitter)', type: `'horizontal' | 'vertical'`, default: `'horizontal'`, description: 'Split direction.' },
    { name: 'sizes (nw-splitter)', type: 'number[]', default: 'from panel [size]s, or even split', description: 'Two-way bound panel sizes as percentages, summing to 100.' },
    { name: 'gutterSize (nw-splitter)', type: 'number', default: '6', description: 'Divider thickness in pixels.' },
    { name: 'stateKey (nw-splitter)', type: 'string', default: 'undefined', description: 'When set, persists and restores panel sizes under this key.' },
    { name: 'stateStorage (nw-splitter)', type: `'session' | 'local'`, default: `'session'`, description: 'Storage used for stateKey persistence.' },
    { name: 'resizeStart / resizeEnd (nw-splitter)', type: 'output<number[]>', default: '—', description: 'Fires when a drag starts/ends, with the current sizes.' },
    { name: 'size (nw-splitter-panel)', type: 'number', default: 'even split', description: 'Initial size as a percentage.' },
    { name: 'minSize (nw-splitter-panel)', type: 'number', default: '0', description: 'Minimum size as a percentage, enforced while dragging.' },
  ];
}
