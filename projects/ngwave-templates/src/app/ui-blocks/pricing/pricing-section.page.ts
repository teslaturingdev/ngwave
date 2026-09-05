import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NwButtonComponent, NwTagComponent, NwToggleComponent } from '@ngwave/ui';
import { RouterLink } from '@angular/router';

interface Plan {
  name: string;
  tagline: string;
  monthly: number;
  yearly: number;
  featured?: boolean;
  cta: string;
  features: string[];
}

const PLANS: Plan[] = [
  {
    name: 'Indie',
    tagline: 'For solo developers and side projects.',
    monthly: 19,
    yearly: 15,
    cta: 'Start free trial',
    features: ['1 workspace', 'Up to 3 projects', 'Community support', 'Core UI blocks', 'Basic analytics'],
  },
  {
    name: 'Team',
    tagline: 'For growing product teams.',
    monthly: 49,
    yearly: 39,
    featured: true,
    cta: 'Start free trial',
    features: ['Unlimited workspaces', 'Unlimited projects', 'Priority support', 'All UI blocks + templates', 'Advanced analytics', 'Role-based access'],
  },
  {
    name: 'Enterprise',
    tagline: 'For large organizations at scale.',
    monthly: 0,
    yearly: 0,
    cta: 'Contact sales',
    features: ['Everything in Team', 'SSO & SAML', 'Dedicated support engineer', 'Custom SLAs', 'On-prem / VPC deploy'],
  },
];

@Component({
  selector: 'app-pricing-section-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NwButtonComponent, NwTagComponent, NwToggleComponent],
  template: `
    <div class="min-h-full bg-surface-0 py-16 px-6">
      <div class="mx-auto max-w-6xl">
        <a routerLink="/ui-blocks" class="text-sm text-surface-500 hover:text-surface-900">← All UI Blocks</a>

        <div class="mt-8 text-center">
          <span
            class="inline-flex items-center rounded-full bg-nw-50 px-3 py-1 text-xs font-semibold text-nw-700"
            >Pricing</span
          >
          <h1 class="mt-4 text-3xl sm:text-4xl font-bold text-surface-900">
            Simple pricing that scales with you
          </h1>
          <p class="mt-3 text-surface-500 max-w-xl mx-auto">
            Start free, upgrade when your team grows. Cancel anytime, no questions asked.
          </p>

          <div class="mt-6 inline-flex items-center gap-3">
            <span class="text-sm" [class]="!yearly() ? 'font-semibold text-surface-900' : 'text-surface-500'"
              >Monthly</span
            >
            <nw-toggle [(checked)]="yearly" />
            <span class="text-sm" [class]="yearly() ? 'font-semibold text-surface-900' : 'text-surface-500'"
              >Yearly</span
            >
            <nw-tag value="Save 20%" severity="success" [rounded]="true" />
          </div>
        </div>

        <div class="mt-12 grid gap-6 lg:grid-cols-3">
          @for (plan of plans; track plan.name) {
            <div
              class="relative rounded-nw-lg border p-6 flex flex-col"
              [class]="
                plan.featured
                  ? 'border-nw-600 shadow-nw-lg ring-1 ring-nw-600 bg-surface-0'
                  : 'border-surface-200 bg-surface-0'
              "
            >
              @if (plan.featured) {
                <span
                  class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-nw-600 px-3 py-1 text-xs font-semibold text-white"
                  >Most popular</span
                >
              }

              <h3 class="text-lg font-semibold text-surface-900">{{ plan.name }}</h3>
              <p class="mt-1 text-sm text-surface-500">{{ plan.tagline }}</p>

              <div class="mt-5 flex items-baseline gap-1">
                @if (plan.monthly > 0) {
                  <span class="text-4xl font-bold text-surface-900">
                    &#36;{{ yearly() ? plan.yearly : plan.monthly }}
                  </span>
                  <span class="text-sm text-surface-500">/ mo</span>
                } @else {
                  <span class="text-3xl font-bold text-surface-900">Custom</span>
                }
              </div>
              @if (plan.monthly > 0 && yearly()) {
                <p class="mt-1 text-xs text-surface-400">Billed annually</p>
              }

              <nw-button
                [variant]="plan.featured ? 'primary' : 'secondary'"
                [label]="plan.cta"
                [fluid]="true"
                class="mt-6"
              />

              <ul class="mt-6 space-y-2.5 flex-1">
                @for (f of plan.features; track f) {
                  <li class="flex items-start gap-2 text-sm text-surface-600">
                    <span class="mt-0.5 text-green-600">✓</span>
                    {{ f }}
                  </li>
                }
              </ul>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class PricingSectionBlockPageComponent {
  protected readonly yearly = signal(true);
  protected readonly plans = PLANS;
}
