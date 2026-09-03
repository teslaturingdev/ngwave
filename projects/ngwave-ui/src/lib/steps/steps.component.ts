import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

export interface NwStepItem {
  label: string;
  icon?: string;
  disabled?: boolean;
  command?: () => void;
}

@Component({
  selector: 'nw-steps',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <ol class="flex items-center w-full">
      @for (item of items(); track $index; let i = $index; let last = $last) {
        <li class="flex items-center" [class.flex-1]="!last">
          <button
            type="button"
            [disabled]="readonly() || (item.disabled ?? false)"
            (click)="select(i)"
            class="flex items-center gap-2 shrink-0 disabled:cursor-not-allowed"
          >
            <span
              class="h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 shrink-0"
              [class]="circleClass(i)"
            >
              @if (item.icon) {
                <span [class]="item.icon" aria-hidden="true"></span>
              } @else {
                {{ i + 1 }}
              }
            </span>
            <span class="text-sm whitespace-nowrap" [class]="labelClass(i)">{{ item.label }}</span>
          </button>
          @if (!last) {
            <span class="flex-1 h-0.5 mx-2" [class]="lineClass(i)"></span>
          }
        </li>
      }
    </ol>
  `,
})
export class NwStepsComponent {
  readonly items = input<NwStepItem[]>([]);
  readonly activeIndex = model(0);
  /** When true (the default, matching PrimeNG), steps are display-only. */
  readonly readonly = input(true);

  protected select(i: number): void {
    if (this.readonly()) return;
    const item = this.items()[i];
    if (item?.disabled) return;
    this.activeIndex.set(i);
    item?.command?.();
  }

  protected circleClass(i: number): string {
    if (i < this.activeIndex()) return 'border-nw-600 bg-nw-600 text-white';
    if (i === this.activeIndex()) return 'border-nw-600 text-nw-600 bg-nw-50';
    return 'border-surface-300 text-surface-400 bg-surface-0';
  }

  protected labelClass(i: number): string {
    return i === this.activeIndex() ? 'text-surface-900 font-medium' : 'text-surface-500';
  }

  protected lineClass(i: number): string {
    return i < this.activeIndex() ? 'bg-nw-600' : 'bg-surface-200';
  }
}
