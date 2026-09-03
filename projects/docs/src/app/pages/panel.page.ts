import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NwPanelComponent } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-panel-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwPanelComponent,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Panel</h1>
          <p class="mt-2 text-surface-600">
            A bordered content container with an optional header bar and
            collapse toggle.
          </p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="basic" title="Basic" [code]="basicCode">
              <nw-panel header="Account settings" class="w-full">
                <p class="text-sm text-surface-600">Panel content.</p>
              </nw-panel>
            </docs-demo>

            <docs-demo id="toggleable" title="Toggleable" [code]="toggleableCode">
              <nw-panel
                header="Notifications"
                [toggleable]="true"
                [(collapsed)]="collapsed"
                class="w-full"
              >
                <p class="text-sm text-surface-600">Collapsible content.</p>
              </nw-panel>
            </docs-demo>

            <docs-demo id="icons" title="Custom icons & extra header content" [code]="iconsCode">
              <nw-panel header="Storage" [toggleable]="true" expandIcon="+" collapseIcon="−" class="w-full">
                <ng-template nwPanelIcons>
                  <span class="text-xs text-surface-500 px-1">2.1 GB used</span>
                </ng-template>
                <p class="text-sm text-surface-600">Panel content.</p>
              </nw-panel>
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
export class PanelDocPageComponent {
  protected readonly collapsed = signal(false);

  protected readonly sections: TocSection[] = [
    { id: 'basic', label: 'Basic' },
    { id: 'toggleable', label: 'Toggleable' },
    { id: 'icons', label: 'Custom icons & extra header content' },
  ];

  protected readonly basicCode = `<nw-panel header="Account settings">
  ...
</nw-panel>`;
  protected readonly toggleableCode = `<nw-panel header="Notifications" [toggleable]="true" [(collapsed)]="collapsed">
  ...
</nw-panel>`;
  protected readonly iconsCode = `<nw-panel header="Storage" [toggleable]="true" expandIcon="+" collapseIcon="−">
  <ng-template nwPanelIcons>
    <span>2.1 GB used</span>
  </ng-template>
  ...
</nw-panel>`;

  protected readonly api: ApiRow[] = [
    { name: 'header', type: 'string', default: `''`, description: 'Panel title shown in the header bar.' },
    { name: 'toggleable', type: 'boolean', default: 'false', description: 'Shows a collapse/expand toggle in the header.' },
    { name: 'collapsed', type: 'boolean', default: 'false', description: 'Two-way bound collapsed state.' },
    { name: 'expandIcon / collapseIcon', type: 'string', default: `'▾' / '▾'`, description: 'Glyph shown when collapsed/expanded (the collapsed one rotates 180° when opened).' },
    { name: 'nwPanelIcons', type: 'directive', default: '—', description: 'Extra header content, right-aligned before the toggle: <ng-template nwPanelIcons>.' },
    { name: 'nwPanelHeader', type: 'directive', default: '—', description: 'Full custom header, replacing the title: <ng-template nwPanelHeader>.' },
  ];
}
