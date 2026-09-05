import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NwAvatarComponent, NwCardComponent, NwDialogComponent, NwInputTextComponent } from '@ngwave/ui';

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
  imports: [
    RouterLink,
    NwAvatarComponent,
    NwCardComponent,
    NwDialogComponent,
    NwInputTextComponent,
  ],
  template: `
    <div class="min-h-full bg-surface-50">
      <div class="border-b border-surface-200 bg-surface-0 px-6 py-2">
        <a routerLink="/ui-blocks" class="text-sm text-surface-500 hover:text-surface-900">← All UI Blocks</a>
      </div>

      <header class="flex items-center gap-4 border-b border-surface-200 bg-surface-0 px-6 h-16">
        <div class="flex items-center gap-2 shrink-0">
          <span
            class="inline-flex h-8 w-8 items-center justify-center rounded-nw bg-nw-600 text-sm font-bold text-white"
            >N</span
          >
          <span class="font-semibold text-surface-900">Workspace</span>
        </div>

        <button
          type="button"
          (click)="open()"
          class="flex flex-1 max-w-md items-center gap-2 rounded-nw border border-surface-200 bg-surface-50 px-3 py-2 text-sm text-surface-400 hover:border-surface-300 hover:bg-surface-100"
        >
          <span>⌕</span>
          <span class="flex-1 text-left">Search or jump to…</span>
          <kbd class="rounded border border-surface-300 bg-surface-0 px-1.5 py-0.5 text-xs text-surface-500"
            >⌘K</kbd
          >
        </button>

        <nw-avatar label="AK" size="normal" class="ml-auto" />
      </header>

      <main class="max-w-5xl mx-auto px-6 py-10">
        <h1 class="text-lg font-semibold text-surface-900">Dashboard</h1>
        <p class="mt-1 text-sm text-surface-500">
          Press the search bar above (or ⌘K) to open the command palette.
        </p>

        <div class="mt-6 grid gap-6 lg:grid-cols-3">
          <nw-card header="Quick actions" class="lg:col-span-2 block">
            <div class="grid gap-3 sm:grid-cols-2">
              @for (cmd of quickActions; track cmd.label) {
                <button
                  type="button"
                  (click)="open()"
                  class="flex items-center gap-3 rounded-nw border border-surface-200 px-3 py-2.5 text-left hover:border-nw-300 hover:bg-nw-50/40"
                >
                  <span class="text-base">{{ cmd.icon }}</span>
                  <span class="text-sm font-medium text-surface-800">{{ cmd.label }}</span>
                </button>
              }
            </div>
          </nw-card>

          <nw-card header="Shortcuts" class="block">
            <div class="space-y-2.5">
              @for (s of shortcuts; track s.label) {
                <div class="flex items-center justify-between">
                  <span class="text-sm text-surface-600">{{ s.label }}</span>
                  <kbd class="rounded border border-surface-200 bg-surface-50 px-1.5 py-0.5 text-xs text-surface-500">{{
                    s.keys
                  }}</kbd>
                </div>
              }
            </div>
          </nw-card>
        </div>
      </main>

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
    </div>
  `,
})
export class CommandPaletteBlockPageComponent {
  protected readonly visible = signal(false);
  protected readonly query = signal('');

  protected readonly quickActions = COMMANDS.slice(0, 4);
  protected readonly shortcuts = [
    { label: 'Open command palette', keys: '⌘K' },
    { label: 'New document', keys: '⌘N' },
    { label: 'Toggle sidebar', keys: '⌘B' },
    { label: 'Open settings', keys: '⌘,' },
  ];

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
