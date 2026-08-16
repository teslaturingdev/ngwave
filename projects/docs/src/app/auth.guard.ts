import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

// Sign-in/up is a dialog (Clerk's openSignIn/openSignUp), not a dedicated page — a
// blocked route redirects to the home page and pops the dialog on top of it, landing
// back on the originally requested URL once the user completes it.
export const authGuard: CanActivateFn = async (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.whenLoaded();
  if (auth.isSignedIn()) return true;
  auth.openSignIn(state.url);
  return router.parseUrl('/');
};
