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
import {
  buildLibraryZip,
  GeneratedLibrary,
  generateLibrary,
  isValidPrefix,
  resolveFolders,
  ResolvedComponent,
} from '@ngwave/own-library';
import { scanFiles } from '@ngwave/report';
import { NwSpinnerComponent } from '@ngwave/ui';
import { AuthService } from '../auth.service';

function isRelevant(path: string): boolean {
  return isRelevantPath(path, '.html');
}

@Component({
  selector: 'docs-migrate-library-page',
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
          <h1 class="mt-3 text-3xl font-bold tracking-tight">Your Own Component Library</h1>
          <p class="mt-1.5 max-w-2xl text-white/80">
            Real, working component source in <strong>your own namespace</strong> — only
            what your app uses. Zero NgWave branding, zero third-party runtime dependency
            (not even Angular CDK). You own every line, forever.
          </p>
          <a
            routerLink="/migrate/report"
            class="mt-3 inline-flex items-center gap-1.5 text-sm text-white/70 underline-offset-2 hover:text-white hover:underline"
          >
            ← Not sure yet? See what this would replace first
          </a>
        </div>
      </header>

      @if (!components()) {
        <div
          class="rounded-nw-lg border-2 border-dashed p-10 text-center transition-colors"
          [class]="dragOver() ? 'border-nw-500 bg-nw-50' : 'border-surface-300 bg-surface-0'"
          (dragover)="onDragOver($event)"
          (dragleave)="onDragLeave($event)"
          (drop)="onDrop($event)"
        >
          <div class="text-4xl">🏷️</div>
          <p class="mt-3 text-surface-700">Drag a project folder here, or</p>
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
            We only look at which PrimeNG components you use — nothing is uploaded.
            <code>node_modules</code>, <code>dist</code> and <code>.git</code> are skipped.
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
          <div class="text-sm">Detecting which components you use…</div>
        </div>
      }

      @if (error()) {
        <div class="rounded-nw border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {{ error() }}
        </div>
      }

      @if (components(); as comps) {
        <div class="space-y-6 animate-nw-fade-in">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="text-sm text-surface-600">
              Found <strong class="text-surface-900">{{ comps.length }}</strong> components
              you'll need
            </div>
            <button
              type="button"
              (click)="clear()"
              class="rounded-full px-3 py-1 text-sm text-surface-500 hover:bg-surface-100"
            >
              Start over
            </button>
          </div>

          @if (comps.length === 0) {
            <div class="rounded-nw border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              No components NgWave currently supports were detected in that project.
            </div>
          } @else {
            <div class="flex flex-wrap gap-2">
              @for (c of comps; track c.folder) {
                <span
                  class="inline-flex items-center gap-1.5 rounded-full border border-surface-200 bg-surface-0 px-3 py-1 text-sm text-surface-700"
                >
                  {{ c.folder }}
                  @if (!c.direct) {
                    <span class="text-xs text-surface-400">(needed by another component)</span>
                  }
                </span>
              }
            </div>

            @if (!generated()) {
              <div class="rounded-nw-lg border border-surface-200 bg-surface-0 p-4 shadow-nw-sm">
                <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-surface-500">
                  Choose your namespace
                </label>
                <div class="flex flex-wrap items-center gap-3">
                  <input
                    type="text"
                    placeholder="acme"
                    [value]="prefix()"
                    (input)="onPrefix($event)"
                    class="w-40 rounded-nw border border-surface-300 bg-surface-0 px-3 py-2 text-sm text-surface-900 shadow-nw-sm transition-[border-color,box-shadow] duration-150 ease-nw placeholder:text-surface-400 hover:border-surface-400 focus:border-nw-500 focus:outline-none focus:ring-4 focus:ring-nw-500/15"
                  />
                  <span class="text-xs text-surface-400"
                    >→ <code>{{ prefix() || 'acme' }}-button</code>,
                    <code>{{ capitalized() }}ButtonComponent</code>, your own
                    <code>--{{ prefix() || 'acme' }}-500</code> tokens</span
                  >
                  <button
                    type="button"
                    (click)="generate()"
                    [disabled]="generating() || !isPrefixValid()"
                    class="ml-auto inline-flex items-center gap-2 rounded-nw bg-nw-600 px-4 py-2.5 text-sm font-semibold text-white shadow-nw-sm transition-colors hover:bg-nw-700 disabled:opacity-50"
                  >
                    @if (generating()) {
                      <nw-spinner [size]="16" variant="current" />
                      Generating…
                    } @else {
                      Generate my library →
                    }
                  </button>
                </div>
                @if (prefix() && !isPrefixValid()) {
                  <div class="mt-2 text-xs text-red-700">
                    Lowercase letters, digits, and hyphens only, starting with a letter.
                  </div>
                }
              </div>
            }
          }

          @if (generated(); as lib) {
            <div class="space-y-4 animate-nw-fade-in">
              <div
                class="flex flex-wrap items-center gap-3 rounded-nw-lg border border-green-200 bg-green-50 p-4"
              >
                <div class="min-w-0">
                  <div class="font-semibold text-green-900">
                    @{{ prefix() }}/ui is ready — {{ lib.files.length }} files
                  </div>
                  <div class="text-xs text-green-700">
                    Renamed, trimmed, yours. No NgWave branding left anywhere.
                  </div>
                </div>
                <div class="ml-auto flex flex-wrap items-center gap-2">
                  @if (auth.isSignedIn()) {
                    <button
                      type="button"
                      (click)="save()"
                      [disabled]="saving() || saved()"
                      class="inline-flex items-center gap-2 rounded-nw bg-white px-4 py-2.5 text-sm font-medium text-green-800 shadow-nw-sm transition-colors hover:bg-green-100"
                    >
                      {{ saved() ? 'Saved ✓' : saving() ? 'Saving…' : 'Save to my account' }}
                    </button>
                  }
                  <button
                    type="button"
                    (click)="download()"
                    class="inline-flex items-center gap-2 rounded-nw bg-nw-600 px-4 py-2.5 text-sm font-semibold text-white shadow-nw-sm transition-colors hover:bg-nw-700"
                  >
                    Download {{ prefix() }}-ui.zip →
                  </button>
                </div>
              </div>

              @if (saveError()) {
                <div class="rounded-nw border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {{ saveError() }}
                </div>
              }

              <div class="rounded-nw border border-surface-200 bg-surface-50 p-3 text-sm text-surface-600">
                This is a rename-and-trim of NgWave's real component source into your
                namespace — same colors as NgWave for now (recoloring to your brand is
                next). No app migration onto it yet either — that's a separate step.
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class MigrateLibraryPageComponent {
  protected readonly auth = inject(AuthService);
  protected readonly maxFiles = MAX_FILES;
  protected readonly scanning = signal(false);
  protected readonly error = signal('');
  protected readonly components = signal<ResolvedComponent[] | null>(null);
  protected readonly dragOver = signal(false);

  protected readonly prefix = signal('');
  protected readonly generating = signal(false);
  protected readonly generated = signal<GeneratedLibrary | null>(null);
  protected readonly saving = signal(false);
  protected readonly saved = signal(false);
  protected readonly saveError = signal('');

  private usedTags: string[] = [];

  protected isPrefixValid(): boolean {
    return isValidPrefix(this.prefix());
  }

  protected capitalized(): string {
    const p = this.prefix() || 'acme';
    return p.charAt(0).toUpperCase() + p.slice(1);
  }

  protected onPrefix(event: Event): void {
    this.prefix.set((event.target as HTMLInputElement).value.trim().toLowerCase());
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
    this.components.set(null);
    this.error.set('');
    this.prefix.set('');
    this.generated.set(null);
    this.usedTags = [];
    this.saved.set(false);
    this.saveError.set('');
  }

  protected async save(): Promise<void> {
    const lib = this.generated();
    if (!lib) return;
    this.saving.set(true);
    this.saveError.set('');
    try {
      const zipBytes = buildLibraryZip(lib.files);
      const token = await this.auth.getToken();
      const resp = await fetch('/api/save-migration', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          tool: 'own-library',
          summary: { prefix: this.prefix(), files: lib.files.length },
          artifactBase64: uint8ToBase64(zipBytes),
        }),
      });
      const raw = await resp.text();
      const data = raw ? JSON.parse(raw) : {};
      if (!resp.ok) throw new Error(data.error || `Request failed (${resp.status}).`);
      this.saved.set(true);
    } catch (e) {
      this.saveError.set(e instanceof Error ? e.message : 'Could not save this library.');
    } finally {
      this.saving.set(false);
    }
  }

  protected async generate(): Promise<void> {
    if (!this.isPrefixValid()) return;
    this.generating.set(true);
    this.error.set('');
    try {
      this.generated.set(await generateLibrary(this.usedTags, this.prefix()));
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'Something went wrong generating your library.');
    } finally {
      this.generating.set(false);
    }
  }

  protected download(): void {
    const lib = this.generated();
    if (!lib) return;
    const zipBytes = buildLibraryZip(lib.files);
    const blob = new Blob([zipBytes as BlobPart], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.prefix()}-ui.zip`;
    a.click();
    URL.revokeObjectURL(url);
  }

  private async process(collected: CollectedFile[]): Promise<void> {
    this.error.set('');
    const relevant = collected.filter((c) => isRelevant(c.path)).slice(0, MAX_FILES);
    if (!relevant.length) {
      this.error.set(
        'No .html files found. Choose a folder or files that contain your PrimeNG templates.',
      );
      return;
    }

    this.scanning.set(true);
    try {
      const files = await readFileContents(relevant);
      const scan = scanFiles(files);
      this.usedTags = scan.tags.map((t) => t.tag);
      this.components.set(resolveFolders(this.usedTags));
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'Something went wrong reading those files.');
    } finally {
      this.scanning.set(false);
    }
  }
}
