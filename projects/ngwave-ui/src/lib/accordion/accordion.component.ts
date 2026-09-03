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
  signal,
} from '@angular/core';

/** Custom tab header: `<ng-template nwAccordionHeader>…</ng-template>`. */
@Directive({ selector: '[nwAccordionHeader]' })
export class NwAccordionHeaderDirective {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}

@Component({
  selector: 'nw-accordion-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  template: `
    <button
      type="button"
      data-nw-accordion-header
      [disabled]="disabled()"
      [attr.tabindex]="focused() ? 0 : -1"
      (click)="onClick()"
      (focus)="focusHandler?.()"
      (keydown)="keydownHandler?.($event)"
      [attr.aria-expanded]="expanded()"
      class="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-medium text-surface-900 bg-surface-0 hover:bg-surface-50 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-nw-500 focus-visible:ring-inset"
    >
      @if (headerTemplate(); as tpl) {
        <ng-container [ngTemplateOutlet]="tpl.template" />
      } @else {
        <span>{{ header() }}</span>
      }
      <span class="transition-transform shrink-0" [class.rotate-180]="expanded()">{{
        expanded() ? collapseIcon() : expandIcon()
      }}</span>
    </button>
    <div
      class="grid transition-[grid-template-rows] duration-200 ease-nw"
      [style.grid-template-rows]="expanded() ? '1fr' : '0fr'"
    >
      <div class="overflow-hidden">
        <div class="px-4 pb-4 pt-1 text-sm text-surface-700">
          <ng-content />
        </div>
      </div>
    </div>
  `,
})
export class NwAccordionTabComponent {
  readonly header = input('');
  readonly disabled = input(false);
  readonly headerTemplate = contentChild(NwAccordionHeaderDirective);

  /** Driven by the parent nw-accordion. */
  readonly expanded = signal(false);
  readonly focused = signal(false);
  readonly expandIcon = signal('▾');
  readonly collapseIcon = signal('▾');
  private toggleHandler: (() => void) | null = null;
  focusHandler: (() => void) | null = null;
  keydownHandler: ((e: KeyboardEvent) => void) | null = null;

  /** @internal bound by the parent nw-accordion */
  _bindToggle(fn: () => void): void {
    this.toggleHandler = fn;
  }

  protected onClick(): void {
    this.toggleHandler?.();
  }
}

@Component({
  selector: 'nw-accordion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block rounded-nw-lg border border-surface-200 overflow-hidden divide-y divide-surface-200',
  },
  template: `<ng-content />`,
})
export class NwAccordionComponent {
  private readonly hostEl = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  readonly expandedIndices = model<number[]>([]);
  readonly multiple = input(false);
  readonly expandIcon = input('▾');
  readonly collapseIcon = input('▾');
  readonly selectOnFocus = input(false);

  protected readonly tabs = contentChildren(NwAccordionTabComponent);
  private readonly expandedSet = computed(() => new Set(this.expandedIndices()));
  private readonly focusedIndex = signal(0);

  constructor() {
    effect(() => {
      const set = this.expandedSet();
      const list = this.tabs();
      const focusIdx = this.focusedIndex();
      const expandIcon = this.expandIcon();
      const collapseIcon = this.collapseIcon();
      list.forEach((tab, i) => {
        tab.expanded.set(set.has(i));
        tab.focused.set(i === focusIdx);
        tab.expandIcon.set(expandIcon);
        tab.collapseIcon.set(collapseIcon);
        tab._bindToggle(() => this.toggle(i));
        tab.focusHandler = () => {
          this.focusedIndex.set(i);
          if (this.selectOnFocus()) this.toggle(i);
        };
        tab.keydownHandler = (e) => this.onKeydown(e, i);
      });
    });
  }

  protected toggle(i: number): void {
    const tab = this.tabs()[i];
    if (tab?.disabled()) return;
    const set = this.expandedSet();
    const isOpen = set.has(i);
    if (this.multiple()) {
      const next = new Set(set);
      isOpen ? next.delete(i) : next.add(i);
      this.expandedIndices.set([...next]);
    } else {
      this.expandedIndices.set(isOpen ? [] : [i]);
    }
  }

  private onKeydown(event: KeyboardEvent, i: number): void {
    const list = this.tabs();
    let target = -1;
    if (event.key === 'ArrowDown') {
      target = (i + 1) % list.length;
    } else if (event.key === 'ArrowUp') {
      target = (i - 1 + list.length) % list.length;
    } else if (event.key === 'Home') {
      target = 0;
    } else if (event.key === 'End') {
      target = list.length - 1;
    } else {
      return;
    }
    event.preventDefault();
    this.focusedIndex.set(target);
    queueMicrotask(() => {
      const buttons = this.hostEl.querySelectorAll<HTMLElement>('[data-nw-accordion-header]');
      buttons[target]?.focus();
    });
  }
}
