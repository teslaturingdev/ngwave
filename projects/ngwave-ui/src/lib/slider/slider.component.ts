import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type NwSliderOrientation = 'horizontal' | 'vertical';

@Component({
  selector: 'nw-slider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-block' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NwSliderComponent),
      multi: true,
    },
  ],
  template: `
    <div
      #track
      class="relative touch-none select-none rounded-full bg-surface-200"
      [class]="orientation() === 'vertical' ? 'w-2 h-40 mx-2' : 'w-full h-2'"
      [class.opacity-50]="isDisabled()"
      [class.pointer-events-none]="isDisabled()"
      (pointerdown)="onTrackClick($event)"
    >
      <div
        class="absolute rounded-full bg-nw-600"
        [class.transition-all]="animate() && !dragging()"
        [style]="rangeBarStyle()"
      ></div>
      @if (range()) {
        <div
          class="nw-slider-thumb"
          [class.transition-all]="animate() && !dragging()"
          [style]="thumbStyle(rangeValue()[0])"
          role="slider"
          tabindex="0"
          [attr.aria-valuemin]="min()"
          [attr.aria-valuemax]="max()"
          [attr.aria-valuenow]="rangeValue()[0]"
          [attr.aria-orientation]="orientation()"
          (pointerdown)="startDrag(0, $event)"
          (keydown)="onKeydown(0, $event)"
        ></div>
        <div
          class="nw-slider-thumb"
          [class.transition-all]="animate() && !dragging()"
          [style]="thumbStyle(rangeValue()[1])"
          role="slider"
          tabindex="0"
          [attr.aria-valuemin]="min()"
          [attr.aria-valuemax]="max()"
          [attr.aria-valuenow]="rangeValue()[1]"
          [attr.aria-orientation]="orientation()"
          (pointerdown)="startDrag(1, $event)"
          (keydown)="onKeydown(1, $event)"
        ></div>
      } @else {
        <div
          class="nw-slider-thumb"
          [class.transition-all]="animate() && !dragging()"
          [style]="thumbStyle(value())"
          role="slider"
          tabindex="0"
          [attr.aria-valuemin]="min()"
          [attr.aria-valuemax]="max()"
          [attr.aria-valuenow]="value()"
          [attr.aria-orientation]="orientation()"
          (pointerdown)="startDrag(0, $event)"
          (keydown)="onKeydown(0, $event)"
        ></div>
      }
    </div>
  `,
  styles: `
    .nw-slider-thumb {
      position: absolute;
      height: 1rem;
      width: 1rem;
      border-radius: 9999px;
      background: rgb(var(--nw-600));
      border: 2px solid rgb(var(--surface-0));
      box-shadow: var(--nw-shadow-sm);
      cursor: pointer;
      transform: translate(-50%, -50%);
      top: 50%;
    }
    .nw-slider-thumb:focus-visible {
      outline: 2px solid rgb(var(--nw-500));
      outline-offset: 2px;
    }
  `,
})
export class NwSliderComponent implements ControlValueAccessor {
  private readonly hostEl = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  readonly value = model(0);
  readonly rangeValue = model<[number, number]>([20, 80]);
  readonly min = input(0);
  readonly max = input(100);
  readonly step = input(1);
  readonly disabled = input(false);
  readonly range = input(false);
  readonly orientation = input<NwSliderOrientation>('horizontal');
  readonly animate = input(false);

  readonly onSlideEnd = output<number | [number, number]>();

  protected readonly dragging = signal(false);
  private readonly formDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  private onChange: (v: number | [number, number]) => void = () => {};
  protected onTouched: () => void = () => {};

  private pct(v: number): number {
    const span = this.max() - this.min();
    return span === 0 ? 0 : ((v - this.min()) / span) * 100;
  }

  private clampToStep(raw: number): number {
    const stepped = Math.round((raw - this.min()) / this.step()) * this.step() + this.min();
    return Math.min(this.max(), Math.max(this.min(), stepped));
  }

  protected thumbStyle(v: number): Record<string, string> {
    const p = `${this.pct(v)}%`;
    return this.orientation() === 'vertical' ? { bottom: p, left: '50%' } : { left: p, top: '50%' };
  }

  protected rangeBarStyle(): Record<string, string> {
    const vertical = this.orientation() === 'vertical';
    if (this.range()) {
      const [a, b] = this.rangeValue();
      const lo = this.pct(Math.min(a, b));
      const hi = this.pct(Math.max(a, b));
      return vertical
        ? { bottom: `${lo}%`, height: `${hi - lo}%`, width: '100%' }
        : { left: `${lo}%`, width: `${hi - lo}%`, height: '100%' };
    }
    const p = this.pct(this.value());
    return vertical ? { bottom: '0%', height: `${p}%`, width: '100%' } : { left: '0%', width: `${p}%`, height: '100%' };
  }

  protected onTrackClick(event: PointerEvent): void {
    if (this.isDisabled() || (event.target as HTMLElement).classList.contains('nw-slider-thumb')) return;
    const raw = this.positionToValue(event);
    if (this.range()) {
      const [a, b] = this.rangeValue();
      const idx = Math.abs(raw - a) <= Math.abs(raw - b) ? 0 : 1;
      this.startDrag(idx, event, raw);
    } else {
      this.startDrag(0, event, raw);
    }
  }

  private positionToValue(event: PointerEvent): number {
    const rect = this.hostEl.querySelector('[role="slider"]')?.parentElement?.getBoundingClientRect() ??
      this.hostEl.getBoundingClientRect();
    const vertical = this.orientation() === 'vertical';
    const fraction = vertical
      ? (rect.bottom - event.clientY) / rect.height
      : (event.clientX - rect.left) / rect.width;
    const raw = this.min() + fraction * (this.max() - this.min());
    return this.clampToStep(raw);
  }

  protected startDrag(index: 0 | 1, event: PointerEvent, initial?: number): void {
    if (this.isDisabled()) return;
    event.preventDefault();
    this.dragging.set(true);
    if (initial != null) this.applyValue(index, initial);
    (event.target as HTMLElement).focus?.();

    const move = (e: PointerEvent) => {
      this.applyValue(index, this.positionToValue(e));
    };
    const up = () => {
      this.dragging.set(false);
      this.onTouched();
      this.onSlideEnd.emit(this.range() ? this.rangeValue() : this.value());
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  }

  private applyValue(index: 0 | 1, raw: number): void {
    if (this.range()) {
      const cur = [...this.rangeValue()] as [number, number];
      cur[index] = raw;
      if (index === 0) cur[0] = Math.min(cur[0], cur[1]);
      else cur[1] = Math.max(cur[1], cur[0]);
      this.rangeValue.set(cur);
      this.onChange(cur);
    } else {
      this.value.set(raw);
      this.onChange(raw);
    }
  }

  protected onKeydown(index: 0 | 1, event: KeyboardEvent): void {
    if (this.isDisabled()) return;
    const step = this.step();
    const big = step * 10;
    let delta = 0;
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') delta = step;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') delta = -step;
    else if (event.key === 'PageUp') delta = big;
    else if (event.key === 'PageDown') delta = -big;
    else if (event.key === 'Home') {
      event.preventDefault();
      this.applyValue(index, this.min());
      this.onSlideEnd.emit(this.range() ? this.rangeValue() : this.value());
      return;
    } else if (event.key === 'End') {
      event.preventDefault();
      this.applyValue(index, this.max());
      this.onSlideEnd.emit(this.range() ? this.rangeValue() : this.value());
      return;
    } else {
      return;
    }
    event.preventDefault();
    const current = this.range() ? this.rangeValue()[index] : this.value();
    this.applyValue(index, this.clampToStep(current + delta));
    this.onSlideEnd.emit(this.range() ? this.rangeValue() : this.value());
  }

  writeValue(value: number | [number, number]): void {
    if (this.range()) {
      this.rangeValue.set(Array.isArray(value) ? value : [this.min(), this.max()]);
    } else {
      this.value.set(typeof value === 'number' ? value : 0);
    }
  }
  registerOnChange(fn: (v: number | [number, number]) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }
}
