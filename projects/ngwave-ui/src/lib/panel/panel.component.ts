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

/** Extra content in the header, right-aligned before the toggle button: `<ng-template nwPanelIcons>…</ng-template>`. */
@Directive({ selector: '[nwPanelIcons]' })
export class NwPanelIconsDirective {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}
/** Full custom header, replacing the default title: `<ng-template nwPanelHeader>…</ng-template>`. */
@Directive({ selector: '[nwPanelHeader]' })
export class NwPanelHeaderDirective {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}

@Component({
  selector: 'nw-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  template: `
    <div class="rounded-nw-lg border border-surface-200 bg-surface-0 overflow-hidden">
      @if (header() || toggleable() || headerTemplate() || iconsTemplate()) {
        <div
          class="flex items-center justify-between gap-2 px-4 py-3 bg-surface-50 border-b border-surface-200"
        >
          @if (headerTemplate(); as tpl) {
            <ng-container [ngTemplateOutlet]="tpl.template" />
          } @else {
            <span class="font-semibold text-surface-900 text-sm">{{ header() }}</span>
          }
          <div class="flex items-center gap-1 shrink-0">
            @if (iconsTemplate(); as tpl) {
              <ng-container [ngTemplateOutlet]="tpl.template" />
            }
            @if (toggleable()) {
              <button
                type="button"
                (click)="toggle()"
                [attr.aria-expanded]="!collapsed()"
                aria-label="Toggle panel"
                class="h-7 w-7 rounded-nw text-surface-500 hover:bg-surface-200 flex items-center justify-center"
              >
                <span class="transition-transform inline-block" [class.-rotate-180]="collapsed()">{{
                  collapsed() ? expandIcon() : collapseIcon()
                }}</span>
              </button>
            }
          </div>
        </div>
      }
      @if (!collapsed()) {
        <div class="p-4">
          <ng-content />
        </div>
      }
    </div>
  `,
})
export class NwPanelComponent {
  readonly header = input('');
  readonly toggleable = input(false);
  readonly collapsed = model(false);
  readonly expandIcon = input('▾');
  readonly collapseIcon = input('▾');

  protected readonly headerTemplate = contentChild(NwPanelHeaderDirective);
  protected readonly iconsTemplate = contentChild(NwPanelIconsDirective);

  protected toggle(): void {
    this.collapsed.update((c) => !c);
  }
}
