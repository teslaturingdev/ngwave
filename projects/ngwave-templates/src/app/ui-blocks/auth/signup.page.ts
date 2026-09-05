import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NwButtonComponent, NwCheckboxComponent, NwInputTextComponent } from '@ngwave/ui';
import { AuthShellComponent } from './auth-shell.component';

type Strength = 'empty' | 'weak' | 'fair' | 'strong';

@Component({
  selector: 'app-signup-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, AuthShellComponent, NwButtonComponent, NwCheckboxComponent, NwInputTextComponent],
  template: `
    <app-auth-shell
      quote="We onboarded our whole team in a single afternoon."
      quoteAuthor="Daniel Osei"
      quoteRole="Engineering Lead, Arclight"
      quoteInitials="DO"
    >
      <h1 class="text-2xl font-bold text-surface-900">Create your account</h1>
      <p class="mt-1.5 text-sm text-surface-500">Free for teams up to 5 people.</p>

      <form class="mt-8 space-y-4" (submit)="$event.preventDefault()">
        <div>
          <label class="block text-sm font-medium text-surface-700 mb-1.5">Full name</label>
          <nw-input-text placeholder="Saravanan P." [fluid]="true" />
        </div>
        <div>
          <label class="block text-sm font-medium text-surface-700 mb-1.5">Email address</label>
          <nw-input-text type="email" placeholder="you@company.com" [fluid]="true" />
        </div>
        <div>
          <label class="block text-sm font-medium text-surface-700 mb-1.5">Password</label>
          <nw-input-text
            type="password"
            placeholder="Create a password"
            [fluid]="true"
            [(value)]="password"
          />
          <div class="mt-2 flex items-center gap-2">
            <div class="flex-1 h-1.5 rounded-full bg-surface-100 overflow-hidden">
              <div
                class="h-full rounded-full transition-all"
                [class]="strengthBarClass()"
                [style.width.%]="strengthPercent()"
              ></div>
            </div>
            <span class="text-xs shrink-0" [class]="strengthTextClass()">{{ strengthLabel() }}</span>
          </div>
        </div>
        <nw-checkbox [(checked)]="agree" label="I agree to the Terms of Service and Privacy Policy" />
        <nw-button variant="primary" [fluid]="true" label="Create account" class="block" />
      </form>

      <p class="mt-8 text-center text-sm text-surface-500">
        Already have an account?
        <a routerLink="/ui-blocks/login" class="font-medium text-nw-600 hover:text-nw-700">Sign in</a>
      </p>
    </app-auth-shell>
  `,
})
export class SignupBlockPageComponent {
  protected readonly agree = signal(false);
  protected readonly password = signal('');

  protected readonly strength = computed<Strength>(() => {
    const len = this.password().length;
    if (len === 0) return 'empty';
    if (len < 6) return 'weak';
    if (len < 10) return 'fair';
    return 'strong';
  });

  protected readonly strengthPercent = computed(
    () => ({ empty: 0, weak: 33, fair: 66, strong: 100 })[this.strength()],
  );
  protected readonly strengthLabel = computed(
    () => ({ empty: '', weak: 'Weak', fair: 'Fair', strong: 'Strong' })[this.strength()],
  );
  protected readonly strengthBarClass = computed(
    () =>
      ({ empty: 'bg-surface-200', weak: 'bg-red-500', fair: 'bg-amber-500', strong: 'bg-green-500' })[
        this.strength()
      ],
  );
  protected readonly strengthTextClass = computed(
    () =>
      ({ empty: 'text-surface-400', weak: 'text-red-600', fair: 'text-amber-600', strong: 'text-green-600' })[
        this.strength()
      ],
  );

}
