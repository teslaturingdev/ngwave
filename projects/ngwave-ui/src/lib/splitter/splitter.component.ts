import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  contentChildren,
  effect,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';

export type NwSplitterOrientation = 'horizontal' | 'vertical';
export type NwSplitterStateStorage = 'session' | 'local';

@Component({
  selector: 'nw-splitter-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col overflow-hidden shrink-0 grow-0',
    '[style.flex-basis.%]': 'size()',
  },
  template: `
    <div class="flex-1 overflow-auto">
      <ng-content />
    </div>
  `,
})
export class NwSplitterPanelComponent {
  /** Initial size as a percentage of the splitter's main axis. */
  readonly initialSize = input<number | undefined>(undefined, { alias: 'size' });
  /** Minimum size as a percentage; enforced while dragging the adjacent gutter(s). */
  readonly minSize = input(0);

  /** @internal driven by the parent nw-splitter */
  readonly size = signal(50);
}

@Component({
  selector: 'nw-splitter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'relative block w-full h-full overflow-hidden' },
  template: `
    <div class="flex w-full h-full" [class.flex-col]="orientation() === 'vertical'">
      <ng-content />
    </div>
    @for (pct of gutterPositions(); track $index; let i = $index) {
      <div
        class="absolute bg-surface-200 hover:bg-nw-300 transition-colors z-10"
        [class]="
          orientation() === 'vertical'
            ? 'left-0 right-0 -translate-y-1/2 cursor-row-resize'
            : 'top-0 bottom-0 -translate-x-1/2 cursor-col-resize'
        "
        [style.height.px]="orientation() === 'vertical' ? gutterSize() : null"
        [style.width.px]="orientation() === 'horizontal' ? gutterSize() : null"
        [style.left.%]="orientation() === 'horizontal' ? pct : null"
        [style.top.%]="orientation() === 'vertical' ? pct : null"
        (pointerdown)="startDrag(i, $event)"
      ></div>
    }
  `,
})
export class NwSplitterComponent {
  private readonly hostEl = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  readonly orientation = input<NwSplitterOrientation>('horizontal');
  readonly gutterSize = input(6);
  readonly sizes = model<number[]>([]);
  readonly stateKey = input<string | undefined>(undefined);
  readonly stateStorage = input<NwSplitterStateStorage>('session');

  readonly resizeStart = output<number[]>();
  readonly resizeEnd = output<number[]>();

  protected readonly panels = contentChildren(NwSplitterPanelComponent);

  private readonly effectiveSizes = computed(() => {
    const n = this.panels().length;
    const given = this.sizes();
    if (given.length === n && n > 0) return given;
    if (n === 0) return [];

    const persisted = this.loadState();
    if (persisted && persisted.length === n) return persisted;

    const withInitial = this.panels().map((p) => p.initialSize());
    if (withInitial.every((s) => s != null)) return withInitial as number[];

    return Array.from({ length: n }, () => 100 / n);
  });

  protected readonly gutterPositions = computed(() => {
    const sizes = this.effectiveSizes();
    const positions: number[] = [];
    let acc = 0;
    for (let i = 0; i < sizes.length - 1; i++) {
      acc += sizes[i];
      positions.push(acc);
    }
    return positions;
  });

  constructor() {
    effect(() => {
      const sizes = this.effectiveSizes();
      this.panels().forEach((p, i) => p.size.set(sizes[i] ?? 0));
    });
  }

  private storage(): Storage | null {
    if (typeof window === 'undefined') return null;
    return this.stateStorage() === 'local' ? window.localStorage : window.sessionStorage;
  }

  private loadState(): number[] | null {
    const key = this.stateKey();
    if (!key) return null;
    try {
      const raw = this.storage()?.getItem(`nw-splitter-${key}`);
      return raw ? (JSON.parse(raw) as number[]) : null;
    } catch {
      return null;
    }
  }

  private saveState(sizes: number[]): void {
    const key = this.stateKey();
    if (!key) return;
    try {
      this.storage()?.setItem(`nw-splitter-${key}`, JSON.stringify(sizes));
    } catch {
      // storage unavailable — ignore
    }
  }

  protected startDrag(gutterIndex: number, event: PointerEvent): void {
    event.preventDefault();
    const rect = this.hostEl.getBoundingClientRect();
    const vertical = this.orientation() === 'vertical';
    const totalPx = vertical ? rect.height : rect.width;
    const startPos = vertical ? event.clientY : event.clientX;
    const startSizes = [...this.effectiveSizes()];
    const panels = this.panels();
    const minA = panels[gutterIndex]?.minSize() ?? 0;
    const minB = panels[gutterIndex + 1]?.minSize() ?? 0;

    this.resizeStart.emit(startSizes);

    const move = (e: PointerEvent) => {
      const pos = vertical ? e.clientY : e.clientX;
      const deltaPct = ((pos - startPos) / totalPx) * 100;
      const next = [...startSizes];
      const a = gutterIndex;
      const b = gutterIndex + 1;
      let newA = startSizes[a] + deltaPct;
      let newB = startSizes[b] - deltaPct;
      if (newA < minA) {
        newB -= minA - newA;
        newA = minA;
      }
      if (newB < minB) {
        newA -= minB - newB;
        newB = minB;
      }
      next[a] = newA;
      next[b] = newB;
      this.sizes.set(next);
    };
    const up = () => {
      this.saveState(this.effectiveSizes());
      this.resizeEnd.emit(this.effectiveSizes());
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  }
}
