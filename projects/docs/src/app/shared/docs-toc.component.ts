import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
  input,
  signal,
} from '@angular/core';

export interface TocSection {
  id: string;
  label: string;
}

@Component({
  selector: 'docs-toc',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav
      class="hidden xl:block sticky top-16 self-start w-52 shrink-0 max-h-[calc(100vh-5rem)] overflow-y-auto"
    >
      <div
        class="text-xs font-semibold uppercase tracking-wide text-surface-400 mb-2 pl-4"
      >
        On this page
      </div>
      <ul class="border-l border-surface-200">
        @for (s of sections(); track s.id) {
          <li>
            <a
              [href]="'#' + s.id"
              (click)="go($event, s.id)"
              class="block py-1 pl-4 -ml-px border-l-2 text-sm transition-colors"
              [class.border-nw-600]="active() === s.id"
              [class.text-nw-600]="active() === s.id"
              [class.font-medium]="active() === s.id"
              [class.border-transparent]="active() !== s.id"
              [class.text-surface-500]="active() !== s.id"
              [class.hover:text-surface-800]="active() !== s.id"
            >
              {{ s.label }}
            </a>
          </li>
        }
      </ul>
    </nav>
  `,
})
export class DocsTocComponent implements OnInit, OnDestroy {
  private readonly doc = inject(DOCUMENT);
  readonly sections = input<TocSection[]>([]);
  protected readonly active = signal<string>('');

  private readonly onScroll = () => this.update();

  ngOnInit(): void {
    const view = this.doc.defaultView;
    if (!view) return;
    view.addEventListener('scroll', this.onScroll, { passive: true });
    view.addEventListener('resize', this.onScroll);
    setTimeout(() => this.update());
  }

  ngOnDestroy(): void {
    const view = this.doc.defaultView;
    view?.removeEventListener('scroll', this.onScroll);
    view?.removeEventListener('resize', this.onScroll);
  }

  protected go(ev: Event, id: string): void {
    ev.preventDefault();
    this.doc.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  private update(): void {
    const offset = 100;
    let current = '';
    for (const s of this.sections()) {
      const el = this.doc.getElementById(s.id);
      if (!el || (el as HTMLElement).offsetParent === null) continue;
      if (el.getBoundingClientRect().top <= offset) current = s.id;
    }
    if (!current && this.sections().length) current = this.sections()[0].id;
    this.active.set(current);
  }
}
