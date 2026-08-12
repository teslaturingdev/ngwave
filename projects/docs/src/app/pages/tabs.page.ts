import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NwTabComponent, NwTabsComponent } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-tabs-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwTabsComponent,
    NwTabComponent,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Tabs</h1>
          <p class="mt-2 text-surface-600">
            Horizontal or vertical tabbed panels — with closable tabs, lazy
            loading, scrollable overflow, header icons/badges, and full keyboard
            navigation.
          </p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="basic" title="Horizontal" [code]="basicCode">
              <nw-tabs class="w-full">
                <nw-tab header="Overview"><p class="text-surface-700">The overview panel.</p></nw-tab>
                <nw-tab header="Details"><p class="text-surface-700">The details panel.</p></nw-tab>
                <nw-tab header="Activity"><p class="text-surface-700">The activity panel.</p></nw-tab>
              </nw-tabs>
            </docs-demo>

            <docs-demo id="badges" title="Icons & badges" [code]="badgeCode">
              <nw-tabs class="w-full">
                <nw-tab header="Inbox" badge="4"><p class="text-surface-700">4 new messages.</p></nw-tab>
                <nw-tab header="Sent"><p class="text-surface-700">Sent items.</p></nw-tab>
                <nw-tab header="Spam" badge="99+"><p class="text-surface-700">Filtered.</p></nw-tab>
              </nw-tabs>
            </docs-demo>

            <docs-demo id="closable" title="Closable" [code]="closableCode">
              <nw-tabs class="w-full">
                <nw-tab header="Doc 1" [closable]="true"><p class="text-surface-700">First document.</p></nw-tab>
                <nw-tab header="Doc 2" [closable]="true"><p class="text-surface-700">Second document.</p></nw-tab>
                <nw-tab header="Doc 3" [closable]="true"><p class="text-surface-700">Third document.</p></nw-tab>
              </nw-tabs>
            </docs-demo>

            <docs-demo id="lazy" title="Lazy loading" [code]="lazyCode">
              <nw-tabs [lazy]="true" class="w-full">
                <nw-tab header="Cheap"><p class="text-surface-700">Rendered immediately.</p></nw-tab>
                <nw-tab header="Expensive"><p class="text-surface-700">Only rendered when first opened (then cached).</p></nw-tab>
              </nw-tabs>
            </docs-demo>

            <docs-demo id="scrollable" title="Scrollable" [code]="scrollableCode">
              <nw-tabs [scrollable]="true" class="w-full max-w-md">
                @for (n of many; track n) {
                  <nw-tab [header]="'Tab ' + n"><p class="text-surface-700">Panel {{ n }}.</p></nw-tab>
                }
              </nw-tabs>
            </docs-demo>

            <docs-demo id="vertical" title="Vertical" [code]="verticalCode">
              <nw-tabs orientation="vertical" class="w-full">
                <nw-tab header="Profile"><p class="text-surface-700">Profile settings.</p></nw-tab>
                <nw-tab header="Security"><p class="text-surface-700">Security settings.</p></nw-tab>
                <nw-tab header="Billing" [disabled]="true"><p>—</p></nw-tab>
              </nw-tabs>
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
export class TabsDocPageComponent {
  protected readonly many = Array.from({ length: 12 }, (_, i) => i + 1);

  protected readonly sections: TocSection[] = [
    { id: 'basic', label: 'Horizontal' },
    { id: 'badges', label: 'Icons & badges' },
    { id: 'closable', label: 'Closable' },
    { id: 'lazy', label: 'Lazy loading' },
    { id: 'scrollable', label: 'Scrollable' },
    { id: 'vertical', label: 'Vertical' },
  ];

  protected readonly basicCode = `<nw-tabs [(activeIndex)]="index">
  <nw-tab header="Overview">…</nw-tab>
  <nw-tab header="Details">…</nw-tab>
</nw-tabs>`;
  protected readonly badgeCode = `<nw-tab header="Inbox" badge="4" leftIcon="pi pi-inbox">…</nw-tab>`;
  protected readonly closableCode = `<nw-tabs (tabClose)="onClose($event)">
  <nw-tab header="Doc 1" [closable]="true">…</nw-tab>
</nw-tabs>`;
  protected readonly lazyCode = `<nw-tabs [lazy]="true">
  <nw-tab header="Expensive">…rendered on first open, then cached…</nw-tab>
</nw-tabs>`;
  protected readonly scrollableCode = `<nw-tabs [scrollable]="true">
  @for (n of many; track n) { <nw-tab [header]="'Tab ' + n">…</nw-tab> }
</nw-tabs>`;
  protected readonly verticalCode = `<nw-tabs orientation="vertical">
  <nw-tab header="Profile">…</nw-tab>
  <nw-tab header="Billing" [disabled]="true">…</nw-tab>
</nw-tabs>`;

  protected readonly api: ApiRow[] = [
    { name: 'activeIndex (nw-tabs)', type: 'number', default: '0', description: 'Two-way bound index of the active tab.' },
    { name: 'orientation', type: `'horizontal' | 'vertical'`, default: `'horizontal'`, description: 'Tab bar layout.' },
    { name: 'scrollable', type: 'boolean', default: 'false', description: 'Enables horizontal scroll + nav arrows when tabs overflow.' },
    { name: 'lazy', type: 'boolean', default: 'false', description: 'Renders a tab’s content only when first activated (then caches).' },
    { name: 'tabClose', type: 'EventEmitter<number>', default: '—', description: 'Fires with the index of a closed tab.' },
    { name: 'header (nw-tab)', type: 'string', default: `''`, description: 'Tab label (or use *nwTabHeader for a custom header).' },
    { name: 'leftIcon (nw-tab)', type: 'string', default: `''`, description: 'CSS class for a leading icon.' },
    { name: 'badge (nw-tab)', type: 'string', default: `''`, description: 'Badge text shown in the tab header.' },
    { name: 'closable (nw-tab)', type: 'boolean', default: 'false', description: 'Adds a ✕ to close the tab.' },
    { name: 'disabled (nw-tab)', type: 'boolean', default: 'false', description: 'Disables the tab.' },
  ];
}
