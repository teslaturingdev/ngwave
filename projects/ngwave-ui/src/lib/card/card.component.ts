import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  TemplateRef,
  contentChild,
  inject,
  input,
} from '@angular/core';

/** Custom header content, e.g. an image: `<ng-template nwCardHeader>…</ng-template>`. */
@Directive({ selector: '[nwCardHeader]' })
export class NwCardHeaderDirective {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}
/** Footer content, e.g. actions: `<ng-template nwCardFooter>…</ng-template>`. */
@Directive({ selector: '[nwCardFooter]' })
export class NwCardFooterDirective {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}

@Component({
  selector: 'nw-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  template: `
    <div class="rounded-nw-lg border border-surface-200 bg-surface-0 shadow-nw-sm overflow-hidden">
      @if (headerTemplate(); as tpl) {
        <ng-container [ngTemplateOutlet]="tpl.template" />
      }
      <div class="p-5">
        @if (header()) {
          <h3 class="text-lg font-semibold text-surface-900">{{ header() }}</h3>
        }
        @if (subheader()) {
          <p class="mt-1 text-sm text-surface-500">{{ subheader() }}</p>
        }
        <div [class.mt-3]="header() || subheader()">
          <ng-content />
        </div>
      </div>
      @if (footerTemplate(); as tpl) {
        <div class="px-5 py-3 border-t border-surface-200 bg-surface-50">
          <ng-container [ngTemplateOutlet]="tpl.template" />
        </div>
      }
    </div>
  `,
})
export class NwCardComponent {
  readonly header = input('');
  readonly subheader = input('');

  protected readonly headerTemplate = contentChild(NwCardHeaderDirective);
  protected readonly footerTemplate = contentChild(NwCardFooterDirective);
}
