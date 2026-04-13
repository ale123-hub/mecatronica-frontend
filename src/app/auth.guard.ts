import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard = () => {
  const token = localStorage.getItem('token');
  const router = inject(Router);

  console.log('Verificando token en el Guard:', token); 

  if (token) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};