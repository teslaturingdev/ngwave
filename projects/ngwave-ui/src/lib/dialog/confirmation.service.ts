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
}

/**
 * Drives `<nw-confirm-dialog>`. Call `confirm(...)` from anywhere; place a
 * single `<nw-confirm-dialog />` at the app root to render it.
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
