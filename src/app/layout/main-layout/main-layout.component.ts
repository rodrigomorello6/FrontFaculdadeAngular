import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {
  private authService = inject(AuthService);
  private logger = inject(LoggerService);

  get isAdmin(): boolean {
    const token = this.authService.getToken();
    if (!token) return false;

    try {
      const payloadBase64Url = token.split('.')[1];
      if (!payloadBase64Url) return false;

      const normalizedBase64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');
      const paddedBase64 = normalizedBase64.padEnd(Math.ceil(normalizedBase64.length / 4) * 4, '=');
      const payloadJson = atob(paddedBase64);
      const payload = JSON.parse(payloadJson);

      const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload['role'];
      return role === 'Admin';
    } catch (error) {
      this.logger.error('Falha ao ler role do token JWT.', error);
      return false;
    }
  }

  sair() {
    this.authService.logout();
  }
}
