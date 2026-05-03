import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/auth.models';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="register-container">
      <h2>Registar Novo Utilizador</h2>
      
      <div class="form-group">
        <label>Login:</label>
        <input type="text" [(ngModel)]="login" placeholder="Ex: professor_joao">
      </div>

      <div class="form-group">
        <label>Senha:</label>
        <input type="password" [(ngModel)]="senha" placeholder="Mínimo 8 caracteres">
      </div>

      <div class="form-group">
        <label>Tipo de Conta:</label>
        <select [(ngModel)]="role">
          <option value="Aluno">Aluno</option>
          <option value="Professor">Professor</option>
          <option value="Admin">Administrador</option>
        </select>
      </div>

      <button (click)="fazerCadastro()" [disabled]="loading" class="btn-save">
        {{ loading ? 'A guardar...' : 'Criar Utilizador' }}
      </button>
      
      <button (click)="voltar()" class="btn-back">Voltar</button>

      @if (mensagem) {
        <p [class.erro]="!sucesso" [class.sucesso]="sucesso">
            {{ mensagem }}
        </p>
      }
    </div>
  `,
  styles: [`
    .register-container { padding: 20px; max-width: 400px; margin: 50px auto; border: 1px solid #ddd; border-radius: 8px; font-family: Arial, sans-serif; background-color: white; }
    .form-group { margin-bottom: 15px; }
    label { display: block; margin-bottom: 5px; font-weight: bold; color: #333; }
    input, select { width: 100%; padding: 10px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px; }
    button { width: 100%; padding: 10px; margin-top: 10px; border: none; cursor: pointer; color: white; border-radius: 4px; font-size: 16px; }
    .btn-save { background-color: #28a745; transition: 0.3s; }
    .btn-save:hover:not(:disabled) { background-color: #218838; }
    .btn-save:disabled { background-color: #94d3a2; cursor: not-allowed; }
    .btn-back { background-color: #6c757d; margin-top: 5px; }
    .btn-back:hover { background-color: #5a6268; }
    .erro { color: #dc3545; margin-top: 10px; font-weight: bold; }
    .sucesso { color: #28a745; margin-top: 10px; font-weight: bold; }
  `]
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private logger = inject(LoggerService);

  login = '';
  senha = '';
  role = 'Aluno';
  mensagem = '';
  sucesso = false;
  loading = false;

  fazerCadastro() {
    if (!this.login || !this.senha) {
      this.mensagem = 'Preencha todos os campos!';
      this.sucesso = false;
      return;
    }

    this.loading = true;
    this.mensagem = '';

    const dados: RegisterRequest = {
      login: this.login,
      senha: this.senha,
      role: this.role
    };

    this.authService.register(dados).subscribe({
      next: () => {
        this.loading = false;
        this.sucesso = true;
        this.mensagem = 'Utilizador criado com sucesso!';
        this.limparFormulario();
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        this.loading = false;
        this.sucesso = false;
        this.mensagem = err?.error?.message || 'Erro ao criar utilizador.';
        this.logger.error('Erro no cadastro de utilizador.', err);
      }
    });
  }

  limparFormulario() {
    this.login = '';
    this.senha = '';
    this.role = 'Aluno';
  }

  voltar() {
    this.router.navigate(['/login']); 
  }
}
