import { Injectable, computed, signal } from '@angular/core';
import type { Clerk } from '@clerk/clerk-js';
import { environment } from '../environments/environment';

// Derived from Clerk's own `.user` property rather than importing
// `UserResource` directly — that type lives in `@clerk/shared`, a
// transitive dependency we don't declare and shouldn't rely on directly.
type ClerkUser = NonNullable<Clerk['user']>;

// Clerk's prebuilt UI (<SignIn>, <SignUp>, ...) ships as a separate bundle,
// not part of @clerk/clerk-js itself. The official vanilla-JS quickstart
// loads it via a <script> tag from Clerk's own CDN — the URL is derived
// from the publishable key's embedded frontend-API domain — which sets
// `window.__internal_ClerkUICtor` for `clerk.load({ ui })` to consume.
// There's no npm package for this in a non-React app; matching the
// documented pattern here rather than inventing an alternative.
type ClerkUiCtor = NonNullable<
  NonNullable<Parameters<Clerk['load']>[0]>['ui']
>['ClerkUI'];

declare global {
  interface Window {
    __internal_ClerkUICtor?: ClerkUiCtor;
  }
}

function frontendApiDomain(publishableKey: string): string {
  const encoded = publishableKey.split('_')[2] ?? '';
  return atob(encoded).slice(0, -1);
}

function loadClerkUiScript(publishableKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://${frontendApiDomain(publishableKey)}/npm/@clerk/ui@1/dist/ui.browser.js`;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Clerk UI bundle.'));
    document.head.appendChild(script);
  });
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly user = signal<ClerkUser | null>(null);
  readonly isLoaded = signal(false);
  readonly isSignedIn = computed(() => !!this.user());

  private clerk: Clerk | null = null;
  private readonly ready: Promise<void> = this.init();

  private async init(): Promise<void> {
    const key = environment.clerkPublishableKey;
    if (!key) {
      this.isLoaded.set(true);
      return;
    }
    const [{ Clerk }] = await Promise.all([import('@clerk/clerk-js'), loadClerkUiScript(key)]);
    const clerk = new Clerk(key);
    await clerk.load({ ui: { ClerkUI: window.__internal_ClerkUICtor! } });
    this.clerk = clerk;
    clerk.addListener(({ user }) => this.user.set(user ?? null));
    this.user.set(clerk.user ?? null);
    this.isLoaded.set(true);
  }

  whenLoaded(): Promise<void> {
    return this.ready;
  }

  async openSignIn(redirectUrl = '/dashboard'): Promise<void> {
    await this.ready;
    this.clerk?.openSignIn({ fallbackRedirectUrl: redirectUrl });
  }

  async openSignUp(redirectUrl = '/dashboard'): Promise<void> {
    await this.ready;
    this.clerk?.openSignUp({ fallbackRedirectUrl: redirectUrl });
  }

  async signOut(): Promise<void> {
    await this.clerk?.signOut();
  }

  async getToken(): Promise<string | null> {
    return (await this.clerk?.session?.getToken()) ?? null;
  }
}
