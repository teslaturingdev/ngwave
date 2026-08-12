import { Injectable, signal } from '@angular/core';

export type NwToastSeverity =
  | 'success'
  | 'info'
  | 'warn'
  | 'error'
  | 'secondary'
  | 'contrast';

export interface NwToastMessage {
  id: number;
  severity: NwToastSeverity;
  summary: string;
  detail?: string;
  /** Auto-dismiss delay in ms; 0 keeps it until dismissed. */
  life?: number;
  /** Keep until manually dismissed (equivalent to life: 0). */
  sticky?: boolean;
  /** Whether the ✕ close button is shown. */
  closable?: boolean;
  /** Routes the message to a `<nw-toast key="...">` outlet. */
  key?: string;
  /** Override the default severity icon. */
  icon?: string;
}

export type NwToastInput = Omit<NwToastMessage, 'id'>;

@Injectable({ providedIn: 'root' })
export class NwToastService {
  private counter = 0;
  readonly messages = signal<NwToastMessage[]>([]);

  show(message: NwToastInput): void {
    const id = ++this.counter;
    const full: NwToastMessage = {
      life: 3000,
      closable: true,
      ...message,
      id,
    };
    this.messages.update((m) => [...m, full]);
    const life = full.sticky ? 0 : full.life;
    if (life && life > 0) {
      setTimeout(() => this.remove(id), life);
    }
  }

  /** Convenience for showing several messages at once. */
  showAll(messages: NwToastInput[]): void {
    for (const m of messages) this.show(m);
  }

  remove(id: number): void {
    this.messages.update((m) => m.filter((x) => x.id !== id));
  }

  /** Clear everything, or only the messages for a given keyed outlet. */
  clear(key?: string): void {
    if (key === undefined) {
      this.messages.set([]);
    } else {
      this.messages.update((m) => m.filter((x) => x.key !== key));
    }
  }
}
