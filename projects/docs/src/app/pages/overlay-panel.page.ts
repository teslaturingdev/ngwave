import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NwButtonComponent, NwOverlayPanelComponent } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-overlay-panel-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwOverlayPanelComponent,
    NwButtonComponent,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Overlay Panel</h1>
          <p class="mt-2 text-surface-600">
            A positioned popover toggled imperatively from a trigger element —
            flips to stay on-screen, traps Tab focus, and closes on Escape.
          </p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="basic" title="Basic" [code]="basicCode">
              <nw-button label="Toggle" (click)="panel.toggle($event)" />
              <nw-overlay-panel #panel>
                <p class="text-sm text-surface-700 w-56">
                  Any content — a menu, a form, a preview.
                </p>
              </nw-overlay-panel>
            </docs-demo>

            <docs-demo id="close-icon" title="Close icon" [code]="closeIconCode">
              <nw-button label="Toggle" (click)="panel2.toggle($event)" />
              <nw-overlay-panel #panel2 [showCloseIcon]="true">
                <p class="text-sm text-surface-700 w-56 pr-4">
                  Has its own close (✕) button.
                </p>
              </nw-overlay-panel>
            </docs-demo>

            <docs-demo id="form" title="Focus trap with form content" [code]="formCode">
              <nw-button label="Filter" (click)="panel3.toggle($event)" />
              <nw-overlay-panel #panel3 [showCloseIcon]="true">
                <div class="w-64 space-y-2">
                  <label class="block text-xs font-medium text-surface-600">From</label>
                  <input type="date" class="w-full h-9 px-2 rounded-nw border border-surface-300 text-sm" />
                  <label class="block text-xs font-medium text-surface-600">To</label>
                  <input type="date" class="w-full h-9 px-2 rounded-nw border border-surface-300 text-sm" />
                  <nw-button label="Apply" size="small" class="mt-1" />
                </div>
              </nw-overlay-panel>
              <p class="text-xs text-surface-500 mt-2">
                Tab cycles between the two date fields and the button only — try it.
              </p>
            </docs-demo>

            <docs-demo id="edge" title="Viewport-aware positioning" [code]="edgeCode">
              <div class="flex justify-end w-full">
                <nw-button label="Near the edge" (click)="panel4.toggle($event)" />
              </div>
              <nw-overlay-panel #panel4>
                <p class="text-sm text-surface-700 w-72">
                  This panel flips or shifts automatically if it would overflow
                  the viewport.
                </p>
              </nw-overlay-panel>
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
export class OverlayPanelDocPageComponent {
  protected readonly sections: TocSection[] = [
    { id: 'basic', label: 'Basic' },
    { id: 'close-icon', label: 'Close icon' },
    { id: 'form', label: 'Focus trap with form content' },
    { id: 'edge', label: 'Viewport-aware positioning' },
  ];

  protected readonly basicCode = `<nw-button label="Toggle" (click)="panel.toggle($event)" />
<nw-overlay-panel #panel>
  <p>Any content — a menu, a form, a preview.</p>
</nw-overlay-panel>`;
  protected readonly closeIconCode = `<nw-overlay-panel #panel [showCloseIcon]="true">
  <p>Has its own close button.</p>
</nw-overlay-panel>`;
  protected readonly formCode = `<nw-overlay-panel #panel [showCloseIcon]="true">
  <input type="date" />
  <input type="date" />
  <nw-button label="Apply" />
</nw-overlay-panel>`;
  protected readonly edgeCode = `<nw-overlay-panel #panel>
  <!-- automatically flips above / shifts left if it would overflow the viewport -->
</nw-overlay-panel>`;

  protected readonly api: ApiRow[] = [
    { name: 'dismissable', type: 'boolean', default: 'true', description: 'Close when clicking outside the panel.' },
    { name: 'showCloseIcon', type: 'boolean', default: 'false', description: 'Shows a close (✕) button inside the panel.' },
    { name: 'toggle(event)', type: 'method', default: '—', description: 'Toggle the panel, anchored to event.currentTarget.' },
    { name: 'show(event)', type: 'method', default: '—', description: 'Open the panel, anchored to event.currentTarget.' },
    { name: 'hide()', type: 'method', default: '—', description: 'Close the panel and return focus to the trigger.' },
    { name: 'onShow / onHide', type: 'output<void>', default: '—', description: 'Fires when the panel opens/closes.' },
    { name: 'Positioning', type: '—', default: '—', description: 'Opens below-left of the trigger by default; flips above and/or clamps horizontally if it would overflow the viewport.' },
    { name: 'Focus', type: '—', default: '—', description: 'Focuses the first focusable element on open, traps Tab/Shift+Tab inside the panel, and restores focus to the trigger on close.' },
    { name: 'Keyboard', type: '—', default: '—', description: 'Escape always closes the panel, regardless of dismissable.' },
  ];
}
