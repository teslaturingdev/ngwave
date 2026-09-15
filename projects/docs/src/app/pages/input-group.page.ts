import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NwInputGroupAddonComponent, NwInputGroupComponent, NwInputTextComponent } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';

@Component({
  selector: 'docs-input-group-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwInputGroupComponent,
    NwInputGroupAddonComponent,
    NwInputTextComponent,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Input Group</h1>
          <p class="mt-2 text-surface-600">
            Groups an input with one or more addons — a currency prefix, units suffix, or icon —
            into a single visually-connected row.
          </p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="prefix" title="Prefix addon" [code]="prefixCode">
              <nw-input-group class="max-w-xs">
                <nw-input-group-addon>$</nw-input-group-addon>
                <nw-input-text placeholder="0.00" />
              </nw-input-group>
            </docs-demo>

            <docs-demo id="suffix" title="Suffix addon" [code]="suffixCode">
              <nw-input-group class="max-w-xs">
                <nw-input-text placeholder="yoursite" />
                <nw-input-group-addon>.com</nw-input-group-addon>
              </nw-input-group>
            </docs-demo>

            <docs-demo id="both" title="Both sides" [code]="bothCode">
              <nw-input-group class="max-w-xs">
                <nw-input-group-addon>https://</nw-input-group-addon>
                <nw-input-text placeholder="example.com" />
                <nw-input-group-addon>/api</nw-input-group-addon>
              </nw-input-group>
            </docs-demo>
          </div>

          <div api>
            <p class="text-sm text-surface-600">
              <code>nw-input-group</code> is a plain flex wrapper; <code>nw-input-group-addon</code>
              accepts any projected content (text, icons) and has no inputs of its own beyond a
              CSS class.
            </p>
          </div>
        </docs-tabs>
      </article>

      <docs-toc [sections]="sections" />
    </div>
  `,
})
export class InputGroupDocPageComponent {
  protected readonly sections: TocSection[] = [
    { id: 'prefix', label: 'Prefix addon' },
    { id: 'suffix', label: 'Suffix addon' },
    { id: 'both', label: 'Both sides' },
  ];

  protected readonly prefixCode = `<nw-input-group>
  <nw-input-group-addon>$</nw-input-group-addon>
  <nw-input-text placeholder="0.00" />
</nw-input-group>`;
  protected readonly suffixCode = `<nw-input-group>
  <nw-input-text placeholder="yoursite" />
  <nw-input-group-addon>.com</nw-input-group-addon>
</nw-input-group>`;
  protected readonly bothCode = `<nw-input-group>
  <nw-input-group-addon>https://</nw-input-group-addon>
  <nw-input-text placeholder="example.com" />
  <nw-input-group-addon>/api</nw-input-group-addon>
</nw-input-group>`;
}
