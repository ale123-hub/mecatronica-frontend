import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('admin_token');

  if (token) {
    return true; // Hay token, ¡puedes pasar!
  } else {
    router.navigate(['/login']); // No hay token, ¡fuera de aquí!
    return false;
  }
};