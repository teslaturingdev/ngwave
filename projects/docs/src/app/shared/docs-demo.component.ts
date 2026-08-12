import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'docs-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section [id]="id()" class="scroll-mt-24">
      @if (title()) {
        <h2 class="text-xl font-semibold text-surface-900 mb-2">
          {{ title() }}
        </h2>
      }
      <div
        class="rounded-nw border border-surface-200 bg-surface-0 p-6 flex flex-wrap items-center gap-3"
      >
        <ng-content />
      </div>
      @if (code()) {
        <div class="relative mt-3 rounded-nw bg-[#0f172a]">
          <button
            type="button"
            (click)="copy()"
            class="absolute top-2 right-2 text-xs px-2 py-1 rounded-nw bg-[#1e293b] text-[#e2e8f0] hover:bg-[#334155] transition-colors"
          >
            {{ copied() ? 'Copied!' : 'Copy' }}
          </button>
          <pre
            class="p-4 pr-16 overflow-x-auto text-sm leading-relaxed text-slate-100"
          ><code [innerHTML]="highlighted()"></code></pre>
        </div>
      }
    </section>
  `,
})
export class DocsDemoComponent {
  private readonly sanitizer = inject(DomSanitizer);

  readonly id = input<string>('');
  readonly title = input<string>('');
  readonly code = input<string>('');
  protected readonly copied = signal(false);

  protected readonly highlighted = computed(() =>
    this.sanitizer.bypassSecurityTrustHtml(this.highlight(this.code())),
  );

  protected async copy(): Promise<void> {
    await navigator.clipboard.writeText(this.code());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1500);
  }

  private highlight(code: string): string {
    let s = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    // strings
    s = s.replace(
      /"([^"]*)"/g,
      '<span class="text-amber-300">"$1"</span>',
    );
    s = s.replace(
      /'([^']*)'/g,
      `<span class="text-amber-300">'$1'</span>`,
    );
    // line comments
    s = s.replace(
      /(\/\/[^\n]*)/g,
      '<span class="text-slate-500">$1</span>',
    );
    // tag names
    s = s.replace(
      /(&lt;\/?)([a-zA-Z][\w-]*)/g,
      '$1<span class="text-sky-400">$2</span>',
    );
    return s;
  }
}
