import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NwButtonComponent } from '@ngwave/ui';

@Component({
  selector: 'docs-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NwButtonComponent],
  template: `
    <section class="py-8">
      <span
        class="inline-block text-xs font-medium px-2 py-1 rounded-nw bg-nw-100 text-nw-700"
        >MIT · Angular 22 · Signals · v0.6.0</span
      >
      <h1 class="mt-4 text-4xl font-bold tracking-tight text-surface-900">
        The open-source PrimeNG alternative.
      </h1>
      <p class="mt-4 text-lg text-surface-600">
        NgWave is a modern Angular UI component library — twelve fully-featured
        components including a flagship DataTable, Autocomplete, and a complete
        set of form inputs. Free forever, built on the Signals API, with a
        themeable design-token system out of the box.
      </p>

      <div class="mt-6 flex flex-wrap items-center gap-3">
        <a routerLink="/components/button">
          <nw-button size="large">Browse components</nw-button>
        </a>
        <a href="https://templates.ngwave.dev" target="_blank" rel="noopener">
          <nw-button size="large" variant="outlined">View templates ↗</nw-button>
        </a>
        <a routerLink="/changelog">
          <nw-button size="large" variant="text">What's new</nw-button>
        </a>
      </div>

      <div
        class="mt-8 rounded-nw border border-surface-200 bg-[#0f172a] p-4 text-sm text-[#e2e8f0] font-mono"
      >
        npm install &#64;ngwave/ui&#64;0.6.0
      </div>
    </section>
  `,
})
export class HomeComponent {}
