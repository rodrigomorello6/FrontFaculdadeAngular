import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRequest, LoginResponse, RegisterRequest } from '../models/auth.models';
import { environment } from '../../environments/environment';

export interface UsuarioSistema {
  usuarioID: number;
  login: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/Auth`;

  login(credenciais: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credenciais).pipe(
      tap((response) => {
        localStorage.setItem('auth_token', response.token);
      })
    );
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = this.decodeJwtPayload(token);
      const expValue = payload?.['exp'];
      const exp = typeof expValue === 'number' ? expValue : null;
      if (!exp) return false;

      const nowInSeconds = Math.floor(Date.now() / 1000);
      return exp > nowInSeconds;
    } catch {
      return false;
    }
  }

  register(dados: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, dados);
  }

  getUsers(): Observable<UsuarioSistema[]> {
    return this.http.get<UsuarioSistema[]>(this.apiUrl);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  private decodeJwtPayload(token: string): Record<string, any> {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Token JWT inválido.');
    }

    const normalizedBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = normalizedBase64.padEnd(Math.ceil(normalizedBase64.length / 4) * 4, '=');
    const payloadJson = atob(paddedBase64);

    return JSON.parse(payloadJson);
  }
}
