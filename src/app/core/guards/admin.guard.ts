import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../state/auth.store';

export const adminGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (authStore.estConnecte() && authStore.estAdmin()) {
    return true;
  }

  router.navigate(['/acces-refuse']);
  return false;
};