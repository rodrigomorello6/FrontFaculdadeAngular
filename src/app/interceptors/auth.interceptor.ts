import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { LoggerService } from '../services/logger.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const logger = inject(LoggerService);

  // Rotas públicas que não precisam de token
  const rotasPublicas = ['/Auth/login', '/Auth/register'];
  const ehRotaPublica = rotasPublicas.some(rota => req.url.includes(rota));

  let authReq = req;

  // Se não for rota pública, tenta adicionar o token
  if (!ehRotaPublica) {
    const token = localStorage.getItem('auth_token');

    if (token) {
      authReq = req.clone({
        headers: req.headers
          .set('Authorization', `Bearer ${token}`)
          .set('Content-Type', 'application/json')
      });
    } else {
      // Se for rota protegida sem token, redireciona para login
      logger.warn(`Tentativa de acesso a rota protegida sem token: ${req.url}`);
      router.navigate(['/login']);
    }
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token expirado ou inválido
        logger.error('Erro 401: Token expirado ou inválido', error);
        localStorage.removeItem('auth_token');
        router.navigate(['/login']);
      } else if (error.status === 403) {
        logger.error('Erro 403: Acesso proibido', error);
      }
      return throwError(() => error);
    })
  );
};