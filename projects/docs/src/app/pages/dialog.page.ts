import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  NwButtonComponent,
  NwConfirmDialogComponent,
  NwConfirmationService,
  NwDialogComponent,
  NwDialogFooterDirective,
  NwDialogHeaderDirective,
} from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-dialog-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwButtonComponent,
    NwDialogComponent,
    NwDialogFooterDirective,
    NwDialogHeaderDirective,
    NwConfirmDialogComponent,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Dialog</h1>
          <p class="mt-2 text-surface-600">
            A modal dialog and drawer in one component — with backdrop, Escape /
            mask dismiss, a footer slot, and five positions.
          </p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="basic" title="Modal dialog" [code]="basicCode">
              <nw-button (click)="basic.set(true)">Show dialog</nw-button>
              <nw-dialog [(visible)]="basic" header="Confirm action">
                <p class="text-surface-700">
                  Are you sure you want to proceed? This can't be undone.
                </p>
                <ng-template nwDialogFooter>
                  <div class="flex justify-end gap-2">
                    <nw-button variant="text" (click)="basic.set(false)"
                      >Cancel</nw-button
                    >
                    <nw-button variant="danger" (click)="basic.set(false)"
                      >Delete</nw-button
                    >
                  </div>
                </ng-template>
              </nw-dialog>
            </docs-demo>

            <docs-demo id="drawer" title="Drawer" [code]="drawerCode">
              <nw-button variant="outlined" (click)="drawer.set(true)"
                >Open drawer</nw-button
              >
              <nw-dialog [(visible)]="drawer" header="Menu" position="right">
                <nav class="space-y-2 text-surface-700">
                  <p>Dashboard</p>
                  <p>Settings</p>
                  <p>Profile</p>
                </nav>
              </nw-dialog>
            </docs-demo>

            <docs-demo id="positions" title="Positions" [code]="positionsCode">
              <nw-button variant="secondary" (click)="left.set(true)"
                >Left</nw-button
              >
              <nw-button variant="secondary" (click)="top.set(true)"
                >Top</nw-button
              >
              <nw-button variant="secondary" (click)="bottom.set(true)"
                >Bottom</nw-button
              >
              <nw-dialog [(visible)]="left" header="Left" position="left">
                <p class="text-surface-700">A left drawer.</p>
              </nw-dialog>
              <nw-dialog [(visible)]="top" header="Top" position="top">
                <p class="text-surface-700">A top sheet.</p>
              </nw-dialog>
              <nw-dialog [(visible)]="bottom" header="Bottom" position="bottom">
                <p class="text-surface-700">A bottom sheet.</p>
              </nw-dialog>
            </docs-demo>

            <docs-demo
              id="advanced"
              title="Draggable, resizable & maximizable"
              [code]="advancedCode"
            >
              <nw-button (click)="advanced.set(true)">Open window</nw-button>
              <nw-dialog
                [(visible)]="advanced"
                header="Window"
                [draggable]="true"
                [resizable]="true"
                [maximizable]="true"
                [modal]="false"
              >
                <p class="text-surface-700">
                  Drag me by the header, resize from the corner, or maximize.
                </p>
              </nw-dialog>
            </docs-demo>

            <docs-demo id="header" title="Custom header template" [code]="headerCode">
              <nw-button variant="outlined" (click)="custom.set(true)"
                >Open</nw-button
              >
              <nw-dialog [(visible)]="custom">
                <ng-template nwDialogHeader>
                  <span class="flex items-center gap-2">
                    <span class="text-primary-500">◆</span>
                    <span>Custom header</span>
                  </span>
                </ng-template>
                <p class="text-surface-700">
                  The header bar is fully templated.
                </p>
              </nw-dialog>
            </docs-demo>

            <docs-demo
              id="confirm"
              title="ConfirmationService"
              [code]="confirmCode"
            >
              <nw-button variant="danger" (click)="askDelete()"
                >Delete item</nw-button
              >
              <span class="text-sm text-surface-600">{{ confirmResult() }}</span>
              <nw-confirm-dialog />
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
export class DialogPageComponent {
  private readonly confirmation = inject(NwConfirmationService);

  protected readonly basic = signal(false);
  protected readonly drawer = signal(false);
  protected readonly left = signal(false);
  protected readonly top = signal(false);
  protected readonly bottom = signal(false);
  protected readonly advanced = signal(false);
  protected readonly custom = signal(false);
  protected readonly confirmResult = signal('');

  protected askDelete(): void {
    this.confirmation.confirm({
      header: 'Delete item',
      message: 'This permanently removes the item. Continue?',
      icon: '⚠️',
      acceptLabel: 'Delete',
      acceptVariant: 'danger',
      accept: () => this.confirmResult.set('Deleted.'),
      reject: () => this.confirmResult.set('Cancelled.'),
    });
  }

  protected readonly sections: TocSection[] = [
    { id: 'basic', label: 'Modal dialog' },
    { id: 'drawer', label: 'Drawer' },
    { id: 'positions', label: 'Positions' },
    { id: 'advanced', label: 'Draggable & resizable' },
    { id: 'header', label: 'Header template' },
    { id: 'confirm', label: 'ConfirmationService' },
  ];

  protected readonly basicCode = `<nw-button (click)="visible.set(true)">Show dialog</nw-button>
<nw-dialog [(visible)]="visible" header="Confirm action">
  <p>Are you sure?</p>
  <ng-template nwDialogFooter>
    <nw-button variant="text" (click)="visible.set(false)">Cancel</nw-button>
    <nw-button variant="danger" (click)="visible.set(false)">Delete</nw-button>
  </ng-template>
</nw-dialog>`;

  protected readonly drawerCode = `<nw-dialog [(visible)]="drawer" header="Menu" position="right">
  <nav>…</nav>
</nw-dialog>`;

  protected readonly positionsCode = `<nw-dialog [(visible)]="open" position="left">…</nw-dialog>
<nw-dialog [(visible)]="open" position="top">…</nw-dialog>
<nw-dialog [(visible)]="open" position="bottom">…</nw-dialog>`;

  protected readonly advancedCode = `<nw-dialog
  [(visible)]="visible"
  header="Window"
  [draggable]="true"
  [resizable]="true"
  [maximizable]="true"
  [modal]="false">
  …
</nw-dialog>`;

  protected readonly headerCode = `<nw-dialog [(visible)]="visible">
  <ng-template nwDialogHeader>
    <span class="icon">◆</span> Custom header
  </ng-template>
  …
</nw-dialog>`;

  protected readonly confirmCode = `// once, at the app root:
<nw-confirm-dialog />

// anywhere:
private confirmation = inject(NwConfirmationService);

delete() {
  this.confirmation.confirm({
    header: 'Delete item',
    message: 'This permanently removes the item. Continue?',
    icon: '⚠️',
    acceptLabel: 'Delete',
    acceptVariant: 'danger',
    accept: () => { /* … */ },
    reject: () => { /* … */ },
  });
}`;

  protected readonly api: ApiRow[] = [
    { name: 'visible', type: 'boolean', default: 'false', description: 'Two-way bound open state.' },
    { name: 'header', type: 'string', default: `''`, description: 'Title shown in the header bar.' },
    { name: 'position', type: `'center' | 'left' | 'right' | 'top' | 'bottom'`, default: `'center'`, description: 'Modal (center) or drawer edge.' },
    { name: 'modal', type: 'boolean', default: 'true', description: 'Shows a backdrop behind the dialog.' },
    { name: 'closable', type: 'boolean', default: 'true', description: 'Shows the ✕ button and enables Escape close.' },
    { name: 'dismissableMask', type: 'boolean', default: 'true', description: 'Clicking the backdrop closes the dialog.' },
    { name: 'draggable', type: 'boolean', default: 'false', description: 'Drag the dialog by its header (center position only).' },
    { name: 'resizable', type: 'boolean', default: 'false', description: 'Adds a corner handle to resize the panel.' },
    { name: 'maximizable', type: 'boolean', default: 'false', description: 'Adds a maximize/restore toggle to the header.' },
    { name: 'blockScroll', type: 'boolean', default: 'true', description: 'Locks page scroll while the dialog is open.' },
    { name: 'width', type: 'string', default: `'32rem'`, description: 'Width for center/left/right (ignored for top/bottom).' },
    { name: 'shown / hidden', type: 'output<void>', default: '—', description: 'Emitted after the dialog opens / closes.' },
    { name: 'nwDialogHeader', type: 'directive', default: '—', description: 'Template for the header: <ng-template nwDialogHeader>.' },
    { name: 'nwDialogFooter', type: 'directive', default: '—', description: 'Template for the footer: <ng-template nwDialogFooter>.' },
    { name: 'NwConfirmationService', type: 'service', default: '—', description: 'confirm({message, accept, reject, …}); render one <nw-confirm-dialog />.' },
  ];
}
