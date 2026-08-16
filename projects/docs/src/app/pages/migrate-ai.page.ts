import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { migrate } from '@ngwave/migrate';
import { NwSpinnerComponent } from '@ngwave/ui';
import { AuthService } from '../auth.service';

interface AiChange {
  summary: string;
  detail: string;
  confidence: 'high' | 'medium' | 'low';
}
interface AiResult {
  html: string;
  ts: string;
  changes: AiChange[];
  unresolved: string[];
  model: string;
  corrected: boolean;
}

interface Sample {
  id: string;
  label: string;
  html: string;
  ts: string;
}

const SAMPLES: Sample[] = [
  {
    id: 'table',
    label: 'DataTable',
    html: `<p-table
  [value]="products"
  [rows]="10"
  [paginator]="true"
  sortMode="multiple"
  [(selection)]="selected"
  dataKey="id"
  [globalFilterFields]="['name']">
  <ng-template pTemplate="header">
    <tr><th>Name</th><th>Price</th></tr>
  </ng-template>
  <ng-template pTemplate="body" let-p>
    <tr><td>{{ p.name }}</td><td>{{ p.price }}</td></tr>
  </ng-template>
</p-table>`,
    ts: `import { Component } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.html',
})
export class ProductsComponent {
  products = [{ id: 1, name: 'Widget', price: 9.99 }];
  selected: any[] = [];
}`,
  },
  {
    id: 'form',
    label: 'Form',
    html: `<input pInputText [(ngModel)]="name" placeholder="Name" />
<p-inputNumber [(ngModel)]="qty" mode="currency" currency="USD"></p-inputNumber>
<p-dropdown [options]="opts" [(ngModel)]="sel" optionLabel="label" [filter]="true"></p-dropdown>
<textarea pInputTextarea [(ngModel)]="notes" [rows]="3"></textarea>`,
    ts: '',
  },
  {
    id: 'button',
    label: 'Buttons',
    html: `<p-button label="Save" icon="pi pi-check" (onClick)="save()"></p-button>
<p-button label="Delete" severity="danger" [outlined]="true"></p-button>
<button pButton type="button" label="Next" iconPos="right"></button>`,
    ts: '',
  },
  {
    id: 'toast',
    label: 'Toast',
    html: `<p-toast position="top-right"></p-toast>
<p-button label="Notify" (onClick)="notify()"></p-button>`,
    ts: `import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.html',
  providers: [MessageService],
})
export class NotifyComponent {
  constructor(private messageService: MessageService) {}

  notify() {
    this.messageService.add({
      severity: 'success',
      summary: 'Saved',
      detail: 'Your changes were saved.',
    });
  }
}`,
  },
];

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Lightweight Angular-template highlighter → safe HTML (strings pulled out first). */
function highlight(code: string): string {
  const strings: string[] = [];
  let h = escapeHtml(code).replace(/"([^"]*)"/g, (_m, inner) => {
    strings.push(inner);
    return `" ${strings.length - 1} "`;
  });
  h = h.replace(
    /(\[\([\w.\-]+\)\]|\[[\w.\-]+\]|\([\w.\-@]+\)|[a-zA-Z_:@#*][\w:.\-]*)(=)/g,
    '<span style="color:#7dd3fc">$1</span>$2',
  );
  h = h.replace(
    /(&lt;\/?)([a-zA-Z][\w-]*)/g,
    '$1<span style="color:#f472b6">$2</span>',
  );
  h = h.replace(
    /" (\d+) "/g,
    (_m, i) => `<span style="color:#fde68a">"${strings[+i]}"</span>`,
  );
  return h;
}

@Component({
  selector: 'docs-migrate-ai-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NwSpinnerComponent, RouterLink],
  template: `
    <div class="space-y-6">
      <header
        class="relative overflow-hidden rounded-nw-lg border border-surface-200 bg-gradient-to-br from-nw-600 to-nw-800 p-6 text-white shadow-nw-md"
      >
        <div
          class="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl"
        ></div>
        <div class="relative">
          <span
            class="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium backdrop-blur"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-fuchsia-300"></span>
            AI-assisted · powered by Claude
          </span>
          <h1 class="mt-3 text-3xl font-bold tracking-tight">
            Finish with AI ✨
          </h1>
          <p class="mt-1.5 max-w-2xl text-white/80">
            Paste a full component — template and (optionally) its
            <code class="rounded bg-white/10 px-1">.ts</code> — and get compiling
            NgWave code back. The AI builds
            <code class="rounded bg-white/10 px-1">[columns]</code> arrays,
            migrates services, fixes imports, and honestly flags anything NgWave
            can't do yet.
          </p>
          <a
            routerLink="/migrate"
            class="mt-3 inline-flex items-center gap-1.5 text-sm text-white/70 underline-offset-2 hover:text-white hover:underline"
          >
            ← Just need the free instant codemod? Use plain Migrate
          </a>
        </div>
      </header>

      <div class="flex flex-wrap items-center gap-2">
        <span class="text-xs font-semibold uppercase tracking-wide text-surface-500"
          >Try a sample</span
        >
        @for (s of samples; track s.id) {
          <button
            type="button"
            (click)="loadSample(s)"
            class="rounded-full border px-3 py-1 text-sm transition-colors duration-150 ease-nw"
            [class]="
              activeSample() === s.id
                ? 'border-nw-500 bg-nw-50 text-nw-700 font-medium'
                : 'border-surface-300 text-surface-600 hover:bg-surface-100'
            "
          >
            {{ s.label }}
          </button>
        }
        <button
          type="button"
          (click)="clear()"
          class="ml-auto rounded-full px-3 py-1 text-sm text-surface-500 hover:bg-surface-100"
        >
          Clear
        </button>
      </div>

      <!-- INPUT → OUTPUT split -->
      <div class="grid items-start gap-6 lg:grid-cols-2">
        <!-- LEFT: input -->
        <div class="space-y-4">
          <div
            class="rounded-nw-lg border border-surface-200 bg-surface-0 p-1 shadow-nw-sm"
          >
            <div
              class="flex items-center gap-2 px-3 pt-2 text-xs font-semibold uppercase tracking-wide text-surface-500"
            >
              <span class="h-2 w-2 rounded-full bg-nw-500"></span>
              Your PrimeNG
            </div>
            <div class="flex flex-col">
              <label
                class="px-3 pt-3 pb-1 text-[11px] font-medium text-surface-400"
                >template .html</label
              >
              <textarea
                [value]="htmlInput()"
                (input)="onHtml($event)"
                spellcheck="false"
                placeholder="Paste your PrimeNG template here…"
                class="mx-1 h-64 resize-y rounded-nw border border-surface-200 bg-surface-0 p-3 font-mono text-sm text-surface-900 transition-[border-color,box-shadow] duration-150 ease-nw placeholder:text-surface-400 hover:border-surface-300 focus:border-nw-500 focus:outline-none focus:ring-4 focus:ring-nw-500/15"
              ></textarea>
              <label
                class="px-3 pt-3 pb-1 text-[11px] font-medium text-surface-400"
                >component .ts <span class="text-surface-300">(optional)</span></label
              >
              <textarea
                [value]="tsInput()"
                (input)="onTs($event)"
                spellcheck="false"
                placeholder="Paste the component's .ts to migrate services, build [columns] arrays, fix imports…"
                class="mx-1 mb-1 h-40 resize-y rounded-nw border border-surface-200 bg-surface-0 p-3 font-mono text-sm text-surface-900 transition-[border-color,box-shadow] duration-150 ease-nw placeholder:text-surface-400 hover:border-surface-300 focus:border-nw-500 focus:outline-none focus:ring-4 focus:ring-nw-500/15"
              ></textarea>
            </div>
          </div>

          <!-- Deterministic preview badge -->
          @if (detTotal() > 0) {
            <div
              class="flex items-center justify-between rounded-nw border border-surface-200 bg-surface-50 px-3 py-2 text-xs text-surface-600"
            >
              <span
                >Rules handle
                <span class="font-semibold text-surface-900">{{ automated() }}%</span>
                automatically</span
              >
              <span class="text-surface-400"
                >{{ det().report.manual.length }} manual ·
                {{ det().report.unsupported.length }} need AI</span
              >
            </div>
          }

          <div class="flex flex-wrap items-center gap-3">
            <button
              type="button"
              (click)="finishWithAI()"
              [disabled]="aiLoading() || !htmlInput().trim()"
              class="inline-flex items-center gap-2 rounded-nw bg-nw-600 px-4 py-2.5 text-sm font-semibold text-white shadow-nw-sm transition-colors hover:bg-nw-700 disabled:opacity-50"
            >
              @if (aiLoading()) {
                <nw-spinner [size]="16" variant="current" />
                Working…
              } @else {
                Finish with AI ✨
              }
            </button>
            <label
              class="inline-flex cursor-pointer items-center gap-1.5 text-xs text-surface-600"
            >
              <input type="checkbox" [checked]="deep()" (change)="toggleDeep($event)" />
              Deep mode (Opus — slower, sharper)
            </label>
          </div>
        </div>

        <!-- RIGHT: output -->
        <div
          class="rounded-nw-lg border border-surface-200 bg-surface-0 shadow-nw-sm"
        >
          <div
            class="flex items-center gap-2 border-b border-surface-200 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-surface-500"
          >
            <span class="h-2 w-2 rounded-full bg-green-500"></span>
            NgWave output
          </div>

          @if (aiError()) {
            <div
              class="m-4 rounded-nw border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {{ aiError() }}
            </div>
          }

          @if (aiLoading()) {
            <div
              class="flex flex-col items-center justify-center gap-3 px-4 py-24 text-center text-surface-500"
            >
              <nw-spinner [size]="28" />
              <div class="text-sm">Claude is finishing your migration…</div>
              <div class="text-xs text-surface-400">
                Usually a few seconds{{ deep() ? ' — deep mode takes longer' : '' }}
              </div>
            </div>
          } @else if (aiResult(); as ai) {
            <div class="space-y-4 p-4 animate-nw-fade-in">
              @if (auth.isSignedIn()) {
                <div class="flex items-center justify-end">
                  <button
                    type="button"
                    (click)="save()"
                    [disabled]="saving() || saved()"
                    class="rounded-nw bg-surface-100 px-3 py-1.5 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-200 disabled:opacity-50"
                  >
                    {{ saved() ? 'Saved ✓' : saving() ? 'Saving…' : 'Save to my account' }}
                  </button>
                </div>
              }
              @if (saveError()) {
                <div class="rounded-nw border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {{ saveError() }}
                </div>
              }
              <div>
                <div class="mb-1.5 flex items-center justify-between">
                  <span
                    class="text-xs font-semibold uppercase tracking-wide text-surface-500"
                    >Migrated template</span
                  >
                  <button
                    type="button"
                    (click)="copyText(ai.html, 'html')"
                    class="rounded-nw bg-surface-100 px-2 py-0.5 text-xs text-surface-700 hover:bg-surface-200"
                  >
                    {{ copiedKey() === 'html' ? '✓ Copied' : 'Copy' }}
                  </button>
                </div>
                <pre
                  class="max-h-72 overflow-auto rounded-nw bg-[#0b1020] p-3 font-mono text-xs leading-relaxed text-[#e2e8f0]"
                ><code [innerHTML]="hl(ai.html)"></code></pre>
              </div>

              @if (ai.ts) {
                <div>
                  <div class="mb-1.5 flex items-center justify-between">
                    <span
                      class="text-xs font-semibold uppercase tracking-wide text-surface-500"
                      >Migrated .ts</span
                    >
                    <button
                      type="button"
                      (click)="copyText(ai.ts, 'ts')"
                      class="rounded-nw bg-surface-100 px-2 py-0.5 text-xs text-surface-700 hover:bg-surface-200"
                    >
                      {{ copiedKey() === 'ts' ? '✓ Copied' : 'Copy' }}
                    </button>
                  </div>
                  <pre
                    class="max-h-72 overflow-auto rounded-nw bg-[#0b1020] p-3 font-mono text-xs leading-relaxed text-[#e2e8f0]"
                  ><code [innerHTML]="hl(ai.ts)"></code></pre>
                </div>
              }

              @if (ai.changes.length) {
                <div>
                  <div
                    class="mb-2 text-xs font-semibold uppercase tracking-wide text-surface-500"
                  >
                    What the AI changed
                  </div>
                  <ul class="space-y-1.5">
                    @for (c of ai.changes; track c.summary) {
                      <li class="flex items-start gap-2 text-sm text-surface-700">
                        <span
                          class="mt-0.5 shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase"
                          [class]="confClass(c.confidence)"
                          >{{ c.confidence }}</span
                        >
                        <span
                          ><span class="font-medium text-surface-900">{{
                            c.summary
                          }}</span>
                          — {{ c.detail }}</span
                        >
                      </li>
                    }
                  </ul>
                </div>
              }

              @if (ai.unresolved.length) {
                <div class="rounded-nw border border-amber-200 bg-amber-50 p-3">
                  <div
                    class="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-700"
                  >
                    Still needs you
                  </div>
                  <ul class="list-disc space-y-1 pl-5 text-sm text-amber-800">
                    @for (u of ai.unresolved; track u) {
                      <li>{{ u }}</li>
                    }
                  </ul>
                </div>
              }

              <div class="text-xs text-surface-400">
                Powered by Claude · {{ ai.model
                }}{{ ai.corrected ? ' · auto-corrected' : '' }}
              </div>
            </div>
          } @else {
            <div
              class="flex flex-col items-center justify-center gap-2 px-4 py-24 text-center text-surface-400"
            >
              <div class="text-4xl">✨</div>
              <div class="text-sm">
                Your finished NgWave code will appear here.
              </div>
              <div class="max-w-xs text-xs">
                Paste a component on the left and hit
                <span class="font-medium text-surface-500">Finish with AI</span>.
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class MigrateAiPageComponent {
  protected readonly samples = SAMPLES;
  protected readonly htmlInput = signal(SAMPLES[0].html);
  protected readonly tsInput = signal(SAMPLES[0].ts);
  protected readonly activeSample = signal<string>('table');

  private readonly san = inject(DomSanitizer);
  protected readonly auth = inject(AuthService);
  protected readonly saving = signal(false);
  protected readonly saved = signal(false);
  protected readonly saveError = signal('');

  protected readonly det = computed(() =>
    this.htmlInput().trim()
      ? migrate(this.htmlInput())
      : { code: '', imports: [], report: { mapped: [], manual: [], unsupported: [] } },
  );

  protected readonly detTotal = computed(() => {
    const r = this.det().report;
    return r.mapped.length + r.manual.length + r.unsupported.length;
  });

  protected readonly automated = computed(() =>
    this.detTotal() === 0
      ? 0
      : Math.round((this.det().report.mapped.length / this.detTotal()) * 100),
  );

  protected readonly aiLoading = signal(false);
  protected readonly aiError = signal('');
  protected readonly aiResult = signal<AiResult | null>(null);
  protected readonly deep = signal(false);
  protected readonly copiedKey = signal<'html' | 'ts' | ''>('');

  protected onHtml(event: Event): void {
    this.htmlInput.set((event.target as HTMLTextAreaElement).value);
    this.activeSample.set('');
  }

  protected onTs(event: Event): void {
    this.tsInput.set((event.target as HTMLTextAreaElement).value);
    this.activeSample.set('');
  }

  protected loadSample(s: Sample): void {
    this.htmlInput.set(s.html);
    this.tsInput.set(s.ts);
    this.activeSample.set(s.id);
    this.aiResult.set(null);
    this.aiError.set('');
  }

  protected clear(): void {
    this.htmlInput.set('');
    this.tsInput.set('');
    this.activeSample.set('');
    this.aiResult.set(null);
    this.aiError.set('');
    this.saved.set(false);
    this.saveError.set('');
  }

  protected toggleDeep(event: Event): void {
    this.deep.set((event.target as HTMLInputElement).checked);
  }

  protected hl(code: string): SafeHtml {
    return this.san.bypassSecurityTrustHtml(highlight(code));
  }

  protected confClass(c: 'high' | 'medium' | 'low'): string {
    return c === 'high'
      ? 'bg-green-100 text-green-700'
      : c === 'medium'
        ? 'bg-amber-100 text-amber-700'
        : 'bg-surface-100 text-surface-600';
  }

  protected async copyText(text: string, key: 'html' | 'ts'): Promise<void> {
    await navigator.clipboard.writeText(text);
    this.copiedKey.set(key);
    setTimeout(() => this.copiedKey.set(''), 1500);
  }

  protected async finishWithAI(): Promise<void> {
    this.aiLoading.set(true);
    this.aiError.set('');
    this.aiResult.set(null);
    this.saved.set(false);
    this.saveError.set('');
    try {
      const token = await this.auth.getToken();
      const resp = await fetch('/api/migrate-ai', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          html: this.htmlInput(),
          ts: this.tsInput().trim() || undefined,
          deterministic: this.det(),
          deep: this.deep(),
        }),
      });
      const raw = await resp.text();
      let data: { error?: string } & Partial<AiResult> = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error(
          `Server returned an unexpected response (${resp.status}). Please try again.`,
        );
      }
      if (!resp.ok) throw new Error(data.error || `Request failed (${resp.status}).`);
      this.aiResult.set(data as AiResult);
    } catch (e) {
      this.aiError.set(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      this.aiLoading.set(false);
    }
  }

  protected async save(): Promise<void> {
    const result = this.aiResult();
    if (!result) return;
    this.saving.set(true);
    this.saveError.set('');
    try {
      const token = await this.auth.getToken();
      const resp = await fetch('/api/save-migration', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          tool: 'migrate-ai',
          summary: {
            component: this.activeSample() || 'custom',
            changes: result.changes?.length ?? 0,
          },
          payload: result,
        }),
      });
      const raw = await resp.text();
      const data = raw ? JSON.parse(raw) : {};
      if (!resp.ok) throw new Error(data.error || `Request failed (${resp.status}).`);
      this.saved.set(true);
    } catch (e) {
      this.saveError.set(e instanceof Error ? e.message : 'Could not save this result.');
    } finally {
      this.saving.set(false);
    }
  }
}
