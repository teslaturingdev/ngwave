import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NwButtonComponent, NwIconComponent, NwInputTextComponent } from '@ngwave/ui';
import { AuthShellComponent } from './auth-shell.component';

@Component({
  selector: 'app-forgot-password-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, AuthShellComponent, NwButtonComponent, NwIconComponent, NwInputTextComponent],
  template: `
    <app-auth-shell
      quote="Support tickets dropped 40% once search actually worked."
      quoteAuthor="Maya Chen"
      quoteRole="Ops Manager, Northwind"
      quoteInitials="MC"
    >
      @if (!sent()) {
        <h1 class="text-2xl font-bold text-surface-900">Reset your password</h1>
        <p class="mt-1.5 text-sm text-surface-500">
          Enter your email and we'll send you a link to get back in.
        </p>

        <form class="mt-8 space-y-4" (submit)="onSubmit($event)">
          <div>
            <label class="block text-sm font-medium text-surface-700 mb-1.5">Email address</label>
            <nw-input-text type="email" placeholder="you@company.com" [fluid]="true" />
          </div>
          <nw-button type="submit" variant="primary" [fluid]="true" label="Send reset link" class="block" />
        </form>
      } @else {
        <div class="text-center">
          <span
            class="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600"
          >
            <nw-icon name="check" [size]="22" />
          </span>
          <h1 class="mt-4 text-2xl font-bold text-surface-900">Check your email</h1>
          <p class="mt-1.5 text-sm text-surface-500">
            We've sent a password reset link to your inbox.
          </p>
        </div>
      }

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
export class ForgotPasswordBlockPageComponent {
  protected readonly sent = signal(false);

  protected onSubmit(event: Event): void {
    event.preventDefault();
    this.sent.set(true);
  }
}
