import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NwButtonComponent, NwCardComponent, NwIconComponent } from '@ngwave/ui';

@Component({
  selector: 'app-empty-state-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NwButtonComponent, NwCardComponent, NwIconComponent],
  template: `
    <div class="min-h-full flex items-center justify-center bg-surface-50 p-8">
      <div class="w-full max-w-xl space-y-6">
        <nw-card header="Projects">
          <div class="flex flex-col items-center text-center py-10">
            <span
              class="inline-flex h-14 w-14 items-center justify-center rounded-full bg-surface-100 text-surface-400"
            >
              <nw-icon name="folder" [size]="24" />
            </span>
            <h3 class="mt-4 font-semibold text-surface-900">No projects yet</h3>
            <p class="mt-1.5 text-sm text-surface-500 max-w-xs">
              Get started by creating your first project.
            </p>
            <nw-button variant="primary" size="small" label="+ New project" class="mt-5" />
          </div>
        </nw-card>

        <nw-card header="Search results">
          <div class="flex flex-col items-center text-center py-10">
            <span
              class="inline-flex h-14 w-14 items-center justify-center rounded-full bg-surface-100 text-surface-400"
            >
              <nw-icon name="search" [size]="24" />
            </span>
            <h3 class="mt-4 font-semibold text-surface-900">No results found</h3>
            <p class="mt-1.5 text-sm text-surface-500 max-w-xs">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <nw-button variant="secondary" size="small" label="Clear filters" class="mt-5" />
          </div>
        </nw-card>
      </div>
    </div>
  `,
})
export class EmptyStateBlockPageComponent {}
