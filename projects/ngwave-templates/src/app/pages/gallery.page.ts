import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NwTagComponent } from '@ngwave/ui';

type TemplateKind = 'landing' | 'admin';

interface TemplateEntry {
  slug: string;
  title: string;
  description: string;
  tag: string;
  kind: TemplateKind;
  components: string[];
}

interface Highlight {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-gallery-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NwTagComponent],
  template: `
    <div class="min-h-full flex flex-col bg-surface-0">
      <header
        class="sticky top-0 z-10 flex items-center justify-between px-6 h-14 border-b border-surface-200 bg-surface-0/90 backdrop-blur"
      >
        <div class="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 40 40" aria-hidden="true" class="shrink-0">
            <path
              d="M17 10 L7 20 L17 30"
              style="stroke: rgb(var(--nw-600))"
              stroke-width="4.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              fill="none"
            />
            <path
              d="M23 10 L33 20 L23 30"
              style="stroke: rgb(var(--nw-400))"
              stroke-width="4.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              fill="none"
            />
          </svg>
          <span class="font-semibold text-surface-900">NgWave Templates</span>
        </div>
        <a href="https://ngwave.dev" class="text-sm text-surface-600 hover:text-surface-900">
          ngwave.dev ↗
        </a>
      </header>

      <!-- Hero -->
      <section class="relative overflow-hidden border-b border-surface-200 bg-surface-50">
        <div
          class="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-nw-200 to-nw-50 opacity-60 blur-3xl"
          aria-hidden="true"
        ></div>
        <div
          class="absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-gradient-to-tr from-nw-100 to-transparent opacity-70 blur-3xl"
          aria-hidden="true"
        ></div>
        <div class="relative max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
          <span
            class="inline-flex items-center gap-1.5 rounded-full bg-nw-50 text-nw-700 text-xs font-medium px-3 py-1 ring-1 ring-nw-100"
          >
            ✦ {{ templates.length }} full-page templates, more on the way
          </span>
          <h1 class="mt-5 text-4xl sm:text-5xl font-bold tracking-tight text-surface-900">
            Real pages, not just component demos
          </h1>
          <p class="mt-4 text-lg text-surface-600 max-w-2xl mx-auto">
            Every template on this page is a genuine, working composition built
            entirely from <span class="font-medium text-surface-900">@ngwave/ui</span>
            — the same components, the same tokens, ready to copy into your own app.
          </p>

          <div class="mt-10 grid gap-6 sm:grid-cols-3 max-w-3xl mx-auto text-left">
            @for (h of highlights; track h.title) {
              <div class="rounded-nw-lg border border-surface-200 bg-surface-0 p-4 shadow-nw-sm">
                <span
                  class="inline-flex h-9 w-9 items-center justify-center rounded-nw bg-nw-50 text-nw-600"
                  >{{ h.icon }}</span
                >
                <h3 class="mt-3 text-sm font-semibold text-surface-900">{{ h.title }}</h3>
                <p class="mt-1 text-xs text-surface-500">{{ h.description }}</p>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Templates -->
      <main class="flex-1 max-w-5xl w-full mx-auto px-6 py-16">
        <div class="flex items-end justify-between gap-4 mb-8">
          <div>
            <h2 class="text-2xl font-bold text-surface-900">Browse templates</h2>
            <p class="mt-1 text-sm text-surface-500">Click one to open the full page.</p>
          </div>
        </div>

        <div class="grid gap-6 sm:grid-cols-2">
          @for (t of templates; track t.slug) {
            <a
              [routerLink]="'/' + t.slug"
              class="group block rounded-nw-lg border border-surface-200 bg-surface-0 overflow-hidden shadow-nw-sm hover:shadow-nw-xl hover:-translate-y-0.5 transition-all"
            >
              <div class="h-48 bg-surface-50 border-b border-surface-200 p-5">
                @if (t.kind === 'landing') {
                  <div
                    class="h-full w-full rounded-nw border border-surface-200 bg-surface-0 flex flex-col overflow-hidden shadow-nw-sm"
                  >
                    <div class="h-4 border-b border-surface-200 bg-surface-100 flex items-center gap-1 px-2">
                      <span class="h-1 w-6 rounded-full bg-surface-300"></span>
                      <span class="ml-auto h-1 w-1.5 rounded-full bg-nw-400"></span>
                      <span class="h-1 w-1.5 rounded-full bg-nw-400"></span>
                    </div>
                    <div class="flex-1 flex flex-col items-center justify-center gap-2 px-6">
                      <span class="h-2 w-28 rounded-full bg-surface-300"></span>
                      <span class="h-1.5 w-36 rounded-full bg-surface-200"></span>
                      <span class="mt-1.5 h-3.5 w-16 rounded-full bg-nw-500"></span>
                    </div>
                    <div class="flex items-center justify-center gap-2 pb-3">
                      @for (i of [0, 1, 2]; track i) {
                        <span class="h-6 w-10 rounded bg-surface-100"></span>
                      }
                    </div>
                  </div>
                } @else {
                  <div class="h-full w-full rounded-nw border border-surface-200 bg-surface-0 flex overflow-hidden shadow-nw-sm">
                    <div class="w-10 bg-surface-800 shrink-0 flex flex-col items-center gap-2 pt-3">
                      @for (i of [0, 1, 2, 3]; track i) {
                        <span
                          class="h-2.5 w-2.5 rounded"
                          [class]="i === 0 ? 'bg-nw-400' : 'bg-white/20'"
                        ></span>
                      }
                    </div>
                    <div class="flex-1 flex flex-col">
                      <div class="h-4 border-b border-surface-200 bg-surface-100"></div>
                      <div class="flex-1 p-3 grid grid-cols-3 gap-1.5">
                        <span class="rounded bg-nw-100"></span>
                        <span class="rounded bg-surface-100"></span>
                        <span class="rounded bg-surface-100"></span>
                        <span class="col-span-3 rounded bg-surface-100"></span>
                        <span class="col-span-2 rounded bg-surface-50 border border-surface-100"></span>
                        <span class="rounded bg-surface-50 border border-surface-100"></span>
                      </div>
                    </div>
                  </div>
                }
              </div>
              <div class="p-5">
                <div class="flex items-center justify-between gap-2">
                  <h2 class="font-semibold text-lg text-surface-900 group-hover:text-nw-600 transition-colors">
                    {{ t.title }}
                  </h2>
                  <nw-tag [value]="t.tag" severity="secondary" />
                </div>
                <p class="mt-1.5 text-sm text-surface-600">{{ t.description }}</p>
                <div class="mt-3 flex flex-wrap gap-1.5">
                  @for (c of t.components; track c) {
                    <span class="text-[11px] font-medium px-2 py-0.5 rounded-full bg-surface-100 text-surface-600">
                      {{ c }}
                    </span>
                  }
                </div>
                <span class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-nw-600">
                  View template
                  <span class="transition-transform group-hover:translate-x-0.5">→</span>
                </span>
              </div>
            </a>
          }
        </div>
      </main>

      <!-- Closing CTA -->
      <section class="border-t border-surface-200 bg-surface-50">
        <div class="max-w-5xl mx-auto px-6 py-14 text-center">
          <h2 class="text-2xl font-bold text-surface-900">Want to see the components themselves?</h2>
          <p class="mt-2 text-surface-600">
            Every piece used here — DataTable, Tree, Dialog, Accordion, and more — has its
            own page with the full API.
          </p>
          <a
            href="https://ngwave.dev"
            class="mt-6 inline-flex items-center gap-2 rounded-nw bg-nw-600 px-5 py-2.5 text-sm font-medium text-white shadow-nw-sm hover:bg-nw-700 transition-colors"
          >
            Browse the component docs ↗
          </a>
        </div>
      </section>

      <footer class="px-6 py-6 text-center text-xs text-surface-400">
        Built entirely with
        <a href="https://ngwave.dev" class="underline hover:text-surface-600">@ngwave/ui</a>.
      </footer>
    </div>
  `,
})
export class GalleryPageComponent {
  protected readonly highlights: Highlight[] = [
    { icon: '⚡', title: 'Real compositions', description: 'Not isolated demos — full pages you could ship.' },
    { icon: '🎨', title: 'One design system', description: 'Same tokens, same components, light & dark ready.' },
    { icon: '📱', title: 'Fully responsive', description: 'Every layout adapts down to mobile widths.' },
  ];

  protected readonly templates: TemplateEntry[] = [
    {
      slug: 'landing-page',
      title: 'SaaS Landing Page',
      description: 'Hero, feature spotlights, pricing, testimonials, and FAQ.',
      tag: 'Marketing',
      kind: 'landing',
      components: ['Button', 'Card', 'Tag', 'Avatar', 'Rating', 'Accordion', 'Divider', 'Input'],
    },
    {
      slug: 'admin-dashboard',
      title: 'Admin Template',
      description: 'Dashboard, user management, and file manager — one connected suite.',
      tag: 'App',
      kind: 'admin',
      components: ['DataTable', 'Tree', 'Splitter', 'Dialog', 'Dropdown', 'Tabs', 'FileUpload', 'Tag'],
    },
  ];
}
