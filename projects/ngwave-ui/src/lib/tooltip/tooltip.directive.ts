import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, inject, input, OnDestroy } from '@angular/core';

export type NwTooltipPosition = 'top' | 'bottom' | 'left' | 'right';

/** Hover/focus tooltip. Usage: `<button [nwTooltip]="'Save changes'">Save</button>` */
@Directive({
  selector: '[nwTooltip]',
  host: {
    '(mouseenter)': 'show()',
    '(mouseleave)': 'hide()',
    '(focus)': 'show()',
    '(blur)': 'hide()',
  },
})
export class NwTooltipDirective implements OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly doc = inject(DOCUMENT);

  readonly nwTooltip = input('', { alias: 'nwTooltip' });
  readonly tooltipPosition = input<NwTooltipPosition>('top');

  private node: HTMLElement | null = null;

  protected show(): void {
    const text = this.nwTooltip();
    if (!text) return;
    this.hide();

    const tip = this.doc.createElement('div');
    tip.textContent = text;
    tip.setAttribute('role', 'tooltip');
    tip.className =
      'fixed z-[60] rounded-nw bg-surface-900 px-2 py-1 text-xs font-medium text-surface-0 shadow-nw-md pointer-events-none animate-nw-fade-in';
    this.doc.body.appendChild(tip);
    this.node = tip;

    const hostRect = this.el.nativeElement.getBoundingClientRect();
    const tipRect = tip.getBoundingClientRect();
    const gap = 6;
    let top = hostRect.top;
    let left = hostRect.left;

    switch (this.tooltipPosition()) {
      case 'top':
        top = hostRect.top - tipRect.height - gap;
        left = hostRect.left + hostRect.width / 2 - tipRect.width / 2;
        break;
      case 'bottom':
        top = hostRect.bottom + gap;
        left = hostRect.left + hostRect.width / 2 - tipRect.width / 2;
        break;
      case 'left':
        top = hostRect.top + hostRect.height / 2 - tipRect.height / 2;
        left = hostRect.left - tipRect.width - gap;
        break;
      case 'right':
        top = hostRect.top + hostRect.height / 2 - tipRect.height / 2;
        left = hostRect.right + gap;
        break;
    }
    tip.style.top = `${Math.max(4, top)}px`;
    tip.style.left = `${Math.max(4, left)}px`;
  }

  protected hide(): void {
    this.node?.remove();
    this.node = null;
  }

  ngOnDestroy(): void {
    this.hide();
  }
}
