import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  TemplateRef,
  contentChild,
  inject,
  input,
  model,
} from '@angular/core';

/** Custom legend content: `<ng-template nwFieldsetHeader>…</ng-template>`. */
@Directive({ selector: '[nwFieldsetHeader]' })
export class NwFieldsetHeaderDirective {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}

@Component({
  selector: 'nw-fieldset',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  template: `
    <fieldset class="rounded-nw border border-surface-200 bg-surface-0 px-4 pb-4">
      @if (legend() || headerTemplate()) {
        <legend class="px-2 text-sm font-semibold text-surface-900">
          @if (toggleable()) {
            <button
              type="button"
              class="inline-flex items-center gap-1.5"
              (click)="toggle()"
              [attr.aria-expanded]="!collapsed()"
            >
              <span class="transition-transform inline-block" [class.-rotate-90]="collapsed()"
                >▾</span
              >
              @if (headerTemplate(); as tpl) {
                <ng-container [ngTemplateOutlet]="tpl.template" />
              } @else {
                {{ legend() }}
              }
            </button>
          } @else if (headerTemplate(); as tpl) {
            <ng-container [ngTemplateOutlet]="tpl.template" />
          } @else {
            {{ legend() }}
          }
        </legend>
      }
      @if (!collapsed()) {
        <div class="pt-2">
          <ng-content />
        </div>
      }
    </fieldset>
  `,
})
export class NwFieldsetComponent {
  readonly legend = input('');
  readonly toggleable = input(false);
  readonly collapsed = model(false);

  protected readonly headerTemplate = contentChild(NwFieldsetHeaderDirective);

  protected toggle(): void {
    this.collapsed.update((c) => !c);
  }
}
