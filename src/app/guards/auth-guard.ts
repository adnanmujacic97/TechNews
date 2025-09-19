// src/app/guards/auth.guard.ts
import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Return an Observable<boolean> instead of just true/false
  return authService.checkSession().pipe(
    map(res => {
      if (res.loggedIn && res.user) {
        // Sync frontend state
        authService.setUser(res.user);
        return true; // Allow navigation
      } else {
        // Redirect to login
        return router.createUrlTree(['']);
      }
    })
  );
};