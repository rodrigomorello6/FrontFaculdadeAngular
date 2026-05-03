import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';

import { MatriculaService } from '../../services/matricula.service';
import { AlunoService } from '../../services/aluno.service';
import { CursoService } from '../../services/curso.service';
import { LoggerService } from '../../services/logger.service';

// Importando os Modelos da pasta correta
import { Aluno } from '../../models/aluno.model';
import { Curso } from '../../models/curso.model';
import { Matricula } from '../../models/matricula.model'; // <--- Faltava isso aqui!

@Component({
  selector: 'app-matricula-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './matricula-create.component.html',
  styleUrl: './matricula-create.component.css'
})
export class MatriculaCreateComponent implements OnInit {
  private matriculaService = inject(MatriculaService);
  private alunoService = inject(AlunoService);
  private cursoService = inject(CursoService);
  private router = inject(Router);
  private logger = inject(LoggerService);

  alunos: Aluno[] = [];
  cursos: Curso[] = [];
  
  // Modelo do formulário
  selectedAlunoID = 0;
  selectedCursoID = 0;
  dataMatricula = new Date().toISOString().split('T')[0]; // Hoje

  isLoading = false;
  errorMessage = '';

  ngOnInit() {
    this.carregarListas();
  }

  carregarListas() {
    this.isLoading = true;
    
    // forkJoin: Carrega alunos e cursos ao mesmo tempo (Performance ideal)
    forkJoin({
      alunos: this.alunoService.getAll(), // Método atualizado
      cursos: this.cursoService.getAll()  // Método atualizado
    }).subscribe({
      next: (resultado) => {
        this.alunos = resultado.alunos;
        this.cursos = resultado.cursos;
        this.isLoading = false;
      },
      error: (err) => {
        this.logger.error('Erro ao carregar dados para matrícula', err);
        this.errorMessage = 'Erro ao carregar listas de cadastro.';
        this.isLoading = false;
      }
    });
  }

  salvar() {
    if (!this.selectedAlunoID || !this.selectedCursoID) {
        this.errorMessage = 'Selecione um Aluno e um Curso!';
        return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const novaMatricula: Matricula = {
        alunoID: Number(this.selectedAlunoID),
        cursoID: Number(this.selectedCursoID),
        dataMatricula: this.dataMatricula
    };

    this.matriculaService.create(novaMatricula).subscribe({
        next: () => {
            this.router.navigate(['/matriculas']);
        },
        error: (e) => {
            this.logger.error('Erro ao criar matrícula', e);
            this.errorMessage = 'Erro ao realizar matrícula. Tente novamente.';
            this.isLoading = false;
        }
    });
  }

  cancelar() {
    this.router.navigate(['/matriculas']);
  }
}