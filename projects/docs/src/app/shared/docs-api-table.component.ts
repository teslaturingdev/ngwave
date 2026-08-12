import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface ApiRow {
  name: string;
  type: string;
  default?: string;
  description: string;
}

@Component({
  selector: 'docs-api-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rounded-nw border border-surface-200 overflow-x-auto">
      <table class="w-full text-left text-sm border-collapse">
        <thead class="bg-surface-50 text-surface-500">
          <tr>
            <th class="px-4 py-2 font-medium">Name</th>
            <th class="px-4 py-2 font-medium">Type</th>
            <th class="px-4 py-2 font-medium">Default</th>
            <th class="px-4 py-2 font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          @for (row of rows(); track row.name) {
            <tr class="border-t border-surface-200 align-top">
              <td class="px-4 py-2 font-mono text-nw-600">{{ row.name }}</td>
              <td class="px-4 py-2 font-mono text-surface-700">
                {{ row.type }}
              </td>
              <td class="px-4 py-2 font-mono text-surface-500">
                {{ row.default || '—' }}
              </td>
              <td class="px-4 py-2 text-surface-700">{{ row.description }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class DocsApiTableComponent {
  readonly rows = input.required<ApiRow[]>();
}
