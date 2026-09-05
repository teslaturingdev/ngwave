import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NwButtonComponent, NwCheckboxComponent, NwInputTextComponent } from '@ngwave/ui';
import { AuthShellComponent } from './auth-shell.component';

@Component({
  selector: 'app-login-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, AuthShellComponent, NwButtonComponent, NwCheckboxComponent, NwInputTextComponent],
  template: `
    <app-auth-shell>
      <h1 class="text-2xl font-bold text-surface-900">Welcome back</h1>
      <p class="mt-1.5 text-sm text-surface-500">Sign in to your account to continue.</p>

      <form class="mt-8 space-y-4" (submit)="$event.preventDefault()">
        <div>
          <label class="block text-sm font-medium text-surface-700 mb-1.5">Email address</label>
          <nw-input-text type="email" placeholder="you@company.com" [fluid]="true" />
        </div>
        <div>
          <label class="block text-sm font-medium text-surface-700 mb-1.5">Password</label>
          <nw-input-text type="password" placeholder="••••••••" [fluid]="true" />
        </div>
        <div class="flex items-center justify-between">
          <nw-checkbox [(checked)]="remember" label="Remember me" />
          <a routerLink="/ui-blocks/forgot-password" class="text-sm font-medium text-nw-600 hover:text-nw-700">
            Forgot password?
          </a>
        </div>
        <nw-button variant="primary" [fluid]="true" label="Sign in" class="block" />
      </form>

      <div class="mt-6 flex items-center gap-3">
        <span class="flex-1 border-t border-surface-200"></span>
        <span class="text-xs text-surface-400">or continue with</span>
        <span class="flex-1 border-t border-surface-200"></span>
      </div>

      <div class="mt-6 grid grid-cols-2 gap-3">
        <nw-button variant="secondary" [fluid]="true" label="Google" class="block" />
        <nw-button variant="secondary" [fluid]="true" label="GitHub" class="block" />
      </div>

      <p class="mt-8 text-center text-sm text-surface-500">
        Don't have an account?
        <a routerLink="/ui-blocks/signup" class="font-medium text-nw-600 hover:text-nw-700">Sign up</a>
      </p>
    </app-auth-shell>
  `,
})
export class LoginBlockPageComponent {
  protected readonly remember = signal(false);
}
