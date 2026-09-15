import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Simple flex container with start/center/end content slots — project
 * content into `[toolbarStart]`/`[toolbarCenter]`/`[toolbarEnd]`.
 */
@Component({
  selector: 'nw-toolbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div
      class="flex flex-wrap items-center gap-3 rounded-nw-lg border border-surface-200 bg-surface-0 px-4 py-2.5"
    >
      <div class="flex items-center gap-2">
        <ng-content select="[toolbarStart]" />
      </div>
      <div class="flex flex-1 items-center justify-center gap-2">
        <ng-content select="[toolbarCenter]" />
      </div>
      <div class="ml-auto flex items-center gap-2">
        <ng-content select="[toolbarEnd]" />
      </div>
    </div>
  `,
})
export class NwToolbarComponent {}
