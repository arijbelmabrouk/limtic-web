import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const chercheurGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const role  = localStorage.getItem('role');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  if (role !== 'CHERCHEUR' && role !== 'ADMIN') {
    router.navigate(['/home']);
    return false;
  }

  return true;
};