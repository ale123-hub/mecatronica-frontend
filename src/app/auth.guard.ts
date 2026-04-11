import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard = () => {
  const token = localStorage.getItem('token');
  const router = inject(Router);

  console.log('Verificando token en el Guard:', token); // Mira esto en la consola del navegador (F12)

  if (token) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};