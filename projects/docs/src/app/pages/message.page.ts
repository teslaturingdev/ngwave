import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NwMessageComponent } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-message-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwMessageComponent,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Message</h1>
          <p class="mt-2 text-surface-600">
            A lightweight, single-line inline status message — e.g. form field validation
            feedback. Distinct from nw-alert (a bordered block callout) and nw-toast (a
            transient overlay notification): nw-message stays inline in the document flow.
          </p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="severity" title="Severity" [code]="severityCode">
              <div class="flex flex-col items-start gap-2">
                <nw-message severity="success" text="Saved successfully" />
                <nw-message severity="info" text="A new version is available" />
                <nw-message severity="warn" text="Your session will expire soon" />
                <nw-message severity="error" text="This field is required" />
              </div>
            </docs-demo>

            <docs-demo id="closable" title="Closable" [code]="closableCode">
              <nw-message severity="info" text="Dismiss me" [closable]="true" />
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
export class MessageDocPageComponent {
  protected readonly sections: TocSection[] = [
    { id: 'severity', label: 'Severity' },
    { id: 'closable', label: 'Closable' },
  ];

  protected readonly severityCode = `<nw-message severity="success" text="Saved successfully" />
<nw-message severity="error" text="This field is required" />`;
  protected readonly closableCode = `<nw-message severity="info" text="Dismiss me" [closable]="true" />`;

  protected readonly api: ApiRow[] = [
    { name: 'severity', type: `'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast'`, default: `'info'`, description: 'Color scheme and icon.' },
    { name: 'text', type: 'string', default: `''`, description: 'Message text. Can be combined with projected content.' },
    { name: 'closable', type: 'boolean', default: 'false', description: 'Shows a dismiss button.' },
    { name: 'life', type: 'number | null', default: 'null', description: 'Auto-dismiss delay in ms.' },
    { name: 'closed', type: 'output<void>', default: '—', description: 'Emitted when the message is dismissed.' },
  ];
}
