import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NwButtonComponent } from '@ngwave/ui';
import { AuthShellComponent } from './auth-shell.component';

@Component({
  selector: 'app-otp-verification-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, AuthShellComponent, NwButtonComponent],
  template: `
    <app-auth-shell
      quote="Two-factor sign-in and it still takes under five seconds."
      quoteAuthor="Arjun Iyer"
      quoteRole="Security Lead, Hooli"
      quoteInitials="AI"
    >
      <h1 class="text-2xl font-bold text-surface-900">Verify your email</h1>
      <p class="mt-1.5 text-sm text-surface-500">
        Enter the 6-digit code we sent to <span class="text-surface-700">a•••@company.com</span>.
      </p>

      <form class="mt-8" (submit)="$event.preventDefault()">
        <div class="flex items-center justify-between gap-2">
          @for (i of digits; track i) {
            <input
              type="text"
              inputmode="numeric"
              maxlength="1"
              class="h-14 w-12 text-center text-lg font-semibold rounded-nw border border-surface-300 bg-surface-0 text-surface-900 focus:outline-none focus:ring-2 focus:ring-nw-500 focus:border-nw-500"
            />
          }
        </div>
        <nw-button variant="primary" [fluid]="true" label="Verify" class="mt-6 block" />
      </form>

      <p class="mt-6 text-center text-sm text-surface-500">
        @if (countdown() > 0) {
          Resend code in {{ countdown() }}s
        } @else {
          <button type="button" (click)="resend()" class="font-medium text-nw-600 hover:text-nw-700">
            Resend code
          </button>
        }
      </p>

      <p class="mt-4 text-center text-sm text-surface-500">
        <a routerLink="/ui-blocks/login" class="font-medium text-nw-600 hover:text-nw-700">← Back to sign in</a>
      </p>
    </app-auth-shell>
  `,
})
export class OtpVerificationBlockPageComponent {
  protected readonly digits = [0, 1, 2, 3, 4, 5];
  protected readonly countdown = signal(30);

  protected resend(): void {
    this.countdown.set(30);
  }
}
