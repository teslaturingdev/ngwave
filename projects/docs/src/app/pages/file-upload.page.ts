import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NwFileUploadComponent, NwFileUploadHandlerEvent } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-file-upload-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwFileUploadComponent,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">File Upload</h1>
          <p class="mt-2 text-surface-600">
            Drag-and-drop file selection with real HTTP upload (progress
            included), or bring your own upload logic.
          </p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="advanced" title="Advanced (default)" [code]="advancedCode">
              <nw-file-upload
                class="w-full max-w-md"
                [multiple]="true"
                accept="image/*"
                [maxFileSize]="2097152"
              />
            </docs-demo>

            <docs-demo id="custom" title="Custom upload handler" [code]="customCode">
              <nw-file-upload
                class="w-full max-w-md"
                [customUpload]="true"
                [multiple]="true"
                (uploadHandler)="onCustomUpload($event)"
              />
            </docs-demo>

            <docs-demo id="basic" title="Basic mode" [code]="basicCode">
              <nw-file-upload mode="basic" chooseLabel="Pick a file" />
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
export class FileUploadDocPageComponent {
  protected readonly sections: TocSection[] = [
    { id: 'advanced', label: 'Advanced (default)' },
    { id: 'custom', label: 'Custom upload handler' },
    { id: 'basic', label: 'Basic mode' },
  ];

  protected readonly advancedCode = `<nw-file-upload url="/api/upload" [multiple]="true" accept="image/*" [maxFileSize]="2097152" (uploaded)="onDone($event)" />`;
  protected readonly customCode = `<nw-file-upload [customUpload]="true" (uploadHandler)="onCustomUpload($event)" />`;
  protected readonly basicCode = `<nw-file-upload mode="basic" chooseLabel="Pick a file" />`;

  protected readonly api: ApiRow[] = [
    { name: 'mode', type: `'basic' | 'advanced'`, default: `'advanced'`, description: 'Basic is a single choose button; advanced adds a dropzone, file list, and upload/cancel buttons.' },
    { name: 'url', type: 'string', default: `''`, description: 'Upload endpoint. Requires HttpClient to be provided in the app.' },
    { name: 'name', type: 'string', default: `'file'`, description: 'FormData field name for each file.' },
    { name: 'method', type: `'post' | 'put'`, default: `'post'`, description: 'HTTP method for the upload request.' },
    { name: 'multiple', type: 'boolean', default: 'false', description: 'Allow selecting more than one file.' },
    { name: 'accept', type: 'string', default: `''`, description: 'Native accept attribute, e.g. "image/*".' },
    { name: 'maxFileSize', type: 'number', default: 'undefined', description: 'Max file size in bytes; oversized files are rejected with a message.' },
    { name: 'auto', type: 'boolean', default: 'false', description: 'Upload immediately on selection instead of waiting for the Upload button.' },
    { name: 'customUpload', type: 'boolean', default: 'false', description: 'Skip the built-in HTTP call — emits uploadHandler instead so you can upload yourself.' },
    { name: 'withCredentials', type: 'boolean', default: 'false', description: 'Send cookies/auth with the upload request.' },
    { name: 'chooseLabel / uploadLabel / cancelLabel', type: 'string', default: `'Choose' / 'Upload' / 'Cancel'`, description: 'Button text.' },
    { name: 'showUploadButton / showCancelButton', type: 'boolean', default: 'true', description: 'Advanced mode only.' },
    { name: 'selected', type: 'output<File[]>', default: '—', description: 'Fires with the staged file list on every add/remove.' },
    { name: 'uploaded', type: 'output<File[]>', default: '—', description: 'Fires with the uploaded files once the HTTP request completes.' },
    { name: 'uploadError', type: 'output<{files, error}>', default: '—', description: 'Fires if the upload request fails.' },
    { name: 'progress', type: 'output<{file, progress}>', default: '—', description: 'Fires with 0–100 upload progress.' },
    { name: 'uploadHandler', type: 'output<{files}>', default: '—', description: 'Fires instead of the built-in upload when customUpload is true.' },
    { name: 'removed / cleared', type: 'output<File> / output<void>', default: '—', description: 'Fires when a single file or the whole list is removed.' },
  ];

  protected onCustomUpload(event: NwFileUploadHandlerEvent): void {
    // Bring your own upload — e.g. a signed-URL flow, a different HTTP client, etc.
    console.log('Uploading', event.files);
  }
}
