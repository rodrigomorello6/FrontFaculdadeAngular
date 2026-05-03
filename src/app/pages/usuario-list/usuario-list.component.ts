import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { LoggerService } from '../../services/logger.service';

export interface UsuarioAPI {
  usuarioID: number;
  login: string;
  role: string;
}

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuario-list.component.html',
  styleUrls: ['./usuario-list.component.css']
})
export class UsuarioListComponent implements OnInit {
  private authService = inject(AuthService);
  private logger = inject(LoggerService);
  
  usuarios: UsuarioAPI[] = [];
  
  carregando = true;
  erro = '';

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios() {
    this.carregando = true;
    this.erro = '';

    this.authService.getUsers().subscribe({
      next: (dados) => {
        this.usuarios = dados;
        this.carregando = false;
      },
      error: (err: any) => {
        this.logger.error('Erro ao listar usuários', err);
        this.erro = 'Não foi possível carregar os usuários.';
        this.carregando = false;
      }
    });
  }

  deletarUsuario(id: number) {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      this.authService.deleteUser(id).subscribe({
  next: () => this.carregarUsuarios(),
  error: (err: any) => alert('Erro ao excluir')
    });
    }
  }
}