import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';

export type NwAvatarSize = 'normal' | 'large' | 'xlarge';
export type NwAvatarShape = 'square' | 'circle';

const SIZE: Record<NwAvatarSize, string> = {
  normal: 'h-8 w-8 text-sm',
  large: 'h-12 w-12 text-lg',
  xlarge: 'h-16 w-16 text-2xl',
};

const SHAPE: Record<NwAvatarShape, string> = {
  square: 'rounded-nw',
  circle: 'rounded-full',
};

@Component({
  selector: 'nw-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex' },
  template: `
    <span
      class="relative inline-flex items-center justify-center shrink-0 overflow-hidden bg-surface-200 text-surface-700 font-medium select-none"
      [class]="classes()"
    >
      @if (image() && !imgError()) {
        <img
          [src]="image()"
          [alt]="label() || 'avatar'"
          class="h-full w-full object-cover"
          (error)="onError()"
        />
      } @else if (icon()) {
        <span [class]="icon()" aria-hidden="true"></span>
      } @else if (label()) {
        {{ label() }}
      } @else {
        <ng-content />
      }
    </span>
  `,
})
export class NwAvatarComponent {
  readonly label = input('');
  readonly icon = input('');
  readonly image = input('');
  readonly size = input<NwAvatarSize>('normal');
  readonly shape = input<NwAvatarShape>('circle');

  readonly imageError = output<void>();
  protected readonly imgError = signal(false);

  protected readonly classes = computed(
    () => `${SIZE[this.size()]} ${SHAPE[this.shape()]}`,
  );

  protected onError(): void {
    this.imgError.set(true);
    this.imageError.emit();
  }
}
