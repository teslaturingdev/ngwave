import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NwAvatarComponent, NwCheckboxComponent, NwInputTextComponent, NwTagComponent } from '@ngwave/ui';

interface FilterGroup {
  label: string;
  options: { label: string; count: number; checked: boolean }[];
}

interface ResultItem {
  type: string;
  typeColor: string;
  title: string;
  snippet: string;
  path: string;
  author: string;
  authorInitials: string;
  time: string;
  tags: string[];
}

const RESULTS: ResultItem[] = [
  { type: 'Document', typeColor: 'text-sky-400', title: 'Q3 Growth Strategy & Expansion Plan', snippet: 'Outlines the go-to-market approach for entering two new regions, including budget allocation and hiring plan for the...', path: 'Workspace / Strategy / 2026', author: 'Aisha Khan', authorInitials: 'AK', time: '2h ago', tags: ['strategy', 'q3'] },
  { type: 'Code', typeColor: 'text-green-400', title: 'auth/session-store.ts', snippet: 'Handles persistence of the Clerk session identifier in VS Code SecretStorage, plus refresh-on-demand token exchange...', path: 'ngwave-vscode / src / auth', author: 'Marcus Chen', authorInitials: 'MC', time: '5h ago', tags: ['typescript', 'auth'] },
  { type: 'Message', typeColor: 'text-amber-400', title: 'Re: Pricing page copy review', snippet: 'Thanks for the quick turnaround — one small tweak on the Team plan description and this is good to ship...', path: '#product-marketing', author: 'Priya Nair', authorInitials: 'PN', time: '1d ago', tags: ['copy', 'pricing'] },
  { type: 'Document', typeColor: 'text-sky-400', title: 'Onboarding Checklist — Design Spec', snippet: 'Component breakdown for the setup progress card, including states for 0%, partial, and fully completed...', path: 'Workspace / Design / Specs', author: 'Sofia Rossi', authorInitials: 'SR', time: '2d ago', tags: ['design', 'onboarding'] },
  { type: 'Person', typeColor: 'text-fuchsia-400', title: 'Daniel Ortiz', snippet: 'Backend Engineer · Platform team · Joined Jan 2025 · 14 shared projects', path: 'People directory', author: 'Daniel Ortiz', authorInitials: 'DO', time: 'Active now', tags: ['backend'] },
];

@Component({
  selector: 'app-search-results-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NwInputTextComponent, NwCheckboxComponent, NwAvatarComponent, NwTagComponent],
  template: `
    <div class="min-h-full bg-slate-950 text-slate-100">
      <header class="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div class="mx-auto flex max-w-6xl items-center gap-4 px-6 h-16">
          <a routerLink="/ui-blocks" class="text-sm text-slate-400 hover:text-slate-100">← All UI Blocks</a>
          <div class="flex-1 max-w-xl">
            <nw-input-text [(value)]="query" placeholder="Search everything…" iconLeft="⌕" [fluid]="true" />
          </div>
          <nw-avatar label="You" size="normal" />
        </div>
      </header>

      <div class="mx-auto max-w-6xl px-6 py-8">
        <div class="flex items-baseline justify-between">
          <h1 class="text-xl font-semibold">
            Results for "<span class="text-sky-400">{{ query() }}</span>"
          </h1>
          <p class="text-sm text-slate-400">{{ filteredResults().length }} results</p>
        </div>

        <div class="mt-6 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
          <aside class="space-y-6">
            @for (group of groups(); track group.label) {
              <div>
                <h3 class="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {{ group.label }}
                </h3>
                <div class="mt-2.5 space-y-2">
                  @for (opt of group.options; track opt.label) {
                    <label class="flex items-center justify-between gap-2 cursor-pointer group">
                      <span class="flex items-center gap-2">
                        <nw-checkbox [checked]="opt.checked" (checkedChange)="toggleOption(group, opt)" />
                        <span class="text-sm text-slate-300 group-hover:text-slate-100">{{ opt.label }}</span>
                      </span>
                      <span class="text-xs text-slate-500">{{ opt.count }}</span>
                    </label>
                  }
                </div>
              </div>
            }
          </aside>

          <div class="space-y-4">
            @for (r of filteredResults(); track r.title) {
              <article
                class="rounded-nw-lg border border-slate-800 bg-slate-900/60 p-5 hover:border-slate-700 transition-colors"
              >
                <div class="flex items-center gap-2">
                  <span class="text-xs font-semibold uppercase tracking-wide" [class]="r.typeColor">{{
                    r.type
                  }}</span>
                  <span class="text-xs text-slate-600">·</span>
                  <span class="text-xs text-slate-500">{{ r.path }}</span>
                </div>
                <h2 class="mt-1.5 text-base font-semibold text-slate-100 hover:text-sky-400 cursor-pointer">
                  {{ r.title }}
                </h2>
                <p class="mt-1 text-sm text-slate-400 line-clamp-2">{{ r.snippet }}</p>
                <div class="mt-3 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <nw-avatar [label]="r.authorInitials" size="normal" />
                    <span class="text-xs text-slate-400">{{ r.author }} · {{ r.time }}</span>
                  </div>
                  <div class="flex gap-1.5">
                    @for (tag of r.tags; track tag) {
                      <nw-tag [value]="tag" severity="contrast" [rounded]="true" />
                    }
                  </div>
                </div>
              </article>
            }

            @if (filteredResults().length === 0) {
              <div class="rounded-nw-lg border border-dashed border-slate-800 py-16 text-center text-slate-500">
                No results match the selected filters.
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SearchResultsBlockPageComponent {
  protected readonly query = signal('growth strategy');

  protected readonly groups = signal<FilterGroup[]>([
    {
      label: 'Content type',
      options: [
        { label: 'Documents', count: 128, checked: true },
        { label: 'Code', count: 342, checked: true },
        { label: 'Messages', count: 76, checked: true },
        { label: 'People', count: 24, checked: true },
      ],
    },
    {
      label: 'Date',
      options: [
        { label: 'Today', count: 6, checked: false },
        { label: 'This week', count: 31, checked: false },
        { label: 'This month', count: 94, checked: false },
      ],
    },
  ]);

  private readonly activeTypes = computed(() => {
    const typeGroup = this.groups().find((g) => g.label === 'Content type');
    return new Set(
      (typeGroup?.options ?? [])
        .filter((o) => o.checked)
        .map((o) => o.label.replace(/s$/, '')),
    );
  });

  protected readonly filteredResults = computed(() => {
    const types = this.activeTypes();
    return RESULTS.filter((r) => types.has(r.type));
  });

  protected toggleOption(group: FilterGroup, option: FilterGroup['options'][number]): void {
    this.groups.update((groups) =>
      groups.map((g) =>
        g === group
          ? {
              ...g,
              options: g.options.map((o) => (o === option ? { ...o, checked: !o.checked } : o)),
            }
          : g,
      ),
    );
  }
}
