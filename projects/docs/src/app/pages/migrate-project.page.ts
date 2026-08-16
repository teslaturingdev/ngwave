import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  CollectedFile,
  collectFromDataTransfer,
  collectFromFileList,
  isRelevantPath,
  MAX_FILES,
  readFileContents,
  uint8ToBase64,
} from '@ngwave/files';
import { buildMigratedZip, migrateProject, ProjectMigrationResult } from '@ngwave/batch-migrate';
import { NwSpinnerComponent } from '@ngwave/ui';
import { AuthService } from '../auth.service';

function isRelevant(path: string): boolean {
  return isRelevantPath(path, '.html');
}

@Component({
  selector: 'docs-migrate-project-page',
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
            Runs 100% in your browser — nothing is uploaded, free with sign-in
          </span>
          <h1 class="mt-3 text-3xl font-bold tracking-tight">Migrate Your Whole Project</h1>
          <p class="mt-1.5 max-w-2xl text-white/80">
            Point this at your PrimeNG project and get every template migrated to
            NgWave in one pass — download a ready-to-drop-in <code>.zip</code>, no more
            copy-pasting one component at a time.
          </p>
          <a
            routerLink="/migrate/report"
            class="mt-3 inline-flex items-center gap-1.5 text-sm text-white/70 underline-offset-2 hover:text-white hover:underline"
          >
            ← Not sure yet? Get a free cost report first
          </a>
        </div>
      </header>

      @if (!result()) {
        <div
          class="rounded-nw-lg border-2 border-dashed p-10 text-center transition-colors"
          [class]="dragOver() ? 'border-nw-500 bg-nw-50' : 'border-surface-300 bg-surface-0'"
          (dragover)="onDragOver($event)"
          (dragleave)="onDragLeave($event)"
          (drop)="onDrop($event)"
        >
          <div class="text-4xl">📦</div>
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
            Only <code>.html</code> template files are migrated (deterministic rules only —
            no AI, no cost); <code>node_modules</code>, <code>dist</code> and
            <code>.git</code> are skipped automatically. <code>.ts</code> files aren't
            touched yet — use <a routerLink="/migrate/ai" class="underline">Finish with AI</a>
            per component for those.
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

      @if (processing()) {
        <div
          class="flex flex-col items-center justify-center gap-3 rounded-nw-lg border border-surface-200 bg-surface-0 px-4 py-16 text-center text-surface-500 shadow-nw-sm"
        >
          <nw-spinner [size]="28" />
          <div class="text-sm">Migrating {{ processCount() }} files…</div>
        </div>
      }

      @if (error()) {
        <div class="rounded-nw border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {{ error() }}
        </div>
      }

      @if (result(); as r) {
        <div class="space-y-6 animate-nw-fade-in">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="text-sm text-surface-600">
              Migrated <strong class="text-surface-900">{{ r.totals.fileCount }}</strong> files
            </div>
            <button
              type="button"
              (click)="clear()"
              class="rounded-full px-3 py-1 text-sm text-surface-500 hover:bg-surface-100"
            >
              Migrate another project
            </button>
          </div>

          @if (truncated()) {
            <div class="rounded-nw border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              Migrated the first {{ maxFiles }} matching files (more were found) — migrate a
              subdirectory for full coverage of a very large repo.
            </div>
          }

          <!-- Automation score -->
          <div class="rounded-nw-lg border border-surface-200 bg-surface-0 p-4 shadow-nw-sm">
            <div class="flex items-center justify-between text-sm">
              <span class="font-semibold text-surface-900">{{ automatedPct() }}% automated</span>
              <span class="text-surface-500"
                >{{ r.totals.mappedCount }} mapped ·
                {{ r.totals.manualCount }} manual ·
                {{ r.totals.unsupportedCount }} unsupported</span
              >
            </div>
            <div class="mt-2 flex h-2.5 overflow-hidden rounded-full bg-surface-100">
              <div
                class="bg-green-500 transition-all duration-500 ease-nw"
                [style.width.%]="pct(r.totals.mappedCount)"
              ></div>
              <div
                class="bg-amber-400 transition-all duration-500 ease-nw"
                [style.width.%]="pct(r.totals.manualCount)"
              ></div>
              <div
                class="bg-red-500 transition-all duration-500 ease-nw"
                [style.width.%]="pct(r.totals.unsupportedCount)"
              ></div>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <button
              type="button"
              (click)="download()"
              class="inline-flex items-center justify-center gap-2 rounded-nw bg-nw-600 px-4 py-3 text-sm font-semibold text-white shadow-nw-sm transition-colors hover:bg-nw-700"
            >
              Download migrated project (.zip) →
            </button>
            @if (auth.isSignedIn()) {
              <button
                type="button"
                (click)="save()"
                [disabled]="saving() || saved()"
                class="inline-flex items-center justify-center gap-2 rounded-nw bg-surface-100 px-4 py-3 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-200 disabled:opacity-50"
              >
                {{ saved() ? 'Saved ✓' : saving() ? 'Saving…' : 'Save to my account' }}
              </button>
            }
          </div>
          @if (saveError()) {
            <div class="rounded-nw border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {{ saveError() }}
            </div>
          }

          <!-- Per-file breakdown -->
          <div class="overflow-x-auto rounded-nw-lg border border-surface-200 bg-surface-0 shadow-nw-sm">
            <table class="w-full text-left text-sm">
              <thead class="border-b border-surface-200 bg-surface-50 text-xs uppercase tracking-wide text-surface-500">
                <tr>
                  <th class="px-4 py-2.5">File</th>
                  <th class="px-4 py-2.5">Mapped</th>
                  <th class="px-4 py-2.5">Manual</th>
                  <th class="px-4 py-2.5">Unsupported</th>
                </tr>
              </thead>
              <tbody>
                @for (file of r.files; track file.path) {
                  <tr class="border-b border-surface-100 last:border-0">
                    <td class="px-4 py-2.5 font-mono text-xs text-surface-900">{{ file.path }}</td>
                    <td class="px-4 py-2.5 text-surface-600">{{ file.report.mapped.length }}</td>
                    <td class="px-4 py-2.5 text-surface-600">{{ file.report.manual.length }}</td>
                    <td class="px-4 py-2.5 text-surface-600">{{ file.report.unsupported.length }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <div class="rounded-nw border border-surface-200 bg-surface-50 p-3 text-sm text-surface-600">
            The zip includes a <code class="text-nw-600">_MIGRATION_NOTES.md</code> listing,
            per file, which NgWave imports to add and anything flagged manual or unsupported.
          </div>

          <a
            routerLink="/migrate/ai"
            class="flex flex-wrap items-center gap-3 rounded-nw-lg border border-nw-200 bg-gradient-to-br from-nw-50 to-surface-0 p-4 shadow-nw-sm transition-shadow hover:shadow-nw-md"
          >
            <div class="min-w-0">
              <div class="font-semibold text-surface-900">Some files still need work?</div>
              <div class="text-xs text-surface-500">
                Paste anything flagged manual or unsupported into Finish with AI, one
                component at a time.
              </div>
            </div>
            <span
              class="ml-auto inline-flex items-center gap-1.5 rounded-nw bg-nw-600 px-3.5 py-2 text-sm font-medium text-white shadow-nw-sm"
            >
              Finish with AI →
            </span>
          </a>
        </div>
      }
    </div>
  `,
})
export class MigrateProjectPageComponent {
  protected readonly auth = inject(AuthService);
  protected readonly maxFiles = MAX_FILES;
  protected readonly processing = signal(false);
  protected readonly processCount = signal(0);
  protected readonly error = signal('');
  protected readonly result = signal<ProjectMigrationResult | null>(null);
  protected readonly truncated = signal(false);
  protected readonly dragOver = signal(false);
  protected readonly saving = signal(false);
  protected readonly saved = signal(false);
  protected readonly saveError = signal('');

  protected automatedPct(): number {
    const r = this.result();
    if (!r) return 0;
    const total = r.totals.mappedCount + r.totals.manualCount + r.totals.unsupportedCount;
    return total === 0 ? 0 : Math.round((r.totals.mappedCount / total) * 100);
  }

  protected pct(count: number): number {
    const r = this.result();
    if (!r) return 0;
    const total = r.totals.mappedCount + r.totals.manualCount + r.totals.unsupportedCount;
    return total === 0 ? 0 : (count / total) * 100;
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
    this.result.set(null);
    this.error.set('');
    this.truncated.set(false);
    this.saved.set(false);
    this.saveError.set('');
  }

  protected async save(): Promise<void> {
    const r = this.result();
    if (!r) return;
    this.saving.set(true);
    this.saveError.set('');
    try {
      const zipBytes = buildMigratedZip(r.files);
      const token = await this.auth.getToken();
      const resp = await fetch('/api/save-migration', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          tool: 'migrate-project',
          summary: {
            files: r.totals.fileCount,
            mapped: r.totals.mappedCount,
            manual: r.totals.manualCount,
          },
          artifactBase64: uint8ToBase64(zipBytes),
        }),
      });
      const raw = await resp.text();
      const data = raw ? JSON.parse(raw) : {};
      if (!resp.ok) throw new Error(data.error || `Request failed (${resp.status}).`);
      this.saved.set(true);
    } catch (e) {
      this.saveError.set(e instanceof Error ? e.message : 'Could not save this migration.');
    } finally {
      this.saving.set(false);
    }
  }

  protected download(): void {
    const r = this.result();
    if (!r) return;
    const zipBytes = buildMigratedZip(r.files);
    const blob = new Blob([zipBytes as BlobPart], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ngwave-migrated-project.zip';
    a.click();
    URL.revokeObjectURL(url);
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

    this.processing.set(true);
    this.processCount.set(capped.length);
    try {
      const files = await readFileContents(capped);
      this.result.set(migrateProject(files));
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'Something went wrong reading those files.');
    } finally {
      this.processing.set(false);
    }
  }
}
