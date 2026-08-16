import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NwSpinnerComponent } from '@ngwave/ui';
import { AuthService } from '../auth.service';

interface HistoryEntry {
  id: string;
  tool: 'cost-report' | 'migrate-ai' | 'migrate-project' | 'own-library';
  createdAt: string;
  summary: Record<string, string | number>;
  payload?: unknown;
  blobUrl?: string;
}

const TOOL_LABEL: Record<HistoryEntry['tool'], string> = {
  'cost-report': 'Cost Report',
  'migrate-ai': 'Migrate with AI',
  'migrate-project': 'Migrate Project',
  'own-library': 'Own Library',
};

@Component({
  selector: 'docs-dashboard-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NwSpinnerComponent, RouterLink],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-surface-900">Your saved migrations</h1>
        <p class="mt-1 text-sm text-surface-500">
          Anything you save from a tool with "Save to my account" shows up here.
        </p>
      </div>

      @if (loading()) {
        <div
          class="flex flex-col items-center justify-center gap-3 rounded-nw-lg border border-surface-200 bg-surface-0 px-4 py-16 text-center text-surface-500 shadow-nw-sm"
        >
          <nw-spinner [size]="28" />
          <div class="text-sm">Loading…</div>
        </div>
      } @else if (error()) {
        <div class="rounded-nw border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {{ error() }}
        </div>
      } @else if (!history().length) {
        <div
          class="rounded-nw-lg border-2 border-dashed border-surface-300 bg-surface-0 p-10 text-center"
        >
          <div class="text-4xl">🗂️</div>
          <p class="mt-3 text-surface-700">Nothing saved yet.</p>
          <a routerLink="/migrate/report" class="mt-3 inline-block text-sm font-medium text-nw-600 hover:underline">
            Try the Cost Report →
          </a>
        </div>
      } @else {
        <div class="space-y-3">
          @for (entry of history(); track entry.id) {
            <div
              class="flex flex-wrap items-center justify-between gap-3 rounded-nw-lg border border-surface-200 bg-surface-0 p-4 shadow-nw-sm"
            >
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <span class="rounded-full bg-nw-100 px-2 py-0.5 text-xs font-semibold uppercase text-nw-700">
                    {{ toolLabel(entry.tool) }}
                  </span>
                  <span class="text-xs text-surface-400">{{ formatDate(entry.createdAt) }}</span>
                </div>
                <div class="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-surface-600">
                  @for (kv of summaryEntries(entry); track kv[0]) {
                    <span><strong class="text-surface-900">{{ kv[1] }}</strong> {{ kv[0] }}</span>
                  }
                </div>
              </div>
              <button
                type="button"
                (click)="download(entry)"
                class="shrink-0 rounded-nw bg-surface-100 px-3 py-1.5 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-200"
              >
                Download
              </button>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class DashboardPageComponent implements OnInit {
  private readonly auth = inject(AuthService);

  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly history = signal<HistoryEntry[]>([]);

  async ngOnInit(): Promise<void> {
    try {
      const token = await this.auth.getToken();
      const resp = await fetch('/api/list-migrations', {
        headers: token ? { authorization: `Bearer ${token}` } : {},
      });
      const raw = await resp.text();
      const data = raw ? JSON.parse(raw) : {};
      if (!resp.ok) throw new Error(data.error || `Request failed (${resp.status}).`);
      this.history.set(data.history ?? []);
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'Could not load your saved migrations.');
    } finally {
      this.loading.set(false);
    }
  }

  protected toolLabel(tool: HistoryEntry['tool']): string {
    return TOOL_LABEL[tool];
  }

  protected formatDate(iso: string): string {
    return new Date(iso).toLocaleString();
  }

  protected summaryEntries(entry: HistoryEntry): [string, string | number][] {
    return Object.entries(entry.summary);
  }

  protected download(entry: HistoryEntry): void {
    if (entry.blobUrl) {
      window.open(entry.blobUrl, '_blank');
      return;
    }
    const blob = new Blob([JSON.stringify(entry.payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${entry.tool}-${entry.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
