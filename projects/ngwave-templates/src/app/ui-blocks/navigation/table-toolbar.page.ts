import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NwButtonComponent, NwInputTextComponent, NwTagComponent } from '@ngwave/ui';
import { BlockPreviewShellComponent } from '../block-preview-shell.component';

@Component({
  selector: 'app-table-toolbar-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BlockPreviewShellComponent, NwButtonComponent, NwInputTextComponent, NwTagComponent],
  template: `
    <app-block-preview-shell title="Table Toolbar" maxWidth="max-w-3xl">
      <div class="rounded-nw-lg border border-surface-200 bg-surface-0 overflow-hidden">
        <div class="flex flex-wrap items-center gap-3 border-b border-surface-100 p-4">
          <div class="min-w-52 flex-1">
            <nw-input-text placeholder="Search members…" iconLeft="⌕" [fluid]="true" size="normal" />
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="inline-flex h-9 items-center gap-1.5 rounded-nw border border-surface-200 px-3 text-sm font-medium text-surface-700 hover:bg-surface-50"
            >
              Role: All ▾
            </button>
            <button
              type="button"
              class="inline-flex h-9 items-center gap-1.5 rounded-nw border border-surface-200 px-3 text-sm font-medium text-surface-700 hover:bg-surface-50"
            >
              Status ▾
            </button>
          </div>

          <div class="ml-auto flex items-center gap-2">
            @if (selectedCount() > 0) {
              <span class="text-sm text-surface-500">{{ selectedCount() }} selected</span>
              <nw-button variant="text" size="small" label="Remove" />
              <span class="h-5 w-px bg-surface-200"></span>
            }
            <nw-button variant="secondary" size="small" label="Export" />
            <nw-button variant="primary" size="small" label="+ Add member" />
          </div>
        </div>

        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-xs uppercase tracking-wide text-surface-400">
              <th class="w-10 px-4 py-2"></th>
              <th class="px-2 py-2">Name</th>
              <th class="px-2 py-2">Role</th>
              <th class="px-2 py-2">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-100">
            @for (row of rows; track row.name; let i = $index) {
              <tr class="hover:bg-surface-50">
                <td class="px-4 py-3">
                  <input
                    type="checkbox"
                    [checked]="selected().has(i)"
                    (change)="toggleRow(i)"
                    class="h-4 w-4 rounded border-surface-300 text-nw-600 focus:ring-nw-500"
                  />
                </td>
                <td class="px-2 py-3 font-medium text-surface-900">{{ row.name }}</td>
                <td class="px-2 py-3 text-surface-500">{{ row.role }}</td>
                <td class="px-2 py-3">
                  <nw-tag [value]="row.status" [severity]="row.status === 'Active' ? 'success' : 'secondary'" [rounded]="true" />
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </app-block-preview-shell>
  `,
})
export class TableToolbarBlockPageComponent {
  protected readonly selected = signal<Set<number>>(new Set());
  protected readonly selectedCount = signal(0);

  protected readonly rows = [
    { name: 'Aisha Khan', role: 'Product Designer', status: 'Active' },
    { name: 'Marcus Chen', role: 'Frontend Engineer', status: 'Active' },
    { name: 'Priya Nair', role: 'Engineering Manager', status: 'Invited' },
    { name: 'Daniel Ortiz', role: 'Backend Engineer', status: 'Active' },
  ];

  protected toggleRow(index: number): void {
    const next = new Set(this.selected());
    next.has(index) ? next.delete(index) : next.add(index);
    this.selected.set(next);
    this.selectedCount.set(next.size);
  }
}
