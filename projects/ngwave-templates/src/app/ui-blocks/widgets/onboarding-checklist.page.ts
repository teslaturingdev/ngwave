import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NwButtonComponent, NwCardComponent, NwIconComponent } from '@ngwave/ui';
import { BlockPreviewShellComponent } from '../block-preview-shell.component';

interface ChecklistItem {
  label: string;
  description: string;
  done: boolean;
}

@Component({
  selector: 'app-onboarding-checklist-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BlockPreviewShellComponent, NwCardComponent, NwButtonComponent, NwIconComponent],
  template: `
    <app-block-preview-shell title="Onboarding Checklist" maxWidth="max-w-lg">
      <nw-card>
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="font-semibold text-surface-900">Complete your setup</h3>
            <p class="mt-1 text-sm text-surface-500">
              {{ completedCount() }} of {{ items().length }} steps completed
            </p>
          </div>
          <span class="text-lg font-bold text-nw-600">{{ percent() }}%</span>
        </div>

        <div class="mt-4 h-2 w-full overflow-hidden rounded-full bg-surface-100">
          <div
            class="h-full rounded-full bg-nw-600 transition-all"
            [style.width.%]="percent()"
          ></div>
        </div>

        <ul class="mt-6 divide-y divide-surface-100">
          @for (item of items(); track item.label; let i = $index) {
            <li class="flex items-start gap-3 py-3">
              <button
                type="button"
                (click)="toggle(i)"
                class="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs"
                [class]="
                  item.done
                    ? 'bg-nw-600 border-nw-600 text-white'
                    : 'border-surface-300 text-transparent hover:border-nw-400'
                "
                [attr.aria-label]="item.done ? 'Mark as not done' : 'Mark as done'"
              >
                @if (item.done) {
                  <nw-icon name="check" [size]="12" />
                }
              </button>
              <div class="min-w-0 flex-1">
                <p
                  class="text-sm font-medium"
                  [class]="item.done ? 'text-surface-400 line-through' : 'text-surface-900'"
                >
                  {{ item.label }}
                </p>
                <p class="text-xs text-surface-500">{{ item.description }}</p>
              </div>
            </li>
          }
        </ul>

        @if (percent() === 100) {
          <p class="mt-4 flex items-center gap-2 rounded-nw bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
            <nw-icon name="sparkles" [size]="16" />
            All set! Your workspace is ready to go.
          </p>
        } @else {
          <nw-button variant="primary" size="small" label="Continue setup" [fluid]="true" class="mt-2" />
        }
      </nw-card>
    </app-block-preview-shell>
  `,
})
export class OnboardingChecklistBlockPageComponent {
  protected readonly items = signal<ChecklistItem[]>([
    { label: 'Create your account', description: 'You signed up with your work email.', done: true },
    { label: 'Verify your email', description: 'Confirm ownership of your inbox.', done: true },
    { label: 'Invite your team', description: 'Add teammates to collaborate.', done: false },
    { label: 'Connect a data source', description: 'Link a database or API integration.', done: false },
    { label: 'Set up billing', description: 'Add a payment method to unlock all features.', done: false },
  ]);

  protected readonly completedCount = computed(() => this.items().filter((i) => i.done).length);
  protected readonly percent = computed(() =>
    Math.round((this.completedCount() / this.items().length) * 100),
  );

  protected toggle(index: number): void {
    this.items.update((items) =>
      items.map((item, i) => (i === index ? { ...item, done: !item.done } : item)),
    );
  }
}
