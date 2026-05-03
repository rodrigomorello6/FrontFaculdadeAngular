import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs'; // <--- Necessário para carregar tudo junto

// Services
import { MatriculaService } from '../../services/matricula.service';
import { AlunoService } from '../../services/aluno.service';
import { CursoService } from '../../services/curso.service';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-matricula-list',
  standalone: true,
  imports: [CommonModule, DatePipe], // DatePipe para formatar datas
  templateUrl: './matricula-list.component.html',
  styleUrl: './matricula-list.component.css'
})
export class MatriculaListComponent implements OnInit {
  private router = inject(Router);
  private matriculaService = inject(MatriculaService);
  private alunoService = inject(AlunoService);
  private cursoService = inject(CursoService);
  private logger = inject(LoggerService);

  // Usamos 'any[]' ou uma interface estendida para poder guardar os nomes (alunoNome, nomeCurso)
  matriculas: any[] = []; 
  loading = true;
  errorMessage = '';

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    this.loading = true;
    this.errorMessage = '';

    // Busca Matrículas, Alunos e Cursos ao mesmo tempo
    forkJoin({
      listaMatriculas: this.matriculaService.getAll(),
      listaAlunos: this.alunoService.getAll(),
      listaCursos: this.cursoService.getAll()
    }).subscribe({
      next: (resultado) => {
        // Cruza os dados: Para cada matrícula, achamos o nome do aluno e do curso
        this.matriculas = resultado.listaMatriculas.map(mat => {
          const aluno = resultado.listaAlunos.find(a => a.alunoID === mat.alunoID);
          const curso = resultado.listaCursos.find(c => c.cursoID === mat.cursoID);

          return {
            ...mat, // Mantém ID, Data, etc.
            alunoNome: aluno ? aluno.alunoNome : 'Aluno Desconhecido',
            nomeCurso: curso ? curso.nomeCurso : 'Curso Desconhecido'
          };
        });

        this.loading = false;
      },
      error: (err: any) => {
        this.logger.error('Erro ao carregar matrículas', err);
        this.errorMessage = 'Erro ao carregar dados. Verifique a conexão.';
        this.loading = false;
      }
    });
  }

  deletar(id: number) {
    if(confirm('Tem certeza que deseja cancelar esta matrícula?')) {
      this.matriculaService.delete(id).subscribe({
        next: () => {
          alert('Matrícula cancelada com sucesso!');
          this.carregarDados(); // Recarrega para atualizar a lista
        },
        error: (err: any) => alert('Erro ao cancelar matrícula.')
      });
    }
  }

  irParaNovo() {
    this.router.navigate(['/matriculas/novo']);
  }
}