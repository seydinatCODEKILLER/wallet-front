import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from '../state/auth.store';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const token = authStore.token();

  if (token) {
    const reqAvecToken = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(reqAvecToken);
  }

  return next(req);
};