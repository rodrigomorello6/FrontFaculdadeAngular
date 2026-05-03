import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CursoService } from '../../services/curso.service';
import { DepartamentoService } from '../../services/departamento.service';
import { Curso } from '../../models/curso.model';
import { Departamento } from '../../models/departamento.model';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-curso-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './curso-create.component.html',
  styleUrl: './curso-create.component.css'
})
export class CursoCreateComponent implements OnInit {
  private cursoService = inject(CursoService);
  private departamentoService = inject(DepartamentoService);
  private router = inject(Router);
  private logger = inject(LoggerService);

  // Lista para exibir na tabela de ajuda
  departamentos: Departamento[] = [];

  // Objeto do formulário
  curso: Curso = {
    cursoID: 0,
    nomeCurso: '',
    departamentoID: 0,
  };

  isLoading = false;
  errorMessage = '';

  ngOnInit() {
    this.carregarDepartamentos();
  }

  carregarDepartamentos() {
    this.departamentoService.getAll().subscribe({
      next: (dados) => {
        this.departamentos = dados;
      },
      error: (err) => {
        this.logger.error('Erro ao buscar departamentos', err);
      }
    });
  }

  salvar() {
    // Validação
    if (!this.curso.nomeCurso || !this.curso.departamentoID) {
      this.errorMessage = 'Preencha o Nome e escolha um ID de Departamento da lista!';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.cursoService.create(this.curso).subscribe({
      next: () => {
        alert('Curso criado com sucesso!');
        this.router.navigate(['/cursos']);
      },
      error: (e: any) => {
        this.logger.error('Erro ao criar curso', e);
        // Tenta pegar erro específico ou mostra genérico
        this.errorMessage = e.error?.title || 'Erro ao criar curso. Verifique se o ID do Departamento existe.';
        this.isLoading = false;
      }
    });
  }

  cancelar() {
    this.router.navigate(['/cursos']);
  }
}