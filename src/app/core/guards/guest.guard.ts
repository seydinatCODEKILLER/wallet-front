import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../state/auth.store';

export const guestGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (!authStore.estConnecte()) {
    return true;
  }

  router.navigate([authStore.estAdmin() ? '/admin' : '/client']);
  return false;
};