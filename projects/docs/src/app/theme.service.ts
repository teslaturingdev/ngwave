import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

export type Theme = 'light' | 'dark';
const STORAGE_KEY = 'ngwave-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);
  readonly theme = signal<Theme>(this.initial());

  constructor() {
    this.apply(this.theme());
  }

  toggle(): void {
    const next: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    this.store(next);
    this.apply(next);
  }

  private initial(): Theme {
    const stored = this.read();
    if (stored === 'light' || stored === 'dark') return stored;
    const view = this.doc.defaultView;
    const prefersDark =
      typeof view?.matchMedia === 'function' &&
      view.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }

  private read(): Theme | null {
    try {
      return this.doc.defaultView?.localStorage.getItem(
        STORAGE_KEY,
      ) as Theme | null;
    } catch {
      return null;
    }
  }

  private store(theme: Theme): void {
    try {
      this.doc.defaultView?.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* storage unavailable (private mode, etc.) */
    }
  }

  private apply(theme: Theme): void {
    this.doc.documentElement.setAttribute('data-theme', theme);
  }
}
