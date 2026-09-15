import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Wraps a form control + label so the label floats above the field once it
 * has a value or is focused. Give the projected control `class="peer"`.
 */
@Component({
  selector: 'nw-float-label',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div class="relative">
      <ng-content />
      <label
        class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-surface-400 transition-all duration-150 ease-nw peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:text-nw-600 peer-focus:bg-surface-0 peer-focus:px-1 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-surface-0 peer-[:not(:placeholder-shown)]:px-1"
      >
        {{ label() }}
      </label>
    </div>
  `,
})
export class NwFloatLabelComponent {
  readonly label = input('');
}
