import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BlockPreviewShellComponent } from '../block-preview-shell.component';

interface Stat {
  icon: string;
  iconBg: string;
  iconColor: string;
  cardBg: string;
  label: string;
  value: string;
  delta: string;
  trend: 'up' | 'down';
}

@Component({
  selector: 'app-stat-cards-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BlockPreviewShellComponent],
  template: `
    <app-block-preview-shell title="Stat Cards Row" maxWidth="max-w-5xl">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        @for (s of stats; track s.label) {
          <div class="relative overflow-hidden rounded-nw-lg border border-surface-200 p-5" [class]="s.cardBg">
            <div
              class="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-white/40"
              aria-hidden="true"
            ></div>
            <span
              class="relative inline-flex h-10 w-10 items-center justify-center rounded-nw text-lg"
              [class]="s.iconBg + ' ' + s.iconColor"
              >{{ s.icon }}</span
            >
            <p class="relative mt-4 text-xs font-semibold uppercase tracking-wide text-surface-500">
              {{ s.label }}
            </p>
            <p class="relative mt-1 text-2xl font-bold text-surface-900">{{ s.value }}</p>
            <p
              class="relative mt-1.5 text-sm font-medium flex items-center gap-1"
              [class]="s.trend === 'up' ? 'text-green-600' : 'text-red-600'"
            >
              <span>{{ s.trend === 'up' ? '↗' : '↘' }}</span>
              {{ s.delta }}
            </p>
          </div>
        }
      </div>
    </app-block-preview-shell>
  `,
})
export class StatCardsBlockPageComponent {
  protected readonly stats: Stat[] = [
    { icon: '$', iconBg: 'bg-green-100', iconColor: 'text-green-700', cardBg: 'bg-green-50/60', label: 'Net Revenue', value: '$94.2K', delta: '9.4%', trend: 'up' },
    { icon: '👥', iconBg: 'bg-sky-100', iconColor: 'text-sky-700', cardBg: 'bg-sky-50/60', label: 'Qualified Leads', value: '1,284', delta: '6.1%', trend: 'up' },
    { icon: '⏱', iconBg: 'bg-amber-100', iconColor: 'text-amber-700', cardBg: 'bg-amber-50/60', label: 'Avg. Cycle Time', value: '4.2d', delta: '3.5%', trend: 'down' },
    { icon: '🛡', iconBg: 'bg-nw-100', iconColor: 'text-nw-700', cardBg: 'bg-nw-50/60', label: 'Retention', value: '92.7%', delta: '1.8%', trend: 'up' },
  ];
}
