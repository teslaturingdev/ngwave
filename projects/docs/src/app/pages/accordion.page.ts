import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NwAccordionComponent, NwAccordionTabComponent } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-accordion-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwAccordionComponent,
    NwAccordionTabComponent,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Accordion</h1>
          <p class="mt-2 text-surface-600">
            Vertically stacked, collapsible content panels.
          </p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="basic" title="Basic" [code]="basicCode">
              <nw-accordion class="w-full">
                <nw-accordion-tab header="What is NgWave?">
                  An open-source Angular component library.
                </nw-accordion-tab>
                <nw-accordion-tab header="Is it free?">
                  Yes, MIT licensed.
                </nw-accordion-tab>
              </nw-accordion>
            </docs-demo>

            <docs-demo id="multiple" title="Multiple open" [code]="multipleCode">
              <nw-accordion [multiple]="true" class="w-full">
                <nw-accordion-tab header="Section A">Content A</nw-accordion-tab>
                <nw-accordion-tab header="Section B">Content B</nw-accordion-tab>
                <nw-accordion-tab header="Section C" [disabled]="true">Disabled</nw-accordion-tab>
              </nw-accordion>
            </docs-demo>

            <docs-demo id="icons" title="Custom icons & select on focus" [code]="iconsCode">
              <nw-accordion expandIcon="+" collapseIcon="−" [selectOnFocus]="true" class="w-full">
                <nw-accordion-tab header="Keyboard nav">
                  Try Tab to focus a header, then ↑/↓/Home/End.
                </nw-accordion-tab>
                <nw-accordion-tab header="Select on focus">
                  This tab opened as soon as it received focus.
                </nw-accordion-tab>
              </nw-accordion>
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
export class AccordionDocPageComponent {
  protected readonly sections: TocSection[] = [
    { id: 'basic', label: 'Basic' },
    { id: 'multiple', label: 'Multiple open' },
    { id: 'icons', label: 'Custom icons & select on focus' },
  ];

  protected readonly basicCode = `<nw-accordion>
  <nw-accordion-tab header="What is NgWave?">...</nw-accordion-tab>
  <nw-accordion-tab header="Is it free?">...</nw-accordion-tab>
</nw-accordion>`;
  protected readonly multipleCode = `<nw-accordion [multiple]="true">
  <nw-accordion-tab header="Section A">...</nw-accordion-tab>
  <nw-accordion-tab header="Section B">...</nw-accordion-tab>
</nw-accordion>`;
  protected readonly iconsCode = `<nw-accordion expandIcon="+" collapseIcon="−" [selectOnFocus]="true">
  <nw-accordion-tab header="Keyboard nav">...</nw-accordion-tab>
</nw-accordion>`;

  protected readonly api: ApiRow[] = [
    { name: 'multiple (nw-accordion)', type: 'boolean', default: 'false', description: 'Allow more than one tab open at once.' },
    { name: 'expandedIndices (nw-accordion)', type: 'number[]', default: '[]', description: 'Two-way bound indices of open tabs.' },
    { name: 'expandIcon / collapseIcon (nw-accordion)', type: 'string', default: `'▾' / '▾'`, description: 'Glyph shown per-tab when expanded/collapsed (the collapsed one rotates 180° when opened).' },
    { name: 'selectOnFocus (nw-accordion)', type: 'boolean', default: 'false', description: 'Opens a tab as soon as its header receives keyboard focus.' },
    { name: 'header (nw-accordion-tab)', type: 'string', default: `''`, description: 'Tab header text.' },
    { name: 'disabled (nw-accordion-tab)', type: 'boolean', default: 'false', description: 'Disables toggling this tab.' },
    { name: 'Keyboard', type: '—', default: '—', description: '↑/↓ move focus between headers, Home/End jump to first/last, Enter/Space toggle.' },
  ];
}
