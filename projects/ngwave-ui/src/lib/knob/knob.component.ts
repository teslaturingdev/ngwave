import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  forwardRef,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const START_ANGLE = -135;
const SWEEP = 270;
const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const ARC_LEN = CIRCUMFERENCE * (SWEEP / 360);

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** Circular drag-to-set numeric dial, rendered as a 270° gauge with a gap at the bottom. */
@Component({
  selector: 'nw-knob',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-block select-none' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NwKnobComponent),
      multi: true,
    },
  ],
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 100 100"
      class="cursor-pointer"
      [class.opacity-50]="isDisabled()"
      [class.pointer-events-none]="isDisabled()"
      role="slider"
      [attr.aria-valuemin]="min()"
      [attr.aria-valuemax]="max()"
      [attr.aria-valuenow]="value()"
      (pointerdown)="onPointerDown($event)"
    >
      <circle
        cx="50"
        cy="50"
        [attr.r]="radius"
        fill="none"
        [attr.stroke-width]="strokeWidth()"
        [attr.stroke-dasharray]="arcLen + ' ' + circumference"
        [attr.transform]="rotateTransform"
        class="stroke-surface-200"
      />
      <circle
        cx="50"
        cy="50"
        [attr.r]="radius"
        fill="none"
        [attr.stroke-width]="strokeWidth()"
        [attr.stroke-dasharray]="arcLen + ' ' + circumference"
        [attr.stroke-dashoffset]="dashOffset()"
        [attr.transform]="rotateTransform"
        stroke-linecap="round"
        class="stroke-nw-500 transition-[stroke-dashoffset] duration-100"
      />
      @if (showValue()) {
        <text x="50" y="55" text-anchor="middle" class="fill-surface-900 text-[20px] font-medium">
          {{ value() }}
        </text>
      }
    </svg>
  `,
})
export class NwKnobComponent implements ControlValueAccessor {
  private readonly hostEl = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  readonly value = model(0);
  readonly min = input(0);
  readonly max = input(100);
  readonly step = input(1);
  readonly size = input(100);
  readonly strokeWidth = input(8);
  readonly showValue = input(true);
  readonly disabled = input(false);
  readonly readonly = input(false);

  protected readonly radius = RADIUS;
  protected readonly circumference = CIRCUMFERENCE;
  protected readonly arcLen = ARC_LEN;
  protected readonly rotateTransform = `rotate(${START_ANGLE - 90} 50 50)`;

  private readonly formDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  protected readonly dashOffset = computed(() => {
    const range = this.max() - this.min();
    const fraction = range === 0 ? 0 : clamp((this.value() - this.min()) / range, 0, 1);
    return ARC_LEN * (1 - fraction);
  });

  private onChange: (v: number) => void = () => {};
  private onTouched: () => void = () => {};
  private dragging = false;
  private readonly onMove = (e: PointerEvent) => this.updateFromPointer(e);
  private readonly onUp = () => this.stopDrag();

  protected onPointerDown(event: PointerEvent): void {
    if (this.isDisabled() || this.readonly()) return;
    this.dragging = true;
    this.updateFromPointer(event);
    document.addEventListener('pointermove', this.onMove);
    document.addEventListener('pointerup', this.onUp);
  }

  private stopDrag(): void {
    if (!this.dragging) return;
    this.dragging = false;
    document.removeEventListener('pointermove', this.onMove);
    document.removeEventListener('pointerup', this.onUp);
    this.onTouched();
  }

  private updateFromPointer(event: PointerEvent): void {
    const svg = this.hostEl.querySelector('svg');
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = event.clientX - cx;
    const dy = event.clientY - cy;
    let angle = Math.atan2(dx, -dy) * (180 / Math.PI);
    angle = clamp(angle, START_ANGLE, START_ANGLE + SWEEP);
    const fraction = (angle - START_ANGLE) / SWEEP;
    const raw = this.min() + fraction * (this.max() - this.min());
    const stepped = Math.round(raw / this.step()) * this.step();
    const next = clamp(stepped, this.min(), this.max());
    if (next !== this.value()) {
      this.value.set(next);
      this.onChange(next);
    }
  }

  writeValue(v: number): void {
    this.value.set(v ?? 0);
  }
  registerOnChange(fn: (v: number) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }
}
