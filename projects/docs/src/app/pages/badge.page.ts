import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NwBadgeComponent, NwOverlayBadgeComponent } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-badge-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwBadgeComponent,
    NwOverlayBadgeComponent,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Badge</h1>
          <p class="mt-2 text-surface-600">
            A small numeric, text, or dot indicator — plain or overlaid on other content.
          </p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="severity" title="Severity" [code]="severityCode">
              <div class="flex items-center gap-3">
                <nw-badge value="2" severity="success" />
                <nw-badge value="4" severity="info" />
                <nw-badge value="8" severity="warn" />
                <nw-badge value="16" severity="danger" />
                <nw-badge value="32" severity="secondary" />
                <nw-badge value="64" severity="contrast" />
              </div>
            </docs-demo>

            <docs-demo id="size" title="Size" [code]="sizeCode">
              <div class="flex items-center gap-3">
                <nw-badge value="1" severity="danger" size="small" />
                <nw-badge value="1" severity="danger" size="normal" />
                <nw-badge value="1" severity="danger" size="large" />
              </div>
            </docs-demo>

            <docs-demo id="dot" title="Dot (no value)" [code]="dotCode">
              <nw-badge severity="danger" />
            </docs-demo>

            <docs-demo id="overlay" title="Overlay badge" [code]="overlayCode">
              <div class="flex items-center gap-8">
                <nw-overlay-badge value="4" severity="danger">
                  <span class="pi pi-bell text-2xl text-surface-600"></span>
                </nw-overlay-badge>
                <nw-overlay-badge severity="danger">
                  <span class="pi pi-envelope text-2xl text-surface-600"></span>
                </nw-overlay-badge>
              </div>
            </docs-demo>
          </div>

          <div api>
            <h3 class="text-sm font-semibold text-surface-900 mb-2">nw-badge</h3>
            <docs-api-table [rows]="badgeApi" />
            <h3 class="text-sm font-semibold text-surface-900 mt-8 mb-2">nw-overlay-badge</h3>
            <docs-api-table [rows]="overlayBadgeApi" />
          </div>
        </docs-tabs>
      </article>

      <docs-toc [sections]="sections" />
    </div>
  `,
})
export class BadgeDocPageComponent {
  protected readonly sections: TocSection[] = [
    { id: 'severity', label: 'Severity' },
    { id: 'size', label: 'Size' },
    { id: 'dot', label: 'Dot (no value)' },
    { id: 'overlay', label: 'Overlay badge' },
  ];

  protected readonly severityCode = `<nw-badge value="2" severity="success" />
<nw-badge value="16" severity="danger" />`;
  protected readonly sizeCode = `<nw-badge value="1" severity="danger" size="small" />
<nw-badge value="1" severity="danger" size="large" />`;
  protected readonly dotCode = `<nw-badge severity="danger" />`;
  protected readonly overlayCode = `<nw-overlay-badge value="4" severity="danger">
  <span class="pi pi-bell text-2xl"></span>
</nw-overlay-badge>`;

  protected readonly badgeApi: ApiRow[] = [
    { name: 'value', type: 'string | number | null', default: `''`, description: 'Badge content. Renders as a dot when empty/null.' },
    { name: 'severity', type: `'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'`, default: `'secondary'`, description: 'Color scheme.' },
    { name: 'size', type: `'small' | 'normal' | 'large'`, default: `'normal'`, description: 'Badge size.' },
  ];

  protected readonly overlayBadgeApi: ApiRow[] = [
    { name: 'value', type: 'string | number | null', default: `''`, description: 'Badge content. Renders as a dot when empty/null.' },
    { name: 'severity', type: `'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'`, default: `'danger'`, description: 'Color scheme.' },
    { name: 'size', type: `'small' | 'normal' | 'large'`, default: `'small'`, description: 'Badge size.' },
  ];
}
