import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  NwAvatarComponent,
  NwButtonComponent,
  NwDialogComponent,
  NwFileUploadComponent,
  NwSplitterComponent,
  NwSplitterPanelComponent,
  NwTagComponent,
  NwTreeComponent,
  NwTreeNode,
} from '@ngwave/ui';
import { AdminShellComponent } from '../admin-dashboard/admin-shell.component';

interface FileItem {
  name: string;
  type: 'PDF' | 'PNG' | 'DOCX' | 'XLSX' | 'FIG' | 'Folder';
  size: string;
  modified: string;
  sharedWith: string[];
}

@Component({
  selector: 'app-admin-files-template',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AdminShellComponent,
    NwButtonComponent,
    NwTagComponent,
    NwAvatarComponent,
    NwTreeComponent,
    NwSplitterComponent,
    NwSplitterPanelComponent,
    NwDialogComponent,
    NwFileUploadComponent,
  ],
  template: `
    <app-admin-shell pageTitle="Files" pageSubtitle="Shared documents and assets.">
      <nw-splitter class="h-[calc(100vh-8rem)] rounded-nw-lg border border-surface-200 bg-surface-0 overflow-hidden">
        <nw-splitter-panel [size]="24" [minSize]="16" class="bg-surface-50">
          <div class="p-4">
            <h3 class="text-xs font-semibold uppercase tracking-wide text-surface-400 mb-2">Folders</h3>
            <nw-tree [nodes]="folders" selectionMode="single" [selection]="selectedFolder()" />
          </div>
        </nw-splitter-panel>
        <nw-splitter-panel [size]="76" [minSize]="50">
          <div class="p-5">
            <div class="flex items-center justify-between gap-3">
              <p class="text-sm text-surface-500">
                Projects <span class="mx-1 text-surface-300">/</span> Marketing
                <span class="mx-1 text-surface-300">/</span>
                <span class="text-surface-900 font-medium">Assets</span>
              </p>
              <nw-button variant="primary" size="small" label="↑ Upload files" (click)="uploadOpen.set(true)" />
            </div>

            <div class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              @for (f of files; track f.name) {
                <div class="rounded-nw border border-surface-200 p-4 hover:border-surface-300 hover:shadow-nw-sm transition-shadow">
                  <div class="flex items-start justify-between">
                    <span
                      class="h-10 w-10 rounded-nw flex items-center justify-center text-sm font-semibold shrink-0"
                      [class]="typeClass(f.type)"
                    >
                      {{ f.type === 'Folder' ? '📁' : f.type }}
                    </span>
                    <nw-tag [value]="f.type" severity="secondary" />
                  </div>
                  <p class="mt-3 text-sm font-medium text-surface-900 truncate">{{ f.name }}</p>
                  <p class="text-xs text-surface-500">{{ f.size }} · {{ f.modified }}</p>
                  <div class="mt-3 flex items-center -space-x-2">
                    @for (initials of f.sharedWith; track initials) {
                      <nw-avatar [label]="initials" size="normal" class="ring-2 ring-surface-0 rounded-full" />
                    }
                  </div>
                </div>
              }
            </div>
          </div>
        </nw-splitter-panel>
      </nw-splitter>

      <nw-dialog header="Upload files" [(visible)]="uploadOpen" width="28rem">
        <nw-file-upload [multiple]="true" />
      </nw-dialog>
    </app-admin-shell>
  `,
})
export class AdminFilesTemplateComponent {
  protected readonly uploadOpen = signal(false);

  protected readonly folders: NwTreeNode[] = [
    {
      label: 'Projects',
      expanded: true,
      children: [
        {
          label: 'Marketing',
          expanded: true,
          children: [{ label: 'Assets', expanded: true }, { label: 'Campaigns' }],
        },
        { label: 'Engineering' },
        { label: 'Design' },
      ],
    },
    { label: 'Shared with me' },
    { label: 'Trash' },
  ];

  protected readonly selectedFolder = signal<NwTreeNode | null>(this.folders[0]?.children?.[0]?.children?.[0] ?? null);

  protected readonly files: FileItem[] = [
    { name: 'Q3 brand guidelines.pdf', type: 'PDF', size: '4.2 MB', modified: '2 days ago', sharedWith: ['PN', 'DO'] },
    { name: 'Homepage hero.png', type: 'PNG', size: '1.8 MB', modified: 'Yesterday', sharedWith: ['MC'] },
    { name: 'Launch checklist.docx', type: 'DOCX', size: '86 KB', modified: '3 hours ago', sharedWith: ['PN', 'DO', 'MC'] },
    { name: 'Budget tracker.xlsx', type: 'XLSX', size: '212 KB', modified: '1 week ago', sharedWith: ['AI'] },
    { name: 'Dashboard redesign.fig', type: 'FIG', size: '9.6 MB', modified: '5 hours ago', sharedWith: ['SR', 'MC'] },
    { name: 'Icons', type: 'Folder', size: '24 items', modified: '2 weeks ago', sharedWith: ['PN'] },
  ];

  protected typeClass(type: FileItem['type']): string {
    const map: Record<FileItem['type'], string> = {
      PDF: 'bg-red-50 text-red-600',
      PNG: 'bg-sky-50 text-sky-600',
      DOCX: 'bg-nw-50 text-nw-600',
      XLSX: 'bg-green-50 text-green-600',
      FIG: 'bg-purple-50 text-purple-600',
      Folder: 'bg-amber-50 text-amber-600',
    };
    return map[type];
  }
}
