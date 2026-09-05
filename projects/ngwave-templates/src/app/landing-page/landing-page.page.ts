import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  NwAccordionComponent,
  NwAccordionTabComponent,
  NwAvatarComponent,
  NwButtonComponent,
  NwCardComponent,
  NwDividerComponent,
  NwInputTextComponent,
  NwRatingComponent,
  NwTagComponent,
} from '@ngwave/ui';

interface FeatureSpotlight {
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
  reverse: boolean;
}

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface Stat {
  value: string;
  label: string;
}

interface Plan {
  name: string;
  price: string;
  period: string;
  popular: boolean;
  description: string;
  cta: string;
  features: string[];
}

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatar: string;
}

interface Faq {
  question: string;
  answer: string;
}

interface FooterColumn {
  title: string;
  links: string[];
}

@Component({
  selector: 'app-landing-page-template',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    NwButtonComponent,
    NwCardComponent,
    NwTagComponent,
    NwAvatarComponent,
    NwAccordionComponent,
    NwAccordionTabComponent,
    NwDividerComponent,
    NwRatingComponent,
    NwInputTextComponent,
  ],
  template: `
    <div class="min-h-full bg-surface-0">
      <!-- Announcement bar -->
      <div class="bg-surface-900 text-surface-0 text-center text-sm py-2 px-4">
        ✦ Wavelength 2.0 is here — real-time collaboration for every plan.
        <a href="#features" class="underline font-medium ml-1">See what's new →</a>
      </div>

      <!-- Nav -->
      <header class="sticky top-0 z-10 border-b border-surface-200 bg-surface-0/90 backdrop-blur">
        <div class="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
          <a routerLink="/" class="font-bold text-lg text-surface-900">Wavelength</a>
          <nav class="hidden md:flex items-center gap-8 text-sm text-surface-600">
            <a href="#features" class="hover:text-surface-900">Features</a>
            <a href="#pricing" class="hover:text-surface-900">Pricing</a>
            <a href="#testimonials" class="hover:text-surface-900">Customers</a>
            <a href="#faq" class="hover:text-surface-900">FAQ</a>
          </nav>
          <div class="flex items-center gap-2">
            <nw-button variant="text" size="small" label="Sign in" />
            <nw-button variant="primary" size="small" label="Get Started" />
          </div>
        </div>
      </header>

      <!-- Hero -->
      <section class="max-w-6xl mx-auto px-6 pt-16 pb-24 grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <span
            class="inline-flex items-center gap-1.5 rounded-full bg-nw-50 text-nw-700 text-xs font-medium px-3 py-1"
          >
            ✦ Now with real-time collaboration
          </span>
          <h1 class="mt-5 text-5xl font-bold tracking-tight text-surface-900 leading-[1.1]">
            Plan projects your whole team actually enjoys using
          </h1>
          <p class="mt-5 text-lg text-surface-600">
            Wavelength brings tasks, docs, and timelines into one clean
            workspace — so nothing falls through the cracks.
          </p>
          <div class="mt-8 flex items-center gap-3">
            <nw-button variant="primary" size="large" label="Start free trial" />
            <nw-button variant="outlined" size="large" label="Watch demo" icon="▸" />
          </div>
          <div class="mt-8 flex items-center gap-3">
            <span class="flex -space-x-2">
              @for (a of heroAvatars; track a) {
                <nw-avatar [label]="a" size="normal" class="ring-2 ring-surface-0 rounded-full" />
              }
            </span>
            <div class="text-sm">
              <div class="flex items-center gap-1.5">
                <nw-rating [value]="5" [readonly]="true" [cancel]="false" />
                <span class="font-medium text-surface-900">4.9/5</span>
              </div>
              <p class="text-surface-500">from 2,300+ reviews</p>
            </div>
          </div>
        </div>

        <!-- Product mockup -->
        <div class="relative">
          <div
            class="absolute -inset-6 rounded-nw-lg bg-gradient-to-br from-nw-100 to-nw-50 -z-10 blur-2xl opacity-70"
          ></div>
          <div class="rounded-nw-lg border border-surface-200 bg-surface-0 shadow-nw-xl overflow-hidden">
            <div class="h-9 bg-surface-100 border-b border-surface-200 flex items-center gap-1.5 px-3">
              <span class="h-2.5 w-2.5 rounded-full bg-red-400"></span>
              <span class="h-2.5 w-2.5 rounded-full bg-amber-400"></span>
              <span class="h-2.5 w-2.5 rounded-full bg-green-400"></span>
            </div>
            <div class="flex">
              <div class="w-14 shrink-0 bg-surface-50 border-r border-surface-200 py-3 flex flex-col items-center gap-3">
                @for (i of [0, 1, 2, 3]; track i) {
                  <span
                    class="h-7 w-7 rounded-nw"
                    [class]="i === 0 ? 'bg-nw-500' : 'bg-surface-200'"
                  ></span>
                }
              </div>
              <div class="flex-1 p-4 space-y-3">
                <div class="flex items-center justify-between">
                  <span class="h-3 w-24 rounded-full bg-surface-800"></span>
                  <span class="h-6 w-16 rounded-nw bg-nw-500"></span>
                </div>
                <div class="grid grid-cols-3 gap-2">
                  @for (i of [0, 1, 2]; track i) {
                    <div class="rounded-nw border border-surface-200 p-2.5 space-y-1.5">
                      <span class="block h-1.5 w-8 rounded-full bg-surface-300"></span>
                      <span class="block h-2 w-full rounded-full bg-surface-100"></span>
                      <span class="block h-2 w-2/3 rounded-full bg-surface-100"></span>
                    </div>
                  }
                </div>
                <div class="rounded-nw border border-surface-200 p-3 space-y-2">
                  @for (row of [80, 60, 90, 40]; track row) {
                    <div class="flex items-center gap-2">
                      <span class="h-4 w-4 rounded-full bg-nw-100 shrink-0"></span>
                      <span class="h-1.5 rounded-full bg-surface-100" [style.width.%]="row"></span>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Logo cloud -->
      <section class="border-y border-surface-200 bg-surface-50">
        <div class="max-w-6xl mx-auto px-6 py-8">
          <p class="text-center text-xs font-medium uppercase tracking-wide text-surface-400">
            Trusted by teams at
          </p>
          <div class="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            @for (logo of logos; track logo) {
              <span class="text-lg font-semibold text-surface-300 select-none">{{ logo }}</span>
            }
          </div>
        </div>
      </section>

      <!-- Feature spotlights -->
      <section id="features" class="max-w-6xl mx-auto px-6 py-24 space-y-24">
        @for (s of spotlights; track s.title) {
          <div class="grid lg:grid-cols-2 gap-12 items-center">
            <div [class]="s.reverse ? 'lg:order-2' : ''">
              <span class="text-sm font-semibold text-nw-600">{{ s.eyebrow }}</span>
              <h2 class="mt-2 text-3xl font-bold text-surface-900">{{ s.title }}</h2>
              <p class="mt-3 text-surface-600">{{ s.description }}</p>
              <ul class="mt-5 space-y-2.5">
                @for (p of s.points; track p) {
                  <li class="flex items-start gap-2.5 text-sm text-surface-700">
                    <span
                      class="mt-0.5 h-5 w-5 rounded-full bg-nw-50 text-nw-600 text-xs flex items-center justify-center shrink-0"
                      >✓</span
                    >
                    {{ p }}
                  </li>
                }
              </ul>
            </div>
            <div [class]="s.reverse ? 'lg:order-1' : ''">
              <div class="rounded-nw-lg border border-surface-200 bg-surface-50 shadow-nw-md overflow-hidden">
                <div class="h-40 flex items-center justify-center">
                  <div class="w-4/5 rounded-nw bg-surface-0 border border-surface-200 shadow-nw-sm p-4 space-y-2">
                    <span class="block h-2 w-1/2 rounded-full bg-surface-800"></span>
                    <span class="block h-1.5 w-full rounded-full bg-surface-100"></span>
                    <span class="block h-1.5 w-4/5 rounded-full bg-surface-100"></span>
                    <span class="block mt-2 h-6 w-20 rounded-nw bg-nw-500"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </section>

      <!-- Supporting features grid -->
      <section class="bg-surface-50 border-y border-surface-200">
        <div class="max-w-6xl mx-auto px-6 py-20">
          <div class="max-w-xl">
            <h2 class="text-3xl font-bold text-surface-900">Everything else your team needs</h2>
            <p class="mt-3 text-surface-600">
              Built for speed, designed for clarity — no bloated settings menus.
            </p>
          </div>
          <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            @for (f of features; track f.title) {
              <nw-card>
                <span
                  class="inline-flex h-10 w-10 items-center justify-center rounded-nw bg-nw-50 text-nw-600 text-lg"
                  >{{ f.icon }}</span
                >
                <h3 class="mt-4 font-semibold text-surface-900">{{ f.title }}</h3>
                <p class="mt-1.5 text-sm text-surface-600">{{ f.description }}</p>
              </nw-card>
            }
          </div>
        </div>
      </section>

      <!-- Stats band -->
      <section class="bg-surface-900">
        <div class="max-w-6xl mx-auto px-6 py-16 grid grid-cols-2 lg:grid-cols-4 gap-8">
          @for (s of stats; track s.label) {
            <div class="text-center">
              <p class="text-4xl font-bold text-white">{{ s.value }}</p>
              <p class="mt-1.5 text-sm text-white/60">{{ s.label }}</p>
            </div>
          }
        </div>
      </section>

      <!-- Testimonials -->
      <section id="testimonials" class="max-w-6xl mx-auto px-6 py-24">
        <div class="max-w-xl mx-auto text-center">
          <h2 class="text-3xl font-bold text-surface-900">Loved by teams like yours</h2>
          <p class="mt-3 text-surface-600">Don't take our word for it.</p>
        </div>
        <div class="mt-12 grid gap-6 sm:grid-cols-3">
          @for (t of testimonials; track t.name) {
            <nw-card>
              <nw-rating [value]="5" [readonly]="true" [cancel]="false" />
              <p class="mt-3 text-sm text-surface-700">“{{ t.quote }}”</p>
              <div class="mt-4 flex items-center gap-3">
                <nw-avatar [label]="t.avatar" shape="circle" />
                <div>
                  <p class="text-sm font-medium text-surface-900">{{ t.name }}</p>
                  <p class="text-xs text-surface-500">{{ t.role }}</p>
                </div>
              </div>
            </nw-card>
          }
        </div>
      </section>

      <!-- Pricing -->
      <section id="pricing" class="bg-surface-50 border-y border-surface-200">
        <div class="max-w-6xl mx-auto px-6 py-24">
          <div class="max-w-xl mx-auto text-center">
            <h2 class="text-3xl font-bold text-surface-900">Simple, transparent pricing</h2>
            <p class="mt-3 text-surface-600">Start free. Upgrade when your team grows.</p>
          </div>
          <div class="mt-12 grid gap-6 lg:grid-cols-3 max-w-4xl mx-auto items-start">
            @for (plan of plans; track plan.name) {
              <nw-card [class]="plan.popular ? 'ring-2 ring-nw-500 lg:-translate-y-2' : ''">
                <div class="flex items-center justify-between">
                  <h3 class="font-semibold text-surface-900">{{ plan.name }}</h3>
                  @if (plan.popular) {
                    <nw-tag value="Most popular" severity="info" [rounded]="true" />
                  }
                </div>
                <p class="mt-1 text-sm text-surface-500">{{ plan.description }}</p>
                <p class="mt-4">
                  <span class="text-3xl font-bold text-surface-900">{{ plan.price }}</span>
                  <span class="text-sm text-surface-500">{{ plan.period }}</span>
                </p>
                <nw-button
                  [variant]="plan.popular ? 'primary' : 'secondary'"
                  [fluid]="true"
                  class="mt-5 block"
                  [label]="plan.cta"
                />
                <ul class="mt-6 space-y-2.5 text-sm text-surface-600">
                  @for (feat of plan.features; track feat) {
                    <li class="flex items-center gap-2">
                      <span class="text-nw-600">✓</span>
                      {{ feat }}
                    </li>
                  }
                </ul>
              </nw-card>
            }
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section id="faq" class="max-w-2xl mx-auto px-6 py-24">
        <h2 class="text-3xl font-bold text-surface-900 text-center">Frequently asked questions</h2>
        <nw-accordion class="mt-8">
          @for (f of faqs; track f.question) {
            <nw-accordion-tab [header]="f.question">
              {{ f.answer }}
            </nw-accordion-tab>
          }
        </nw-accordion>
      </section>

      <!-- Closing CTA -->
      <section class="bg-nw-600">
        <div class="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 class="text-3xl font-bold text-white">Ready to bring your team together?</h2>
          <p class="mt-3 text-nw-100">Start your free 14-day trial — no credit card required.</p>
          <div class="mt-7 flex items-center justify-center">
            <nw-button variant="secondary" size="large" label="Start free trial" />
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="max-w-6xl mx-auto px-6 py-16">
        <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div class="lg:col-span-2">
            <span class="font-bold text-lg text-surface-900">Wavelength</span>
            <p class="mt-3 text-sm text-surface-500 max-w-xs">
              The clean, fast project workspace for teams who'd rather be
              building than configuring tools.
            </p>
            <div class="mt-5 flex items-center gap-2 max-w-xs">
              <nw-input-text placeholder="you@company.com" [fluid]="true" />
              <nw-button variant="primary" label="Join" />
            </div>
          </div>
          @for (col of footerColumns; track col.title) {
            <div>
              <h3 class="text-sm font-semibold text-surface-900">{{ col.title }}</h3>
              <ul class="mt-3 space-y-2.5">
                @for (link of col.links; track link) {
                  <li>
                    <a href="#" class="text-sm text-surface-500 hover:text-surface-900">{{ link }}</a>
                  </li>
                }
              </ul>
            </div>
          }
        </div>
        <nw-divider class="mt-12" />
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-surface-500">
          <span>© 2026 Wavelength, Inc.</span>
          <div class="flex items-center gap-5">
            <a href="#" class="hover:text-surface-900" aria-label="X / Twitter">𝕏</a>
            <a href="#" class="hover:text-surface-900" aria-label="GitHub">GitHub</a>
            <a href="#" class="hover:text-surface-900" aria-label="LinkedIn">in</a>
          </div>
        </div>
      </footer>
    </div>
  `,
})
export class LandingPageTemplateComponent {
  protected readonly heroAvatars = ['PN', 'DO', 'MC', 'AJ'];
  protected readonly logos = ['Fenwick', 'Arclight', 'Northwind', 'Acme', 'Globex', 'Initech'];

  protected readonly spotlights: FeatureSpotlight[] = [
    {
      eyebrow: 'PLANNING',
      title: 'See your whole roadmap at a glance',
      description:
        'Drag-and-drop timelines that update in real time as your team moves work forward — no more stale spreadsheets.',
      points: [
        'Unlimited boards and timelines',
        'Dependency tracking built in',
        'Auto-syncs across every view',
      ],
      reverse: false,
    },
    {
      eyebrow: 'COLLABORATION',
      title: 'Work together without the meeting overload',
      description:
        'Comment threads, live cursors, and shared docs keep everyone aligned without another status-update call.',
      points: [
        'Real-time co-editing',
        'Threaded comments on any task',
        '@mentions with instant notifications',
      ],
      reverse: true,
    },
  ];

  protected readonly features: Feature[] = [
    { icon: '⚡', title: 'Fast by default', description: 'Every view loads instantly, even with thousands of tasks.' },
    { icon: '🗂', title: 'Organized workspaces', description: 'Keep every project, doc, and thread in one place.' },
    { icon: '🔔', title: 'Smart notifications', description: 'Only get pinged for what actually needs your attention.' },
    { icon: '🔗', title: 'Deep integrations', description: 'Connects with the tools your team already uses daily.' },
    { icon: '🔒', title: 'Enterprise-grade security', description: 'SSO, audit logs, and granular permissions built in.' },
    { icon: '📊', title: 'Real-time reporting', description: 'See progress across every team without asking for updates.' },
  ];

  protected readonly stats: Stat[] = [
    { value: '10,000+', label: 'teams onboard' },
    { value: '99.9%', label: 'uptime SLA' },
    { value: '4.9/5', label: 'average rating' },
    { value: '40+', label: 'countries' },
  ];

  protected readonly plans: Plan[] = [
    {
      name: 'Starter',
      price: '$0',
      period: '/mo',
      popular: false,
      description: 'For small teams getting started.',
      cta: 'Start for free',
      features: ['Up to 5 members', 'Unlimited tasks', 'Basic reporting'],
    },
    {
      name: 'Team',
      price: '$24',
      period: '/mo',
      popular: true,
      description: 'For growing teams that need more.',
      cta: 'Start free trial',
      features: ['Unlimited members', 'Advanced reporting', 'Priority support', 'SSO'],
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      popular: false,
      description: 'For organizations with custom needs.',
      cta: 'Talk to sales',
      features: ['Dedicated account manager', 'Custom contracts', 'Audit logs', '99.9% uptime SLA'],
    },
  ];

  protected readonly testimonials: Testimonial[] = [
    { quote: 'We replaced three tools with Wavelength in a week.', name: 'Priya Nair', role: 'Head of Product, Fenwick', avatar: 'PN' },
    { quote: 'The cleanest project tool our team has ever used.', name: 'Daniel Osei', role: 'Engineering Lead, Arclight', avatar: 'DO' },
    { quote: 'Onboarding took ten minutes. Everyone just got it.', name: 'Maya Chen', role: 'Ops Manager, Northwind', avatar: 'MC' },
  ];

  protected readonly faqs: Faq[] = [
    { question: 'Is there a free plan?', answer: 'Yes — Starter is free forever for teams up to 5 people.' },
    { question: 'Can I cancel anytime?', answer: 'Yes, plans are month-to-month with no lock-in contracts.' },
    { question: 'Do you offer discounts for nonprofits?', answer: 'Yes, reach out to support and we will set you up with 50% off.' },
    { question: 'What happens to my data if I cancel?', answer: 'You can export everything at any time, and we retain data for 30 days after cancellation.' },
    { question: 'Does Wavelength integrate with Slack?', answer: 'Yes, along with GitHub, Figma, Google Drive, and 40+ other tools.' },
    { question: 'Is my data secure?', answer: 'Yes — SOC 2 Type II certified, with SSO and granular permissions on every plan above Starter.' },
  ];

  protected readonly footerColumns: FooterColumn[] = [
    { title: 'Product', links: ['Features', 'Pricing', 'Integrations', 'Changelog'] },
    { title: 'Company', links: ['About', 'Careers', 'Blog', 'Contact'] },
    { title: 'Resources', links: ['Docs', 'Guides', 'API reference', 'Status'] },
  ];
}
