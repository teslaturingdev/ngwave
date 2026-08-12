import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  TemplateRef,
  computed,
  contentChild,
  contentChildren,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';

export type NwTabOrientation = 'horizontal' | 'vertical';

/** Custom tab header: `<ng-template nwTabHeader>…</ng-template>`. */
@Directive({ selector: '[nwTabHeader]' })
export class NwTabHeaderDirective {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}

@Component({
  selector: 'nw-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (render()) {
      <div role="tabpanel" [hidden]="!active()">
        <ng-content />
      </div>
    }
  `,
})
export class NwTabComponent {
  readonly header = input('');
  readonly disabled = input(false);
  readonly closable = input(false);
  readonly leftIcon = input('');
  readonly badge = input('');

  readonly headerTemplate = contentChild(NwTabHeaderDirective);

  /** Driven by the parent nw-tabs. */
  readonly active = signal(false);
  readonly render = signal(true);
}

@Component({
  selector: 'nw-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  imports: [NgTemplateOutlet],
  template: `
    <div [class]="orientation() === 'vertical' ? 'flex gap-4' : 'flex flex-col'">
      <div
        [class]="
          orientation() === 'vertical'
            ? 'flex flex-col border-r border-surface-200 shrink-0'
            : 'flex items-stretch border-b border-surface-200'
        "
      >
        @if (scrollable() && orientation() === 'horizontal') {
          <button
            type="button"
            (click)="scroll(-1)"
            aria-label="Scroll tabs left"
            class="px-1 text-surface-500 hover:text-surface-900 shrink-0"
          >
            ‹
          </button>
        }

        <div
          #tablist
          role="tablist"
          (keydown)="onKeydown($event)"
          [class]="
            orientation() === 'vertical'
              ? 'flex flex-col'
              : 'flex overflow-x-auto scroll-smooth'
          "
          style="scrollbar-width: none"
        >
          @for (tab of tabs(); track $index; let i = $index) {
            @if (!isClosed(i)) {
              <button
                role="tab"
                type="button"
                [disabled]="tab.disabled()"
                (click)="selectTab(i)"
                [attr.aria-selected]="i === activeIdx()"
                [attr.tabindex]="i === activeIdx() ? 0 : -1"
                [class]="tabButtonClass(i)"
              >
                @if (tab.leftIcon()) {
                  <span [class]="tab.leftIcon()" aria-hidden="true"></span>
                }
                @if (tab.headerTemplate(); as tpl) {
                  <ng-container [ngTemplateOutlet]="tpl.template" />
                } @else {
                  <span>{{ tab.header() }}</span>
                }
                @if (tab.badge()) {
                  <span
                    class="text-[10px] leading-none px-1.5 py-0.5 rounded-full bg-nw-100 text-nw-700"
                    >{{ tab.badge() }}</span
                  >
                }
                @if (tab.closable()) {
                  <span
                    role="button"
                    aria-label="Close tab"
                    (click)="closeTab(i, $event)"
                    class="ml-1 text-surface-400 hover:text-surface-700"
                    >✕</span
                  >
                }
              </button>
            }
          }
        </div>

        @if (scrollable() && orientation() === 'horizontal') {
          <button
            type="button"
            (click)="scroll(1)"
            aria-label="Scroll tabs right"
            class="px-1 text-surface-500 hover:text-surface-900 shrink-0"
          >
            ›
          </button>
        }
      </div>

      <div [class]="orientation() === 'vertical' ? 'flex-1 min-w-0' : 'pt-4'">
        <ng-content />
      </div>
    </div>
  `,
})
export class NwTabsComponent {
  private readonly hostEl = inject<ElementRef<HTMLElement>>(ElementRef)
    .nativeElement;

  readonly activeIndex = model(0);
  readonly orientation = input<NwTabOrientation>('horizontal');
  readonly scrollable = input(false);
  readonly lazy = input(false);

  readonly tabClose = output<number>();

  protected readonly tabs = contentChildren(NwTabComponent);
  protected readonly tablist = viewChild<ElementRef<HTMLElement>>('tablist');
  protected readonly closed = signal<Set<number>>(new Set());

  private readonly activatedSet = new Set<number>();

  protected readonly activeIdx = computed(() => {
    const n = this.tabs().length;
    const idx = Math.min(Math.max(0, this.activeIndex()), Math.max(0, n - 1));
    return idx;
  });

  constructor() {
    effect(() => {
      const idx = this.activeIdx();
      const lazy = this.lazy();
      const list = this.tabs();
      this.activatedSet.add(idx);
      list.forEach((t, i) => {
        t.active.set(i === idx && !this.isClosed(i));
        t.render.set(!lazy || this.activatedSet.has(i));
      });
    });
  }

  protected isClosed(i: number): boolean {
    return this.closed().has(i);
  }

  protected selectTab(i: number): void {
    if (this.tabs()[i]?.disabled() || this.isClosed(i)) return;
    this.activeIndex.set(i);
  }

  protected closeTab(i: number, event: Event): void {
    event.stopPropagation();
    this.closed.update((s) => new Set(s).add(i));
    this.tabClose.emit(i);
    if (this.activeIdx() === i) {
      const next = this.firstOpenTab();
      if (next !== -1) this.activeIndex.set(next);
    }
  }

  private firstOpenTab(): number {
    const list = this.tabs();
    for (let i = 0; i < list.length; i++) {
      if (!this.isClosed(i) && !list[i].disabled()) return i;
    }
    return -1;
  }

  protected scroll(dir: number): void {
    this.tablist()?.nativeElement.scrollBy({ left: dir * 160, behavior: 'smooth' });
  }

  protected onKeydown(event: KeyboardEvent): void {
    const list = this.tabs();
    const enabled = (i: number) => !this.isClosed(i) && !list[i]?.disabled();
    let target = -1;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      for (let i = this.activeIdx() + 1; i < list.length; i++)
        if (enabled(i)) { target = i; break; }
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      for (let i = this.activeIdx() - 1; i >= 0; i--)
        if (enabled(i)) { target = i; break; }
    } else if (event.key === 'Home') {
      target = this.firstOpenTab();
    } else if (event.key === 'End') {
      for (let i = list.length - 1; i >= 0; i--)
        if (enabled(i)) { target = i; break; }
    } else {
      return;
    }
    if (target !== -1) {
      event.preventDefault();
      this.activeIndex.set(target);
      this.focusTab(target);
    }
  }

  private focusTab(i: number): void {
    const buttons = this.hostEl.querySelectorAll<HTMLButtonElement>(
      '[role="tab"]',
    );
    // account for closed tabs before i
    let visibleIndex = 0;
    for (let k = 0; k < i; k++) if (!this.isClosed(k)) visibleIndex++;
    buttons[visibleIndex]?.focus();
  }

  protected tabButtonClass(i: number): string {
    const vertical = this.orientation() === 'vertical';
    const base =
      'inline-flex items-center gap-2 whitespace-nowrap px-4 py-2 text-sm font-medium ' +
      'transition-[color,border-color,background-color] duration-200 ease-nw rounded-t-nw ' +
      'disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nw-500 ' +
      (vertical ? '-mr-px border-r-2 text-left rounded-t-none rounded-l-nw' : '-mb-px border-b-2');
    return i === this.activeIdx()
      ? `${base} border-nw-600 text-nw-600 bg-nw-50/50`
      : `${base} border-transparent text-surface-600 hover:text-surface-900 hover:bg-surface-100/60`;
  }
}
