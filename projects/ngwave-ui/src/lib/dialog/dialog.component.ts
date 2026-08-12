import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  TemplateRef,
  computed,
  contentChild,
  effect,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';

export type NwDialogPosition = 'center' | 'left' | 'right' | 'top' | 'bottom';

/** Custom header content: `<ng-template nwDialogHeader>…</ng-template>`. */
@Directive({ selector: '[nwDialogHeader]' })
export class NwDialogHeaderDirective {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}
/** Footer content: `<ng-template nwDialogFooter>…</ng-template>`. */
@Directive({ selector: '[nwDialogFooter]' })
export class NwDialogFooterDirective {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}

@Component({
  selector: 'nw-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  host: { '(document:keydown.escape)': 'onEscape()' },
  template: `
    @if (visible()) {
      <div
        class="fixed inset-0 z-50 flex"
        [class]="containerClass()"
        (keydown.tab)="onTab($event)"
      >
        @if (modal()) {
          <div
            class="absolute inset-0 bg-surface-950/50 backdrop-blur-[2px] animate-nw-fade-in"
            (click)="onMaskClick()"
          ></div>
        }
        <div
          #panel
          role="dialog"
          aria-modal="true"
          tabindex="-1"
          class="relative z-10 bg-surface-0 text-surface-900 shadow-nw-xl ring-1 ring-surface-900/5 flex flex-col max-h-full overflow-hidden focus:outline-none"
          [class]="panelClass()"
          [style.width]="widthStyle()"
          [style.height]="heightStyle()"
          [style.transform]="transformStyle()"
        >
          @if (header() || headerTemplate() || closable() || maximizable()) {
            <div
              class="flex items-center justify-between gap-4 px-5 py-3 border-b border-surface-200"
              [class.cursor-move]="draggable() && !maximized()"
              (pointerdown)="startDrag($event)"
            >
              <div class="font-semibold text-surface-900 min-w-0">
                @if (headerTemplate(); as tpl) {
                  <ng-container [ngTemplateOutlet]="tpl.template" />
                } @else {
                  {{ header() }}
                }
              </div>
              <div class="flex items-center gap-1 shrink-0">
                @if (maximizable()) {
                  <button
                    type="button"
                    (click)="toggleMaximize()"
                    [attr.aria-label]="maximized() ? 'Restore' : 'Maximize'"
                    class="h-8 w-8 rounded-nw text-surface-500 hover:bg-surface-100"
                  >
                    {{ maximized() ? '❐' : '▢' }}
                  </button>
                }
                @if (closable()) {
                  <button
                    type="button"
                    (click)="close()"
                    aria-label="Close"
                    class="h-8 w-8 rounded-nw text-surface-500 hover:bg-surface-100"
                  >
                    ✕
                  </button>
                }
              </div>
            </div>
          }
          <div class="p-5 overflow-auto flex-1">
            <ng-content />
          </div>
          @if (footerTemplate()) {
            <div class="px-5 py-3 border-t border-surface-200">
              <ng-container [ngTemplateOutlet]="footerTemplate()!.template" />
            </div>
          }
          @if (resizable() && !maximized()) {
            <span
              (pointerdown)="startResize($event)"
              class="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize text-surface-400"
              aria-hidden="true"
              >◢</span
            >
          }
        </div>
      </div>
    }
  `,
})
export class NwDialogComponent {
  private readonly doc = inject(DOCUMENT);
  private readonly hostEl = inject<ElementRef<HTMLElement>>(ElementRef)
    .nativeElement;

  readonly visible = model(false);
  readonly header = input('');
  readonly modal = input(true);
  readonly closable = input(true);
  readonly dismissableMask = input(true);
  readonly position = input<NwDialogPosition>('center');
  readonly width = input<string>('32rem');
  readonly draggable = input(false);
  readonly resizable = input(false);
  readonly maximizable = input(false);
  readonly blockScroll = input(true);

  readonly shown = output<void>();
  readonly hidden = output<void>();

  protected readonly headerTemplate = contentChild(NwDialogHeaderDirective);
  protected readonly footerTemplate = contentChild(NwDialogFooterDirective);

  protected readonly maximized = signal(false);
  private readonly dragX = signal(0);
  private readonly dragY = signal(0);
  private readonly sizeW = signal<string | null>(null);
  private readonly sizeH = signal<string | null>(null);
  private previousFocus: HTMLElement | null = null;

  constructor() {
    effect(() => {
      const open = this.visible();
      if (open) {
        this.previousFocus = this.doc.activeElement as HTMLElement | null;
        if (this.blockScroll()) this.doc.body.style.overflow = 'hidden';
        queueMicrotask(() => {
          (this.hostEl.querySelector('[role="dialog"]') as HTMLElement)?.focus();
          this.shown.emit();
        });
      } else {
        this.doc.body.style.overflow = '';
        this.dragX.set(0);
        this.dragY.set(0);
        this.sizeW.set(null);
        this.sizeH.set(null);
        this.maximized.set(false);
        this.previousFocus?.focus?.();
        this.hidden.emit();
      }
    });
  }

  protected readonly containerClass = computed(() => {
    if (this.maximized()) return 'items-stretch justify-stretch';
    switch (this.position()) {
      case 'left':
        return 'items-stretch justify-start';
      case 'right':
        return 'items-stretch justify-end';
      case 'top':
        return 'flex-col items-stretch justify-start';
      case 'bottom':
        return 'flex-col items-stretch justify-end';
      default:
        return 'items-center justify-center p-4';
    }
  });

  protected readonly panelClass = computed(() => {
    if (this.maximized()) return 'w-screen h-screen animate-nw-scale-in';
    switch (this.position()) {
      case 'left':
        return 'h-full max-w-[90vw] animate-nw-drawer-left';
      case 'right':
        return 'h-full max-w-[90vw] animate-nw-drawer-right';
      case 'top':
        return 'w-full max-h-[80vh] animate-nw-drawer-down';
      case 'bottom':
        return 'w-full max-h-[80vh] animate-nw-drawer-up';
      default:
        return 'rounded-nw-lg w-full max-h-[85vh] animate-nw-scale-in';
    }
  });

  protected widthStyle(): string | null {
    if (this.maximized()) return null;
    if (this.sizeW()) return this.sizeW();
    const pos = this.position();
    if (pos === 'top' || pos === 'bottom') return null;
    return this.width();
  }
  protected heightStyle(): string | null {
    return this.maximized() ? null : this.sizeH();
  }
  protected transformStyle(): string | null {
    if (this.maximized() || (this.dragX() === 0 && this.dragY() === 0)) return null;
    return `translate(${this.dragX()}px, ${this.dragY()}px)`;
  }

  protected close(): void {
    this.visible.set(false);
  }
  protected onMaskClick(): void {
    if (this.dismissableMask()) this.close();
  }
  protected onEscape(): void {
    if (this.visible() && this.closable()) this.close();
  }
  protected toggleMaximize(): void {
    this.maximized.update((m) => !m);
  }

  // ---- Focus trap ----
  protected onTab(ev: Event): void {
    const event = ev as KeyboardEvent;
    const focusables = this.hostEl.querySelectorAll<HTMLElement>(
      '[role="dialog"] a[href], [role="dialog"] button:not([disabled]), [role="dialog"] input:not([disabled]), [role="dialog"] select, [role="dialog"] textarea, [role="dialog"] [tabindex]:not([tabindex="-1"])',
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = this.doc.activeElement;
    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  // ---- Drag ----
  protected startDrag(ev: PointerEvent): void {
    if (!this.draggable() || this.maximized() || this.position() !== 'center') {
      return;
    }
    const startX = ev.clientX - this.dragX();
    const startY = ev.clientY - this.dragY();
    const move = (e: PointerEvent) => {
      this.dragX.set(e.clientX - startX);
      this.dragY.set(e.clientY - startY);
    };
    const up = () => {
      this.doc.removeEventListener('pointermove', move);
      this.doc.removeEventListener('pointerup', up);
    };
    this.doc.addEventListener('pointermove', move);
    this.doc.addEventListener('pointerup', up);
  }

  // ---- Resize ----
  protected startResize(ev: PointerEvent): void {
    ev.preventDefault();
    ev.stopPropagation();
    const panel = (ev.target as HTMLElement).closest(
      '[role="dialog"]',
    ) as HTMLElement;
    const startW = panel.offsetWidth;
    const startH = panel.offsetHeight;
    const startX = ev.clientX;
    const startY = ev.clientY;
    const move = (e: PointerEvent) => {
      this.sizeW.set(`${Math.max(240, startW + (e.clientX - startX))}px`);
      this.sizeH.set(`${Math.max(160, startH + (e.clientY - startY))}px`);
    };
    const up = () => {
      this.doc.removeEventListener('pointermove', move);
      this.doc.removeEventListener('pointerup', up);
    };
    this.doc.addEventListener('pointermove', move);
    this.doc.addEventListener('pointerup', up);
  }
}
