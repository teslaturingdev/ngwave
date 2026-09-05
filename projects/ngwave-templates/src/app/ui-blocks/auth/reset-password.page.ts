import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NwButtonComponent, NwIconComponent, NwInputTextComponent } from '@ngwave/ui';
import { AuthShellComponent } from './auth-shell.component';

@Component({
  selector: 'app-reset-password-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, AuthShellComponent, NwButtonComponent, NwIconComponent, NwInputTextComponent],
  template: `
    <app-auth-shell
      quote="The cleanest onboarding flow our team has ever shipped."
      quoteAuthor="Sofia Reyes"
      quoteRole="Design Lead, Globex"
      quoteInitials="SR"
    >
      <h1 class="text-2xl font-bold text-surface-900">Choose a new password</h1>
      <p class="mt-1.5 text-sm text-surface-500">Must be at least 8 characters.</p>

      <form class="mt-8 space-y-4" (submit)="$event.preventDefault()">
        <div>
          <label class="block text-sm font-medium text-surface-700 mb-1.5">New password</label>
          <nw-input-text type="password" placeholder="••••••••" [fluid]="true" />
        </div>
        <div>
          <label class="block text-sm font-medium text-surface-700 mb-1.5">Confirm password</label>
          <nw-input-text type="password" placeholder="••••••••" [fluid]="true" />
        </div>
        <nw-button variant="primary" [fluid]="true" label="Reset password" class="block" />
      </form>

      <p class="mt-8 text-center text-sm text-surface-500">
        <a
          routerLink="/ui-blocks/login"
          class="inline-flex items-center gap-1 font-medium text-nw-600 hover:text-nw-700"
        >
          <nw-icon name="arrow-left" [size]="14" />
          Back to sign in
        </a>
      </p>
    </app-auth-shell>
  `,
})
export class ResetPasswordBlockPageComponent {}
