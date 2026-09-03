import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'nw-avatar-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex items-center' },
  styles: `
    :host ::ng-deep nw-avatar {
      margin-left: -0.5rem;
      box-shadow: 0 0 0 2px rgb(var(--surface-0));
    }
    :host ::ng-deep nw-avatar:first-child {
      margin-left: 0;
    }
  `,
  template: `<ng-content />`,
})
export class NwAvatarGroupComponent {}
