import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NwButtonComponent, NwDialogComponent, NwInputTextComponent } from '@ngwave/ui';
import { BlockPreviewShellComponent } from '../block-preview-shell.component';

interface CommandItem {
  icon: string;
  label: string;
  group: string;
  shortcut?: string;
}

const COMMANDS: CommandItem[] = [
  { icon: '📄', label: 'Create new document', group: 'Actions', shortcut: '⌘N' },
  { icon: '👥', label: 'Invite team member', group: 'Actions' },
  { icon: '⚙', label: 'Open settings', group: 'Actions', shortcut: '⌘,' },
  { icon: '📊', label: 'Go to Analytics', group: 'Navigate' },
  { icon: '📁', label: 'Go to Projects', group: 'Navigate' },
  { icon: '💬', label: 'Go to Messages', group: 'Navigate' },
  { icon: '🌙', label: 'Toggle dark mode', group: 'Preferences' },
  { icon: '⎋', label: 'Sign out', group: 'Preferences' },
];

@Component({
  selector: 'app-command-palette-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BlockPreviewShellComponent, NwButtonComponent, NwDialogComponent, NwInputTextComponent],
  template: `
    <app-block-preview-shell title="Command Palette" maxWidth="max-w-sm">
      <div class="flex flex-col items-center gap-3">
        <nw-button variant="secondary" label="Open command palette" (click)="open()" />
        <p class="text-sm text-surface-400">or press <kbd class="rounded border border-surface-300 bg-surface-50 px-1.5 py-0.5 text-xs">⌘K</kbd></p>
      </div>

      <nw-dialog [(visible)]="visible" [closable]="false" [dismissableMask]="true" width="36rem" position="top">
        <div class="-m-6">
          <div class="flex items-center gap-3 border-b border-surface-100 px-4 py-3">
            <span class="text-surface-400">⌕</span>
            <nw-input-text
              [(value)]="query"
              placeholder="Type a command or search…"
              [fluid]="true"
              class="border-0 shadow-none [&_input]:border-0"
            />
            <kbd class="rounded border border-surface-200 px-1.5 py-0.5 text-xs text-surface-400">esc</kbd>
          </div>

          <div class="max-h-96 overflow-y-auto py-2">
            @for (group of groupedResults(); track group.name) {
              <p class="px-4 pt-2 pb-1 text-xs font-semibold uppercase tracking-wide text-surface-400">
                {{ group.name }}
              </p>
              @for (cmd of group.items; track cmd.label) {
                <button
                  type="button"
                  class="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-surface-50"
                >
                  <span class="w-5 text-center">{{ cmd.icon }}</span>
                  <span class="flex-1 text-sm text-surface-900">{{ cmd.label }}</span>
                  @if (cmd.shortcut) {
                    <kbd class="rounded border border-surface-200 px-1.5 py-0.5 text-xs text-surface-400">{{
                      cmd.shortcut
                    }}</kbd>
                  }
                </button>
              }
            }

            @if (groupedResults().length === 0) {
              <p class="px-4 py-8 text-center text-sm text-surface-400">No matching commands.</p>
            }
          </div>
        </div>
      </nw-dialog>
    </app-block-preview-shell>
  `,
})
export class CommandPaletteBlockPageComponent {
  protected readonly visible = signal(false);
  protected readonly query = signal('');

  protected readonly groupedResults = computed(() => {
    const q = this.query().trim().toLowerCase();
    const filtered = q ? COMMANDS.filter((c) => c.label.toLowerCase().includes(q)) : COMMANDS;
    const names = [...new Set(filtered.map((c) => c.group))];
    return names.map((name) => ({ name, items: filtered.filter((c) => c.group === name) }));
  });

  protected open(): void {
    this.query.set('');
    this.visible.set(true);
  }
}
