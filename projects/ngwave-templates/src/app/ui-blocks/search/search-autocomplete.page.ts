import { ChangeDetectionStrategy, Component, computed, signal, viewChild } from '@angular/core';
import {
  NwButtonComponent,
  NwCheckboxComponent,
  NwIconComponent,
  NwIconName,
  NwInputTextComponent,
  NwOverlayPanelComponent,
  NwTagComponent,
} from '@ngwave/ui';
import { BlockPreviewShellComponent } from '../block-preview-shell.component';

interface Suggestion {
  icon: NwIconName;
  label: string;
  category: string;
}

const ALL_SUGGESTIONS: Suggestion[] = [
  { icon: 'file-text', label: 'Q3 Expansion Proposal', category: 'Documents' },
  { icon: 'file-text', label: 'Q3 Marketing Budget', category: 'Documents' },
  { icon: 'user', label: 'Quinn Alvarez', category: 'People' },
  { icon: 'folder', label: 'Quality Assurance', category: 'Projects' },
  { icon: 'message-circle', label: 'Quick sync notes', category: 'Messages' },
];

@Component({
  selector: 'app-search-autocomplete-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BlockPreviewShellComponent,
    NwIconComponent,
    NwInputTextComponent,
    NwButtonComponent,
    NwOverlayPanelComponent,
    NwCheckboxComponent,
    NwTagComponent,
  ],
  template: `
    <app-block-preview-shell title="Search with Autocomplete & Filters" maxWidth="max-w-lg">
      <div class="relative">
        <div class="flex gap-2">
          <div class="relative flex-1">
            <nw-icon
              name="search"
              [size]="17"
              class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none z-10"
            />
            <nw-input-text
              [(value)]="query"
              placeholder="Search documents, people, projects…"
              iconLeft="pi pi-search"
              [fluid]="true"
              [clearable]="true"
            />
            @if (query() && suggestions().length > 0) {
              <div
                class="absolute z-20 mt-1.5 w-full rounded-nw-lg border border-surface-200 bg-surface-0 shadow-nw-lg overflow-hidden"
              >
                @for (s of suggestions(); track s.label) {
                  <button
                    type="button"
                    class="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-surface-50"
                  >
                    <nw-icon [name]="s.icon" [size]="16" class="text-surface-400" />
                    <span class="flex-1 text-sm text-surface-900">{{ s.label }}</span>
                    <span class="text-xs text-surface-400">{{ s.category }}</span>
                  </button>
                }
              </div>
            }
          </div>
          <button
            type="button"
            (click)="filters().toggle($event)"
            class="relative inline-flex h-10 shrink-0 items-center gap-1.5 rounded-nw border border-surface-200 px-3 text-sm font-medium text-surface-700 hover:bg-surface-50"
          >
            <nw-icon name="filter" [size]="15" />
            Filters
            @if (activeFilterCount() > 0) {
              <span
                class="inline-flex h-4 w-4 items-center justify-center rounded-full bg-nw-600 text-[10px] font-semibold text-white"
                >{{ activeFilterCount() }}</span
              >
            }
          </button>
        </div>

        @if (activeFilterLabels().length > 0) {
          <div class="mt-2 flex flex-wrap gap-1.5">
            @for (label of activeFilterLabels(); track label) {
              <nw-tag [value]="label" severity="secondary" [rounded]="true" />
            }
          </div>
        }
      </div>

      <nw-overlay-panel>
        <div class="w-64">
          <h3 class="text-sm font-semibold text-surface-900">Advanced filters</h3>

          <p class="mt-3 text-xs font-medium uppercase tracking-wide text-surface-400">Type</p>
          <div class="mt-2 flex flex-col items-start gap-2">
            <nw-checkbox [(checked)]="filterDocs" label="Documents" />
            <nw-checkbox [(checked)]="filterPeople" label="People" />
            <nw-checkbox [(checked)]="filterProjects" label="Projects" />
          </div>

          <p class="mt-4 text-xs font-medium uppercase tracking-wide text-surface-400">Date range</p>
          <div class="mt-2 flex flex-col items-start gap-2">
            <nw-checkbox [(checked)]="filterLastWeek" label="Last 7 days" />
            <nw-checkbox [(checked)]="filterLastMonth" label="Last 30 days" />
          </div>

          <div class="mt-4 flex gap-2">
            <nw-button variant="text" size="small" label="Clear all" (click)="clearFilters()" />
            <nw-button variant="primary" size="small" label="Apply" [fluid]="true" />
          </div>
        </div>
      </nw-overlay-panel>
    </app-block-preview-shell>
  `,
})
export class SearchAutocompleteBlockPageComponent {
  protected readonly filters = viewChild.required(NwOverlayPanelComponent);

  protected readonly query = signal('Q');

  protected readonly filterDocs = signal(true);
  protected readonly filterPeople = signal(false);
  protected readonly filterProjects = signal(false);
  protected readonly filterLastWeek = signal(false);
  protected readonly filterLastMonth = signal(true);

  protected readonly suggestions = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return [];
    return ALL_SUGGESTIONS.filter((s) => s.label.toLowerCase().includes(q));
  });

  protected readonly activeFilterCount = computed(
    () =>
      [
        this.filterDocs(),
        this.filterPeople(),
        this.filterProjects(),
        this.filterLastWeek(),
        this.filterLastMonth(),
      ].filter(Boolean).length,
  );

  protected readonly activeFilterLabels = computed(() => {
    const labels: string[] = [];
    if (this.filterDocs()) labels.push('Documents');
    if (this.filterPeople()) labels.push('People');
    if (this.filterProjects()) labels.push('Projects');
    if (this.filterLastWeek()) labels.push('Last 7 days');
    if (this.filterLastMonth()) labels.push('Last 30 days');
    return labels;
  });

  protected clearFilters(): void {
    this.filterDocs.set(false);
    this.filterPeople.set(false);
    this.filterProjects.set(false);
    this.filterLastWeek.set(false);
    this.filterLastMonth.set(false);
  }
}
