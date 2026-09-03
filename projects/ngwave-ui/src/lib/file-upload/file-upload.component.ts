import { HttpClient, HttpEventType } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';

export type NwFileUploadMode = 'basic' | 'advanced';

export interface NwFileUploadProgressEvent {
  file: File;
  progress: number;
}

export interface NwFileUploadHandlerEvent {
  files: File[];
}

export interface NwFileUploadErrorEvent {
  files: File[];
  error: unknown;
}

@Component({
  selector: 'nw-file-upload',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <input
      #fileInput
      type="file"
      class="hidden"
      [multiple]="multiple()"
      [accept]="accept()"
      [disabled]="disabled()"
      (change)="onChange($event)"
    />

    @if (mode() === 'basic') {
      <div class="inline-flex items-center gap-2">
        <button
          type="button"
          [disabled]="disabled() || uploading()"
          (click)="fileInput.click()"
          class="inline-flex items-center gap-2 h-10 px-4 rounded-nw bg-nw-600 text-white text-sm font-medium hover:bg-nw-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ files().length ? files()[0].name : chooseLabel() }}
        </button>
        @if (uploading()) {
          <span class="text-sm text-surface-500">Uploading…</span>
        }
      </div>
      @if (errorMessage()) {
        <p class="mt-2 text-sm text-red-600">{{ errorMessage() }}</p>
      }
    } @else {
      <div
        class="rounded-nw-lg border-2 border-dashed p-6 text-center transition-colors"
        [class]="dragging() ? 'border-nw-500 bg-nw-50' : 'border-surface-300 bg-surface-0'"
        [class.opacity-50]="disabled()"
        [class.pointer-events-none]="disabled()"
        (dragover)="onDragOver($event)"
        (dragleave)="dragging.set(false)"
        (drop)="onDrop($event)"
      >
        <div class="flex items-center justify-center gap-2 flex-wrap">
          <button
            type="button"
            (click)="fileInput.click()"
            [disabled]="disabled()"
            class="inline-flex items-center gap-2 h-9 px-3 rounded-nw bg-surface-100 text-surface-800 text-sm font-medium hover:bg-surface-200 disabled:opacity-50"
          >
            {{ chooseLabel() }}
          </button>
          @if (showUploadButton()) {
            <button
              type="button"
              (click)="uploadFiles()"
              [disabled]="disabled() || uploading() || files().length === 0"
              class="inline-flex items-center gap-2 h-9 px-3 rounded-nw bg-nw-600 text-white text-sm font-medium hover:bg-nw-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ uploadLabel() }}
            </button>
          }
          @if (showCancelButton()) {
            <button
              type="button"
              (click)="clearAll()"
              [disabled]="disabled() || files().length === 0"
              class="inline-flex items-center gap-2 h-9 px-3 rounded-nw bg-surface-100 text-surface-800 text-sm font-medium hover:bg-surface-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ cancelLabel() }}
            </button>
          }
        </div>

        <p class="mt-3 text-sm text-surface-500">
          Drag &amp; drop {{ multiple() ? 'files' : 'a file' }} here
        </p>

        @if (errorMessage()) {
          <p class="mt-2 text-sm text-red-600">{{ errorMessage() }}</p>
        }

        @if (files().length) {
          <ul class="mt-4 space-y-2 text-left">
            @for (f of files(); track f.name) {
              <li class="flex items-center gap-3 text-sm text-surface-700 bg-surface-50 rounded-nw px-3 py-2">
                @if (previews().get(f); as src) {
                  <img [src]="src" [style.width.px]="previewWidth()" class="rounded-nw object-cover shrink-0" alt="" />
                }
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-2">
                    <span class="truncate">{{ f.name }}</span>
                    <span class="text-xs text-surface-400 shrink-0">{{ formatSize(f.size) }}</span>
                  </div>
                  @if (fileProgress().get(f); as pct) {
                    <div class="mt-1 h-1.5 rounded-full bg-surface-200 overflow-hidden">
                      <div class="h-full bg-nw-600 transition-all" [style.width.%]="pct"></div>
                    </div>
                  }
                </div>
                <button
                  type="button"
                  aria-label="Remove"
                  class="text-surface-400 hover:text-surface-900 shrink-0"
                  (click)="removeFile(f)"
                >
                  ✕
                </button>
              </li>
            }
          </ul>
        }
      </div>
    }
  `,
})
export class NwFileUploadComponent {
  private readonly http = inject(HttpClient, { optional: true });

  readonly mode = input<NwFileUploadMode>('advanced');
  readonly name = input('file');
  readonly url = input('');
  readonly method = input<'post' | 'put'>('post');
  readonly multiple = input(false);
  readonly accept = input('');
  readonly disabled = input(false);
  readonly auto = input(false);
  readonly maxFileSize = input<number | undefined>(undefined);
  readonly withCredentials = input(false);
  readonly customUpload = input(false);
  readonly chooseLabel = input('Choose');
  readonly uploadLabel = input('Upload');
  readonly cancelLabel = input('Cancel');
  readonly showUploadButton = input(true);
  readonly showCancelButton = input(true);
  readonly previewWidth = input(50);
  readonly invalidFileSizeMessage = input('exceeds the maximum allowed file size');

  readonly selected = output<File[]>();
  readonly uploaded = output<File[]>();
  readonly uploadError = output<NwFileUploadErrorEvent>();
  readonly cleared = output<void>();
  readonly removed = output<File>();
  readonly progress = output<NwFileUploadProgressEvent>();
  readonly uploadHandler = output<NwFileUploadHandlerEvent>();

  protected readonly files = signal<File[]>([]);
  protected readonly dragging = signal(false);
  protected readonly uploading = signal(false);
  protected readonly fileProgress = signal<Map<File, number>>(new Map());
  protected readonly previews = signal<Map<File, string>>(new Map());
  protected readonly errorMessage = signal('');

  protected onDragOver(e: DragEvent): void {
    e.preventDefault();
    if (!this.disabled()) this.dragging.set(true);
  }

  protected onDrop(e: DragEvent): void {
    e.preventDefault();
    this.dragging.set(false);
    if (this.disabled()) return;
    this.addFiles(e.dataTransfer?.files ?? null);
  }

  protected onChange(e: Event): void {
    this.addFiles((e.target as HTMLInputElement).files);
    (e.target as HTMLInputElement).value = '';
  }

  private addFiles(list: FileList | null): void {
    if (!list || list.length === 0) return;
    this.errorMessage.set('');
    let next = Array.from(list);
    const max = this.maxFileSize();
    if (max != null) {
      const oversized = next.filter((f) => f.size > max);
      if (oversized.length) {
        this.errorMessage.set(
          `${oversized.map((f) => f.name).join(', ')} ${this.invalidFileSizeMessage()} (${this.formatSize(max)}).`,
        );
      }
      next = next.filter((f) => f.size <= max);
    }
    const files = this.multiple() ? [...this.files(), ...next] : next.slice(0, 1);
    this.files.set(files);
    this.buildPreviews(next);
    this.selected.emit(files);
    if (this.auto()) this.uploadFiles();
  }

  private buildPreviews(newFiles: File[]): void {
    const map = new Map(this.previews());
    for (const f of newFiles) {
      if (f.type.startsWith('image/')) map.set(f, URL.createObjectURL(f));
    }
    this.previews.set(map);
  }

  protected removeFile(f: File): void {
    const url = this.previews().get(f);
    if (url) URL.revokeObjectURL(url);
    const previews = new Map(this.previews());
    previews.delete(f);
    this.previews.set(previews);

    const files = this.files().filter((x) => x !== f);
    this.files.set(files);
    this.removed.emit(f);
  }

  protected clearAll(): void {
    for (const url of this.previews().values()) URL.revokeObjectURL(url);
    this.previews.set(new Map());
    this.files.set([]);
    this.fileProgress.set(new Map());
    this.cleared.emit();
  }

  protected formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  uploadFiles(): void {
    const files = this.files();
    if (!files.length) return;

    if (this.customUpload()) {
      this.uploadHandler.emit({ files });
      return;
    }
    if (!this.http || !this.url()) return;

    this.uploading.set(true);
    const formData = new FormData();
    for (const f of files) formData.append(this.name(), f, f.name);

    this.http
      .request(this.method(), this.url(), {
        body: formData,
        reportProgress: true,
        observe: 'events',
        withCredentials: this.withCredentials(),
      })
      .subscribe({
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            const pct = Math.round((event.loaded / event.total) * 100);
            const map = new Map(this.fileProgress());
            for (const f of files) map.set(f, pct);
            this.fileProgress.set(map);
            for (const f of files) this.progress.emit({ file: f, progress: pct });
          } else if (event.type === HttpEventType.Response) {
            this.uploading.set(false);
            this.uploaded.emit(files);
            this.clearAll();
          }
        },
        error: (error: unknown) => {
          this.uploading.set(false);
          this.uploadError.emit({ files, error });
        },
      });
  }
}
