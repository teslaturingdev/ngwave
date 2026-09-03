import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'nw-chip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex' },
  template: `
    <span
      class="inline-flex items-center gap-2 pl-1 pr-2 py-1 rounded-full bg-surface-100 text-surface-800 text-sm"
    >
      @if (image()) {
        <img [src]="image()" alt="" class="h-6 w-6 rounded-full object-cover" />
      } @else if (icon()) {
        <span
          class="h-6 w-6 flex items-center justify-center rounded-full bg-surface-200"
          [class]="icon()"
          aria-hidden="true"
        ></span>
      }
      @if (label()) {
        <span>{{ label() }}</span>
      } @else {
        <ng-content />
      }
      @if (removable()) {
        <button
          type="button"
          (click)="remove()"
          aria-label="Remove"
          class="h-4 w-4 rounded-full flex items-center justify-center text-surface-500 hover:bg-surface-200 hover:text-surface-900"
        >
          @if (removeIcon()) {
            <span [class]="removeIcon()" aria-hidden="true"></span>
          } @else {
            ✕
          }
        </button>
      }
    </span>
  `,
})
export class NwChipComponent {
  readonly label = input('');
  readonly icon = input('');
  readonly image = input('');
  readonly removable = input(false);
  readonly removeIcon = input('');

  readonly removed = output<void>();

  protected remove(): void {
    this.removed.emit();
  }
}
