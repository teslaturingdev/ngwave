import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NwAvatarComponent } from '@ngwave/ui';

@Component({
  selector: 'app-auth-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NwAvatarComponent],
  template: `
    <div class="min-h-full flex bg-surface-0">
      <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-nw-700">
        <div class="absolute inset-0 bg-gradient-to-br from-nw-600 to-nw-900"></div>
        <div class="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/10 blur-3xl"></div>
        <div class="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-white/10 blur-3xl"></div>
        <div class="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <a routerLink="/" class="flex items-center gap-2 font-semibold text-lg">
            <svg width="22" height="22" viewBox="0 0 40 40" aria-hidden="true" class="shrink-0">
              <path d="M17 10 L7 20 L17 30" stroke="white" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
              <path d="M23 10 L33 20 L23 30" stroke="rgb(199 210 254)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            </svg>
            Wavelength
          </a>
          <div class="max-w-md">
            <p class="text-2xl font-medium leading-snug">“{{ quote() }}”</p>
            <div class="mt-5 flex items-center gap-3">
              <nw-avatar [label]="quoteInitials()" class="ring-2 ring-white/20 rounded-full" />
              <div>
                <p class="text-sm font-medium">{{ quoteAuthor() }}</p>
                <p class="text-xs text-white/60">{{ quoteRole() }}</p>
              </div>
            </div>
          </div>
          <p class="text-xs text-white/40">© 2026 Wavelength, Inc.</p>
        </div>
      </div>
      <div class="flex-1 flex items-center justify-center p-8">
        <div class="w-full max-w-sm">
          <ng-content />
        </div>
      </div>
    </div>
  `,
})
export class AuthShellComponent {
  readonly quote = input('Wavelength cut our sprint planning time in half.');
  readonly quoteAuthor = input('Priya Nair');
  readonly quoteRole = input('Head of Product, Fenwick');
  readonly quoteInitials = input('PN');
}
