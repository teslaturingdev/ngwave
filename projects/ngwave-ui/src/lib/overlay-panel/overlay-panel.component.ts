import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'nw-overlay-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: `
    @if (visible()) {
      <div
        #panel
        role="dialog"
        tabindex="-1"
        class="fixed z-50 rounded-nw-lg border border-surface-200 bg-surface-0 shadow-nw-lg p-4 animate-nw-scale-in focus:outline-none"
        [style.top.px]="top()"
        [style.left.px]="left()"
        (keydown.escape)="hide()"
        (keydown.tab)="onTab($event)"
      >
        @if (showCloseIcon()) {
          <button
            type="button"
            aria-label="Close"
            (click)="hide()"
            class="absolute top-2 right-2 h-6 w-6 rounded-nw text-surface-400 hover:bg-surface-100 hover:text-surface-900"
          >
            ✕
          </button>
        }
        <ng-content />
      </div>
    }
  `,
})
export class NwOverlayPanelComponent {
  private readonly doc = inject(DOCUMENT);
  private readonly injector = inject(Injector);

  readonly dismissable = input(true);
  readonly showCloseIcon = input(false);

  readonly onShow = output<void>();
  readonly onHide = output<void>();

  protected readonly visible = signal(false);
  protected readonly top = signal(0);
  protected readonly left = signal(0);
  protected readonly panelRef = viewChild<ElementRef<HTMLElement>>('panel');

  private triggerEl: HTMLElement | null = null;

  private readonly docClickHandler = (e: Event): void => {
    if (!this.dismissable() || !this.visible()) return;
    const panelEl = this.panelRef()?.nativeElement;
    if (panelEl && !panelEl.contains(e.target as Node)) this.hide();
  };

  toggle(event: Event): void {
    this.visible() ? this.hide() : this.show(event);
  }

  show(event: Event): void {
    const target = event.currentTarget as HTMLElement;
    this.triggerEl = target;
    const rect = target.getBoundingClientRect();
    this.top.set(rect.bottom + 8);
    this.left.set(rect.left);
    this.visible.set(true);
    this.onShow.emit();

    afterNextRender(
      () => {
        this.refinePosition(rect);
        this.focusFirstElement();
        this.doc.addEventListener('click', this.docClickHandler);
      },
      { injector: this.injector },
    );
  }

  hide(): void {
    this.visible.set(false);
    this.onHide.emit();
    this.doc.removeEventListener('click', this.docClickHandler);
    this.triggerEl?.focus();
    this.triggerEl = null;
  }

  private refinePosition(triggerRect: DOMRect): void {
    const panelEl = this.panelRef()?.nativeElement;
    if (!panelEl) return;
    const panelRect = panelEl.getBoundingClientRect();
    const vw = this.doc.defaultView?.innerWidth ?? 0;
    const vh = this.doc.defaultView?.innerHeight ?? 0;
    const margin = 8;

    let top = triggerRect.bottom + margin;
    if (top + panelRect.height > vh - margin) {
      const above = triggerRect.top - panelRect.height - margin;
      if (above >= margin) top = above;
      else top = Math.max(margin, vh - panelRect.height - margin);
    }

    let left = triggerRect.left;
    if (left + panelRect.width > vw - margin) {
      left = Math.max(margin, vw - panelRect.width - margin);
    }

    this.top.set(top);
    this.left.set(left);
  }

  private focusFirstElement(): void {
    const panelEl = this.panelRef()?.nativeElement;
    if (!panelEl) return;
    const focusable = panelEl.querySelector<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    (focusable ?? panelEl).focus();
  }

  protected onTab(event: Event): void {
    const panelEl = this.panelRef()?.nativeElement;
    if (!panelEl) return;
    const keyEvent = event as KeyboardEvent;
    const focusables = panelEl.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = this.doc.activeElement;
    if (keyEvent.shiftKey && active === first) {
      keyEvent.preventDefault();
      last.focus();
    } else if (!keyEvent.shiftKey && active === last) {
      keyEvent.preventDefault();
      first.focus();
    }
  }
}
