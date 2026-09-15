import { Injectable, signal } from '@angular/core';
import { NwButtonVariant } from '../button';

export interface NwConfirmation {
  message: string;
  header?: string;
  icon?: string;
  acceptLabel?: string;
  rejectLabel?: string;
  acceptVariant?: NwButtonVariant;
  rejectVariant?: NwButtonVariant;
  accept?: () => void;
  reject?: () => void;
  /** Element to anchor near — used by nw-confirm-popup, ignored by nw-confirm-dialog. */
  target?: EventTarget | null;
}

/**
 * Drives `<nw-confirm-dialog>` (modal) or `<nw-confirm-popup>` (anchored,
 * non-modal) — use one or the other, both read the same pending request.
 * Call `confirm(...)` from anywhere; place a single renderer at the app root.
 */
@Injectable({ providedIn: 'root' })
export class NwConfirmationService {
  /** Current pending confirmation (null when nothing is open). */
  readonly current = signal<NwConfirmation | null>(null);

  confirm(confirmation: NwConfirmation): void {
    this.current.set(confirmation);
  }

  accept(): void {
    this.current()?.accept?.();
    this.current.set(null);
  }

  reject(): void {
    this.current()?.reject?.();
    this.current.set(null);
  }

  close(): void {
    this.current.set(null);
  }
}
