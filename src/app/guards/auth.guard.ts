import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoggerService } from '../services/logger.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const logger = inject(LoggerService);

  const estaLogado = authService.isLoggedIn();

  if (estaLogado) {
    return true;
  }

  logger.warn(`Acesso negado para rota protegida: ${state.url}`);
  return router.createUrlTree(['/login']);
};
