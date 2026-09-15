import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NwPasswordComponent } from '@ngwave/ui';
import { DocsDemoComponent } from '../shared/docs-demo.component';
import { DocsTabsComponent } from '../shared/docs-tabs.component';
import { DocsTocComponent, TocSection } from '../shared/docs-toc.component';
import {
  ApiRow,
  DocsApiTableComponent,
} from '../shared/docs-api-table.component';

@Component({
  selector: 'docs-password-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NwPasswordComponent,
    DocsDemoComponent,
    DocsTabsComponent,
    DocsTocComponent,
    DocsApiTableComponent,
  ],
  template: `
    <div class="flex gap-10">
      <article class="flex-1 min-w-0 max-w-3xl">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-surface-900">Password</h1>
          <p class="mt-2 text-surface-600">Password input with a show/hide toggle and an optional strength meter.</p>
        </header>

        <docs-tabs>
          <div doc class="space-y-10">
            <docs-demo id="basic" title="Basic" [code]="basicCode">
              <div class="w-full max-w-xs">
                <nw-password [(value)]="value" placeholder="Password" />
              </div>
            </docs-demo>

            <docs-demo id="feedback" title="Strength meter" [code]="feedbackCode">
              <div class="w-full max-w-xs">
                <nw-password [(value)]="value" placeholder="Password" [feedback]="true" />
              </div>
            </docs-demo>
          </div>

          <div api>
            <docs-api-table [rows]="api" />
          </div>
        </docs-tabs>
      </article>

      <docs-toc [sections]="sections" />
    </div>
  `,
})
export class PasswordDocPageComponent {
  protected value = '';

  protected readonly sections: TocSection[] = [
    { id: 'basic', label: 'Basic' },
    { id: 'feedback', label: 'Strength meter' },
  ];

  protected readonly basicCode = `<nw-password [(value)]="password" placeholder="Password" />`;
  protected readonly feedbackCode = `<nw-password [(value)]="password" placeholder="Password" [feedback]="true" />`;

  protected readonly api: ApiRow[] = [
    { name: 'value', type: 'string', default: `''`, description: 'Bindable password value (model).' },
    { name: 'placeholder', type: 'string', default: `''`, description: 'Input placeholder text.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the field.' },
    { name: 'size', type: `'small' | 'normal' | 'large'`, default: `'normal'`, description: 'Field size.' },
    { name: 'fluid', type: 'boolean', default: 'false', description: 'Stretches the field to full width.' },
    { name: 'feedback', type: 'boolean', default: 'false', description: 'Shows a strength meter below the field.' },
  ];
}
