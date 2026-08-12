import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

type Tab = 'doc' | 'api';

@Component({
  selector: 'docs-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="border-b border-surface-200 flex gap-1 mb-6">
      <button type="button" (click)="active.set('doc')" [class]="tabClass('doc')">
        Documentation
      </button>
      <button type="button" (click)="active.set('api')" [class]="tabClass('api')">
        API
      </button>
    </div>
    <div [hidden]="active() !== 'doc'">
      <ng-content select="[doc]" />
    </div>
    <div [hidden]="active() !== 'api'">
      <ng-content select="[api]" />
    </div>
  `,
})
export class DocsTabsComponent {
  protected readonly active = signal<Tab>('doc');

  protected tabClass(tab: Tab): string {
    const base =
      'px-4 py-2 -mb-px border-b-2 text-sm font-medium transition-colors';
    return this.active() === tab
      ? `${base} border-nw-600 text-nw-600`
      : `${base} border-transparent text-surface-500 hover:text-surface-800`;
  }
}
