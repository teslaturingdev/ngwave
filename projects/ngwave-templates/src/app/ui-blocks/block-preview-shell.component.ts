import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NwIconComponent } from '@ngwave/ui';

@Component({
  selector: 'app-block-preview-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NwIconComponent],
  template: `
    <div class="min-h-full flex flex-col bg-surface-0">
      <header
        class="sticky top-0 z-10 flex items-center justify-between px-6 h-14 border-b border-surface-200 bg-surface-0/90 backdrop-blur"
      >
        <a routerLink="/ui-blocks" class="inline-flex items-center gap-1.5 text-sm text-surface-600 hover:text-surface-900">
          <nw-icon name="arrow-left" [size]="15" />
          All UI Blocks
        </a>
        <span class="text-sm font-medium text-surface-900">{{ title() }}</span>
      </header>
      <main
        class="flex-1 flex items-center justify-center p-10"
        style="background-image: radial-gradient(rgb(var(--surface-200)) 1px, transparent 1px); background-size: 20px 20px;"
      >
        <div class="w-full" [class]="maxWidth()">
          <ng-content />
        </div>
      </main>
    </div>
  `,
})
export class BlockPreviewShellComponent {
  readonly title = input('');
  readonly maxWidth = input('max-w-2xl');
}
