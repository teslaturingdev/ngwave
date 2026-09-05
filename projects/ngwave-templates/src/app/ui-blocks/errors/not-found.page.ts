import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NwButtonComponent } from '@ngwave/ui';

@Component({
  selector: 'app-not-found-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NwButtonComponent],
  template: `
    <div class="min-h-full relative flex items-center justify-center overflow-hidden bg-surface-0 px-6">
      <div
        class="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-gradient-to-br from-nw-100 to-transparent opacity-60 blur-3xl"
        aria-hidden="true"
      ></div>
      <div
        class="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-gradient-to-tr from-nw-50 to-transparent opacity-70 blur-3xl"
        aria-hidden="true"
      ></div>

      <div class="relative text-center max-w-md">
        <p class="text-8xl font-bold text-nw-600/20 select-none">404</p>
        <h1 class="-mt-6 text-3xl font-bold text-surface-900">Page not found</h1>
        <p class="mt-3 text-surface-600">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <div class="mt-8 flex items-center justify-center gap-3">
          <a routerLink="/">
            <nw-button variant="primary" size="large" label="Go back home" />
          </a>
          <nw-button variant="outlined" size="large" label="Contact support" />
        </div>
      </div>
    </div>
  `,
})
export class NotFoundBlockPageComponent {}
