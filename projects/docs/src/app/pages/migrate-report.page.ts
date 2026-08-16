import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  CollectedFile,
  collectFromDataTransfer,
  collectFromFileList,
  isRelevantPath,
  MAX_FILES,
  readFileContents,
} from '@ngwave/files';
import { buildCostReport, ComponentCostRow, CostReport } from '@ngwave/report';
import { NwSpinnerComponent } from '@ngwave/ui';

function isRelevant(path: string): boolean {
  return isRelevantPath(path, '.html');
}

@Component({
  selector: 'docs-migrate-report-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NwSpinnerComponent, RouterLink],
  template: `
    <div class="space-y-6">
      <header
        class="relative overflow-hidden rounded-nw-lg border border-surface-200 bg-gradient-to-br from-nw-600 to-nw-800 p-6 text-white shadow-nw-md"
      >
        <div
          class="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl"
        ></div>
        <div class="relative">
          <span
            class="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium backdrop-blur"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-green-300"></span>
            Runs 100% in your browser — nothing is uploaded, free, no sign-up
          </span>
          <h1 class="mt-3 text-3xl font-bold tracking-tight">Migration Cost Report</h1>
          <p class="mt-1.5 max-w-2xl text-white/80">
            Point this at your PrimeNG project and see, before you commit a single
            hour, what it actually costs to move to
            <strong>Angular Material</strong>, <strong>NgWave</strong>, or your own
            component library — component by component.
          </p>
          <a
            routerLink="/migrate"
            class="mt-3 inline-flex items-center gap-1.5 text-sm text-white/70 underline-offset-2 hover:text-white hover:underline"
          >
            ← Already know you're going to NgWave? Use the instant codemod
          </a>
        </div>
      </header>

      @if (!report()) {
        <div
          class="rounded-nw-lg border-2 border-dashed p-10 text-center transition-colors"
          [class]="dragOver() ? 'border-nw-500 bg-nw-50' : 'border-surface-300 bg-surface-0'"
          (dragover)="onDragOver($event)"
          (dragleave)="onDragLeave($event)"
          (drop)="onDrop($event)"
        >
          <div class="text-4xl">📁</div>
          <p class="mt-3 text-surface-700">
            Drag a project folder here, or
          </p>
          <div class="mt-3 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              (click)="folderInput.click()"
              class="rounded-nw bg-nw-600 px-4 py-2.5 text-sm font-semibold text-white shadow-nw-sm transition-colors hover:bg-nw-700"
            >
              Choose a folder
            </button>
            <button
              type="button"
              (click)="filesInput.click()"
              class="rounded-nw bg-surface-100 px-4 py-2.5 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-200"
            >
              or choose individual .html files
            </button>
          </div>
          <p class="mt-3 text-xs text-surface-400">
            Only <code>.html</code> template files are read; <code>node_modules</code>,
            <code>dist</code> and <code>.git</code> are skipped automatically.
          </p>
          <input
            #folderInput
            type="file"
            webkitdirectory
            multiple
            hidden
            (change)="onFolderInput($event)"
          />
          <input
            #filesInput
            type="file"
            multiple
            accept=".html"
            hidden
            (change)="onFilesInput($event)"
          />
        </div>
      }

      @if (scanning()) {
        <div
          class="flex flex-col items-center justify-center gap-3 rounded-nw-lg border border-surface-200 bg-surface-0 px-4 py-16 text-center text-surface-500 shadow-nw-sm"
        >
          <nw-spinner [size]="28" />
          <div class="text-sm">Scanning {{ scanCount() }} files…</div>
        </div>
      }

      @if (error()) {
        <div class="rounded-nw border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {{ error() }}
        </div>
      }

      @if (report(); as r) {
        <div class="space-y-6 animate-nw-fade-in">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="text-sm text-surface-600">
              Scanned <strong class="text-surface-900">{{ r.fileCount }}</strong> files ·
              found <strong class="text-surface-900">{{ r.rows.length }}</strong> distinct
              components ·
              <strong class="text-surface-900">{{ r.totalOccurrences }}</strong> total usages
            </div>
            <button
              type="button"
              (click)="clear()"
              class="rounded-full px-3 py-1 text-sm text-surface-500 hover:bg-surface-100"
            >
              Scan another project
            </button>
          </div>

          @if (truncated()) {
            <div class="rounded-nw border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              Showing results for the first {{ maxFiles }} matching files (more were found) —
              scan a subdirectory for full coverage of a very large repo.
            </div>
          }

          <!-- Three-destination summary -->
          <div class="grid gap-4 sm:grid-cols-3">
            <div class="rounded-nw-lg border border-surface-200 bg-surface-0 p-4 shadow-nw-sm">
              <div class="text-xs font-semibold uppercase tracking-wide text-surface-500">
                NgWave
              </div>
              <div class="mt-1 text-2xl font-bold text-surface-900">
                {{ r.ngwaveSummary.automatedPct }}%
              </div>
              <div class="text-xs text-surface-500">automated (exact)</div>
              <div class="mt-2 text-xs text-surface-600">
                {{ r.ngwaveSummary.mappedCount }} components supported ·
                {{ r.ngwaveSummary.unsupportedCount }} not yet
              </div>
            </div>
            <div class="rounded-nw-lg border border-surface-200 bg-surface-0 p-4 shadow-nw-sm">
              <div class="text-xs font-semibold uppercase tracking-wide text-surface-500">
                Angular Material
              </div>
              <div class="mt-1 text-2xl font-bold text-surface-900">
                {{ r.materialSummary.automatedPct }}%
              </div>
              <div class="text-xs text-surface-500">estimated automated</div>
              <div class="mt-2 text-xs text-surface-600">
                {{ r.materialSummary.mappedCount }} clean ·
                {{ r.materialSummary.partialOrManualCount }} partial ·
                {{ r.materialSummary.unsupportedCount }} unsupported
              </div>
            </div>
            <div class="rounded-nw-lg border border-surface-200 bg-surface-0 p-4 shadow-nw-sm">
              <div class="text-xs font-semibold uppercase tracking-wide text-surface-500">
                Own library (CDK)
              </div>
              <div class="mt-1 text-2xl font-bold text-surface-900">{{ r.ownCdk.tier }}</div>
              <div class="text-xs text-surface-500">{{ r.ownCdk.hoursRange }} — rough estimate</div>
              <div class="mt-2 text-xs text-surface-600">
                Built from {{ r.ownCdk.distinctComponents }} distinct components you use
              </div>
            </div>
          </div>

          <!-- Inventory table -->
          <div class="overflow-x-auto rounded-nw-lg border border-surface-200 bg-surface-0 shadow-nw-sm">
            <table class="w-full text-left text-sm">
              <thead class="border-b border-surface-200 bg-surface-50 text-xs uppercase tracking-wide text-surface-500">
                <tr>
                  <th class="px-4 py-2.5">Component</th>
                  <th class="px-4 py-2.5">Uses</th>
                  <th class="px-4 py-2.5">NgWave</th>
                  <th class="px-4 py-2.5">Material</th>
                </tr>
              </thead>
              <tbody>
                @for (row of r.rows; track row.tag) {
                  <tr class="border-b border-surface-100 last:border-0">
                    <td class="px-4 py-2.5 font-mono text-surface-900">{{ row.tag }}</td>
                    <td class="px-4 py-2.5 text-surface-600">{{ row.count }}</td>
                    <td class="px-4 py-2.5">
                      <span
                        class="rounded-full px-2 py-0.5 text-xs font-medium"
                        [class]="row.ngwave.hasAdapter ? 'bg-green-100 text-green-700' : 'bg-surface-100 text-surface-500'"
                      >
                        {{ row.ngwave.hasAdapter ? 'Supported' : 'Not yet' }}
                      </span>
                    </td>
                    <td class="px-4 py-2.5">
                      <span
                        class="rounded-full px-2 py-0.5 text-xs font-medium"
                        [class]="materialClass(row)"
                        [title]="row.material.note"
                      >
                        {{ row.material.status }}
                      </span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          @if (r.ngwaveNotes.length) {
            <div class="rounded-nw border border-amber-200 bg-amber-50 p-3">
              <div class="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
                Specific things to review for NgWave
              </div>
              <ul class="list-disc space-y-1 pl-5 text-sm text-amber-800">
                @for (note of r.ngwaveNotes; track note) {
                  <li>{{ note }}</li>
                }
              </ul>
            </div>
          }

          <a
            routerLink="/migrate/ai"
            class="flex flex-wrap items-center gap-3 rounded-nw-lg border border-nw-200 bg-gradient-to-br from-nw-50 to-surface-0 p-4 shadow-nw-sm transition-shadow hover:shadow-nw-md"
          >
            <div class="min-w-0">
              <div class="font-semibold text-surface-900">Ready to actually migrate?</div>
              <div class="text-xs text-surface-500">
                Paste a component into Finish with AI and get compiling NgWave code back.
              </div>
            </div>
            <span
              class="ml-auto inline-flex items-center gap-1.5 rounded-nw bg-nw-600 px-3.5 py-2 text-sm font-medium text-white shadow-nw-sm"
            >
              Finish with AI →
            </span>
          </a>

          <!-- Lead capture — opt-in, never gates the report above -->
          <div class="rounded-nw-lg border border-surface-200 bg-surface-0 p-4 shadow-nw-sm">
            @if (leadSubmitted()) {
              <div class="py-3 text-center animate-nw-fade-in">
                <div class="text-2xl">✅</div>
                <div class="mt-1 font-semibold text-surface-900">Thanks — we'll be in touch.</div>
                <div class="text-sm text-surface-500">
                  Got your details, along with this report's summary, so the first reply won't
                  start from zero.
                </div>
              </div>
            } @else {
              <div class="font-semibold text-surface-900">
                Want us to run this migration for you?
              </div>
              <div class="mb-3 text-xs text-surface-500">
                Leave your email and we'll reach out — no obligation, no spam.
              </div>
              <form (submit)="submitLead($event)" class="space-y-3">
                <!-- Honeypot — hidden from real users, bots tend to fill every field -->
                <input
                  type="text"
                  name="company"
                  tabindex="-1"
                  autocomplete="off"
                  class="hidden"
                  [value]="leadHoneypot()"
                  (input)="onHoneypot($event)"
                />
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  [value]="leadEmail()"
                  (input)="onLeadEmail($event)"
                  class="w-full rounded-nw border border-surface-300 bg-surface-0 px-3 py-2 text-sm text-surface-900 shadow-nw-sm transition-[border-color,box-shadow] duration-150 ease-nw placeholder:text-surface-400 hover:border-surface-400 focus:border-nw-500 focus:outline-none focus:ring-4 focus:ring-nw-500/15"
                />
                <div class="flex flex-wrap gap-4 text-sm text-surface-600">
                  @for (opt of destinationOptions; track opt.value) {
                    <label class="inline-flex items-center gap-1.5">
                      <input
                        type="radio"
                        name="destination"
                        [checked]="leadDestination() === opt.value"
                        (change)="leadDestination.set(opt.value)"
                      />
                      {{ opt.label }}
                    </label>
                  }
                </div>
                <textarea
                  placeholder="Anything else? (optional)"
                  rows="2"
                  [value]="leadNote()"
                  (input)="onLeadNote($event)"
                  class="w-full resize-y rounded-nw border border-surface-300 bg-surface-0 px-3 py-2 text-sm text-surface-900 shadow-nw-sm transition-[border-color,box-shadow] duration-150 ease-nw placeholder:text-surface-400 hover:border-surface-400 focus:border-nw-500 focus:outline-none focus:ring-4 focus:ring-nw-500/15"
                ></textarea>
                @if (leadError()) {
                  <div class="text-sm text-red-700">{{ leadError() }}</div>
                }
                <button
                  type="submit"
                  [disabled]="leadSubmitting()"
                  class="inline-flex items-center gap-2 rounded-nw bg-nw-600 px-4 py-2 text-sm font-medium text-white shadow-nw-sm transition-colors hover:bg-nw-700 disabled:opacity-50"
                >
                  @if (leadSubmitting()) {
                    <nw-spinner [size]="14" variant="current" />
                    Sending…
                  } @else {
                    Request help →
                  }
                </button>
              </form>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class MigrateReportPageComponent {
  protected readonly maxFiles = MAX_FILES;
  protected readonly scanning = signal(false);
  protected readonly scanCount = signal(0);
  protected readonly error = signal('');
  protected readonly report = signal<CostReport | null>(null);
  protected readonly truncated = signal(false);
  protected readonly dragOver = signal(false);

  protected readonly destinationOptions: { value: 'material' | 'ngwave' | 'unsure'; label: string }[] = [
    { value: 'material', label: 'Angular Material' },
    { value: 'ngwave', label: 'NgWave' },
    { value: 'unsure', label: 'Not sure yet' },
  ];
  protected readonly leadEmail = signal('');
  protected readonly leadDestination = signal<'material' | 'ngwave' | 'unsure'>('unsure');
  protected readonly leadNote = signal('');
  protected readonly leadHoneypot = signal('');
  protected readonly leadSubmitting = signal(false);
  protected readonly leadSubmitted = signal(false);
  protected readonly leadError = signal('');

  protected materialClass(row: ComponentCostRow): string {
    const status = row.material.status;
    if (status === 'mapped') return 'bg-green-100 text-green-700';
    if (status === 'partial') return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-700';
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragOver.set(true);
  }

  protected onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragOver.set(false);
  }

  protected async onDrop(event: DragEvent): Promise<void> {
    event.preventDefault();
    this.dragOver.set(false);
    if (!event.dataTransfer) return;
    const collected = await collectFromDataTransfer(event.dataTransfer);
    await this.process(collected);
  }

  protected async onFolderInput(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const collected = collectFromFileList(input.files, true);
    await this.process(collected);
    input.value = '';
  }

  protected async onFilesInput(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const collected = collectFromFileList(input.files, false);
    await this.process(collected);
    input.value = '';
  }

  protected clear(): void {
    this.report.set(null);
    this.error.set('');
    this.truncated.set(false);
    this.leadEmail.set('');
    this.leadDestination.set('unsure');
    this.leadNote.set('');
    this.leadHoneypot.set('');
    this.leadSubmitted.set(false);
    this.leadError.set('');
  }

  protected onLeadEmail(event: Event): void {
    this.leadEmail.set((event.target as HTMLInputElement).value);
  }

  protected onLeadNote(event: Event): void {
    this.leadNote.set((event.target as HTMLTextAreaElement).value);
  }

  protected onHoneypot(event: Event): void {
    this.leadHoneypot.set((event.target as HTMLInputElement).value);
  }

  protected async submitLead(event: Event): Promise<void> {
    event.preventDefault();
    this.leadError.set('');
    const email = this.leadEmail().trim();
    if (!email || !email.includes('@')) {
      this.leadError.set('Enter a valid email address.');
      return;
    }

    const r = this.report();
    this.leadSubmitting.set(true);
    try {
      const resp = await fetch('/api/report-lead', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email,
          destination: this.leadDestination(),
          note: this.leadNote().trim() || undefined,
          summary: r
            ? {
                fileCount: r.fileCount,
                totalOccurrences: r.totalOccurrences,
                ngwaveAutomatedPct: r.ngwaveSummary.automatedPct,
                materialAutomatedPct: r.materialSummary.automatedPct,
              }
            : undefined,
          hp: this.leadHoneypot() || undefined,
        }),
      });
      const raw = await resp.text();
      let data: { error?: string; ok?: boolean } = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error(
          `Server returned an unexpected response (${resp.status}). Please try again.`,
        );
      }
      if (!resp.ok) throw new Error(data.error || `Request failed (${resp.status}).`);
      this.leadSubmitted.set(true);
    } catch (e) {
      this.leadError.set(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      this.leadSubmitting.set(false);
    }
  }

  private async process(collected: CollectedFile[]): Promise<void> {
    this.error.set('');
    const relevant = collected.filter((c) => isRelevant(c.path));
    if (!relevant.length) {
      this.error.set(
        'No .html files found. Choose a folder or files that contain your PrimeNG templates.',
      );
      return;
    }

    this.truncated.set(relevant.length > MAX_FILES);
    const capped = relevant.slice(0, MAX_FILES);

    this.scanning.set(true);
    this.scanCount.set(capped.length);
    try {
      const files = await readFileContents(capped);
      this.report.set(buildCostReport(files));
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'Something went wrong reading those files.');
    } finally {
      this.scanning.set(false);
    }
  }
}
