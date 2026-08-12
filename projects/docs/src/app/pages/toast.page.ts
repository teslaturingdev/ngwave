import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NwButtonComponent, NwToastComponent, NwToastService } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-toast-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwButtonComponent,
    NwToastComponent,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Toast</h1>
          <p class="mt-2 text-surface-600">
            Fire-and-forget notifications via a signal-based service. Drop one
            <code class="text-nw-600">&lt;nw-toast&gt;</code> at your app root and
            call <code class="text-nw-600">NwToastService.show()</code>.
          </p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="severities" title="Severities" [code]="severityCode">
              <nw-button variant="success" (click)="success()">Success</nw-button>
              <nw-button variant="info" (click)="info()">Info</nw-button>
              <nw-button variant="warn" (click)="warn()">Warn</nw-button>
              <nw-button variant="danger" (click)="error()">Error</nw-button>
              <nw-button variant="secondary" (click)="secondary()">Secondary</nw-button>
              <nw-button variant="contrast" (click)="contrast()">Contrast</nw-button>
            </docs-demo>

            <docs-demo id="detail" title="Summary + detail" [code]="detailCode">
              <nw-button (click)="detail()">Show with detail</nw-button>
            </docs-demo>

            <docs-demo id="sticky" title="Sticky (no auto-dismiss)" [code]="stickyCode">
              <nw-button variant="outlined" (click)="sticky()">Sticky toast</nw-button>
            </docs-demo>
          </div>

          <div api>
            <docs-api-table [rows]="api" />
          </div>
        </docs-tabs>
      </article>

      <docs-toc [sections]="sections" />
    </div>

    <nw-toast position="top-right" />
  `,
})
export class ToastPageComponent {
  private readonly toast = inject(NwToastService);

  protected success(): void {
    this.toast.show({ severity: 'success', summary: 'Saved', detail: 'Your changes were saved.' });
  }
  protected info(): void {
    this.toast.show({ severity: 'info', summary: 'Heads up', detail: 'New update available.' });
  }
  protected warn(): void {
    this.toast.show({ severity: 'warn', summary: 'Careful', detail: 'Storage almost full.' });
  }
  protected error(): void {
    this.toast.show({ severity: 'error', summary: 'Failed', detail: 'Could not connect.' });
  }
  protected secondary(): void {
    this.toast.show({ severity: 'secondary', summary: 'Note', detail: 'Draft auto-saved.' });
  }
  protected contrast(): void {
    this.toast.show({ severity: 'contrast', summary: 'System', detail: 'Maintenance at 2am.' });
  }
  protected detail(): void {
    this.toast.show({
      severity: 'info',
      summary: 'Export ready',
      detail: 'Your CSV export is ready to download.',
    });
  }
  protected sticky(): void {
    this.toast.show({ severity: 'warn', summary: 'Action required', sticky: true });
  }

  protected readonly sections: TocSection[] = [
    { id: 'severities', label: 'Severities' },
    { id: 'detail', label: 'Summary + detail' },
    { id: 'sticky', label: 'Sticky' },
  ];

  protected readonly severityCode = `// 1. Add once at your app root:
<nw-toast position="top-right" />

// 2. Inject the service and fire toasts:
private toast = inject(NwToastService);
this.toast.show({ severity: 'success', summary: 'Saved' });`;

  protected readonly detailCode = `this.toast.show({
  severity: 'info',
  summary: 'Export ready',
  detail: 'Your CSV export is ready to download.',
});`;

  protected readonly stickyCode = `// sticky: true keeps the toast until dismissed
this.toast.show({ severity: 'warn', summary: 'Action required', sticky: true });`;

  protected readonly api: ApiRow[] = [
    { name: 'NwToastService.show(msg)', type: 'method', default: '—', description: 'Shows a toast: { severity, summary, detail?, life?, sticky?, closable?, key?, icon? }.' },
    { name: 'NwToastService.remove(id)', type: 'method', default: '—', description: 'Dismisses a specific toast.' },
    { name: 'NwToastService.clear(key?)', type: 'method', default: '—', description: 'Removes all toasts, or only those for a keyed outlet.' },
    { name: 'severity', type: `'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast'`, default: '—', description: 'Toast color/intent.' },
    { name: 'life', type: 'number', default: '3000', description: 'Auto-dismiss delay in ms; 0 keeps it until dismissed.' },
    { name: 'sticky', type: 'boolean', default: 'false', description: 'Keeps the toast until dismissed (ignores life).' },
    { name: 'closable', type: 'boolean', default: 'true', description: 'Shows the ✕ dismiss button.' },
    { name: 'key', type: 'string', default: '—', description: 'Routes the message to a matching <nw-toast key="...">.' },
    { name: 'position (nw-toast)', type: `'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'`, default: `'top-right'`, description: 'Where the toast stack appears.' },
    { name: 'key (nw-toast)', type: 'string', default: `''`, description: 'Only renders messages with a matching key.' },
  ];
}
