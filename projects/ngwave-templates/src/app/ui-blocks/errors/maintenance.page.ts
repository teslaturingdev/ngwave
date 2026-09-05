import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NwButtonComponent } from '@ngwave/ui';

@Component({
  selector: 'app-maintenance-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NwButtonComponent],
  template: `
    <div class="min-h-full relative flex items-center justify-center overflow-hidden bg-surface-0 px-6">
      <div
        class="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-gradient-to-br from-amber-100 to-transparent opacity-60 blur-3xl"
        aria-hidden="true"
      ></div>

      <div class="relative text-center max-w-md">
        <span
          class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-500 text-3xl"
          >🛠</span
        >
        <h1 class="mt-6 text-3xl font-bold text-surface-900">We'll be right back</h1>
        <p class="mt-3 text-surface-600">
          Wavelength is undergoing scheduled maintenance. We expect to be back
          online shortly.
        </p>
        <div class="mt-6 inline-flex items-center gap-2 rounded-nw bg-surface-50 border border-surface-200 px-4 py-2 text-sm text-surface-600">
          <span class="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
          Estimated completion: 45 minutes
        </div>
        <div class="mt-8">
          <nw-button variant="outlined" size="large" label="Check status page" />
        </div>
      </div>
    </div>
  `,
})
export class MaintenanceBlockPageComponent {}
