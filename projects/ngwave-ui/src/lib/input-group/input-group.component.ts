import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Groups an input with one or more addons (icons, text, buttons) into a
 * single visually-connected row — e.g. a currency prefix or a units suffix.
 * Addons are `nw-input-group-addon`; the input itself can be any nw- form
 * control (its own rounded corners are left as-is, so pair it with square
 * corners on that side via a wrapping class if you want a fully seamless
 * look).
 */
@Component({
  selector: 'nw-input-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex items-stretch w-full [&_input]:rounded-none' },
  template: `<ng-content />`,
})
export class NwInputGroupComponent {}

@Component({
  selector: 'nw-input-group-addon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'inline-flex items-center gap-1.5 shrink-0 border border-surface-300 bg-surface-100 px-3 text-sm text-surface-500 first:rounded-l-nw last:rounded-r-nw [&:not(:first-child)]:-ml-px',
  },
  template: `<ng-content />`,
})
export class NwInputGroupAddonComponent {}
