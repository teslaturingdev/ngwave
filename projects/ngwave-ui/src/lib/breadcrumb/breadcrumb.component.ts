import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export interface NwBreadcrumbItem {
  label: string;
  href?: string;
  icon?: string;
}

@Component({
  selector: 'nw-breadcrumb',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <nav aria-label="Breadcrumb">
      <ol class="flex items-center flex-wrap gap-1.5 text-sm">
        @for (item of items(); track $index; let last = $last) {
          <li class="flex items-center gap-1.5">
            @if (!last && item.href) {
              <a
                [href]="item.href"
                (click)="onClick(item, $event)"
                class="flex items-center gap-1.5 text-surface-500 hover:text-surface-900"
              >
                @if (item.icon) {
                  <span [class]="item.icon" aria-hidden="true"></span>
                }
                {{ item.label }}
              </a>
            } @else {
              <span
                class="flex items-center gap-1.5"
                [class]="last ? 'text-surface-900 font-medium' : 'text-surface-500'"
                [attr.aria-current]="last ? 'page' : null"
              >
                @if (item.icon) {
                  <span [class]="item.icon" aria-hidden="true"></span>
                }
                {{ item.label }}
              </span>
            }
            @if (!last) {
              <span class="text-surface-300" aria-hidden="true">/</span>
            }
          </li>
        }
      </ol>
    </nav>
  `,
})
export class NwBreadcrumbComponent {
  readonly items = input<NwBreadcrumbItem[]>([]);
  readonly itemClick = output<NwBreadcrumbItem>();

  protected onClick(item: NwBreadcrumbItem, event: Event): void {
    this.itemClick.emit(item);
    if (item.href === '') event.preventDefault();
  }
}
